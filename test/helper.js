"use strict";

var Assert = require("assert");

var XPathEvaluator = require("../register");

var XPathResult = XPathEvaluator.XPathResult;

module.exports = {
  assertEvaluatesToNodeSet: function (contextNode, expression, nodes) {
    var result = XPathEvaluator.evaluate(expression, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);

    var match;

    for (var i = 0; i < nodes.length; i++) {
      if (result.snapshotItem(i).tagName) {
        match = nodes[i].match(/(\w+)(?:#([^.]+))?(?:\.([\w\d-]+))?/);

        var tagName = match[1],
            idName = match[2],
            className = match[3];

        if (tagName) {
          Assert.equal(result.snapshotItem(i).tagName.toLowerCase(), tagName);
        }

        if (idName) {
          Assert.equal(result.snapshotItem(i).id, idName);
        }

        if (className) {
          Assert.equal(result.snapshotItem(i).className, className);
        }
      } else {
        match = nodes[i].match(/^(\w+)(?:\(([^\)]*)\))?$/);

        var nodeType = match[1],
            nodeValue = match[2];

        Assert.equal("#" + nodeType, result.snapshotItem(i).nodeName);

        if (nodeValue) {
          Assert.equal(nodeValue, result.snapshotItem(i).nodeValue);
        }
      }
    }

    Assert.equal(result.snapshotLength, nodes.length);
  },

  assertEvaluatesToValue: function (contextNode, expression, value) {
    var result = XPathEvaluator.evaluate(expression, contextNode, null, XPathResult.ANY_TYPE);

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
  },

  createDocument: function () {
    var args = [].slice.call(arguments);

    var html = args.join("");

    var iframe = document.createElement("iframe");

    document.body.appendChild(iframe);

    iframe.contentWindow.document.write(html);

    return iframe.contentWindow.document;
  },

  IS_IE9: navigator.userAgent && navigator.userAgent.indexOf("MSIE 9.0") !== -1
};
