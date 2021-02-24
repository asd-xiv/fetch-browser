/* eslint-disable import/exports-last */

/**
 * Custom Error thrown when fetch resolves with a status !== 20*
 *
 * @param {string}        message
 * @param {Object}        props
 * @param {string}        props.url
 * @param {number}        props.status
 * @param {string|Object} props.body
 *
 * @returns {HTTPError}
 */
export function HTTPError(message, { url, status, body }) {
  this.message = `${status} Server error: ${message}`
  this.name = "HTTPError"
  this.body = body
  this.status = status
  this.url = url
  this.stack = new Error(this.message).stack
}

HTTPError.prototype = new Error("Server error")
