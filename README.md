<!-- markdownlint-disable line-length -->

# fetch-browser

Thin wrapper over `window.fetch`. Sister libray of [`@mutant-ws/fetch-node`](https://github.com/mutant-ws/fetch-node).

## `set`

```javascript
import { set } from "@mutant-ws/fetch-browser"

// third party library for turning objects into query strings
import { stringify } from "qs"

set({
  // Throws if not set and using relative paths
  baseURL: "http://localhost",

  // Default headers sent with every request
  headers: {
    // these are already the default
    "Accept": "application/json",
    "Content-Type": "application/json",
  },

  // Stringify for query params. No default provided. Throws if query params
  // passed and no stringify function defined.
  queryStringifyFn: source =>
    stringify(source, {
      allowDots: true,
      encode: false,
      arrayFormat: "brackets",
      strictNullHandling: true,
    })
})

```

## `GET`

## `PATCH`

## `POST`

## `DELETE`

## `MULTIPART`

<!-- vim-markdown-toc GFM -->

* [About](#about)
* [Changelog](#changelog)

<!-- vim-markdown-toc -->

## About

## Changelog

See the [releases section](https://github.com/mutant-ws/fetch-browser/releases) for details.
