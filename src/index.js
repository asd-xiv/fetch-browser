/* eslint-disable import/exports-last */

import RFC3986 from "rfc-3986"
import {
  get,
  pipe,
  reduce,
  startsWith,
  trim,
  when,
  same,
  toLower,
  isEmpty,
} from "@mutant-ws/m"

import { setProps } from "./fn.set-props"
import { HTTPError } from "./fn.http-error"

/**
 * Config
 */
const props = {
  baseURL: "",
  headers: {},
  queryStringifyFn: null,
}

/**
 * `window.fetch` with qs support, default headers and rejects on status
 * outside 200
 *
 * @param  {String} path        API endpoint
 * @param  {String} opt.method  HTTP Method
 * @param  {Object} opt.headers HTTP Headers
 * @param  {Object} opt.body    HTTP Body
 * @param  {Object} opt.query   Query params
 *
 * @return {Promise}            Resolves with response object if code is 20*.
 *                              Reject all other response codes.
 */
const request = (
  path,
  { method, body = {}, headers = {}, query = {} } = {}
) => {
  if (!isEmpty(query) && isEmpty(props.queryStringifyFn)) {
    throw new TypeError(
      `@mutant-ws/fetch-browser: ${method}:${path} - Cannot send query params without providing "queryStringifyFn"`
    )
  }

  const isPathURI = new RegExp(RFC3986.uri).test(path)

  if (isEmpty(props.baseURL) && !isPathURI) {
    throw new TypeError(
      `@mutant-ws/fetch-browser: ${method}:${path} - Cannot make request with non-absolute path and no "baseURL"`
    )
  }

  // - Remove all undefined values
  // - toLower all keys
  const HEADERS = reduce(
    (acc, [key, value]) =>
      value === undefined
        ? acc
        : {
            ...acc,
            [toLower(key)]: value,
          },
    {}
  )(
    Object.entries({
      accept: "application/json",
      "content-type": "application/json",
      ...props.headers,
      ...headers,
    })
  )

  const isReqJSON = pipe(
    get("content-type"),
    startsWith("application/json")
  )(HEADERS)

  const URI = pipe(
    when(
      isEmpty,
      same(path),
      source => `${path}?${props.queryStringifyFn(source)}`
    ),
    trim("/"),
    source => (isPathURI ? source : `${props.baseURL}/${source}`)
  )(query)

  return window
    .fetch(URI, {
      method,
      headers: HEADERS,

      // Avoid "HEAD or GET Request cannot have a body"
      ...(method === "GET"
        ? {}
        : { body: isReqJSON ? JSON.stringify(body) : body }),
    })
    .then(response => {
      const isResJSON = startsWith("application/json")(
        response.headers.get("Content-Type")
      )

      return Promise.all([
        response,
        isResJSON ? response.json() : response.text(),
      ])
    })
    .then(([response, data]) => {
      /*
       * The Promise returned from fetch() won't reject on HTTP error status
       * even if the response is an HTTP 404 or 500. Instead, it will resolve
       * normally, and it will only reject on network failure or if anything
       * prevented the request from completing.
       */
      if (response.ok) {
        return data
      }

      throw new HTTPError(response.statusText, {
        status: response.status,
        body: data,
        path: URI,
      })
    })
}

export const set = setProps(props)

export const GET = (url, { query, headers } = {}) =>
  request(url, { method: "GET", query, headers })

export const POST = (url, { body, query, headers } = {}) =>
  request(url, { method: "POST", body, query, headers })

export const PATCH = (url, { body, query, headers } = {}) =>
  request(url, { method: "PATCH", body, query, headers })

export const DELETE = (url, { body, query, headers } = {}) =>
  request(url, { method: "DELETE", body, query, headers })

export const MULTIPART = (url, { body = {}, headers } = {}) => {
  const form = new FormData()

  return request(url, {
    method: "POST",
    body: reduce((acc, [key, value]) => {
      acc.append(key, value)

      return acc
    }, form)(Object.entries(body)),
    headers: {
      ...headers,

      // remove content-type header or browser boundery wont get set
      "Content-Type": undefined,
    },
  })
}

export { HTTPError } from "./fn.http-error"
