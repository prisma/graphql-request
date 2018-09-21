# graphql-request

[![CircleCI](https://circleci.com/gh/prisma/graphql-request.svg?style=shield)](https://circleci.com/gh/prisma/graphql-request) [![npm version](https://badge.fury.io/js/graphql-request.svg)](https://badge.fury.io/js/graphql-request)

📡 Minimal GraphQL client supporting Node and browsers for scripts or simple apps

## Features

- Most **simple and lightweight** GraphQL client
- Promise-based API (works with `async` / `await`)
- Typescript support (Flow coming soon)

## Install

```sh
npm install graphql-request
```

## Quickstart

Send a GraphQL query with a single line of code. ▶️ [Try it out](https://runkit.com/593130bdfad7120012472003/593130bdfad7120012472004).

```js
import { request } from 'graphql-request'

const query = `{
  Movie(title: "Inception") {
    releaseDate
    actors {
      name
    }
  }
}`

request('https://api.graph.cool/simple/v1/movies', query).then(data =>
  console.log(data)
)
```

## Usage

```js
import { request, GraphQLClient } from 'graphql-request'

// Run GraphQL queries/mutations using a static function
request(endpoint, query, variables).then(data => console.log(data))

// ... or create a GraphQL client instance to send requests
const client = new GraphQLClient(endpoint, { headers: {} })
client.request(query, variables).then(data => console.log(data))
```

## Examples

### Dynamic headers

```js
import { GraphQLClient } from 'graphql-request'
import store from './store'

const client = new GraphQLClient('my-endpoint', {
  headers: {
    Authorization: () => store.getIdentity().getToken(),
  },
})

const query = `{
  Movie(title: "Inception") {
    releaseDate
    actors {
      name
    }
  }
}`

client.request(query).then(data => console.log(data))
```

### Authentication via HTTP header

```js
import { GraphQLClient } from 'graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: 'Bearer MY_TOKEN',
    },
  })

  const query = /* GraphQL */ `
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `

  const data = await graphQLClient.request(query)
  console.log(JSON.stringify(data, undefined, 2))
}

main().catch(error => console.error(error))
```

[TypeScript Source](examples/authentication-via-http-header.ts)

### Passing more options to fetch

```js
import { GraphQLClient } from 'graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const graphQLClient = new GraphQLClient(endpoint, {
    credentials: 'include',
    mode: 'cors',
  })

  const query = /* GraphQL */ `
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `

  const data = await graphQLClient.request(query)
  console.log(JSON.stringify(data, undefined, 2))
}

main().catch(error => console.error(error))
```

[TypeScript Source](examples/passing-more-options-to-fetch.ts)

### Using variables

```js
import { request } from 'graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const query = /* GraphQL */ `
    query getMovie($title: String!) {
      Movie(title: $title) {
        releaseDate
        actors {
          name
        }
      }
    }
  `

  const variables = {
    title: 'Inception',
  }

  const data = await request(endpoint, query, variables)
  console.log(JSON.stringify(data, undefined, 2))
}

main().catch(error => console.error(error))
```

[TypeScript Source](examples/using-variables.ts)

### Error handling

```js
import { request } from 'graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const query = /* GraphQL */ `
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          fullname # "Cannot query field 'fullname' on type 'Actor'. Did you mean 'name'?"
        }
      }
    }
  `

  try {
    const data = await request(endpoint, query)
    console.log(JSON.stringify(data, undefined, 2))
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
    process.exit(1)
  }
}

main().catch(error => console.error(error))
```

[TypeScript Source](examples/error-handling)

### Using `require` instead of `import`

```js
const { request } = require('graphql-request')

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const query = /* GraphQL */ `
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `

  const data = await request(endpoint, query)
  console.log(JSON.stringify(data, undefined, 2))
}

main().catch(error => console.error(error))
```

### Cookie support for `node`

```sh
npm install fetch-cookie
```

```js
require('fetch-cookie/node-fetch')(require('node-fetch'))

import { GraphQLClient } from 'graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: 'Bearer MY_TOKEN',
    },
  })

  const query = /* GraphQL */ `
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `

  const data = await graphQLClient.rawRequest(query)
  console.log(JSON.stringify(data, undefined, 2))
}

main().catch(error => console.error(error))
```

[TypeScript Source](examples/cookie-support-for-node)

### Receiving a raw response

The `request` method will return the `data` or `errors` key from the response.
If you need to access the `extensions` key you can use the `rawRequest` method:

```js
import { rawRequest } from 'graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const query = /* GraphQL */ `
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `

  const { data, errors, extensions, headers, status } = await rawRequest(
    endpoint,
    query
  )
  console.log(
    JSON.stringify({ data, errors, extensions, headers, status }, undefined, 2)
  )
}

main().catch(error => console.error(error))
```

[TypeScript Source](examples/receiving-a-raw-response)

### More examples coming soon...

- Fragments
- Using [`graphql-tag`](https://github.com/apollographql/graphql-tag)

## FAQ

### What's the difference between `graphql-request`, Apollo and Relay?

`graphql-request` is the most minimal and simplest to use GraphQL client. It's perfect for small scripts or simple apps.

Compared to GraphQL clients like Apollo or Relay, `graphql-request` doesn't have a built-in cache and has no integrations for frontend frameworks. The goal is to keep the package and API as minimal as possible.

### So what about Lokka?

Lokka is great but it still requires [a lot of setup code](https://github.com/kadirahq/lokka-transport-http) to be able to send a simple GraphQL query. `graphql-request` does less work compared to Lokka but is a lot simpler to use.

## Help & Community [![Slack Status](https://slack.prisma.io/badge.svg)](https://slack.prisma.io)

Join our [Slack community](http://slack.prisma.io/) if you run into issues or have questions. We love talking to you!

<p align="center"><a href="https://oss.prisma.io"><img src="https://imgur.com/IMU2ERq.png" alt="Prisma" height="170px"></a></p>
