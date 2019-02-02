import {
  assertEvaluatesToValue as unboundAssertEvaluatesToValue,
  createDocument
} from "./helper";

var document = createDocument(
  "<?xml version='1.0' encoding='UTF-8'?>",
  "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN'",
  "    'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>",
  "<html xmlns='http://www.w3.org/1999/xhtml'>",
  "<head><title>XHTML test page</title></head>",
  "<body><wgx:element xmlns:wgx='http://code.google.com/p/wicked-good-xpath/'/></body>",
  "</html>"
);

var assertEvaluatesToValue = unboundAssertEvaluatesToValue.bind(null, document.body.firstChild);

// TODO: Remove namespace prefix from test 01 once support for namespaces are implemented.

suite("XPathDOM", function () {
  suite.skip("xhtml", function () {
    test("00", function () {
      assertEvaluatesToValue("name(.)", "wgx:element");
    });

    test("01", function () {
      assertEvaluatesToValue("local-name(.)", "wgx:element");
    });
  });
});
