import crossFetch, * as CrossFetch from 'cross-fetch'
import { print } from 'graphql/language/printer'
import createRequestBody from './createRequestBody'
import { ClientError, GraphQLError, RequestDocument, Variables } from './types'
import * as Dom from './types.dom'

export { ClientError } from './types'

/**
 * Convert the given headers configuration into a plain object.
 */
const resolveHeaders = (headers: Dom.RequestInit['headers']): Record<string, string> => {
  let oHeaders: Record<string, string> = {}
  if (headers) {
    if (
      (typeof Headers !== 'undefined' && headers instanceof Headers) ||
      headers instanceof CrossFetch.Headers
    ) {
      oHeaders = HeadersInstanceToPlainObject(headers)
    } else if (Array.isArray(headers)) {
      headers.forEach(([name, value]) => {
        oHeaders[name] = value
      })
    } else {
      oHeaders = headers as Record<string, string>
    }
  }

  return oHeaders
}

/**
 * todo
 */
export class GraphQLClient {
  private url: string
  private options: Dom.RequestInit

  constructor(url: string, options?: Dom.RequestInit) {
    this.url = url
    this.options = options || {}
  }

  async rawRequest<T = any, V = Variables>(
    query: string,
    variables?: V
  ): Promise<{ data?: T; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] }> {
    let { headers, fetch: localFetch = crossFetch, ...others } = this.options
    const body = createRequestBody(query, variables)
    headers = resolveHeaders(headers)

    const response = await localFetch(this.url, {
      method: 'POST',
      headers: {
        ...(typeof body === 'string' ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body,
      ...others,
    })

    const result = await getResult(response)

    if (response.ok && result.data) {
      const { headers, status } = response
      return { ...result, headers, status }
    } else {
      const errorResult = typeof result === 'string' ? { error: result } : result
      throw new ClientError(
        { ...errorResult, status: response.status, headers: response.headers },
        { query, variables }
      )
    }
  }

  /**
   * Send a GraphQL document to the server.
   */
  async request<T = any, V = Variables>(document: RequestDocument, variables?: V): Promise<{ data?: T; errors?: GraphQLError[] }> {
    let { headers, fetch: localFetch = crossFetch, ...others } = this.options
    headers = resolveHeaders(headers)
    const resolvedDoc = resolveRequestDocument(document)
    const body = createRequestBody(resolvedDoc, variables)

    const response = await localFetch(this.url, {
      method: 'POST',
      headers: {
        ...(typeof body === 'string' ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body,
      ...others,
    })

    const result = await getResult(response)

    if (response.ok && result.data) {
      return result
    } else {
      const errorResult = typeof result === 'string' ? { error: result } : result
      throw new ClientError({ ...errorResult, status: response.status }, { query: resolvedDoc, variables })
    }
  }

  setHeaders(headers: Dom.RequestInit['headers']): GraphQLClient {
    this.options.headers = headers
    return this
  }

  /**
   * Attach a header to the client. All subsequent requests will have this header.
   */
  setHeader(key: string, value: string): GraphQLClient {
    const { headers } = this.options

    if (headers) {
      // todo what if headers is in nested array form... ?
      //@ts-ignore
      headers[key] = value
    } else {
      this.options.headers = { [key]: value }
    }

    return this
  }
}

/**
 * todo
 */
export async function rawRequest<T = any, V = Variables>(
  url: string,
  query: string,
  variables?: V
): Promise<{ data?: T; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] }> {
  const client = new GraphQLClient(url)
  return client.rawRequest<T, V>(query, variables)
}

/**
 * Send a GraphQL Document to the GraphQL server for exectuion.
 *
 * @example
 *
 * ```ts
 * // You can pass a raw string
 *
 * await request('https://foo.bar/graphql', `
 *   {
 *     query {
 *       users
 *     }
 *   }
 * `)
 *
 * // You can also pass a GraphQL DocumentNode. Convenient if you
 * // are using graphql-tag package.
 *
 * import gql from 'graphql-tag'
 *
 * await request('https://foo.bar/graphql', gql`...`)
 *
 * // If you don't actually care about using DocumentNode but just
 * // want the tooling support for gql template tag like IDE syntax
 * // coloring and prettier autoformat then note you can use the
 * // passthrough gql tag shipped with graphql-request to save a bit
 * // of performance and not have to install another dep into your project.
 *
 * import { gql } from 'graphql-request'
 *
 * await request('https://foo.bar/graphql', gql`...`)
 * ```
 */
export async function request<T = any, V = Variables>(
  url: string,
  document: RequestDocument,
  variables?: V
): Promise<{ data?: T; errors?: GraphQLError[] }> {
  const client = new GraphQLClient(url)
  return client.request<T, V>(document, variables)
}

export default request

/**
 * todo
 */
function getResult(response: Dom.Response): Promise<any> {
  const contentType = response.headers.get('Content-Type')
  if (contentType && contentType.startsWith('application/json')) {
    return response.json()
  } else {
    return response.text()
  }
}

/**
 * helpers
 */

function resolveRequestDocument(document: RequestDocument): string {
  if (typeof document === 'string') return document

  return print(document)
}

/**
 * Convenience passthrough template tag to get the benefits of tooling for the gql template tag. This does not actually parse the input into a GraphQL DocumentNode like graphql-tag package does. It just returns the string with any variables given interpolated. Can save you a bit of performance and having to install another package.
 *
 * @example
 *
 * import { gql } from 'graphql-request'
 *
 * await request('https://foo.bar/graphql', gql`...`)
 *
 * @remarks
 *
 * Several tools in the Node GraphQL ecosystem are hardcoded to specially treat any template tag named "gql". For example see this prettier issue: https://github.com/prettier/prettier/issues/4360. Using this template tag has no runtime effect beyond variable interpolation.
 */
export function gql(chunks: TemplateStringsArray, ...variables: any[]): string {
  return chunks.reduce(
    (accumulator, chunk, index) => `${accumulator}${chunk}${index in variables ? variables[index] : ''}`,
    ''
  )
}

/**
 * Convert Headers instance into regular object
 */
function HeadersInstanceToPlainObject(headers: Dom.Response['headers']): Record<string, string> {
  const o: any = {}
  headers.forEach((v, k) => {
    o[k] = v
  })
  return o
}
