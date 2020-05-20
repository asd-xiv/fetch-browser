import { trim, is, isObject } from "@mutant-ws/m"

export const setProps = props => ({ baseURL, headers, queryStringifyFn }) => {
  if (is(queryStringifyFn)) {
    if (typeof queryStringifyFn === "function") {
      props.queryStringifyFn = queryStringifyFn
    } else {
      throw new TypeError(
        `@mutant-ws/fetch-browser: "queryStringifyFn" should be a function, received ${JSON.stringify(
          queryStringifyFn
        )}`
      )
    }
  }

  if (is(headers)) {
    if (isObject(headers)) {
      props.headers = {
        ...props.headers,
        ...headers,
      }
    } else {
      throw new TypeError(
        `@mutant-ws/fetch-browser: "headers" should be an object, received ${JSON.stringify(
          headers
        )}`
      )
    }
  }

  if (is(baseURL)) {
    if (typeof baseURL === "string") {
      props.baseURL = trim("/")(baseURL)
    } else {
      throw new TypeError(
        `@mutant-ws/fetch-node: "baseURL" should be a string, received ${JSON.stringify(
          baseURL
        )}`
      )
    }
  }
}
