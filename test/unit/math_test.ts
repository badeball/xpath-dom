import {
  assertEvaluatesToNodeSet as unboundAssertEvaluatesToNodeSet,
  createDocument
} from "./helper";

var document = createDocument(
  "<html>",
  "  <body>",
  "    <div id='with' price='2' count='3'></div>",
  "    <div id='without' price='2' count='4'></div>",
  "  </body>",
  "</html>"
);

var assertEvaluatesToNodeSet = unboundAssertEvaluatesToNodeSet.bind(null, document);

suite("XPathDOM", function () {
  suite("math", function () {
    test("00", function () {
      assertEvaluatesToNodeSet("//*[@price * (@count + @count) = 12]", ["div#with"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("//*[@price * @count + @count = 12]", ["div#without"]);
    });
  });
});
