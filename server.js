var ApiServer = require( './' )
var env = process.env

var REDIS_URI = env.REDIS_URI || 'redis://localhost:6379'
var HTTP_PORT = env.SERVER_API_PORT || 8080
var HTTP_PREFIX = env.SERVER_API_PREFIX || '/'
var HTTP_HOST = env.SERVER_HOST || '0.0.0.0'
var ENDPOINT = env.ENDPOINT_API || 'http://' + HTTP_HOST + ':' + HTTP_PORT

var server = new ApiServer({
    httpPort: HTTP_PORT,
    httpPrefix: HTTP_PREFIX,
    redis: REDIS_URI
})

console.log( 'Server initialized on port ' + HTTP_PORT )
console.log( 'It should be accessed over ' + ENDPOINT )
