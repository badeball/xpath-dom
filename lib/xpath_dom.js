var DocumentPosition = {
  DISCONNECTED: 1,
  PRECEDING: 2,
  FOLLOWING: 4,
  CONTAINS: 8,
  CONTAINED_BY: 16,
  IMPLEMENTATION_SPECIFIC: 32
};

export default class XPathDOM {
  constructor(nativeNode) {
    if (!nativeNode) {
      throw new Error("This should not happen!");
    }

    this.nativeNode = nativeNode;
  }

  getNativeNode() {
    return this.nativeNode;
  }

  asString() {
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
  }

  asNumber() {
    return +this.asString();
  }

  getNodeType() {
    return this.nativeNode.nodeType;
  }

  getChildNodes() {
    var children = [];

    for (var i = 0; i < this.nativeNode.childNodes.length; i++) {
      children.push(new XPathDOM(this.nativeNode.childNodes[i]));
    }

    return children;
  }

  getFollowingSiblings() {
    var node = this.nativeNode, followingSiblings = [];

    while ((node = node.nextSibling)) {
      followingSiblings.push(new XPathDOM(node));
    }

    return followingSiblings;
  }

  getPrecedingSiblings() {
    var node = this.nativeNode, precedingSiblings = [];

    while ((node = node.previousSibling)) {
      precedingSiblings.unshift(new XPathDOM(node));
    }

    return precedingSiblings;
  }

  getName() {
    var name = this.nativeNode.tagName || this.nativeNode.name;

    if (name) {
      return name.toLowerCase();
    }
  }

  getAttributes() {
    if (!this.nativeNode.attributes) {
      return [];
    }

    var attributes = [];

    for (var i = 0; i < this.nativeNode.attributes.length; i++) {
      attributes.push(new XPathDOM(this.nativeNode.attributes[i]));
    }

    return attributes;
  }

  getParent() {
    return new XPathDOM(this.nativeNode.parentNode || this.nativeNode.ownerElement);
  }

  getOwnerDocument() {
    if (this.nativeNode.ownerDocument) {
      return new XPathDOM(this.nativeNode.ownerDocument);
    }
  }

  getElementById(id) {
    var node = this.nativeNode.getElementById(id);

    if (node) {
      return new XPathDOM(node);
    }
  }

  isEqual(node) {
    return this.getNativeNode() === node.getNativeNode();
  }

  compareDocumentPosition(other) {
    var self = this;

    if (self.getNativeNode() instanceof Attr) {
      self = self.getParent();
    }

    if (other.getNativeNode() instanceof Attr) {
      other = other.getParent();
    }

    var comparing = self.getNativeNode().compareDocumentPosition(other.getNativeNode());

    if (comparing & DocumentPosition.PRECEDING) {
      return 1;
    } else if (comparing & DocumentPosition.FOLLOWING) {
      return -1;
    } else {
      return 0;
    }
  }

  toString() {
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
  }
}
