var ApiServer = require( './' )
var env = process.env

var HTTP_PORT = env.SERVER_API_PORT || 8080
var HTTP_HOST = env.SERVER_HOST || '0.0.0.0'
var ENDPOINT = env.ENDPOINT_API || 'http://' + HTTP_HOST + ':' + HTTP_PORT

var server = new ApiServer({
    httpPort: HTTP_PORT
})

console.log( 'Server initialized on port ' + HTTP_PORT )
console.log( 'It should be accessed over ' + ENDPOINT )
