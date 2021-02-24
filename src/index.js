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
  is,
  isEmpty,
  isObject,
} from "@asd14/m"

import { HTTPError } from "./http-error"

const state = {
  baseURL: "",
  headers: {},
  stringifyQueryParams: undefined,
}

/**
 * `window.fetch` with query string parsing support, default headers and base
 * URL for relative paths.
 *
 * Resolves with response object if code is 200, reject all other response codes.
 *
 * @param {string} path
 * @param {string} props.method
 * @param {Object} props.headers
 * @param {Object} props.body
 * @param {Object} props.query
 *
 * @returns {Promise}
 */
const request = (
  path,
  { method, body = {}, headers = {}, query = {} } = {}
) => {
  if (!isEmpty(query) && isEmpty(state.stringifyQueryParams)) {
    throw new TypeError(
      `@asd14/fetch-browser: ${method}:${path} - Cannot send query params without providing "stringifyQueryParams"`
    )
  }

  const isPathURI = new RegExp(RFC3986.uri).test(path)

  if (isEmpty(state.baseURL) && !isPathURI) {
    throw new TypeError(
      `@asd14/fetch-browser: ${method}:${path} - Cannot make request with non-absolute path and no "baseURL"`
    )
  }

  // - Remove all undefined values
  // - toLower all keys
  const HEADERS = reduce(
    (accumulator, [key, value]) =>
      is(value)
        ? {
            ...accumulator,
            [toLower(key)]: value,
          }
        : accumulator,
    {}
  )(
    Object.entries({
      accept: "application/json",
      "content-type": "application/json",
      ...state.headers,
      ...headers,
    })
  )

  const isRequestJSON = pipe(
    get("content-type", ""),
    startsWith("application/json")
  )(HEADERS)

  const URI = pipe(
    when(
      isEmpty,
      same(path),
      source => `${path}?${state.stringifyQueryParams(source)}`
    ),
    trim("/"),
    source => (isPathURI ? source : `${state.baseURL}/${source}`)
  )(query)

  return window
    .fetch(URI, {
      method,
      headers: HEADERS,

      // Avoid "HEAD or GET Request cannot have a body"
      ...(method === "GET"
        ? {}
        : { body: isRequestJSON ? JSON.stringify(body) : body }),
    })
    .then(response => {
      const isResponseJSON = startsWith("application/json")(
        response.headers.get("Content-Type")
      )

      return Promise.all([
        response,
        isResponseJSON ? response.json() : response.text(),
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

export const setup = ({ baseURL, headers, stringifyQueryParams }) => {
  if (is(stringifyQueryParams)) {
    if (typeof stringifyQueryParams === "function") {
      state.stringifyQueryParams = stringifyQueryParams
    } else {
      throw new TypeError(
        `@asd14/fetch-browser: "stringifyQueryParams" should be a function, received ${JSON.stringify(
          stringifyQueryParams
        )}`
      )
    }
  }

  if (is(headers)) {
    if (isObject(headers)) {
      state.headers = {
        ...state.headers,
        ...headers,
      }
    } else {
      throw new TypeError(
        `@asd14/fetch-browser: "headers" should be an object, received ${JSON.stringify(
          headers
        )}`
      )
    }
  }

  if (is(baseURL)) {
    if (typeof baseURL === "string") {
      state.baseURL = trim("/")(baseURL)
    } else {
      throw new TypeError(
        `@asd14/fetch-browser: "baseURL" should be a string, received ${JSON.stringify(
          baseURL
        )}`
      )
    }
  }
}

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
    body: reduce((accumulator, [key, value]) => {
      accumulator.append(key, value)

      return accumulator
    }, form)(Object.entries(body)),
    headers: {
      ...headers,

      // remove content-type header or browser boundery wont get set
      "content-type": undefined,
    },
  })
}

export { HTTPError } from "./http-error"
