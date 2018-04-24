window.document.evaluate = null;
window.document.createExpression = null;
window.document.createNSResolver = null;
window.XPathResult = null;

if (window.document.evaluate || window.document.createExpression || window.document.createNSResolver || window.XPathResult) {
  throw new Error("Unable to remove existing implementation");
}
