import Assert from "assert";

import { evaluate, XPathResult } from "xpath-dom";

function isElement (node: Node): node is Element {
  return !!(node as any).tagName;
}

export function assertEvaluatesToNodeSet (contextNode: Node, expression: string, nodes: string[]) {
  var result = evaluate(expression, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);

  var match;

  for (var i = 0; i < nodes.length; i++) {
    var item = result.snapshotItem(i);

    if (!item) {
      continue;
    }

    if (isElement(item)) {
      match = nodes[i].match(/(\w+)(?:#([^.]+))?(?:\.([\w\d-]+))?/);

      var tagName = match![1],
          idName = match![2],
          className = match![3];

      if (tagName) {
        Assert.equal(item.tagName.toLowerCase(), tagName);
      }

      if (idName) {
        Assert.equal(item.id, idName);
      }

      if (className) {
        Assert.equal(item.className, className);
      }
    } else if (item) {
      match = nodes[i].match(/^(\w+)(?:\(([^\)]*)\))?$/);

      var nodeType = match![1],
          nodeValue = match![2];

      Assert.equal("#" + nodeType, item.nodeName);

      if (nodeValue) {
        Assert.equal(nodeValue, item.nodeValue);
      }
    }
  }

  Assert.equal(result.snapshotLength, nodes.length);
}

export function assertEvaluatesToValue (contextNode: Node, expression: string, value: number | string | boolean) {
  var result = evaluate(expression, contextNode, null, XPathResult.ANY_TYPE);

  switch (result.resultType) {
    case XPathResult.NUMBER_TYPE:
      Assert.equal(value, result.numberValue);
      break;

    case XPathResult.STRING_TYPE:
      Assert.equal(value, result.stringValue);
      break;

    case XPathResult.BOOLEAN_TYPE:
      Assert.equal(value, result.booleanValue);
      break;

    default:
      throw new Error("Unknown result type " + result.resultType);
  }
}

export function createDocument (...args: string[]) {
  var html = args.join("");

  var iframe = document.createElement("iframe");

  document.body.appendChild(iframe);

  iframe.contentWindow!.document.write(html);

  return iframe.contentWindow!.document;
}

export var IS_IE9 = navigator.userAgent && navigator.userAgent.indexOf("MSIE 9.0") !== -1;
