/* eslint-disable promise/catch-or-return */

/**
 * Local static server serving index.html running the compiled version
 * of `@asd14/fetch-browser`
 */
const httpServer = require("http-server").createServer({
  root: "test.app/dist",
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

createTestCafe("localhost", 1337, 1338).then(async testcafe => {
  const runner = testcafe.createRunner()

  await runner
    .src(["test.scenarios/GET.test.js"])
    .browsers(["firefox:/usr/bin/firefox-developer-edition"])
    .run()

  testcafe.close()
  httpServer.close()
})
