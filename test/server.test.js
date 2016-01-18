var http = require( 'http' )
var ApiServer = require( '..' )
var Promise = require( 'bluebird' )
var Redis = require( 'ioredis' )
var Subscription = require( 'realizehit-subscription' )
var Pattern = Subscription.Pattern
var Supertest = require( 'supertest' )
var Chai = require( 'chai' )
var expect = Chai.expect

var debug = require( 'debug' )( 'realizehit:api:test:server' )

describe( "API Server", function () {

    before(function () {

        debug( "Creating an HTTP Server" )
        this.httpServer = http.createServer()

        debug( "Binding API Server to recently created http server")
        this.server = new ApiServer({ httpServer: this.httpServer })

        debug( "Connecting to local redis server" )
        this.redis = new Redis()

        debug( "Generating a supertest agent" )
        this.request = Supertest.agent( this.httpServer )

    })

    after(function () {

        debug( "Destroying HTTP Server" )
        // Change this to `http.listening` once node supports it
        // nodejs/node#4735
        if ( this.httpServer._handle ) {
            this.httpServer.close()
        }

        debug( "Destroying API Server" )
        this.server.destroy()

        debug( "Destroying redis connection" )
        this.redis.disconnect()

    })

    function pattern2channel ( pattern ) {
        return (new Pattern( pattern )).stringify()
    }

    function subscribeRedisChannel ( channel ) {
        var redis = this.redis

        debug( "subscribing channel %s", channel )
        return redis.subscribe( channel )
    }

    function waitForRedisMessage ( channel ) {
        var redis = this.redis
        return (new Promise (
            function ( fulfill, reject ) {

                debug( "listening for new messages" )
                redis.once( 'message', function ( rcvdChannel, rcvdMessage ) {

                    debug( "fulfilling subscribeAndWaitForMessage promise" )
                    fulfill( rcvdMessage )

                })

                redis.once( 'error', reject )
            }
        ))
        // Parse response on json
        .then( JSON.parse )
    }

    function request ( pattern, payload, expectedStatusCode ) {

        debug( "starting up a request" )
        var request = this.request
            .post( '/' )
            .send({
                pattern: pattern,
                payload: payload
            })

        if ( typeof expectedStatusCode != 'undefined' ) {
            debug( "setting up an expect for the %s status code", expectedStatusCode )
            request.expect( expectedStatusCode )
        }

        return new Promise(function ( fulfill, reject ) {
            request.end(function ( err, response ) {
                if ( err ) {
                    debug( "rejecting request promise" )
                    return reject( err )
                }

                debug( "fulfilling request promise" )
                fulfill( response )
            })
        })
    }

    describe( "possible working situations", function () {

        it( "should work with 2 keys .pattern and 1 object .payload", function () {
            var context = this
            var pattern = { kind: 'movie', source: 'IMDB' }
            var payload = { name: 'Limitless', id: 'yolo' }
            var channel = pattern2channel( pattern )

            var redisMessageHandler = waitForRedisMessage.call( context, channel )

            return Promise.try(function () {
                return subscribeRedisChannel.call( context, channel )
            })
            .then(function () {
                return request.call( context, pattern, payload, 200 )
            })
            .then(function () {
                return redisMessageHandler
            })
            .then(function ( receivedPayload ) {
                expect( receivedPayload ).to.deep.equal( payload )
            })
        })

        it( "should work with 2 keys .pattern and 1 string .payload", function () {
            var context = this
            var pattern = { kind: 'movie', source: 'IMDB' }
            var payload = "Yoyoyo check this out modafoca"
            var channel = pattern2channel( pattern )

            var redisMessageHandler = waitForRedisMessage.call( context, channel )

            return Promise.try(function () {
                return subscribeRedisChannel.call( context, channel )
            })
            .then(function () {
                return request.call( context, pattern, payload, 200 )
            })
            .then(function () {
                return redisMessageHandler
            })
            .then(function ( receivedPayload ) {
                expect( receivedPayload ).to.deep.equal( payload )
            })
        })

        it( "should work with 1 keys .pattern and 1 string .payload", function () {
            var context = this
            var pattern = { kind: 'movie' }
            var payload = "Yoyoyo check this out modafoca"
            var channel = pattern2channel( pattern )

            var redisMessageHandler = waitForRedisMessage.call( context, channel )

            return Promise.try(function () {
                return subscribeRedisChannel.call( context, channel )
            })
            .then(function () {
                return request.call( context, pattern, payload, 200 )
            })
            .then(function () {
                return redisMessageHandler
            })
            .then(function ( receivedPayload ) {
                expect( receivedPayload ).to.deep.equal( payload )
            })
        })


        it( "should work with 1 keys .pattern and 1 positive numeric .payload", function () {
            var context = this
            var pattern = { kind: 'movie' }
            var payload = 1242135
            var channel = pattern2channel( pattern )

            var redisMessageHandler = waitForRedisMessage.call( context, channel )

            return Promise.try(function () {
                return subscribeRedisChannel.call( context, channel )
            })
            .then(function () {
                return request.call( context, pattern, payload, 200 )
            })
            .then(function () {
                return redisMessageHandler
            })
            .then(function ( receivedPayload ) {
                expect( receivedPayload ).to.deep.equal( payload )
            })
        })

        it( "should work with 1 keys .pattern and 1 negative numeric .payload", function () {
            var context = this
            var pattern = { kind: 'movie' }
            var payload = -1242135
            var channel = pattern2channel( pattern )

            var redisMessageHandler = waitForRedisMessage.call( context, channel )

            return Promise.try(function () {
                return subscribeRedisChannel.call( context, channel )
            })
            .then(function () {
                return request.call( context, pattern, payload, 200 )
            })
            .then(function () {
                return redisMessageHandler
            })
            .then(function ( receivedPayload ) {
                expect( receivedPayload ).to.deep.equal( payload )
            })
        })

        it( "should work with 1 keys .pattern and zero number .payload", function () {
            var context = this
            var pattern = { kind: 'movie' }
            var payload = 0
            var channel = pattern2channel( pattern )

            var redisMessageHandler = waitForRedisMessage.call( context, channel )

            return Promise.try(function () {
                return subscribeRedisChannel.call( context, channel )
            })
            .then(function () {
                return request.call( context, pattern, payload, 200 )
            })
            .then(function () {
                return redisMessageHandler
            })
            .then(function ( receivedPayload ) {
                expect( receivedPayload ).to.deep.equal( payload )
            })
        })

    })

    describe( "error scenarious", function () {

        it( "should NOT work with 0 keys .pattern even with a correct .payload", function () {
            var context = this
            var pattern = {}
            var payload = "there's some kind of correctness here"

            return Promise.try(function () {
                return request.call( context, pattern, payload, 400 )
            })
        })

        it( "should NOT work with a correct .pattern when .payload is undefined", function () {
            var context = this
            var pattern = { yolo: 'yolotwice' }
            var payload //= undefined //(jshint errors here)

            return Promise.try(function () {
                return request.call( context, pattern, payload, 400 )
            })
        })

    })

})
