var env = process.env

var HTTP_PORT = env.SERVER_API_PORT || 8080

var Server = require( './lib/server' )
var server = new Server({
    httpPort: HTTP_PORT
})
