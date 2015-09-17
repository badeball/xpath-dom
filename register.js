/* eslint-env node */

var XPathEvaluator = require("xpath-evaluator");

var XPathDOM = require("./lib/xpath_dom");

XPathEvaluator.setAdapter(XPathDOM);

module.exports = XPathEvaluator;
