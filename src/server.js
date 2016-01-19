var EventEmitter = require( 'events' ).EventEmitter
var Express = require( 'express' )
var Redis = require( 'ioredis' )
var assign = require( 'object-assign' )
var http = require( 'http' )
var bodyParser = require( 'body-parser' )
var Subscription = require( 'realizehit-subscription' )
var Pattern = Subscription.Pattern
var Promise = require( 'bluebird' )

var debug = require( 'debug' )( 'realizehit:api:server' )

var defaultOptions = {
    httpServer: false,
    httpPort: 8080,
    httpPrefix: '/',
    redis: 'redis://localhost:6379',
}

function APIServer ( options ) {
    options = typeof options === 'object' && options || {}
    options = assign( {}, defaultOptions, options )

    // Setup HTTP server
    this.http =
        options.httpServer ||
        http.createServer().listen( options.httpPort )

    // Setup HTTP Router
    this.router = Express()
    this.http.on( 'request', this.router )
    this.buildRoutes()

    // Setup Redis pub client
    this.redis = new Redis( options.redis )

    return this
}

module.exports = APIServer

APIServer.prototype = Object.create( EventEmitter.prototype )

// Should handle send
APIServer.prototype.buildRoutes = function APIServer$buildRoutes () {
    var server = this

    debug( "building routes" )

    this.router.post( '/',
        bodyParser.json(),
        function ( req, res, next ) {

            // body should be an object
            if ( typeof req.body !== 'object' ) {
                return res
                .status( 400 )
                .send( 'Please include your arguments on body' )
            }

            var args = req.body

            // Handle response in case we don't have pattern
            if ( typeof args.pattern !== 'object' || Object.keys( args.pattern ).length === 0 ) {
                return res
                .status( 400 )
                .send( 'Please include .pattern in your request body' )
            }

            // Handle response in case we don't have payload
            if ( typeof args.payload === 'undefined' ) {
                return res
                .status( 400 )
                .send( 'Please include .payload in your request body' )
            }

            // Seems that we already have everything we need
            Promise.cast( args.payload )
            .then( JSON.stringify )
            .then(function ( payload ) {
                var channel = (new Pattern( args.pattern )).stringify()

                debug( "Publishing message on redis (channel %s)", channel )
                return server.redis.publish( channel, payload )
            })
            .then(function () {
                res
                .status( 200 )
                .send( "Your payload has been queued for delivery" )
            }, function ( err ) {
                res
                .status( 500 )
                .send( "An error has occurred on the Server, sorry" )
            })
        }
    )
}

APIServer.prototype.destroy =
APIServer.prototype.close =
APIServer.prototype.terminate =
    function APIServer$destroy () {

        // Change this to `http.listening` once node supports it
        // nodejs/node#4735
        if ( this.http._handle ) {
            this.http.close()
        }

        this.redis.disconnect()
    }
