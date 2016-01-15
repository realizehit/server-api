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
docker run -d -p 80:8080 81:3000 realizehit/server-api
```

## Environment Variables

So here is a list of appliable variables:

#### `SERVER_HOST`
Defaults to `0.0.0.0`

#### `SERVER_API_PORT`
Defaults to `8080`

#### `ENDPOINT_HOST`
Defaults to `localhost`

Here you should define the host of the public accessible endpoint, in our case
its our load-balancer's hostname.

#### `ENDPOINT_API_PORT`
Defaults to `SERVER_API_PORT`

Here you should define the configured port of the public accessible endpoint.
