(window.document as any).evaluate = null;
(window.document as any).createExpression = null;
(window.document as any).createNSResolver = null;
(window as any).XPathResult = null;

if (window.document.evaluate || (window.document as any).createExpression || (window.document as any).createNSResolver || (window as any).XPathResult) {
  throw new Error("Unable to remove existing implementation");
}
