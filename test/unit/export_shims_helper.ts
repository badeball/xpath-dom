import "./remove_existing_implementation";
import "../../dist/xpath-dom.shim";

export var evaluate = (window.document as any).evaluate;
export var createExpression = (window.document as any).createExpression;
export var createNSResolver = (window.document as any).createNSResolver;
export var XPathResult = (window as any).XPathResult;
