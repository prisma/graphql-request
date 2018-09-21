import test from 'ava'
import * as fetchMock from 'fetch-mock'
import { ClientError, rawRequest, request, GraphQLClient } from '../src/index'
import { Options } from '../src/types'

test('minimal query', async (t) => {
  const data = {
    viewer: {
      id: 'some-id',
    },
  }

  await mock({body: {data}}, async () => {
    t.deepEqual(await request('https://mock-api.com/graphql', `{ viewer { id } }`), data)
  })
})

test('minimal raw query', async (t) => {
  const data = {
    viewer: {
      id: 'some-id',
    },
  }

  const extensions = {
    version: '1',
  }

  await mock({body: {data, extensions}}, async () => {
    const { headers, ...result } = await rawRequest('https://mock-api.com/graphql', `{ viewer { id } }`)
    t.deepEqual(result, {data, extensions, status: 200})
  })
})

test('minimal raw query with response headers', async (t) => {
  const data = {
    viewer: {
      id: 'some-id',
    },
  }

  const extensions = {
    version: '1',
  }

  const reqHeaders = {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'test-custom-header',
  }

  await mock({headers: reqHeaders, body: {data, extensions}}, async () => {
    const { headers, ...result } = await rawRequest('https://mock-api.com/graphql', `{ viewer { id } }`)
    t.deepEqual(result, {data, extensions, status: 200})
    t.deepEqual(headers.get('X-Custom-Header'), reqHeaders['X-Custom-Header'])
  })
})

test('basic error', async (t) => {
  const errors = {
    message: "Syntax Error GraphQL request (1:1) Unexpected Name \"x\"\n\n1: x\n   ^\n",
    locations: [
      {
        line: 1,
        column: 1
      }
    ]
  }

  await mock({body: {errors}}, async () => {
    const err: ClientError = await t.throws(request('https://mock-api.com/graphql', `x`))
    t.deepEqual<any>(err.response.errors, errors)
  })
})

test('raw request error', async (t) => {
  const errors = {
    message: "Syntax Error GraphQL request (1:1) Unexpected Name \"x\"\n\n1: x\n   ^\n",
    locations: [
      {
        line: 1,
        column: 1
      }
    ]
  }

  await mock({body: {errors}}, async () => {
    const err: ClientError = await t.throws(rawRequest('https://mock-api.com/graphql', `x`))
    t.deepEqual<any>(err.response.errors, errors)
  })
})

test('content-type with charset', async (t) => {
  const data = {
    viewer: {
      id: 'some-id',
    },
  }

  await mock({
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    body: {data}
  }, async () => {
    t.deepEqual(await request('https://mock-api.com/graphql', `{ viewer { id } }`), data)
  })
})


test('extra fetch options', async (t) => {
  const options: Options = {
    credentials: 'include',
    mode: 'cors',
    cache: 'reload',
  }

  const client = new GraphQLClient('https://mock-api.com/graphql', options)
  await mock({
    body: { data: {test: 'test'} }
  }, async () => {
    await client.request('{ test }')
    const actualOptions = fetchMock.lastCall()[1]
    for (let name in options) {
      t.deepEqual(actualOptions[name], options[name])
    }
  })
})

test('dynamic header', async (t) => {
  const HEADER_VALUE = 'dynmic header value'
  const client = new GraphQLClient('https://mock-api.com/graphql', {
    headers: {
      'Authorization': () => {return HEADER_VALUE}
    }
  })
  await mock({
    body: { data: {test: 'test'} }
  }, async () => {
    await client.request('query { test }')
    t.deepEqual(fetchMock.lastCall()[1].headers!['Authorization'], HEADER_VALUE)
  })
})

async function mock(response: any, testFn: () => Promise<void>) {
  fetchMock.mock({
    matcher: '*',
    response: {
      headers: {
        'Content-Type': 'application/json',
        ...response.headers,
      },
      body: JSON.stringify(response.body),
    },
  })

  await testFn()

  fetchMock.restore()
}
