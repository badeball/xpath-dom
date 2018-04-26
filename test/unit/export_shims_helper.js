import "./remove_existing_implementation";
import "../../dist/xpath-dom.shim.min";

export const evaluate = window.document.evaluate;
export const createExpression = window.document.createExpression;
export const createNSResolver = window.document.createNSResolver;
export const XPathResult = window.XPathResult;
