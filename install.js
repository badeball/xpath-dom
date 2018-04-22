if (!window.document.evaluate) {
  var XPathEvaluator = require("./register");

  window.document.evaluate = XPathEvaluator.evaluate;
  window.document.createExpression = XPathEvaluator.createExpression;
  window.document.createNSResolver = XPathEvaluator.createNSResolver;
  window.XPathResult = XPathEvaluator.XPathResult;
}
