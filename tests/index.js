/* eslint-disable promise/catch-or-return */

/**
 * Local static server serving index.html running the compiled version
 * of `@mutant-ws/fetch`
 */
const httpServer = require("http-server").createServer({
  root: "tests",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
  },
})

httpServer.listen(50123)

/**
 * Run all tests via local test runner
 */
const createTestCafe = require("testcafe")

let testcafe = null

createTestCafe("localhost", 1337, 1338)
  .then(tc => {
    testcafe = tc
    const runner = testcafe.createRunner()

    return runner.src(["tests/GET.test.js"]).browsers(["firefox"]).run()
  })
  .then(() => {
    testcafe.close()
    httpServer.close()
  })
