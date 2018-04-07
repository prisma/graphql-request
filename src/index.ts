import { ClientError, GraphQLError, Headers, Options, Variables } from './types'
export { ClientError } from './types'
import 'cross-fetch/polyfill'
import url from 'url'
import qs from 'querystring'

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
  ): Promise<{ data?: T, extensions?: any, errors?: GraphQLError[] }> {
    const response = await this.getResponse(query, variables)

    const result = await getResult(response)

    if (response.ok && !result.errors && result.data) {
      return result
    } else {
      const errorResult =
        typeof result === 'string' ? { error: result } : result
      throw new ClientError(
        { ...errorResult, status: response.status },
        { query, variables },
      )
    }
  }

  async request<T extends any>(
    query: string,
    variables?: Variables,
  ): Promise<T> {
    const response = await this.getResponse(query, variables)

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

  setHeaders(headers: Headers): GraphQLClient {
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

  async getResponse(
    query: string,
    variables?: Variables,
  ) {
    const { headers, method = 'POST', ...others } = this.options
    let response: Response

    if (method.toUpperCase() === 'GET') {
      const _url = url.parse(this.url)
      const _query = _url.query ? qs.parse(_url.query) : { }
      const _finalUrl = url.format({
        ..._url,
        query: {
          ..._query,
          query,
          variables: JSON.stringify(variables),
        }
      })

      response = await fetch(_finalUrl, { headers })
    } else {
      const body = JSON.stringify({
        query,
        variables,
      })

      response = await fetch(this.url, {
        headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
        body,
        ...others,
        method: 'POST',
      })
    }

    return response
  }
}

export async function rawRequest<T extends any>(
  url: string,
  query: string,
  variables?: Variables,
): Promise<{ data?: T, extensions?: any, errors?: GraphQLError[] }> {
  const client = new GraphQLClient(url)

  return client.rawRequest<T>(query, variables)
}

export async function request<T extends any>(
  url: string,
  query: string,
  variables?: Variables,
): Promise<T> {
  const client = new GraphQLClient(url)

  return client.request<T>(query, variables)
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
