/**
 * This module contains types copied from lib.dom.d.ts that are in the type graph of the fetch API.
 *
 * This module is inlined to avoid consumers needing to add dom lib to their tsconfig. For original motivations see:
 *
 * - https://github.com/prisma-labs/graphql-request/issues/26
 * - https://github.com/prisma-labs/graphql-request/issues/15
 */

/** This Fetch API interface allows you to perform various actions on HTTP request and response headers. These actions include retrieving, setting, adding to, and removing. A Headers object has an associated header list, which is initially empty and consists of zero or more name and value pairs.  You can add to this using methods like append() (see Examples.) In all methods of this interface, header names are matched by case-insensitive byte sequence. */
export interface Headers {
  append(name: string, value: string): void
  delete(name: string): void
  get(name: string): string | null
  has(name: string): boolean
  set(name: string, value: string): void
  forEach(callbackfn: (value: string, key: string, parent: Headers) => void, thisArg?: any): void
}

/** A file-like object of immutable, raw data. Blobs represent data that isn't necessarily in a JavaScript-native format. The File interface is based on Blob, inheriting blob functionality and expanding it to support files on the user's system. */
interface Blob {
  readonly size: number
  readonly type: string
  arrayBuffer(): Promise<ArrayBuffer>
  slice(start?: number, end?: number, contentType?: string): Blob
  stream(): ReadableStream
  text(): Promise<string>
}

type BufferSource = ArrayBufferView | ArrayBuffer

interface File extends Blob {
  readonly lastModified: number
  readonly name: string
}

type FormDataEntryValue = File | string

interface URLSearchParams {
  /**
   * Appends a specified key/value pair as a new search parameter.
   */
  append(name: string, value: string): void
  /**
   * Deletes the given search parameter, and its associated value, from the list of all search parameters.
   */
  delete(name: string): void
  /**
   * Returns the first value associated to the given search parameter.
   */
  get(name: string): string | null
  /**
   * Returns all the values association with a given search parameter.
   */
  getAll(name: string): string[]
  /**
   * Returns a Boolean indicating if such a search parameter exists.
   */
  has(name: string): boolean
  /**
   * Sets the value associated to a given search parameter to the given value. If there were several values, delete the others.
   */
  set(name: string, value: string): void
  sort(): void
  forEach(callbackfn: (value: string, key: string, parent: URLSearchParams) => void, thisArg?: any): void
}

interface FormData {
  append(name: string, value: string | Blob, fileName?: string): void
  delete(name: string): void
  get(name: string): FormDataEntryValue | null
  getAll(name: string): FormDataEntryValue[]
  has(name: string): boolean
  set(name: string, value: string | Blob, fileName?: string): void
  forEach(callbackfn: (value: FormDataEntryValue, key: string, parent: FormData) => void, thisArg?: any): void
}

/** This Streams API interface represents a readable stream of byte data. The Fetch API offers a concrete instance of a ReadableStream through the body property of a Response object. */
interface ReadableStream<R = any> {
  readonly locked: boolean
  cancel(reason?: any): Promise<void>
  getReader(options: { mode: 'byob' }): ReadableStreamBYOBReader
  getReader(): ReadableStreamDefaultReader<R>
  pipeThrough<T>(
    { writable, readable }: { writable: WritableStream<R>; readable: ReadableStream<T> },
    options?: PipeOptions
  ): ReadableStream<T>
  pipeTo(dest: WritableStream<R>, options?: PipeOptions): Promise<void>
  tee(): [ReadableStream<R>, ReadableStream<R>]
}

interface ReadableStreamBYOBReader {
  readonly closed: Promise<void>
  cancel(reason?: any): Promise<void>
  read<T extends ArrayBufferView>(view: T): Promise<ReadableStreamReadResult<T>>
  releaseLock(): void
}

type ReadableStreamReadResult<T> = ReadableStreamReadValueResult<T> | ReadableStreamReadDoneResult<T>

interface ReadableStreamReadDoneResult<T> {
  done: true
  value?: T
}

interface ReadableStreamReadValueResult<T> {
  done: false
  value: T
}

interface ReadableStreamDefaultReader<R = any> {
  readonly closed: Promise<void>
  cancel(reason?: any): Promise<void>
  read(): Promise<ReadableStreamReadResult<R>>
  releaseLock(): void
}

type BodyInit = Blob | BufferSource | FormData | URLSearchParams | ReadableStream | string

type RequestCache = 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached'

type RequestCredentials = 'omit' | 'same-origin' | 'include'

type HeadersInit = Headers | string[][] | Record<string, string>

type RequestMode = 'navigate' | 'same-origin' | 'no-cors' | 'cors'

type RequestRedirect = 'follow' | 'error' | 'manual'

type ReferrerPolicy =
  | ''
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url'

/** An event which takes place in the DOM. */
interface Event {
  /**
   * Returns true or false depending on how event was initialized. True if event goes through its target's ancestors in reverse tree order, and false otherwise.
   */
  readonly bubbles: boolean
  cancelBubble: boolean
  /**
   * Returns true or false depending on how event was initialized. Its return value does not always carry meaning, but true can indicate that part of the operation during which event was dispatched, can be canceled by invoking the preventDefault() method.
   */
  readonly cancelable: boolean
  /**
   * Returns true or false depending on how event was initialized. True if event invokes listeners past a ShadowRoot node that is the root of its target, and false otherwise.
   */
  readonly composed: boolean
  /**
   * Returns the object whose event listener's callback is currently being invoked.
   */
  readonly currentTarget: EventTarget | null
  /**
   * Returns true if preventDefault() was invoked successfully to indicate cancelation, and false otherwise.
   */
  readonly defaultPrevented: boolean
  /**
   * Returns the event's phase, which is one of NONE, CAPTURING_PHASE, AT_TARGET, and BUBBLING_PHASE.
   */
  readonly eventPhase: number
  /**
   * Returns true if event was dispatched by the user agent, and false otherwise.
   */
  readonly isTrusted: boolean
  returnValue: boolean
  /** @deprecated */
  readonly srcElement: EventTarget | null
  /**
   * Returns the object to which event is dispatched (its target).
   */
  readonly target: EventTarget | null
  /**
   * Returns the event's timestamp as the number of milliseconds measured relative to the time origin.
   */
  readonly timeStamp: number
  /**
   * Returns the type of event, e.g. "click", "hashchange", or "submit".
   */
  readonly type: string
  /**
   * Returns the invocation target objects of event's path (objects on which listeners will be invoked), except for any nodes in shadow trees of which the shadow root's mode is "closed" that are not reachable from event's currentTarget.
   */
  composedPath(): EventTarget[]
  initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void
  /**
   * If invoked when the cancelable attribute value is true, and while executing a listener for the event with passive set to false, signals to the operation that caused event to be dispatched that it needs to be canceled.
   */
  preventDefault(): void
  /**
   * Invoking this method prevents event from reaching any registered event listeners after the current one finishes running and, when dispatched in a tree, also prevents event from reaching any other objects.
   */
  stopImmediatePropagation(): void
  /**
   * When dispatched in a tree, invoking this method prevents event from reaching any objects other than the current object.
   */
  stopPropagation(): void
  readonly AT_TARGET: number
  readonly BUBBLING_PHASE: number
  readonly CAPTURING_PHASE: number
  readonly NONE: number
}

interface EventListener {
  (evt: Event): void
}

interface EventListenerObject {
  handleEvent(evt: Event): void
}

declare type EventListenerOrEventListenerObject = EventListener | EventListenerObject

interface EventListenerOptions {
  capture?: boolean
}

interface AddEventListenerOptions extends EventListenerOptions {
  once?: boolean
  passive?: boolean
}

interface EventTarget {
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void
  dispatchEvent(evt: Event): boolean
  removeEventListener(
    type: string,
    listener?: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void
}

interface ProgressEvent extends Event {
  readonly lengthComputable: boolean
  readonly loaded: number
  readonly total: number
}

interface AbortSignalEventMap {
  abort: ProgressEvent
}

/** A signal object that allows you to communicate with a DOM request (such as a Fetch) and abort it if required via an AbortController object. */
interface AbortSignal extends EventTarget {
  /**
   * Returns true if this AbortSignal's AbortController has signaled to abort, and false otherwise.
   */
  readonly aborted: boolean
  onabort: ((this: AbortSignal, ev: Event) => any) | null
  addEventListener<K extends keyof AbortSignalEventMap>(
    type: K,
    listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener<K extends keyof AbortSignalEventMap>(
    type: K,
    listener: (this: AbortSignal, ev: AbortSignalEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void
}

export interface RequestInit {
  body?: BodyInit | null
  cache?: RequestCache
  credentials?: RequestCredentials
  headers?: HeadersInit
  integrity?: string
  keepalive?: boolean
  method?: string
  mode?: RequestMode
  redirect?: RequestRedirect
  referrer?: string
  referrerPolicy?: ReferrerPolicy
  signal?: AbortSignal | null
  timeout?: number
  window?: any,
  requestFormatter?: (payload: RequestInit) => Promise<RequestInit> | RequestInit;
}

interface Body {
  readonly body: ReadableStream | null
  readonly bodyUsed: boolean
  arrayBuffer(): Promise<ArrayBuffer>
  blob(): Promise<Blob>
  formData(): Promise<FormData>
  json(): Promise<any>
  text(): Promise<string>
}

type ResponseType = 'basic' | 'cors' | 'default' | 'error' | 'opaque' | 'opaqueredirect'

export interface Response extends Body {
  readonly headers: Headers
  readonly ok: boolean
  readonly redirected: boolean
  readonly status: number
  readonly statusText: string
  readonly trailer: Promise<Headers>
  readonly type: ResponseType
  readonly url: string
  clone(): Response
}

type RequestDestination =
  | ''
  | 'audio'
  | 'audioworklet'
  | 'document'
  | 'embed'
  | 'font'
  | 'image'
  | 'manifest'
  | 'object'
  | 'paintworklet'
  | 'report'
  | 'script'
  | 'sharedworker'
  | 'style'
  | 'track'
  | 'video'
  | 'worker'
  | 'xslt'

export interface Request extends Body {
  /**
   * Returns the cache mode associated with request, which is a string indicating
   * how the the request will interact with the browser's cache when fetching.
   */
  readonly cache: RequestCache
  /**
   * Returns the credentials mode associated with request, which is a string
   * indicating whether credentials will be sent with the request always, never, or only when sent to a
   * same-origin URL.
   */
  readonly credentials: RequestCredentials
  /**
   * Returns the kind of resource requested by request, e.g., "document" or
   * "script".
   */
  readonly destination: RequestDestination
  /**
   * Returns a Headers object consisting of the headers associated with request.
   * Note that headers added in the network layer by the user agent will not be accounted for in this
   * object, e.g., the "Host" header.
   */
  readonly headers: Headers
  /**
   * Returns request's subresource integrity metadata, which is a cryptographic hash of
   * the resource being fetched. Its value consists of multiple hashes separated by whitespace. [SRI]
   */
  readonly integrity: string
  /**
   * Returns a boolean indicating whether or not request is for a history
   * navigation (a.k.a. back-foward navigation).
   */
  readonly isHistoryNavigation: boolean
  /**
   * Returns a boolean indicating whether or not request is for a reload navigation.
   */
  readonly isReloadNavigation: boolean
  /**
   * Returns a boolean indicating whether or not request can outlive the global in which
   * it was created.
   */
  readonly keepalive: boolean
  /**
   * Returns request's HTTP method, which is "GET" by default.
   */
  readonly method: string
  /**
   * Returns the mode associated with request, which is a string indicating
   * whether the request will use CORS, or will be restricted to same-origin URLs.
   */
  readonly mode: RequestMode
  /**
   * Returns the redirect mode associated with request, which is a string
   * indicating how redirects for the request will be handled during fetching. A request will follow redirects by default.
   */
  readonly redirect: RequestRedirect
  /**
   * Returns the referrer of request. Its value can be a same-origin URL if
   * explicitly set in init, the empty string to indicate no referrer, and
   * "about:client" when defaulting to the global's default. This is used during
   * fetching to determine the value of the `Referer` header of the request being made.
   */
  readonly referrer: string
  /**
   * Returns the referrer policy associated with request. This is used during
   * fetching to compute the value of the request's referrer.
   */
  readonly referrerPolicy: ReferrerPolicy
  /**
   * Returns the signal associated with request, which is an AbortSignal object indicating whether or not request has been aborted, and its abort
   * event handler.
   */
  readonly signal: AbortSignal
  /**
   * Returns the URL of request as a string.
   */
  readonly url: string
  clone(): Request
}

// declare function fetch(input?: Request | string, init?: any): Promise<any>

/** This Streams API interface provides a standard abstraction for writing streaming data to a destination, known as a sink. This object comes with built-in backpressure and queuing. */
interface WritableStream<W = any> {
  readonly locked: boolean
  abort(reason?: any): Promise<void>
  getWriter(): WritableStreamDefaultWriter<W>
}

/** This Streams API interface is the object returned by WritableStream.getWriter() and once created locks the < writer to the WritableStream ensuring that no other streams can write to the underlying sink. */
interface WritableStreamDefaultWriter<W = any> {
  readonly closed: Promise<void>
  readonly desiredSize: number | null
  readonly ready: Promise<void>
  abort(reason?: any): Promise<void>
  close(): Promise<void>
  releaseLock(): void
  write(chunk: W): Promise<void>
}

interface PipeOptions {
  preventAbort?: boolean
  preventCancel?: boolean
  preventClose?: boolean
  signal?: AbortSignal
}
