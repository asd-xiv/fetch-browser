import { Selector as $ } from "testcafe"

fixture(`mutant-ws/fetch-browser`).page(`http://localhost:50123`)

test("GET: 200 with json response", t =>
  t.expect($("#asd").innerText).eql("test test"))

test("GET: 200 with text response", t =>
  t.expect($("#asd").innerText).eql("test test"))

test("GET: 404 with json response", t =>
  t.expect($("#asd").innerText).eql("test test"))
