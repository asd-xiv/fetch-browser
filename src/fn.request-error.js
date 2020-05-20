/* eslint-disable import/exports-last */

/**
 * Custom Error thrown when fetch resolves with a status !== 20*
 *
 * @param {String}        message    Response error message
 * @param {String}        opt.url    Request URL
 * @param {Number}        opt.status Response status
 * @param {String|Object} opt.body   Response body
 */
export function RequestError(message, { url, status, body }) {
  this.message = `${status} Server error: ${message}`
  this.name = "RequestError"
  this.body = body
  this.status = status
  this.url = url
  this.stack = new Error().stack
}

RequestError.prototype = new Error()
