import { evaluate, createExpression, createNSResolver, XPathResult } from "./register";

if (!window.document.evaluate) {
  window.document.evaluate = evaluate;
  window.document.createExpression = createExpression;
  window.document.createNSResolver = createNSResolver;
  window.XPathResult = XPathResult;
}
