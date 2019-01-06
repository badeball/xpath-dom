import XPathEvaluator, { XPathResult } from "xpath-evaluator";

import XPathDOM from "./lib/xpath_dom";

var evaluator = new XPathEvaluator(XPathDOM);

export var evaluate = evaluator.evaluate.bind(evaluator);
export var createExpression = evaluator.createExpression.bind(evaluator);
export var createNSResolver = evaluator.createNSResolver.bind(evaluator);

export { XPathResult };
