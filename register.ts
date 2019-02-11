import XPathEvaluator, { XPathResult, XPathResultType } from "xpath-evaluator";

import XPathDOM from "./lib/xpath_dom";

var evaluator = new XPathEvaluator(XPathDOM);

export function evaluate (
  expression: string,
  context: Node,
  nsResolver: XPathNSResolver | ((prefix: string) => string | null) | null,
  type: XPathResultType
) {
  return evaluator.evaluate(expression, context, nsResolver, type);
}

export function createExpression (expression: string, nsResolver: XPathNSResolver) {
  return evaluator.createExpression(expression, nsResolver);
}

export function createNSResolver (nodeResolver?: Node) {
  return evaluator.createNSResolver(nodeResolver)
}

export { XPathResult };
