import {
  assertEvaluatesToNodeSet as unboundAssertEvaluatesToNodeSet,
  createDocument
} from "./helper";

var document = createDocument(
  "<html>",
  "  <head>",
  "    <title>title</title>",
  "  </head>",
  "  <body>",
  "    <h1 id='t'>foo</h1>",
  "  </body>",
  "</html>"
);

var assertEvaluatesToNodeSet = unboundAssertEvaluatesToNodeSet.bind(null, document);

suite("XPathDOM", function () {
  suite("ancestor", function () {
    test("00", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor::*", ["html", "body"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor::node()", ["document()", "html", "body"]);
    });

    test("02", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::*", ["html", "body", "h1"]);
    });

    test("03", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()", ["document()", "html", "body", "h1"]);
    });

    test("04", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor::*", ["html", "body"]);
    });

    test("05", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor::node()", ["document()", "html", "body"]);
    });

    test("06", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor-or-self::*", ["html", "body", "h1"]);
    });

    test("07", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor-or-self::node()", ["document()", "html", "body", "h1"]);
    });

    test("08", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor::*[1]", ["body"]);
    });

    test("09", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor::node()[1]", ["body"]);
    });

    test("10", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::*[1]", ["h1"]);
    });

    test("11", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()[1]", ["h1"]);
    });

    test("12", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor::*[1]", ["html", "body"]);
    });

    test("13", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor::node()[1]", ["document()", "html", "body"]);
    });

    test("14", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor-or-self::*[1]", ["html", "body", "h1"]);
    });

    test("15", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor-or-self::node()[1]", ["document()", "html", "body", "h1"]);
    });
  });
});
