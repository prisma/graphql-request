import { DocumentNode } from 'graphql'

export type Variables = Record<string, any>

export interface GraphQLError {
  message: string
  locations: { line: number; column: number }[]
  path: string[]
}

export interface GraphQLResponse<T = any> {
  data?: T
  errors?: GraphQLError[]
  extensions?: any
  status: number
  [key: string]: any
}

export interface GraphQLRequestContext<V = Variables> {
  query: string
  variables?: V
}

export class ClientError extends Error {
  response: GraphQLResponse
  request: GraphQLRequestContext

  constructor(response: GraphQLResponse, request: GraphQLRequestContext) {
    const message = `${ClientError.extractMessage(response)}: ${JSON.stringify({
      response,
      request
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

export type RequestDocument = string | DocumentNode

export interface SubscribePayload<V = Variables, E = any> {
  readonly document: RequestDocument
  readonly operationName?: string
  readonly variables?: V
  readonly extensions?: E
}

export interface Observer<T> {
  next?(value: T): void
  error?(errorValue: any): void
  complete?(): void
}

export enum SubsciptionProtocol {
  // REF: https://github.com/apollographql/subscriptions-transport-ws
  SUBSCRIPTION_TRANSPORT_WS = 'subscription-transport-ws',
  // REF: https://github.com/enisdenjo/graphql-ws
  GRAPHQL_WS = 'graphql-ws'
}

export interface SubscribeOptions<T> {
  readonly observer: Observer<T>
  readonly protocol?: SubsciptionProtocol
}
