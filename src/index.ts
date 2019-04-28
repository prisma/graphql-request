import { ClientError, GraphQLError, Headers as HttpHeaders, Options, Variables } from './types'
export { ClientError } from './types'
import 'cross-fetch/polyfill'

export class GraphQLClient {
  private url: string
  private options: Options

  constructor(url: string, options?: Options) {
    this.url = url
    this.options = options || {}
  }

  async rawRequest<T extends any>(
    query: string,
    variables?: Variables,
    extendHeaders?: HttpHeaders
  ): Promise<{ data?: T, extensions?: any, headers: Headers, status: number, errors?: GraphQLError[] }> {
    const { headers, ...others } = this.options

    const body = JSON.stringify({
      query,
      variables: variables ? variables : undefined,
    })

    const response = await fetch(this.url, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers, extendHeaders || {}),
      body,
      ...others,
    })

    const result = await getResult(response)

    if (response.ok && !result.errors && result.data) {
      const { headers, status } = response
      return { ...result, headers, status }
    } else {
      const errorResult =
        typeof result === 'string' ? { error: result } : result
      throw new ClientError(
        { ...errorResult, status: response.status, headers: response.headers },
        { query, variables },
      )
    }
  }

  async request<T extends any>(
    query: string,
    variables?: Variables,
    extendHeaders?: HttpHeaders
  ): Promise<T> {
    const { headers, ...others } = this.options

    const body = JSON.stringify({
      query,
      variables: variables ? variables : undefined,
    })

    const response = await fetch(this.url, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers, extendHeaders || {}),
      body,
      ...others,
    })

    const result = await getResult(response)

    if (response.ok && !result.errors && result.data) {
      return result.data
    } else {
      const errorResult =
        typeof result === 'string' ? { error: result } : result
      throw new ClientError(
        { ...errorResult, status: response.status },
        { query, variables },
      )
    }
  }

  setHeaders(headers: HttpHeaders): GraphQLClient {
    this.options.headers = headers

    return this
  }

  setHeader(key: string, value: string): GraphQLClient {
    const { headers } = this.options

    if (headers) {
      headers[key] = value
    } else {
      this.options.headers = { [key]: value }
    }
    return this
  }
}

export async function rawRequest<T extends any>(
  url: string,
  query: string,
  variables?: Variables,
  headers?: HttpHeaders
): Promise<{ data?: T, extensions?: any, headers: Headers, status: number, errors?: GraphQLError[] }> {
  const client = new GraphQLClient(url)

  return client.rawRequest<T>(query, variables, headers)
}

export async function request<T extends any>(
  url: string,
  query: string,
  variables?: Variables,
  headers?: HttpHeaders
): Promise<T> {
  const client = new GraphQLClient(url)

  return client.request<T>(query, variables, headers)
}

export default request

async function getResult(response: Response): Promise<any> {
  const contentType = response.headers.get('Content-Type')
  if (contentType && contentType.startsWith('application/json')) {
    return response.json()
  } else {
    return response.text()
  }
}
