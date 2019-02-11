import {
  IAdapter,
  ATTRIBUTE_NODE,
  DOCUMENT_NODE,
  ELEMENT_NODE
} from "xpath-evaluator";

var DocumentPosition = {
  DISCONNECTED: 1,
  PRECEDING: 2,
  FOLLOWING: 4,
  CONTAINS: 8,
  CONTAINED_BY: 16,
  IMPLEMENTATION_SPECIFIC: 32
};

function isDocumentNode (node: Node): node is Document {
  return node.nodeType === DOCUMENT_NODE;
}

function isElementNode (node: Node): node is Element {
  return node.nodeType === ELEMENT_NODE;
}

export default class XPathDOM implements IAdapter<Node> {
  private nativeNode: Node;

  constructor(nativeNode: Node) {
    if (!nativeNode) {
      throw new Error("This should not happen!");
    }

    this.nativeNode = nativeNode;

    return this;
  }

  getNativeNode(): Node {
    return this.nativeNode;
  }

  asString(): string {
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

  asNumber(): number {
    return +this.asString();
  }

  getNodeType(): number {
    return this.nativeNode.nodeType;
  }

  getChildNodes(): XPathDOM[] {
    var children: XPathDOM[] = [];

    for (var i = 0; i < this.nativeNode.childNodes.length; i++) {
      children.push(new XPathDOM(this.nativeNode.childNodes[i]));
    }

    return children;
  }

  getFollowingSiblings(): XPathDOM[] {
    var node: Node | null = this.nativeNode, followingSiblings: XPathDOM[] = [];

    while ((node = node.nextSibling)) {
      followingSiblings.push(new XPathDOM(node));
    }

    return followingSiblings;
  }

  getPrecedingSiblings(): XPathDOM[] {
    var node: Node | null = this.nativeNode, precedingSiblings: XPathDOM[] = [];

    while ((node = node.previousSibling)) {
      precedingSiblings.unshift(new XPathDOM(node));
    }

    return precedingSiblings;
  }

  getName(): string {
    var name = (this.nativeNode as HTMLElement).tagName || (this.nativeNode as Attr).name;

    if (name) {
      return name.toLowerCase();
    } else {
      return "";
    }
  }

  getAttributes(): XPathDOM[] {
    if (!(this.nativeNode as HTMLElement).attributes) {
      return [];
    }

    var attributes: XPathDOM[] = [];

    for (var i = 0; i < (this.nativeNode as HTMLElement).attributes.length; i++) {
      attributes.push(new XPathDOM((this.nativeNode as HTMLElement).attributes[i]));
    }

    return attributes;
  }

  getParent(): XPathDOM {
    var node = this.nativeNode.parentNode || (this.nativeNode as Attr).ownerElement;

    return new XPathDOM(node as Node);
  }

  getOwnerDocument(): XPathDOM {
    if (this.nativeNode.ownerDocument) {
      return new XPathDOM(this.nativeNode.ownerDocument);
    } else {
      return this;
    }
  }

  getElementById(id: string): XPathDOM | null {
    if (isDocumentNode(this.nativeNode)) {
      var node = this.nativeNode.getElementById(id);

      if (node) {
        return new XPathDOM(node);
      } else {
        return null;
      }
    } else {
      return this.getOwnerDocument().getElementById(id);
    }
  }

  isEqual(node: XPathDOM): boolean {
    return this.getNativeNode() === node.getNativeNode();
  }

  compareDocumentPosition(other: XPathDOM): -1 | 0 | 1 {
    var self: XPathDOM = this;

    if (self.getNativeNode() instanceof Attr) {
      self = self.getParent();
    }

    if (other.getNativeNode() instanceof Attr) {
      other = other.getParent();
    }

    if (!self.getNativeNode().compareDocumentPosition) {
      console.log(self.getNodeType(), ATTRIBUTE_NODE);
      console.log(self.getNativeNode());
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

  toString(): string {
    var name: string = "";

    if (isElementNode(this.nativeNode)) {
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
    }

    return "Node<" + name + ">";
  }
}
