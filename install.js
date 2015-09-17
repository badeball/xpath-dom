/* eslint-env browser, node */

if (!window.document.evaluate) {
  var XPathEvaluator = require("./register");

  window.document.evaluate = XPathEvaluator.evaluate;
  window.document.createExpression = XPathEvaluator.createExpression;
  window.document.createNSResolver = XPathEvaluator.createNSResolver;
  window.XPathResult = XPathEvaluator.XPathResult;

  var property;

  for (property in XPathEvaluator.XPathResultType) {
    if (XPathEvaluator.XPathResultType.hasOwnProperty(property)) {
      window.XPathResult[property] = XPathEvaluator.XPathResultType[property];
    }
  }
}
