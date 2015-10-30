"use strict";

var DocumentPosition = {
  DISCONNECTED: 1,
  PRECEDING: 2,
  FOLLOWING: 4,
  CONTAINS: 8,
  CONTAINED_BY: 16,
  IMPLEMENTATION_SPECIFIC: 32
};

function XPathDOM (nativeNode) {
  if (!nativeNode) {
    throw new Error("This should not happen!");
  }

  this.nativeNode = nativeNode;
}

XPathDOM.prototype.getNativeNode = function () {
  return this.nativeNode;
};

XPathDOM.prototype.asString = function () {
  if (typeof this.nativeNode.textContent === "string") {
    return this.nativeNode.textContent;
  } else {
    var text = "";

    var children = this.getChildNodes();

    for (var i = 0; i < children.length; i++) {
      text = text + children[i].asString();
    }

    return text;
  }
};

XPathDOM.prototype.asNumber = function () {
  return +this.asString();
};

XPathDOM.prototype.getNodeType = function () {
  return this.nativeNode.nodeType;
};

XPathDOM.prototype.getChildNodes = function () {
  var children = [];

  for (var i = 0; i < this.nativeNode.childNodes.length; i++) {
    children.push(new XPathDOM(this.nativeNode.childNodes[i]));
  }

  return children;
};

XPathDOM.prototype.getFollowingSiblings = function () {
  var node = this.nativeNode, followingSiblings = [];

  while ((node = node.nextSibling)) {
    followingSiblings.push(new XPathDOM(node));
  }

  return followingSiblings;
};

XPathDOM.prototype.getPrecedingSiblings = function () {
  var node = this.nativeNode, precedingSiblings = [];

  while ((node = node.previousSibling)) {
    precedingSiblings.unshift(new XPathDOM(node));
  }

  return precedingSiblings;
};

XPathDOM.prototype.getName = function () {
  var name = this.nativeNode.tagName || this.nativeNode.name;

  if (name) {
    return name.toLowerCase();
  }
};

XPathDOM.prototype.getAttributes = function () {
  if (!this.nativeNode.attributes) {
    return [];
  }

  var attributes = [];

  for (var i = 0; i < this.nativeNode.attributes.length; i++) {
    attributes.push(new XPathDOM(this.nativeNode.attributes[i]));
  }

  return attributes;
};

XPathDOM.prototype.getParent = function () {
  return new XPathDOM(this.nativeNode.parentNode || this.nativeNode.ownerElement);
};

XPathDOM.prototype.getOwnerDocument = function () {
  if (this.nativeNode.ownerDocument) {
    return new XPathDOM(this.nativeNode.ownerDocument);
  }
};

XPathDOM.prototype.getElementById = function (id) {
  var node = this.nativeNode.getElementById(id);

  if (node) {
    return new XPathDOM(node);
  }
};

XPathDOM.prototype.isEqual = function (node) {
  return this.getNativeNode() === node.getNativeNode();
};

XPathDOM.compareDocumentPosition = function (a, b) {
  var comparing = a.getNativeNode().compareDocumentPosition(b.getNativeNode());

  if (comparing & DocumentPosition.PRECEDING) {
    return 1;
  } else if (comparing & DocumentPosition.FOLLOWING) {
    return -1;
  } else {
    return 0;
  }
};

XPathDOM.prototype.toString = function () {
  var name;

  if (this.nativeNode.tagName) {
    name = this.nativeNode.tagName.toLowerCase();
  } else {
    name = this.nativeNode.nodeName + "(" + this.nativeNode.nodeValue + ")";
  }

  if (this.nativeNode.className) {
    name = name + "." + this.nativeNode.className.split(/\s+/g).join(".");
  }

  if (this.nativeNode.id) {
    name = name + "#" + this.nativeNode.id;
  }

  return "Node<" + name + ">";
};

module.exports = XPathDOM;
