import { GraphQLClient, rawRequest, request } from '../src'
import { setupTestServer } from './__helpers'

const ctx = setupTestServer()

test('minimal query', async () => {
  const data = ctx.mock({
    body: {
      data: {
        viewer: {
          id: 'some-id',
        },
      },
    },
  }).body.data

  expect(await request(ctx.url, `{ viewer { id } }`)).toEqual(data)
})

test('minimal raw query', async () => {
  const { extensions, data } = ctx.mock({
    body: {
      data: {
        viewer: {
          id: 'some-id',
        },
      },
      extensions: {
        version: '1',
      },
    },
  }).body
  const { headers, ...result } = await rawRequest(ctx.url, `{ viewer { id } }`)
  expect(result).toEqual({ data, extensions, status: 200 })
})

test('minimal raw query with response headers', async () => {
  const {
    headers: reqHeaders,
    body: { data, extensions },
  } = ctx.mock({
    headers: {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'test-custom-header',
    },
    body: {
      data: {
        viewer: {
          id: 'some-id',
        },
      },
      extensions: {
        version: '1',
      },
    },
  })
  const { headers, ...result } = await rawRequest(ctx.url, `{ viewer { id } }`)

  expect(result).toEqual({ data, extensions, status: 200 })
  expect(headers.get('X-Custom-Header')).toEqual(reqHeaders['X-Custom-Header'])
})

test('content-type with charset', async () => {
  const { data } = ctx.mock({
    // headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: {
      data: {
        viewer: {
          id: 'some-id',
        },
      },
    },
  }).body

  expect(await request(ctx.url, `{ viewer { id } }`)).toEqual(data)
})

test('basic error', async () => {
  ctx.mock({
    body: {
      errors: {
        message: 'Syntax Error GraphQL request (1:1) Unexpected Name "x"\n\n1: x\n   ^\n',
        locations: [
          {
            line: 1,
            column: 1,
          },
        ],
      },
    },
  }).body

  const res = await request(ctx.url, `x`).catch((x) => x)

  expect(res).toMatchInlineSnapshot(
    `[Error: GraphQL Error (Code: 200): {"response":{"errors":{"message":"Syntax Error GraphQL request (1:1) Unexpected Name \\"x\\"\\n\\n1: x\\n   ^\\n","locations":[{"line":1,"column":1}]},"status":200},"request":{"query":"x"}}]`
  )
})

test('basic error with raw request', async () => {
  ctx.mock({
    body: {
      errors: {
        message: 'Syntax Error GraphQL request (1:1) Unexpected Name "x"\n\n1: x\n   ^\n',
        locations: [
          {
            line: 1,
            column: 1,
          },
        ],
      },
    },
  })
  const res = await rawRequest(ctx.url, `x`).catch((x) => x)
  expect(res).toMatchInlineSnapshot(
    `[Error: GraphQL Error (Code: 200): {"response":{"errors":{"message":"Syntax Error GraphQL request (1:1) Unexpected Name \\"x\\"\\n\\n1: x\\n   ^\\n","locations":[{"line":1,"column":1}]},"status":200,"headers":{}},"request":{"query":"x"}}]`
  )
})

describe('middleware', () => {
  let client: GraphQLClient
  let requestMiddleware: jest.Mock
  let responseMiddleware: jest.Mock

  beforeEach(() => {
    ctx.mock({
      body: {
        data: {
          result: 123,
        },
      },
    }).body

    requestMiddleware = jest.fn(req => req)
    responseMiddleware = jest.fn()
    client = new GraphQLClient(ctx.url, { requestMiddleware, responseMiddleware })
  })

  it('request', async () => {
    const requestPromise = client.request<{ result: number }>(`x`)
    expect(requestMiddleware).toBeCalled()
    const res = await requestPromise
    expect(responseMiddleware).toBeCalled()
    expect(res.result).toBe(123)
  })

  it('rawRequest', async () => {
    const requestPromise = client.rawRequest<{ result: number }>(`x`)
    expect(requestMiddleware).toBeCalled()
    const res = await requestPromise
    expect(responseMiddleware).toBeCalled()
    expect(res.data?.result).toBe(123)
  })
})

// todo needs to be tested in browser environment
// the options under test here aren't used by node-fetch
test.skip('extra fetch options', async () => {
  const options: RequestInit = {
    credentials: 'include',
    mode: 'cors',
    cache: 'reload',
  }

  const client = new GraphQLClient(ctx.url, options)
  const { requests } = ctx.mock({
    body: { data: { test: 'test' } },
  })
  await client.request('{ test }')
  expect(requests).toMatchInlineSnapshot(`
    Array [
      Object {
        "body": Object {
          "query": "{ test }",
        },
        "headers": Object {
          "accept": "*/*",
          "accept-encoding": "gzip,deflate",
          "connection": "close",
          "content-length": "20",
          "content-type": "application/json",
          "host": "localhost:3210",
          "user-agent": "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
        },
        "method": "POST",
      },
    ]
  `)
})
