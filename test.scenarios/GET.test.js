import { Selector as $ } from "testcafe"

fixture(`asd14/fetch-browser`).page(`http://localhost:50123`)

test("GET: 200 with json response", t =>
  t.expect($("#get-result").textContent).eql("OK 4"))
