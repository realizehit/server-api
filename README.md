# realizehit-api-server

realizehit API server

## Installation

#### NPM
```bash
npm i -g realizehit-api-server
DEBUG=* realizehit-api-server
```

#### Docker
```bash
docker build -t realizehit/api-server .
docker run -d -p 80:8080 81:3000 realizehit/api-server
```

## Environment Variables

So here is a list of appliable variables:

`SERVER_HOST` - Defaults to `0.0.0.0`

`SERVER_API_PORT`- Defaults to `8080`

`ENDPOINT_HOST`- Defaults to `localhost`

Here you should define the host of the public accessible endpoint, in our case
its our load-balancer's hostname.

`ENDPOINT_API_PORT` - Defaults to `SERVER_API_PORT`

Here you should define the configured port of the public accessible endpoint, in
our case its... I won't tell! :)
