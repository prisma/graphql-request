import { RequestInit, Response } from "./types.dom"

export type Variables = { [key: string]: any }

export interface GraphQLClientOptions extends RequestInit {
  requestMiddleware?: (request: RequestInit) => RequestInit
  responseMiddleware?: (response: Response) => void
}

export interface GraphQLError {
  message: string
  locations: { line: number; column: number }[]
  path: string[]
}

export interface GraphQLResponse {
  data?: any
  errors?: GraphQLError[]
  extensions?: any
  status: number
  [key: string]: any
}

export interface GraphQLRequestContext {
  query: string
  variables?: Variables
}

export class ClientError extends Error {
  response: GraphQLResponse
  request: GraphQLRequestContext

  constructor(response: GraphQLResponse, request: GraphQLRequestContext) {
    const message = `${ClientError.extractMessage(response)}: ${JSON.stringify({
      response,
      request,
    })}`

    super(message)

    Object.setPrototypeOf(this, ClientError.prototype)

    this.response = response
    this.request = request

    // this is needed as Safari doesn't support .captureStackTrace
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, ClientError)
    }
  }

  private static extractMessage(response: GraphQLResponse): string {
    try {
      return response.errors![0].message
    } catch (e) {
      return `GraphQL Error (Code: ${response.status})`
    }
  }
}
