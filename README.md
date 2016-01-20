# realizehit-server-api [![Build Status](https://travis-ci.org/realizehit/server-api.svg?branch=master)](https://travis-ci.org/realizehit/server-api)

realizehit API server

Probably you might want to use [realizehit/realizehit](https://github.com/realizehit/realizehit) instead.

## Usage

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
docker run -d --name=redis redis
docker run -d \
    --name=realizehit-server-api \
    -p 8080:8080 \
    -e REDIS_URI="redis://redis:6379" \
    --link redis:redis \
    realizehit/server-api
```

## Environment Variables

So here is a list of appliable variables:

#### `REDIS_URI`
Defaults to `redis://localhost:6379`

You should always specify a way to this communicate with redis.

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
