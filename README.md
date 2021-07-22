# graphql-request

Minimal GraphQL client supporting Node and browsers for scripts or simple apps

![GitHub Action](https://github.com/prisma-labs/graphql-request/workflows/trunk/badge.svg) [![npm version](https://badge.fury.io/js/graphql-request.svg)](https://badge.fury.io/js/graphql-request)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Features](#features)
- [Install](#install)
- [Quickstart](#quickstart)
- [Usage](#usage)
- [Node Version Support](#node-version-support)
- [Community](#community)
    - [GraphQL Code Generator's GraphQL-Request TypeScript Plugin](#graphql-code-generators-graphql-request-typescript-plugin)
- [Examples](#examples)
  - [Authentication via HTTP header](#authentication-via-http-header)
    - [Incrementally setting headers](#incrementally-setting-headers)
  - [Passing Headers in each request](#passing-headers-in-each-request)
  - [Passing more options to `fetch`](#passing-more-options-to-fetch)
  - [Using GraphQL Document variables](#using-graphql-document-variables)
  - [GraphQL Mutations](#graphql-mutations)
  - [Error handling](#error-handling)
  - [Using `require` instead of `import`](#using-require-instead-of-import)
  - [Cookie support for `node`](#cookie-support-for-node)
  - [Using a custom `fetch` method](#using-a-custom-fetch-method)
  - [Receiving a raw response](#receiving-a-raw-response)
  - [File Upload](#file-upload)
    - [Browser](#browser)
    - [Node](#node)
- [FAQ](#faq)
    - [Why do I have to install `graphql`?](#why-do-i-have-to-install-graphql)
    - [Do I need to wrap my GraphQL documents inside the `gql` template exported by `graphql-request`?](#do-i-need-to-wrap-my-graphql-documents-inside-the-gql-template-exported-by-graphql-request)
    - [What's the difference between `graphql-request`, Apollo and Relay?](#whats-the-difference-between-graphql-request-apollo-and-relay)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features

- Most **simple & lightweight** GraphQL client
- Promise-based API (works with `async` / `await`)
- Typescript support
- Isomorphic (works with Node / browsers)

## Install

```sh
npm add graphql-request graphql
```

## Quickstart

Send a GraphQL query with a single line of code. ▶️ [Try it out](https://runkit.com/593130bdfad7120012472003/593130bdfad7120012472004).

```js
import { request, gql } from 'graphql-request'

const query = gql`
  {
    Movie(title: "Inception") {
      releaseDate
      actors {
        name
      }
    }
  }
`

request('https://api.graph.cool/simple/v1/movies', query).then((data) => console.log(data))
```

## Usage

```js
import { request, GraphQLClient } from 'graphql-request'

// Run GraphQL queries/mutations using a static function
request(endpoint, query, variables).then((data) => console.log(data))

// ... or create a GraphQL client instance to send requests
const client = new GraphQLClient(endpoint, { headers: {} })
client.request(query, variables).then((data) => console.log(data))
```

## Node Version Support

We only officially support [LTS Node versions](https://github.com/nodejs/Release#release-schedule). We also make an effort to support two additional versions:

1. The latest even Node version if it is not LTS already.
2. The odd Node version directly following the latest even version.

You are free to try using other versions of Node (e.g. `13.x`) with `graphql-request` but at your own risk.

## Community

#### GraphQL Code Generator's GraphQL-Request TypeScript Plugin

A [GraphQL-Codegen plugin](https://graphql-code-generator.com/docs/plugins/typescript-graphql-request) that generates a `graphql-request` ready-to-use SDK, which is fully-typed.

## Examples

### Authentication via HTTP header

```js
import { GraphQLClient, gql } from 'graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: 'Bearer MY_TOKEN',
    },
  })

  const query = gql`
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

main().catch((error) => console.error(error))
```

[TypeScript Source](examples/authentication-via-http-header.ts)

#### Incrementally setting headers

If you want to set headers after the GraphQLClient has been initialised, you can use the `setHeader()` or `setHeaders()` functions.

```js
import { GraphQLClient } from 'graphql-request'

const client = new GraphQLClient(endpoint)

// Set a single header
client.setHeader('authorization', 'Bearer MY_TOKEN')

// Override all existing headers
client.setHeaders({
  authorization: 'Bearer MY_TOKEN',
  anotherheader: 'header_value'
})
```

#### passing-headers-in-each-request

It is possible to pass custom headers for each request. `request()` and `rawRequest()` accept a header object as the third parameter


```js
import { GraphQLClient } from 'graphql-request'

const client = new GraphQLClient(endpoint)

const query = gql`
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

const requestHeaders = {
  authorization: 'Bearer MY_TOKEN'
}

// Overrides the clients headers with the passed values
const data = await client.request(query, variables, requestHeaders)
```

### Passing more options to `fetch`

```js
import { GraphQLClient, gql } from 'graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const graphQLClient = new GraphQLClient(endpoint, {
    credentials: 'include',
    mode: 'cors',
  })

  const query = gql`
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

main().catch((error) => console.error(error))
```

[TypeScript Source](examples/passing-more-options-to-fetch.ts)

### Using GraphQL Document variables

```js
import { request, gql } from 'graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const query = gql`
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

main().catch((error) => console.error(error))
```

### GraphQL Mutations

```js
import { GraphQLClient, gql } from 'graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: 'Bearer MY_TOKEN',
    },
  })

  const mutation = gql`
    mutation AddMovie($title: String!, $releaseDate: Int!) {
      insert_movies_one(object: { title: $title, releaseDate: $releaseDate }) {
        title
        releaseDate
      }
    }
  `

  const variables = {
    title: 'Inception',
    releaseDate: 2010,
  }
  const data = await graphQLClient.request(mutation, variables)

  console.log(JSON.stringify(data, undefined, 2))
}

main().catch((error) => console.error(error))
```

[TypeScript Source](examples/using-variables.ts)

### Error handling

```js
import { request, gql } from 'graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const query = gql`
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

main().catch((error) => console.error(error))
```

[TypeScript Source](examples/error-handling.ts)

### Using `require` instead of `import`

```js
const { request, gql } = require('graphql-request')

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const query = gql`
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

main().catch((error) => console.error(error))
```

### Cookie support for `node`

```sh
npm install fetch-cookie
```

```js
require('fetch-cookie/node-fetch')(require('node-fetch'))

import { GraphQLClient, gql } from 'graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: 'Bearer MY_TOKEN',
    },
  })

  const query = gql`
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

main().catch((error) => console.error(error))
```

[TypeScript Source](examples/cookie-support-for-node.ts)

### Using a custom `fetch` method

```sh
npm install fetch-cookie
```

```js
import { GraphQLClient, gql } from 'graphql-request'
import crossFetch from 'cross-fetch'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  // a cookie jar scoped to the client object
  const fetch = require('fetch-cookie')(crossFetch)
  const graphQLClient = new GraphQLClient(endpoint, { fetch })

  const query = gql`
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

main().catch((error) => console.error(error))
```

### Receiving a raw response

The `request` method will return the `data` or `errors` key from the response.
If you need to access the `extensions` key you can use the `rawRequest` method:

```js
import { rawRequest, gql } from 'graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const query = gql`
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `

  const { data, errors, extensions, headers, status } = await rawRequest(endpoint, query)
  console.log(JSON.stringify({ data, errors, extensions, headers, status }, undefined, 2))
}

main().catch((error) => console.error(error))
```

### File Upload

#### Browser

```js
import { request } from 'graphql-request'

const UploadUserAvatar = gql`
  mutation uploadUserAvatar($userId: Int!, $file: Upload!) {
    updateUser(id: $userId, input: { avatar: $file })
  }
`

request('/api/graphql', UploadUserAvatar, {
  userId: 1,
  file: document.querySelector('input#avatar').files[0],
})
```

#### Node

```js
import { createReadStream } from 'fs'
import { request } from 'graphql-request'

const UploadUserAvatar = gql`
  mutation uploadUserAvatar($userId: Int!, $file: Upload!) {
    updateUser(id: $userId, input: { avatar: $file })
  }
`

request('/api/graphql', UploadUserAvatar, {
  userId: 1,
  file: createReadStream('./avatar.img'),
})
```

[TypeScript Source](examples/receiving-a-raw-response.ts)

## FAQ

#### Why do I have to install `graphql`?

`graphql-request` uses a TypeScript type from the `graphql` package such that if you are using TypeScript to build your project and you are using `graphql-request` but don't have `graphql` installed TypeScript build will fail. Details [here](https://github.com/prisma-labs/graphql-request/pull/183#discussion_r464453076). If you are a JS user then you do not technically need to install `graphql`. However if you use an IDE that picks up TS types even for JS (like VSCode) then its still in your interest to install `graphql` so that you can benefit from enhanced type safety during development.

#### Do I need to wrap my GraphQL documents inside the `gql` template exported by `graphql-request`?

No. It is there for convenience so that you can get the tooling support like prettier formatting and IDE syntax highlighting. You can use `gql` from `graphql-tag` if you need it for some reason too.

#### What's the difference between `graphql-request`, Apollo and Relay?

`graphql-request` is the most minimal and simplest to use GraphQL client. It's perfect for small scripts or simple apps.

Compared to GraphQL clients like Apollo or Relay, `graphql-request` doesn't have a built-in cache and has no integrations for frontend frameworks. The goal is to keep the package and API as minimal as possible.
