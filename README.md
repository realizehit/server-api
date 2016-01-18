# realizehit-server-api

realizehit API server

Probably you might want to use [realizehit/realizehit](https://github.com/realizehit/realizehit) instead.

## Installation

#### NPM

```bash
npm i -g realizehit-server-api
DEBUG=* realizehit-server-api
```

#### Docker

```bash
docker build -t realizehit/server-api .
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
