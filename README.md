# realizehit-server-api

realizehit API server

Probably you might want to use [realizehit/realizehit](https://github.com/realizehit/realizehit) instead.

## Installation

#### Run as NPM module

```bash
npm i -g realizehit-server-api
```

```javascript
var ApiServer = require( 'realizehit-server-api' )

var server = new ApiServer({
    httpPort: '8080'
})
```

#### Run with Docker

```bash
docker run -d -p 8080:8080 realizehit/server-api
```

## Environment Variables

So here is a list of appliable variables:

#### `SERVER_HOST`
Defaults to `0.0.0.0`

#### `SERVER_API_PORT`
Defaults to `8080`

#### `ENDPOINT_API`
Defaults to `http://{{SERVER_HOST}}:{{SERVER_API_PORT}}`

Here you should define the URI of the public accessible endpoint.

## Contributing

### Running with node

```bash
npm install
npm start
```

### Running with docker

```bash
docker build -t realizehit/server-api:dev .
docker run -d -p 8080:8080 realizehit/server-api:dev
```
