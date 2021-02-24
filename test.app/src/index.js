const qs = require("qs")
const { GET, setup } = require("../../src")

setup({
  stringifyQueryParams: source => qs.stringify(source),
})

GET("https://api.ipify.org", {
  query: {
    format: "json",
  },
})
  .then(data => {
    document.querySelector("#get-result").innerHTML = `OK ${
      data.ip.split(".").length
    }`
  })
  .catch(error => {
    document.querySelector("#get").innerHTML = error.message
  })
