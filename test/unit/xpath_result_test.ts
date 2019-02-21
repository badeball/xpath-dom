import { XPathResult } from "xpath-dom";

import Assert from "assert";

suite("XPathDOM", function () {
  suite("XPathResult", function () {
    test("result type constants", function () {
      Assert.equal(XPathResult.ANY_TYPE, 0);
      Assert.equal(XPathResult.NUMBER_TYPE, 1);
      Assert.equal(XPathResult.STRING_TYPE, 2);
      Assert.equal(XPathResult.BOOLEAN_TYPE, 3);
      Assert.equal(XPathResult.UNORDERED_NODE_ITERATOR_TYPE, 4);
      Assert.equal(XPathResult.ORDERED_NODE_ITERATOR_TYPE, 5);
      Assert.equal(XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, 6);
      Assert.equal(XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, 7);
      Assert.equal(XPathResult.ANY_UNORDERED_NODE_TYPE, 8);
      Assert.equal(XPathResult.FIRST_ORDERED_NODE_TYPE, 9);
    });
  });
});
