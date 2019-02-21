import { evaluate, createExpression, createNSResolver, XPathResult } from "./register";

var document = window.document;

if (!document.evaluate) {
  (document as any).evaluate = evaluate;
  (document as any).createExpression = createExpression;
  (document as any).createNSResolver = createNSResolver;
  (window as any).XPathResult = XPathResult;
}
