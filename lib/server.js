var EventEmitter = require( 'events' ).EventEmitter
var Express = require( 'express' )
var Redis = require( 'ioredis' )
var assign = require( 'object-assign' )
var http = require( 'http' )
var bodyParser = require( 'body-parser' )
var Subscription = require( 'realizehit-subscription' )
var Pattern = Subscription.Pattern

var defaultOptions = {
    httpServer: false,
    httpPort: 8080,
    httpPrefix: '/',
    redis: 'redis://localhost:6379',
}

function Server ( options ) {
    options = typeof options === 'object' && options || {}
    options = assign( options, defaultOptions )

    // Setup HTTP server
    this.http = options.httpServer || http.createServer().listen( options.httpPort )

    // Setup HTTP Router
    this.router = Express.Router()
    this.http.on( 'connection', this.router )
    this.buildRoutes()

    // Setup Redis pub client
    this.redis = new Redis( options.redis )

    return this
}

Server.prototype = Object.create( EventEmitter.prototype )

// Should handle send
Server.prototype.buildRoutes = function () {
    var server

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

            // Handle response in case we don't have filters
            if ( typeof args.filters !== 'object' || Object.keys( args.filters ).length === 0 ) {
                return res
                .status( 400 )
                .send( 'Please include .filters in your request body' )
            }

            // Handle response in case we don't have payload
            if ( typeof args.payload === 'undefined' ) {
                return res
                .status( 400 )
                .send( 'Please include .payload in your request body' )
            }

            // Seems that we already have everything we need
            Promise.try(function () {
                var channel = Pattern( args.filters ).stringify()

                return server.redis.publish( channel, args.payload )
            })
            .then(function () {
                res
                .status( 200 )
                .send( "Your payload has been queued for delivery" )
            }, function () {
                res
                .status( 500 )
                .send( "An error has occurred on the Server, sorry" )
            })
        }
    )

}
