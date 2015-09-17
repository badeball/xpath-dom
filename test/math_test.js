/* eslint-env mocha, node */

"use strict";

var Helper = require("./helper");

var document = Helper.createDocument(
  "<html>",
  "  <body>",
  "    <div id='with' price='2' count='3'></div>",
  "    <div id='without' price='2' count='4'></div>",
  "  </body>",
  "</html>"
);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, document);

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
