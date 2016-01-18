var ApiServer = require( '.' )
var env = process.env

var HTTP_PORT = env.SERVER_API_PORT || 8080

var server = new ApiServer({
    httpPort: HTTP_PORT
})
