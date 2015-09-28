(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.xpathDom = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* eslint-env browser, node */

if (!window.document.evaluate) {
  var XPathEvaluator = require("./register");

  window.document.evaluate = XPathEvaluator.evaluate;
  window.document.createExpression = XPathEvaluator.createExpression;
  window.document.createNSResolver = XPathEvaluator.createNSResolver;
  window.XPathResult = XPathEvaluator.XPathResult;

  var property;

  for (property in XPathEvaluator.XPathResultType) {
    if (XPathEvaluator.XPathResultType.hasOwnProperty(property)) {
      window.XPathResult[property] = XPathEvaluator.XPathResultType[property];
    }
  }
}

},{"./register":106}],2:[function(require,module,exports){
/* eslint-env node */

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
  } else {
    return this;
  }
};

XPathDOM.prototype.getElementById = function (id) {
  var node = this.nativeNode.getElementById(id);

  if (node) {
    return new XPathDOM(node);
  }
};

XPathDOM.compareDocumentPosition = function (a, b) {
  if (a.getNativeNode().compareDocumentPosition(b.getNativeNode()) & DocumentPosition.PRECEDING) {
    return 1;
  } else if (a.getNativeNode().compareDocumentPosition(b.getNativeNode()) & DocumentPosition.FOLLOWING) {
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

},{}],3:[function(require,module,exports){
/* eslint-env node */

"use strict";

module.exports = {
  ANCESTOR: "ancestor",
  ANCESTOR_OR_SELF: "ancestor-or-self",
  ATTRIBUTE: "attribute",
  CHILD: "child",
  DESCENDANT: "descendant",
  DESCENDANT_OR_SELF: "descendant-or-self",
  FOLLOWING: "following",
  FOLLOWING_SIBLING: "following-sibling",
  NAMESPACE: "namespace",
  PARENT: "parent",
  PRECEDING: "preceding",
  PRECEDING_SIBLING: "preceding-sibling",
  SELF: "self",

  isValidAxisSpecifier: function (axisSpecifier) {
    for (var property in this) {
      if (this.hasOwnProperty(property) && this[property] === axisSpecifier) {
        return true;
      }
    }

    return false;
  }
};

},{}],4:[function(require,module,exports){
/* eslint-env node */

module.exports = {
  ABSOLUTE_LOCATION_PATH: "absolute-location-path",
  ADDITIVE: "additive",
  AND: "and",
  DIVISIONAL: "divisional",
  EQUALITY: "equality",
  FILTER: "filter",
  FUNCTION_CALL: "function-call",
  GREATER_THAN: "greater-than",
  GREATER_THAN_OR_EQUAL: "greater-than-or-equal",
  INEQUALITY: "inequality",
  LESS_THAN: "less-than",
  LESS_THAN_OR_EQUAL: "less-than-or-equal",
  LITERAL: "literal",
  MODULUS: "modulus",
  MULTIPLICATIVE: "multiplicative",
  NEGATION: "negation",
  NUMBER: "number",
  OR: "or",
  PATH: "path",
  RELATIVE_LOCATION_PATH: "relative-location-path",
  SUBTRACTIVE: "subtractive",
  UNION: "union"
};

},{}],5:[function(require,module,exports){
/* eslint-env node */

"use strict";

module.exports = {
  COMMENT: "comment",
  NODE: "node",
  PROCESSING_INSTRUCTION: "processing-instruction",
  TEXT: "text",

  isValidNodeType: function (nodeType) {
    for (var property in this) {
      if (this.hasOwnProperty(property) && this[property] === nodeType) {
        return true;
      }
    }

    return false;
  }
};

},{}],6:[function(require,module,exports){
/* eslint-env node */

"use strict";

function AbsoluteLocationPath (lexer) {
  this.lexer = lexer;
}

module.exports = AbsoluteLocationPath;

var AxisSpecifier = require("../axis_specifier");

var ExprType = require("../expr_type");

var NodeType = require("../node_type");

var Step = require("./step");

AbsoluteLocationPath.prototype.parse = function () {
  var absoluteLocation = {
    type: ExprType.ABSOLUTE_LOCATION_PATH
  };

  while (!this.lexer.empty() && this.lexer.peak()[0] === "/") {
    if (!absoluteLocation.steps) {
      absoluteLocation.steps = [];
    }

    if (this.lexer.next() === "/") {
      var next = this.lexer.peak();

      if (!this.lexer.empty() && (next === "." || next === ".." || next === "@" || next === "*" || /(?![0-9])[\w]/.test(next))) {
        absoluteLocation.steps.push(new Step(this.lexer).parse());
      }
    } else {
      absoluteLocation.steps.push({
        axis: AxisSpecifier.DESCENDANT_OR_SELF,
        test: {
          type: NodeType.NODE
        }
      });

      absoluteLocation.steps.push(new Step(this.lexer).parse());
    }
  }

  return absoluteLocation;
};

},{"../axis_specifier":3,"../expr_type":4,"../node_type":5,"./step":22}],7:[function(require,module,exports){
/* eslint-env node */

"use strict";

function AdditiveExpr (lexer) {
  this.lexer = lexer;
}

module.exports = AdditiveExpr;

var ExprType = require("../expr_type");

var MultiplicativeExpr = require("./multiplicative_expr");

AdditiveExpr.prototype.parse = function () {
  var lhs = new MultiplicativeExpr(this.lexer).parse();

  var additiveTypes = {
    "+": ExprType.ADDITIVE,
    "-": ExprType.SUBTRACTIVE
  };

  if (additiveTypes.hasOwnProperty(this.lexer.peak())) {
    var op = this.lexer.next();

    var rhs = new AdditiveExpr(this.lexer).parse();

    return {
      type: additiveTypes[op],
      lhs: lhs,
      rhs: rhs
    };
  } else {
    return lhs;
  }
};

},{"../expr_type":4,"./multiplicative_expr":14}],8:[function(require,module,exports){
/* eslint-env node */

"use strict";

function AndExpr (lexer) {
  this.lexer = lexer;
}

module.exports = AndExpr;

var ExprType = require("../expr_type");

var EqualityExpr = require("./equality_expr");

AndExpr.prototype.parse = function () {
  var lhs = new EqualityExpr(this.lexer).parse();

  if (this.lexer.peak() === "and") {
    this.lexer.next();

    var rhs = new AndExpr(this.lexer).parse();

    return {
      type: ExprType.AND,
      lhs: lhs,
      rhs: rhs
    };
  } else {
    return lhs;
  }
};

},{"../expr_type":4,"./equality_expr":9}],9:[function(require,module,exports){
/* eslint-env node */

"use strict";

function EqualityExpr (lexer) {
  this.lexer = lexer;
}

module.exports = EqualityExpr;

var ExprType = require("../expr_type");

var RelationalExpr = require("./relational_expr");

EqualityExpr.prototype.parse = function () {
  var lhs = new RelationalExpr(this.lexer).parse();

  var equalityTypes = {
    "=": ExprType.EQUALITY,
    "!=": ExprType.INEQUALITY
  };

  if (equalityTypes.hasOwnProperty(this.lexer.peak())) {
    var op = this.lexer.next();

    var rhs = new EqualityExpr(this.lexer).parse();

    return {
      type: equalityTypes[op],
      lhs: lhs,
      rhs: rhs
    };
  } else {
    return lhs;
  }
};

},{"../expr_type":4,"./relational_expr":20}],10:[function(require,module,exports){
/* eslint-env node */

"use strict";

function Expr (lexer) {
  this.lexer = lexer;
}

module.exports = Expr;

var OrExpr = require("./or_expr");

Expr.prototype.parse = function () {
  return new OrExpr(this.lexer).parse();
};

},{"./or_expr":16}],11:[function(require,module,exports){
/* eslint-env node */

"use strict";

function FilterExpr (lexer) {
  this.lexer = lexer;
}

module.exports = FilterExpr;

var ExprType = require("../expr_type");

var Predicate = require("./predicate");

var PrimaryExpr = require("./primary_expr");

FilterExpr.prototype.parse = function () {
  var primary = new PrimaryExpr(this.lexer).parse();

  if (this.lexer.peak() === "[") {
    var filter = {
      type: ExprType.FILTER,
      primary: primary,
      predicates: []
    };

    while (this.lexer.peak() === "[") {
      filter.predicates.push(new Predicate(this.lexer).parse());
    }

    return filter;
  } else {
    return primary;
  }
};

FilterExpr.isValidOp = function (lexer) {
  return PrimaryExpr.isValidOp(lexer);
};

},{"../expr_type":4,"./predicate":18,"./primary_expr":19}],12:[function(require,module,exports){
/* eslint-env node */

"use strict";

function FunctionCall (lexer) {
  this.lexer = lexer;
}

module.exports = FunctionCall;

var ExprType = require("../expr_type");

var Expr = require("./expr");

FunctionCall.prototype.parse = function () {
  var functionCall = {
    type: ExprType.FUNCTION_CALL,
    name: this.lexer.next()
  };

  this.lexer.next();

  if (this.lexer.peak() === ")") {
    this.lexer.next();
  } else {
    functionCall.args = [];

    while (this.lexer.peak() !== ")") {
      functionCall.args.push((new Expr(this.lexer)).parse());

      if (this.lexer.peak() === ",") {
        this.lexer.next();
      }
    }

    this.lexer.next();
  }

  return functionCall;
};

},{"../expr_type":4,"./expr":10}],13:[function(require,module,exports){
/* eslint-env node */

"use strict";

function LocationPath (lexer) {
  this.lexer = lexer;
}

module.exports = LocationPath;

var AbsoluteLocationPath = require("./absolute_location_path");

var RelativeLocationPath = require("./relative_location_path");

LocationPath.prototype.parse = function () {
  var ch = this.lexer.peak()[0];

  if (ch === "/") {
    return new AbsoluteLocationPath(this.lexer).parse();
  } else {
    return new RelativeLocationPath(this.lexer).parse();
  }
};

},{"./absolute_location_path":6,"./relative_location_path":21}],14:[function(require,module,exports){
/* eslint-env node */

"use strict";

function MultiplicativeExpr (lexer) {
  this.lexer = lexer;
}

module.exports = MultiplicativeExpr;

var ExprType = require("../expr_type");

var UnaryExpr = require("./unary_expr");

MultiplicativeExpr.prototype.parse = function () {
  var lhs = new UnaryExpr(this.lexer).parse();

  var multiplicativeTypes = {
    "*": ExprType.MULTIPLICATIVE,
    "div": ExprType.DIVISIONAL,
    "mod": ExprType.MODULUS
  };

  if (multiplicativeTypes.hasOwnProperty(this.lexer.peak())) {
    var op = this.lexer.next();

    var rhs = new MultiplicativeExpr(this.lexer).parse();

    return {
      type: multiplicativeTypes[op],
      lhs: lhs,
      rhs: rhs
    };
  } else {
    return lhs;
  }
};

},{"../expr_type":4,"./unary_expr":23}],15:[function(require,module,exports){
/* eslint-env node */

"use strict";

function NodeTest (lexer) {
  this.lexer = lexer;
}

module.exports = NodeTest;

var NodeType = require("../node_type");

NodeTest.prototype.parse = function () {
  if (this.lexer.peak() === "*") {
    this.lexer.next();

    return {
      name: "*"
    };
  }

  if (this.lexer.peak(1) === "(") {
    if (NodeType.isValidNodeType(this.lexer.peak())) {
      var test = {
        type: this.lexer.next()
      };

      this.lexer.next();

      if (this.lexer.peak() === ")") {
        this.lexer.next();
      } else {
        test.name = this.lexer.next();

        this.lexer.next();
      }

      return test;
    } else {
      throw new Error("Unexpected token " + this.lexer.peak());
    }
  }

  return {
    name: this.lexer.next()
  };
};

},{"../node_type":5}],16:[function(require,module,exports){
/* eslint-env node */

"use strict";

function OrExpr (lexer) {
  this.lexer = lexer;
}

module.exports = OrExpr;

var ExprType = require("../expr_type");

var AndExpr = require("./and_expr");

OrExpr.prototype.parse = function () {
  var lhs = new AndExpr(this.lexer).parse();

  if (this.lexer.peak() === "or") {
    this.lexer.next();

    var rhs = new OrExpr(this.lexer).parse();

    return {
      type: ExprType.OR,
      lhs: lhs,
      rhs: rhs
    };
  } else {
    return lhs;
  }
};

},{"../expr_type":4,"./and_expr":8}],17:[function(require,module,exports){
/* eslint-env node */

"use strict";

function PathExpr (lexer) {
  this.lexer = lexer;
}

module.exports = PathExpr;

var AxisSpecifier = require("../axis_specifier");

var ExprType = require("../expr_type");

var NodeType = require("../node_type");

var FilterExpr = require("./filter_expr");

var LocationPath = require("./location_path");

var Step = require("./step");

PathExpr.prototype.parse = function () {
  if (FilterExpr.isValidOp(this.lexer)) {
    var filter = new FilterExpr(this.lexer).parse();

    if (!this.lexer.empty() && this.lexer.peak()[0] === "/") {
      var path = {
        type: ExprType.PATH,
        filter: filter,
        steps: []
      };

      while (!this.lexer.empty() && this.lexer.peak()[0] === "/") {
        if (this.lexer.next() === "//") {
          path.steps.push({
            axis: AxisSpecifier.DESCENDANT_OR_SELF,
            test: {
              type: NodeType.NODE
            }
          });
        }

        path.steps.push(new Step(this.lexer).parse());
      }

      return path;
    } else {
      return filter;
    }
  } else {
    return new LocationPath(this.lexer).parse();
  }
};

},{"../axis_specifier":3,"../expr_type":4,"../node_type":5,"./filter_expr":11,"./location_path":13,"./step":22}],18:[function(require,module,exports){
/* eslint-env node */

"use strict";

function Predicate (lexer) {
  this.lexer = lexer;
}

module.exports = Predicate;

var Expr = require("./expr");

Predicate.prototype.parse = function () {
  this.lexer.next();

  var predicate = new Expr(this.lexer).parse();

  if (this.lexer.next() !== "]") {
    throw new Error("Unclosed brackets");
  }

  return predicate;
};

},{"./expr":10}],19:[function(require,module,exports){
/* eslint-env node */

"use strict";

function PrimaryExpr (lexer) {
  this.lexer = lexer;
}

module.exports = PrimaryExpr;

var ExprType = require("../expr_type");

var NodeType = require("../node_type");

var Expr = require("./expr");

var FunctionCall = require("./function_call");

PrimaryExpr.prototype.parse = function () {
  var token = this.lexer.peak(),
      ch = token[0];

  if (ch === "(") {
    this.lexer.next();

    var expr = new Expr(this.lexer).parse();

    if (this.lexer.next() !== ")") {
      throw new Error("Unclosed parentheses");
    }

    return expr;
  }

  if (ch === "\"" || ch === "'") {
    this.lexer.next();

    return {
      type: ExprType.LITERAL,
      string: token.slice(1, -1)
    };
  }

  if (ch === "$") {
    throw Error("Variable reference are not implemented");
  }

  if (/^\d+$/.test(token) || /^(\d+)?\.\d+$/.test(token)) {
    this.lexer.next();

    return {
      type: ExprType.NUMBER,
      number: parseFloat(token)
    };
  }

  if (this.lexer.peak(1) === "(" && !NodeType.isValidNodeType(this.lexer.peak())) {
    return new FunctionCall(this.lexer).parse();
  }
};

PrimaryExpr.isValidOp = function (lexer) {
  var token = lexer.peak(),
      ch = token[0];

  return ch === "(" ||
    ch === "\"" ||
    ch === "'" ||
    ch === "$" ||
    /^\d+$/.test(token) ||
    /^(\d+)?\.\d+$/.test(token) ||
    (lexer.peak(1) === "(" && !NodeType.isValidNodeType(lexer.peak()));
};

},{"../expr_type":4,"../node_type":5,"./expr":10,"./function_call":12}],20:[function(require,module,exports){
/* eslint-env node */

"use strict";

function RelationalExpr (lexer) {
  this.lexer = lexer;
}

module.exports = RelationalExpr;

var ExprType = require("../expr_type");

var AdditiveExpr = require("./additive_expr");

RelationalExpr.prototype.parse = function () {
  var lhs = new AdditiveExpr(this.lexer).parse();

  var relationalTypes = {
    "<": ExprType.LESS_THAN,
    ">": ExprType.GREATER_THAN,
    "<=": ExprType.LESS_THAN_OR_EQUAL,
    ">=": ExprType.GREATER_THAN_OR_EQUAL
  };

  if (relationalTypes.hasOwnProperty(this.lexer.peak())) {
    var op = this.lexer.next();

    var rhs = new RelationalExpr(this.lexer).parse();

    return {
      type: relationalTypes[op],
      lhs: lhs,
      rhs: rhs
    };
  } else {
    return lhs;
  }
};

},{"../expr_type":4,"./additive_expr":7}],21:[function(require,module,exports){
/* eslint-env node */

"use strict";

function RelativeLocationPath (lexer) {
  this.lexer = lexer;
}

module.exports = RelativeLocationPath;

var AxisSpecifier = require("../axis_specifier");

var ExprType = require("../expr_type");

var NodeType = require("../node_type");

var Step = require("./step");

RelativeLocationPath.prototype.parse = function () {
  var relativeLocation = {
    type: ExprType.RELATIVE_LOCATION_PATH
  };

  relativeLocation.steps = [new Step(this.lexer).parse()];

  while (!this.lexer.empty() && this.lexer.peak()[0] === "/") {
    if (this.lexer.next() === "/") {
      relativeLocation.steps.push(new Step(this.lexer).parse());
    } else {
      relativeLocation.steps.push({
          axis: AxisSpecifier.DESCENDANT_OR_SELF,
          test: {
            type: NodeType.NODE
          }
        });

      relativeLocation.steps.push(new Step(this.lexer).parse());
    }
  }

  return relativeLocation;
};

},{"../axis_specifier":3,"../expr_type":4,"../node_type":5,"./step":22}],22:[function(require,module,exports){
/* eslint-env node */

"use strict";

function Step (lexer) {
  this.lexer = lexer;
}

module.exports = Step;

var AxisSpecifier = require("../axis_specifier");

var NodeType = require("../node_type");

var NodeTest = require("./node_test");

var Predicate = require("./predicate");

Step.prototype.parse = function () {
  var step = {};

  if (this.lexer.peak(1) === "::") {
    var axisSpecifier = this.lexer.next();

    this.lexer.next();

    if (AxisSpecifier.isValidAxisSpecifier(axisSpecifier)) {
      step.axis = axisSpecifier;
    } else {
      throw new Error("Unexpected token " + axisSpecifier);
    }
  } else if (this.lexer.peak() === "@") {
    this.lexer.next();

    step.axis = AxisSpecifier.ATTRIBUTE;
  } else if (this.lexer.peak() === "..") {
    this.lexer.next();

    return {
      axis: AxisSpecifier.PARENT,
      test: {
        type: NodeType.NODE
      }
    };
  } else if (this.lexer.peak() === ".") {
    this.lexer.next();

    return {
      axis: AxisSpecifier.SELF,
      test: {
        type: NodeType.NODE
      }
    };
  } else {
    step.axis = AxisSpecifier.CHILD;
  }

  step.test = new NodeTest(this.lexer).parse();

  while (this.lexer.peak() === "[") {
    if (!step.predicates) {
      step.predicates = [];
    }

    step.predicates.push(new Predicate(this.lexer).parse());
  }

  return step;
};

},{"../axis_specifier":3,"../node_type":5,"./node_test":15,"./predicate":18}],23:[function(require,module,exports){
/* eslint-env node */

"use strict";

function UnaryExpr (lexer) {
  this.lexer = lexer;
}

module.exports = UnaryExpr;

var ExprType = require("../expr_type");

var UnionExpr = require("./union_expr");

UnaryExpr.prototype.parse = function () {
  if (this.lexer.peak() === "-") {
    this.lexer.next();

    return {
      type: ExprType.NEGATION,
      lhs: new UnaryExpr(this.lexer).parse()
    };
  } else {
    return new UnionExpr(this.lexer).parse();
  }
};

},{"../expr_type":4,"./union_expr":24}],24:[function(require,module,exports){
/* eslint-env node */

"use strict";

function UnionExpr (lexer) {
  this.lexer = lexer;
}

module.exports = UnionExpr;

var ExprType = require("../expr_type");

var PathExpr = require("./path_expr");

UnionExpr.prototype.parse = function () {
  var lhs = new PathExpr(this.lexer).parse();

  if (this.lexer.peak() === "|") {
    this.lexer.next();

    var rhs = new UnionExpr(this.lexer).parse();

    return {
      type: ExprType.UNION,
      lhs: lhs,
      rhs: rhs
    };
  } else {
    return lhs;
  }
};

},{"../expr_type":4,"./path_expr":17}],25:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathLexer = require("xpath-lexer");

var AxisSpecifier = require("./axis_specifier");

var ExprType = require("./expr_type");

var NodeType = require("./node_type");

var Expr = require("./parsers/expr");

function XPathAnalyzer (expression) {
  this.lexer = new XPathLexer(expression);
}

XPathAnalyzer.AxisSpecifier = AxisSpecifier;

XPathAnalyzer.ExprType = ExprType;

XPathAnalyzer.NodeType = NodeType;

XPathAnalyzer.prototype.parse = function () {
  var ast = new Expr(this.lexer).parse();

  if (this.lexer.empty()) {
    return ast;
  } else {
    throw new Error("Unexpected token " + this.lexer.peak());
  }
};

module.exports = XPathAnalyzer;

},{"./axis_specifier":3,"./expr_type":4,"./node_type":5,"./parsers/expr":10,"xpath-lexer":105}],26:[function(require,module,exports){
/* eslint-env node */

"use strict";

module.exports = {
  setAdapter: function (adapter) {
    this.adapter = adapter;
  },

  getAdapter: function () {
    if (!this.adapter) {
      throw new Error("No adapter is specified");
    }

    return this.adapter;
  }
};

},{}],27:[function(require,module,exports){
/* eslint-env node */

module.exports = {};

var XPathAnalyzer = require("xpath-analyzer");

var Ancestor = require("./axes/ancestor");

var AncestorOrSelf = require("./axes/ancestor_or_self");

var Attribute = require("./axes/attribute");

var Child = require("./axes/child");

var Descendant = require("./axes/descendant");

var DescendantOrSelf = require("./axes/descendant_or_self");

var Following = require("./axes/following");

var FollowingSibling = require("./axes/following_sibling");

var Namespace = require("./axes/namespace");

var Parent = require("./axes/parent");

var Preceding = require("./axes/preceding");

var PrecedingSibling = require("./axes/preceding_sibling");

var Self = require("./axes/self");

module.exports[XPathAnalyzer.AxisSpecifier.ANCESTOR] = Ancestor;
module.exports[XPathAnalyzer.AxisSpecifier.ANCESTOR_OR_SELF] = AncestorOrSelf;
module.exports[XPathAnalyzer.AxisSpecifier.ATTRIBUTE] = Attribute;
module.exports[XPathAnalyzer.AxisSpecifier.CHILD] = Child;
module.exports[XPathAnalyzer.AxisSpecifier.DESCENDANT] = Descendant;
module.exports[XPathAnalyzer.AxisSpecifier.DESCENDANT_OR_SELF] = DescendantOrSelf;
module.exports[XPathAnalyzer.AxisSpecifier.FOLLOWING] = Following;
module.exports[XPathAnalyzer.AxisSpecifier.FOLLOWING_SIBLING] = FollowingSibling;
module.exports[XPathAnalyzer.AxisSpecifier.NAMESPACE] = Namespace;
module.exports[XPathAnalyzer.AxisSpecifier.PARENT] = Parent;
module.exports[XPathAnalyzer.AxisSpecifier.PRECEDING] = Preceding;
module.exports[XPathAnalyzer.AxisSpecifier.PRECEDING_SIBLING] = PrecedingSibling;
module.exports[XPathAnalyzer.AxisSpecifier.SELF] = Self;

},{"./axes/ancestor":28,"./axes/ancestor_or_self":29,"./axes/attribute":30,"./axes/child":31,"./axes/descendant":32,"./axes/descendant_or_self":33,"./axes/following":34,"./axes/following_sibling":35,"./axes/namespace":36,"./axes/parent":37,"./axes/preceding":38,"./axes/preceding_sibling":39,"./axes/self":40,"xpath-analyzer":25}],28:[function(require,module,exports){
/* eslint-env node */

"use strict";

var Context = require("../context");

var Node = require("../node");

var NodeSetType = require("../types/node_set_type");

module.exports = {
  evaluate: function (context) {
    var nodes = new NodeSetType();

    if (context.getNode().getNodeType() !== Node.DOCUMENT_NODE) {
      nodes = nodes.unshift(context.getNode().getParent());

      nodes = nodes.merge(this.evaluate(new Context(context.getNode().getParent())));
    }

    return nodes;
  }
};

},{"../context":41,"../node":94,"../types/node_set_type":96}],29:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NodeSetType = require("../types/node_set_type");

var Ancestor = require("./ancestor");

module.exports = {
  evaluate: function (context) {
    var nodes = new NodeSetType([context.getNode()], true);

    return Ancestor.evaluate(context).merge(nodes);
  }
};

},{"../types/node_set_type":96,"./ancestor":28}],30:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NodeSetType = require("../types/node_set_type");

module.exports = {
  evaluate: function (context) {
    return new NodeSetType(context.getNode().getAttributes());
  }
};

},{"../types/node_set_type":96}],31:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NodeSetType = require("../types/node_set_type");

module.exports = {
  evaluate: function (context) {
    return new NodeSetType(context.getNode().getChildNodes());
  }
};

},{"../types/node_set_type":96}],32:[function(require,module,exports){
/* eslint-env node */

"use strict";

var Context = require("../context");

var NodeSetType = require("../types/node_set_type");

module.exports = {
  evaluate: function (context) {
    var nodes = new NodeSetType();

    var children = new NodeSetType(context.getNode().getChildNodes());

    var child, iter = children.iterator();

    while ((child = iter.next())) {
      nodes = nodes.push(child);

      nodes = nodes.merge(this.evaluate(new Context(child)));
    }

    return nodes;
  }
};

},{"../context":41,"../types/node_set_type":96}],33:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NodeSetType = require("../types/node_set_type");

var Descendant = require("./descendant");

module.exports = {
  evaluate: function (context) {
    var nodes = new NodeSetType([context.getNode()]);

    return nodes.merge(Descendant.evaluate(context));
  }
};

},{"../types/node_set_type":96,"./descendant":32}],34:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathAnalyzer = require("xpath-analyzer");

var RelativeLocationPath = require("../evaluators/relative_location_path");

module.exports = {
  evaluate: function (context) {
    return RelativeLocationPath.evaluate({steps: [{
      axis: XPathAnalyzer.AxisSpecifier.ANCESTOR_OR_SELF,
      test: {
        type: XPathAnalyzer.NodeType.NODE
      }
    }, {
      axis: XPathAnalyzer.AxisSpecifier.FOLLOWING_SIBLING,
      test: {
        type: XPathAnalyzer.NodeType.NODE
      }
    }, {
      axis: XPathAnalyzer.AxisSpecifier.DESCENDANT_OR_SELF,
      test: {
        type: XPathAnalyzer.NodeType.NODE
      }
    }]}, context);
  }
};

},{"../evaluators/relative_location_path":63,"xpath-analyzer":25}],35:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NodeSetType = require("../types/node_set_type");

module.exports = {
  evaluate: function (context) {
    return new NodeSetType(context.getNode().getFollowingSiblings());
  }
};

},{"../types/node_set_type":96}],36:[function(require,module,exports){

},{}],37:[function(require,module,exports){
/* eslint-env node */

"use strict";

var Node = require("../node");

var NodeSetType = require("../types/node_set_type");

module.exports = {
  evaluate: function (context) {
    var nodes = new NodeSetType();

    if (context.getNode().getNodeType() !== Node.DOCUMENT_NODE) {
      nodes = nodes.push(context.getNode().getParent());
    }

    return nodes;
  }
};

},{"../node":94,"../types/node_set_type":96}],38:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathAnalyzer = require("xpath-analyzer");

var RelativeLocationPath = require("../evaluators/relative_location_path");

module.exports = {
  evaluate: function (context) {
    return RelativeLocationPath.evaluate({steps: [{
      axis: XPathAnalyzer.AxisSpecifier.ANCESTOR_OR_SELF,
      test: {
        type: XPathAnalyzer.NodeType.NODE
      }
    }, {
      axis: XPathAnalyzer.AxisSpecifier.PRECEDING_SIBLING,
      test: {
        type: XPathAnalyzer.NodeType.NODE
      }
    }, {
      axis: XPathAnalyzer.AxisSpecifier.DESCENDANT_OR_SELF,
      test: {
        type: XPathAnalyzer.NodeType.NODE
      }
    }]}, context);
  }
};

},{"../evaluators/relative_location_path":63,"xpath-analyzer":25}],39:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NodeSetType = require("../types/node_set_type");

module.exports = {
  evaluate: function (context) {
    return new NodeSetType(context.getNode().getPrecedingSiblings());
  }
};

},{"../types/node_set_type":96}],40:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NodeSetType = require("../types/node_set_type");

module.exports = {
  evaluate: function (context) {
    return new NodeSetType([context.getNode()]);
  }
};

},{"../types/node_set_type":96}],41:[function(require,module,exports){
/* eslint-env node */

"use strict";

function Context (node, position, last) {
  this.node = node;
  this.position = position;
  this.last = last;
}

Context.prototype.getNode = function () {
  return this.node;
};

Context.prototype.getPosition = function () {
  return this.position;
};

Context.prototype.getLast = function () {
  return this.last;
};

Context.prototype.toString = function () {
  return "Context<" + this.node + ">";
};

module.exports = Context;

},{}],42:[function(require,module,exports){
/* eslint-env node */

module.exports = {};

var XPathAnalyzer = require("xpath-analyzer");

var AbsoluteLocationPath = require("./evaluators/absolute_location_path");

var Additive = require("./evaluators/additive");

var And = require("./evaluators/and");

var Divisional = require("./evaluators/divisional");

var Equality = require("./evaluators/equality");

var Filter = require("./evaluators/filter");

var FunctionCall = require("./evaluators/function_call");

var GreaterThan = require("./evaluators/greater_than");

var GreaterThanOrEqual = require("./evaluators/greater_than_or_equal");

var Inequality = require("./evaluators/inequality");

var LessThan = require("./evaluators/less_than");

var LessThanOrEqual = require("./evaluators/less_than_or_equal");

var Literal = require("./evaluators/literal");

var Modulus = require("./evaluators/modulus");

var Multiplicative = require("./evaluators/multiplicative");

var Negation = require("./evaluators/negation");

/* eslint-disable no-underscore-dangle */
var Number_ = require("./evaluators/number");
/* eslint-enable no-underscore-dangle */

var Or = require("./evaluators/or");

var Path = require("./evaluators/path");

var RelativeLocationPath = require("./evaluators/relative_location_path");

var Subtractive = require("./evaluators/subtractive");

var Union = require("./evaluators/union");

module.exports[XPathAnalyzer.ExprType.ABSOLUTE_LOCATION_PATH] = AbsoluteLocationPath;
module.exports[XPathAnalyzer.ExprType.ADDITIVE] = Additive;
module.exports[XPathAnalyzer.ExprType.AND] = And;
module.exports[XPathAnalyzer.ExprType.DIVISIONAL] = Divisional;
module.exports[XPathAnalyzer.ExprType.EQUALITY] = Equality;
module.exports[XPathAnalyzer.ExprType.FILTER] = Filter;
module.exports[XPathAnalyzer.ExprType.FUNCTION_CALL] = FunctionCall;
module.exports[XPathAnalyzer.ExprType.GREATER_THAN] = GreaterThan;
module.exports[XPathAnalyzer.ExprType.GREATER_THAN_OR_EQUAL] = GreaterThanOrEqual;
module.exports[XPathAnalyzer.ExprType.INEQUALITY] = Inequality;
module.exports[XPathAnalyzer.ExprType.LESS_THAN] = LessThan;
module.exports[XPathAnalyzer.ExprType.LESS_THAN_OR_EQUAL] = LessThanOrEqual;
module.exports[XPathAnalyzer.ExprType.LITERAL] = Literal;
module.exports[XPathAnalyzer.ExprType.MODULUS] = Modulus;
module.exports[XPathAnalyzer.ExprType.MULTIPLICATIVE] = Multiplicative;
module.exports[XPathAnalyzer.ExprType.NEGATION] = Negation;
module.exports[XPathAnalyzer.ExprType.NUMBER] = Number_;
module.exports[XPathAnalyzer.ExprType.OR] = Or;
module.exports[XPathAnalyzer.ExprType.PATH] = Path;
module.exports[XPathAnalyzer.ExprType.RELATIVE_LOCATION_PATH] = RelativeLocationPath;
module.exports[XPathAnalyzer.ExprType.SUBTRACTIVE] = Subtractive;
module.exports[XPathAnalyzer.ExprType.UNION] = Union;

},{"./evaluators/absolute_location_path":43,"./evaluators/additive":44,"./evaluators/and":45,"./evaluators/divisional":46,"./evaluators/equality":47,"./evaluators/filter":48,"./evaluators/function_call":49,"./evaluators/greater_than":50,"./evaluators/greater_than_or_equal":51,"./evaluators/inequality":53,"./evaluators/less_than":54,"./evaluators/less_than_or_equal":55,"./evaluators/literal":56,"./evaluators/modulus":57,"./evaluators/multiplicative":58,"./evaluators/negation":59,"./evaluators/number":60,"./evaluators/or":61,"./evaluators/path":62,"./evaluators/relative_location_path":63,"./evaluators/subtractive":65,"./evaluators/union":66,"xpath-analyzer":25}],43:[function(require,module,exports){
/* eslint-env node */

"use strict";

var Context = require("../context");

var Node = require("../node");

var RelativeLocationPath = require("./relative_location_path");

module.exports = {
  evaluate: function (ast, context, type) {
    if (context.getNode().getNodeType() !== Node.DOCUMENT_NODE) {
      context = new Context(context.getNode().getOwnerDocument());
    }

    return RelativeLocationPath.evaluate(ast, context, type);
  }
};

},{"../context":41,"../node":94,"./relative_location_path":63}],44:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (ast, context, type) {
    var lhs = XPathExpression.evaluate(ast.lhs, context, type);

    var rhs = XPathExpression.evaluate(ast.rhs, context, type);

    return new NumberType(lhs.asNumber() + rhs.asNumber());
  }
};

},{"../types/number_type":97,"../xpath_expression":102}],45:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var BooleanType = require("../types/boolean_type");

module.exports = {
  evaluate: function (ast, context, type) {
    var lhs = XPathExpression.evaluate(ast.lhs, context, type);

    if (!lhs.asBoolean()) {
      return new BooleanType(false);
    }

    return XPathExpression.evaluate(ast.rhs, context, type);
  }
};

},{"../types/boolean_type":95,"../xpath_expression":102}],46:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (ast, context, type) {
    var lhs = XPathExpression.evaluate(ast.lhs, context, type);

    var rhs = XPathExpression.evaluate(ast.rhs, context, type);

    return new NumberType(lhs.asNumber() / rhs.asNumber());
  }
};

},{"../types/number_type":97,"../xpath_expression":102}],47:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var Helper = require("./helper");

module.exports = {
  evaluate: function (ast, context, type) {
    return Helper.compareNodes(
      ast.type,
      XPathExpression.evaluate(ast.lhs, context, type),
      XPathExpression.evaluate(ast.rhs, context, type),
      function (lhs, rhs) {
        return lhs === rhs;
      }
    );
  }
};

},{"../xpath_expression":102,"./helper":52}],48:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var Context = require("../context");

var NumberType = require("../types/number_type");

var NodeSetType = require("../types/node_set_type");

module.exports = {
  evaluate: function (ast, context, type) {
    var nodes = XPathExpression.evaluate(ast.primary, context, type);

    var node, position = 0, filteredNodes = [], iter = nodes.iterator();

    while ((node = iter.next())) {
      position++;

      var keep = ast.predicates.every(function (predicate) {
        var result = XPathExpression.evaluate(predicate, new Context(node, position, nodes.length()), type);

        if (result === null) {
          return false;
        }

        if (result instanceof NumberType) {
          return result.asNumber() === position;
        } else {
          return result.asBoolean();
        }
      });

      if (keep) {
        filteredNodes.push(node);
      }
    }

    return new NodeSetType(filteredNodes);
  }
};

},{"../context":41,"../types/node_set_type":96,"../types/number_type":97,"../xpath_expression":102}],49:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var Functions = require("../functions");

module.exports = {
  evaluate: function (ast, context, type) {
    var args = (ast.args || []).map(function (arg) {
      return XPathExpression.evaluate(arg, context, type);
    });

    args.unshift(context);

    var functionEvaluator = Functions[ast.name];

    if (functionEvaluator) {
      return functionEvaluator.evaluate.apply(null, args);
    } else {
      throw new Error("Unknown function " + ast.name);
    }
  }
};

},{"../functions":67,"../xpath_expression":102}],50:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var Helper = require("./helper");

module.exports = {
  evaluate: function (ast, context, type) {
    return Helper.compareNodes(
      ast.type,
      XPathExpression.evaluate(ast.lhs, context, type),
      XPathExpression.evaluate(ast.rhs, context, type),
      function (lhs, rhs) {
        return lhs > rhs;
      }
    );
  }
};

},{"../xpath_expression":102,"./helper":52}],51:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var Helper = require("./helper");

module.exports = {
  evaluate: function (ast, context, type) {
    return Helper.compareNodes(
      ast.type,
      XPathExpression.evaluate(ast.lhs, context, type),
      XPathExpression.evaluate(ast.rhs, context, type),
      function (lhs, rhs) {
        return lhs >= rhs;
      }
    );
  }
};

},{"../xpath_expression":102,"./helper":52}],52:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathAnalyzer = require("xpath-analyzer");

var BooleanType = require("../types/boolean_type");

var NodeSetType = require("../types/node_set_type");

var NumberType = require("../types/number_type");

var StringType = require("../types/string_type");

module.exports = {
  compareNodes: function (type, lhs, rhs, comparator) {
    if (lhs instanceof NodeSetType && rhs instanceof NodeSetType) {
      var lNode, lIter = lhs.iterator();

      while ((lNode = lIter.next())) {
        var rNode, rIter = rhs.iterator();

        while ((rNode = rIter.next())) {
          if (comparator(lNode.asString(), rNode.asString())) {
            return new BooleanType(true);
          }
        }
      }

      return new BooleanType(false);
    }

    if (lhs instanceof NodeSetType || rhs instanceof NodeSetType) {
      var nodeSet, primitive;

      if (lhs instanceof NodeSetType) {
        nodeSet = lhs;
        primitive = rhs;
      } else {
        nodeSet = rhs;
        primitive = lhs;
      }

      var node, iter = nodeSet.iterator();

      while ((node = iter.next())) {
        if (primitive instanceof NumberType) {
          if (comparator(node.asNumber(), primitive.asNumber())) {
            return new BooleanType(true);
          }
        } else if (primitive instanceof BooleanType) {
          if (comparator(node.asBoolean(), primitive.asBoolean())) {
            return new BooleanType(true);
          }
        } else if (primitive instanceof StringType) {
          if (comparator(node.asString(), primitive.asString())) {
            return new BooleanType(true);
          }
        } else {
          throw new Error("Unknown value type");
        }
      }

      return new BooleanType(false);
    }

    // Neither object is a NodeSet at this point.


    if (type === XPathAnalyzer.ExprType.EQUALITY ||
        type === XPathAnalyzer.ExprType.INEQUALITY) {
      if (lhs instanceof BooleanType || rhs instanceof BooleanType) {
        if (comparator(lhs.asBoolean(), rhs.asBoolean())) {
          return new BooleanType(true);
        }
      } else if (rhs instanceof NumberType || rhs instanceof NumberType) {
        if (comparator(lhs.asNumber(), rhs.asNumber())) {
          return new BooleanType(true);
        }
      } else if (rhs instanceof StringType || rhs instanceof StringType) {
        if (comparator(lhs.asString(), rhs.asString())) {
          return new BooleanType(true);
        }
      } else {
        throw new Error("Unknown value types");
      }

      return new BooleanType(false);
    } else {
      return new BooleanType(comparator(lhs.asNumber(), rhs.asNumber()));
    }
  }
};

},{"../types/boolean_type":95,"../types/node_set_type":96,"../types/number_type":97,"../types/string_type":98,"xpath-analyzer":25}],53:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var Helper = require("./helper");

module.exports = {
  evaluate: function (ast, context, type) {
    return Helper.compareNodes(
      ast.type,
      XPathExpression.evaluate(ast.lhs, context, type),
      XPathExpression.evaluate(ast.rhs, context, type),
      function (lhs, rhs) {
        return lhs !== rhs;
      }
    );
  }
};

},{"../xpath_expression":102,"./helper":52}],54:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var Helper = require("./helper");

module.exports = {
  evaluate: function (ast, context, type) {
    return Helper.compareNodes(
      ast.type,
      XPathExpression.evaluate(ast.lhs, context, type),
      XPathExpression.evaluate(ast.rhs, context, type),
      function (lhs, rhs) {
        return lhs < rhs;
      }
    );
  }
};

},{"../xpath_expression":102,"./helper":52}],55:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var Helper = require("./helper");

module.exports = {
  evaluate: function (ast, context, type) {
    return Helper.compareNodes(
      ast.type,
      XPathExpression.evaluate(ast.lhs, context, type),
      XPathExpression.evaluate(ast.rhs, context, type),
      function (lhs, rhs) {
        return lhs <= rhs;
      }
    );
  }
};

},{"../xpath_expression":102,"./helper":52}],56:[function(require,module,exports){
/* eslint-env node */

"use strict";

var StringType = require("../types/string_type");

module.exports = {
  evaluate: function (ast) {
    return new StringType(ast.string);
  }
};

},{"../types/string_type":98}],57:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (ast, context, type) {
    var lhs = XPathExpression.evaluate(ast.lhs, context, type);

    var rhs = XPathExpression.evaluate(ast.rhs, context, type);

    return new NumberType(lhs.asNumber() % rhs.asNumber());
  }
};

},{"../types/number_type":97,"../xpath_expression":102}],58:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (ast, context, type) {
    var lhs = XPathExpression.evaluate(ast.lhs, context, type);

    var rhs = XPathExpression.evaluate(ast.rhs, context, type);

    return new NumberType(lhs.asNumber() * rhs.asNumber());
  }
};

},{"../types/number_type":97,"../xpath_expression":102}],59:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (ast, context, type) {
    var lhs = XPathExpression.evaluate(ast.lhs, context, type);

    return new NumberType(-lhs.asNumber());
  }
};

},{"../types/number_type":97,"../xpath_expression":102}],60:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (ast) {
    return new NumberType(ast.number);
  }
};

},{"../types/number_type":97}],61:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var BooleanType = require("../types/boolean_type");

module.exports = {
  evaluate: function (ast, context, type) {
    var lhs = XPathExpression.evaluate(ast.lhs, context, type);

    if (lhs.asBoolean()) {
      return new BooleanType(true);
    }

    return XPathExpression.evaluate(ast.rhs, context, type);
  }
};

},{"../types/boolean_type":95,"../xpath_expression":102}],62:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var Context = require("../context");

var RelativeLocationPath = require("./relative_location_path");

module.exports = {
  evaluate: function (ast, context, type) {
    var nodes = XPathExpression.evaluate(ast.filter, context, type);

    if (ast.steps) {
      var nodeSets = [], node, iter = nodes.iterator();

      while ((node = iter.next())) {
        nodeSets.push(RelativeLocationPath.evaluate(ast, new Context(node), type));
      }

      nodes = nodeSets.reduce(function (previousValue, currentValue) {
        return previousValue.merge(currentValue);
      });
    }

    return nodes;
  }
};

},{"../context":41,"../xpath_expression":102,"./relative_location_path":63}],63:[function(require,module,exports){
/* eslint-env node */

"use strict";

module.exports = {};

var Context = require("../context");

var NodeSetType = require("../types/node_set_type");

var Step = require("./step");

module.exports.evaluate = function (ast, context, type) {
  var nodeSet = new NodeSetType([context.getNode()]),
      nextNodeSet = new NodeSetType();

  if (ast.steps) {
    for (var i = 0; i < ast.steps.length; i++) {
      var node, iter = nodeSet.iterator();

      while ((node = iter.next())) {
        var stepResult = Step.evaluate(ast.steps[i], new Context(node), type);

        nextNodeSet = nextNodeSet.merge(stepResult);
      }

      nodeSet = nextNodeSet;
      nextNodeSet = new NodeSetType();
    }
  }

  return nodeSet;
};

},{"../context":41,"../types/node_set_type":96,"./step":64}],64:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathAnalyzer = require("xpath-analyzer");

var XPathExpression = require("../xpath_expression");

var Axes = require("../axes");

var Context = require("../context");

var NumberType = require("../types/number_type");

var NodeSetType = require("../types/node_set_type");

var Node = require("../node");

module.exports = {
  evaluate: function (step, context, type) {
    var nodes;

    var axisEvaluator = Axes[step.axis];

    if (axisEvaluator) {
      nodes = axisEvaluator.evaluate(context, type);
    } else {
      throw new Error("Unknown axis specifier " + step.axis);
    }

    if (step.test.name) {
      var name = step.test.name;

      nodes = nodes.filter(function (node) {
        return (name === "*" && node.getName()) || node.getName() === step.test.name;
      });
    }

    if (step.test.type && step.test.type !== XPathAnalyzer.NodeType.NODE) {
      var nodeType;

      switch (step.test.type) {
        case XPathAnalyzer.NodeType.COMMENT:
          nodeType = Node.COMMENT_NODE;
          break;

        case XPathAnalyzer.NodeType.PROCESSING_INSTRUCTION:
          nodeType = Node.PROCESSING_INSTRUCTION_NODE;
          break;

        case XPathAnalyzer.NodeType.TEXT:
          nodeType = Node.TEXT_NODE;
          break;

        default:
          throw new Error("Unknown node nodeType " + step.test.nodeType);
      }

      nodes = nodes.filter(function (node) {
        return node.getNodeType() === nodeType;
      });
    }

    if (step.predicates) {
      var reversed = (
          step.axis === XPathAnalyzer.AxisSpecifier.ANCESTOR ||
          step.axis === XPathAnalyzer.AxisSpecifier.ANCESTOR_OR_SELF ||
          step.axis === XPathAnalyzer.AxisSpecifier.PRECEDING ||
          step.axis === XPathAnalyzer.AxisSpecifier.PRECEDING_SIBLING);

      var node, position = 0, filteredNodes = [], iter = nodes.iterator(reversed);

      while ((node = iter.next())) {
        position++;

        var keep = step.predicates.every(function (predicate) {
          var result = XPathExpression.evaluate(predicate, new Context(node, position, nodes.length()), type);

          if (result === null) {
            return false;
          }

          if (result instanceof NumberType) {
            return result.asNumber() === position;
          } else {
            return result.asBoolean();
          }
        });

        if (keep) {
          filteredNodes.push(node);
        }
      }

      nodes = new NodeSetType(filteredNodes);
    }

    return nodes;
  }
};

},{"../axes":27,"../context":41,"../node":94,"../types/node_set_type":96,"../types/number_type":97,"../xpath_expression":102,"xpath-analyzer":25}],65:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (ast, context, type) {
    var lhs = XPathExpression.evaluate(ast.lhs, context, type);

    var rhs = XPathExpression.evaluate(ast.rhs, context, type);

    return new NumberType(lhs.asNumber() - rhs.asNumber());
  }
};

},{"../types/number_type":97,"../xpath_expression":102}],66:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("../xpath_expression");

module.exports = {
  evaluate: function (ast, context, type) {
    var lhs = XPathExpression.evaluate(ast.lhs, context, type);

    var rhs = XPathExpression.evaluate(ast.rhs, context, type);

    return lhs.merge(rhs);
  }
};

},{"../xpath_expression":102}],67:[function(require,module,exports){
/* eslint-env node */

module.exports = {};

/* eslint-disable no-underscore-dangle */
var Boolean_ = require("./functions/boolean");
/* eslint-enable no-underscore-dangle */

var Ceiling = require("./functions/ceiling");

var Concat = require("./functions/concat");

var Contains = require("./functions/contains");

var Count = require("./functions/count");

var False = require("./functions/false");

var Floor = require("./functions/floor");

var Id = require("./functions/id");

var Last = require("./functions/last");

var LocalName = require("./functions/local_name");

var Name = require("./functions/name");

var NormalizeSpace = require("./functions/normalize_space");

var Not = require("./functions/not");

/* eslint-disable no-underscore-dangle */
var Number_ = require("./functions/number");
/* eslint-enable no-underscore-dangle */

var Position = require("./functions/position");

var Round = require("./functions/round");

var StartsWith = require("./functions/starts_with");

var StringLength = require("./functions/string_length");

/* eslint-disable no-underscore-dangle */
var String_ = require("./functions/string");
/* eslint-enable no-underscore-dangle */

var SubstringAfter = require("./functions/substring_after");

var SubstringBefore = require("./functions/substring_before");

var Substring = require("./functions/substring");

var Sum = require("./functions/sum");

var Translate = require("./functions/translate");

var True = require("./functions/true");

/* eslint-disable dot-notation */
module.exports["boolean"] = Boolean_;
module.exports["ceiling"] = Ceiling;
module.exports["concat"] = Concat;
module.exports["contains"] = Contains;
module.exports["count"] = Count;
module.exports["false"] = False;
module.exports["floor"] = Floor;
module.exports["id"] = Id;
module.exports["last"] = Last;
module.exports["local-name"] = LocalName;
module.exports["name"] = Name;
module.exports["normalize-space"] = NormalizeSpace;
module.exports["not"] = Not;
module.exports["number"] = Number_;
module.exports["position"] = Position;
module.exports["round"] = Round;
module.exports["starts-with"] = StartsWith;
module.exports["string-length"] = StringLength;
module.exports["string"] = String_;
module.exports["substring-after"] = SubstringAfter;
module.exports["substring-before"] = SubstringBefore;
module.exports["substring"] = Substring;
module.exports["sum"] = Sum;
module.exports["translate"] = Translate;
module.exports["true"] = True;
/* eslint-enable dot-notation */

},{"./functions/boolean":68,"./functions/ceiling":69,"./functions/concat":70,"./functions/contains":71,"./functions/count":72,"./functions/false":73,"./functions/floor":74,"./functions/id":75,"./functions/last":76,"./functions/local_name":77,"./functions/name":78,"./functions/normalize_space":79,"./functions/not":80,"./functions/number":81,"./functions/position":82,"./functions/round":83,"./functions/starts_with":84,"./functions/string":85,"./functions/string_length":86,"./functions/substring":87,"./functions/substring_after":88,"./functions/substring_before":89,"./functions/sum":90,"./functions/translate":91,"./functions/true":92}],68:[function(require,module,exports){
/* eslint-env node */

"use strict";

var BooleanType = require("../types/boolean_type");

module.exports = {
  evaluate: function (context, value) {
    if (!value) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    return new BooleanType(value.asBoolean());
  }
};

},{"../types/boolean_type":95}],69:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (context, number) {
    if (!number) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    if (!(number instanceof NumberType)) {
      throw new Error("Wrong type of argument");
    }

    return new NumberType(Math.ceil(number.asNumber()));
  }
};

},{"../types/number_type":97}],70:[function(require,module,exports){
/* eslint-env node */

"use strict";

var StringType = require("../types/string_type");

module.exports = {
  evaluate: function () {
    var args = [].slice.call(arguments);

    args.shift();

    if (args.length === 0) {
      throw new Error("Expected some arguments");
    }

    args = args.map(function (arg) {
      return arg.asString();
    });

    return new StringType(args.join(""));
  }
};

},{"../types/string_type":98}],71:[function(require,module,exports){
/* eslint-env node */

"use strict";

var BooleanType = require("../types/boolean_type");

module.exports = {
  evaluate: function (context, base, contains) {
    if (!contains) {
      throw new Error("Expected two arguments");
    }

    base = base.asString();

    contains = contains.asString();

    return new BooleanType(base.indexOf(contains) !== -1);
  }
};

},{"../types/boolean_type":95}],72:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NodeSetType = require("../types/node_set_type");

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (context, nodeset) {
    if (!nodeset) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    if (!(nodeset instanceof NodeSetType)) {
      throw new Error("Wrong type of argument");
    }

    return new NumberType(nodeset.length());
  }
};

},{"../types/node_set_type":96,"../types/number_type":97}],73:[function(require,module,exports){
/* eslint-env node */

"use strict";

var BooleanType = require("../types/boolean_type");

module.exports = {
  evaluate: function () {
    return new BooleanType(false);
  }
};

},{"../types/boolean_type":95}],74:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (context, number) {
    if (!number) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    if (!(number instanceof NumberType)) {
      throw new Error("Wrong type of argument");
    }

    return new NumberType(Math.floor(number.asNumber()));
  }
};

},{"../types/number_type":97}],75:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NodeSetType = require("../types/node_set_type");

var StringType = require("../types/string_type");

module.exports = {
  evaluate: function (context, value) {
    if (!value) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    var node, ids = [];

    if (value instanceof NodeSetType) {
      var iter = value.iterator();

      while ((node = iter.next())) {
        ids = ids.concat(node.asString().split(/\s+/g));
      }
    } else if (value instanceof StringType) {
      ids = value.asString().split(/\s+/g);
    } else {
      ids.push(value.asString());
    }

    var nodes = new NodeSetType();

    for (var i = 0; i < ids.length; i++) {
      node = context.getNode().getOwnerDocument().getElementById(ids[i]);

      if (node) {
        nodes = nodes.merge(new NodeSetType([node]));
      }
    }

    return nodes;
  }
};

},{"../types/node_set_type":96,"../types/string_type":98}],76:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (context) {
    return new NumberType(context.getLast());
  }
};

},{"../types/number_type":97}],77:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NodeSetType = require("../types/node_set_type");

var StringType = require("../types/number_type");

module.exports = {
  evaluate: function (context, nodeset) {
    if (!nodeset) {
      nodeset = new NodeSetType([context.getNode()]);
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    if (!(nodeset instanceof NodeSetType)) {
      throw new Error("Wrong type of argument");
    }

    if (nodeset.empty()) {
      return new StringType("");
    } else {
      return new StringType(nodeset.first().getName());
    }
  }
};

},{"../types/node_set_type":96,"../types/number_type":97}],78:[function(require,module,exports){
/* eslint-env node */

"use strict";

var StringType = require("../types/string_type");

var NodeSetType = require("../types/node_set_type");

module.exports = {
  evaluate: function (context, nodeset) {
    if (!nodeset) {
      return new StringType(context.getNode().getName());
    } else {
      if (arguments.length > 2) {
        throw new Error("Unknown argument(s)");
      }

      if (!(nodeset instanceof NodeSetType)) {
        throw new Error("Wrong type of argument");
      }

      if (nodeset.empty()) {
        return new StringType("");
      } else {
        return new StringType(nodeset.first().getName());
      }
    }
  }
};

},{"../types/node_set_type":96,"../types/string_type":98}],79:[function(require,module,exports){
/* eslint-env node */

"use strict";

var StringType = require("../types/string_type");

module.exports = {
  evaluate: function (context, value) {
    var string;

    if (!value) {
      string = context.getNode().asString();
    } else {
      if (arguments.length > 2) {
        throw new Error("Unknown argument(s)");
      }

      string = value.asString();
    }

    return new StringType(string.trim().replace(/\s{2,}/g, " "));
  }
};

},{"../types/string_type":98}],80:[function(require,module,exports){
/* eslint-env node */

"use strict";

var BooleanType = require("../types/boolean_type");

module.exports = {
  evaluate: function (context, value) {
    if (!value) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    return new BooleanType(!value.asBoolean());
  }
};

},{"../types/boolean_type":95}],81:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (context, value) {
    if (!value) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    return new NumberType(value.asNumber());
  }
};

},{"../types/number_type":97}],82:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (context) {
    return new NumberType(context.getPosition());
  }
};

},{"../types/number_type":97}],83:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (context, number) {
    if (!number) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    if (!(number instanceof NumberType)) {
      throw new Error("Wrong type of argument");
    }

    return new NumberType(Math.round(number.asNumber()));
  }
};

},{"../types/number_type":97}],84:[function(require,module,exports){
/* eslint-env node */

"use strict";

var BooleanType = require("../types/boolean_type");

module.exports = {
  evaluate: function (context, base, substring) {
    if (!substring) {
      throw new Error("Expected two arguments");
    }

    base = base.asString();

    substring = substring.asString();

    var index = base.indexOf(substring);

    return new BooleanType(index === 0);
  }
};

},{"../types/boolean_type":95}],85:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NodeSetType = require("../types/node_set_type");

var StringType = require("../types/string_type");

module.exports = {
  evaluate: function (context, value) {
    if (!value) {
      value = new NodeSetType([context.getNode()]);
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    return new StringType(value.asString());
  }
};

},{"../types/node_set_type":96,"../types/string_type":98}],86:[function(require,module,exports){
/* eslint-env node */

"use strict";

var StringType = require("../types/string_type");

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (context, string) {
    if (!string) {
      string = context.getNode().asString();
    } else {
      if (arguments.length > 2) {
        throw new Error("Unknown argument(s)");
      }

      if (!(string instanceof StringType)) {
        throw new Error("Wrong type of argument");
      }

      string = string.asString();
    }

    return new NumberType(string.length);
  }
};

},{"../types/number_type":97,"../types/string_type":98}],87:[function(require,module,exports){
/* eslint-env node */

"use strict";

var StringType = require("../types/string_type");

module.exports = {
  evaluate: function (context, base, start, length) {
    if (!start) {
      throw new Error("Expected two or three arguments");
    }

    base = base.asString();

    start = Math.round(start.asNumber());

    if (isNaN(start) || start === Infinity || start === -Infinity) {
      return new StringType("");
    }

    if (length) {
      length = Math.round(length.asNumber());

      if (isNaN(length) || length === -Infinity) {
        return new StringType("");
      }
    }

    if (length) {
      return new StringType(base.substring(start - 1, start + length - 1));
    } else {
      return new StringType(base.substring(start - 1));
    }
  }
};

},{"../types/string_type":98}],88:[function(require,module,exports){
/* eslint-env node */

"use strict";

var StringType = require("../types/string_type");

module.exports = {
  evaluate: function (context, base, substring) {
    if (!substring) {
      throw new Error("Expected two arguments");
    }

    base = base.asString();

    substring = substring.asString();

    var index = base.indexOf(substring);

    if (index === -1) {
      return new StringType("");
    } else {
      return new StringType(base.substring(index + substring.length));
    }
  }
};

},{"../types/string_type":98}],89:[function(require,module,exports){
/* eslint-env node */

"use strict";

var StringType = require("../types/string_type");

module.exports = {
  evaluate: function (context, base, substring) {
    if (!substring) {
      throw new Error("Expected two arguments");
    }

    base = base.asString();

    substring = substring.asString();

    var index = base.indexOf(substring);

    if (index === -1) {
      return new StringType("");
    } else {
      return new StringType(base.substring(0, index));
    }
  }
};

},{"../types/string_type":98}],90:[function(require,module,exports){
/* eslint-env node */

"use strict";

var NodeSetType = require("../types/node_set_type");

var NumberType = require("../types/number_type");

module.exports = {
  evaluate: function (context, nodeset) {
    if (!nodeset) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    if (!(nodeset instanceof NodeSetType)) {
      throw new Error("Wrong type of argument");
    }

    var sum = 0, node, iter = nodeset.iterator();

    while ((node = iter.next())) {
      sum = sum + node.asNumber();
    }

    return new NumberType(sum);
  }
};

},{"../types/node_set_type":96,"../types/number_type":97}],91:[function(require,module,exports){
/* eslint-env node */

"use strict";

var StringType = require("../types/string_type");

module.exports = {
  evaluate: function (context, base, mapFrom, mapTo) {
    if (!mapTo) {
      throw new Error("Expected three arguments");
    }

    if (!(base instanceof StringType) ||
        !(mapFrom instanceof StringType) ||
        !(mapTo instanceof StringType)) {
      throw new Error("Expected string arguments");
    }

    base = base.asString();

    mapFrom = mapFrom.asString();

    mapTo = mapTo.asString();

    for (var i = 0; i < mapFrom.length; i++) {
      if (i < mapTo.length) {
        base = base.replace(new RegExp(mapFrom[i], "g"), mapTo[i]);
      } else {
        base = base.replace(new RegExp(mapFrom[i], "g"), "");
      }
    }

    return new StringType(base);
  }
};

},{"../types/string_type":98}],92:[function(require,module,exports){
/* eslint-env node */

"use strict";

var BooleanType = require("../types/boolean_type");

module.exports = {
  evaluate: function () {
    return new BooleanType(true);
  }
};

},{"../types/boolean_type":95}],93:[function(require,module,exports){
/* eslint-env node */

/* eslint-disable no-underscore-dangle */

"use strict";

function Iterator (list, reversed) {
  this.list = list;
  this.reversed = reversed;
  this.current = reversed ? list.last() : list.first();
  this.lastReturned = null;
  this.i = 0;
}

Iterator.prototype.next = function () {
  this.i++;

  if (this.i > 10000) {
    throw new Error("An error has probably ocurred!");
  }

  if (this.current) {
    this.lastReturned = this.current;

    if (this.reversed) {
      this.current = this.current.previous;
    } else {
      this.current = this.current.next;
    }

    return this.lastReturned;
  }
};

Iterator.prototype.remove = function () {
  if (!this.lastReturned) {
    throw new Error("remove was called before iterating!");
  }

  var next = this.lastReturned.next,
      previous = this.lastReturned.previous;

  if (next) {
    next.previous = previous;
  } else {
    this.list.last_ = previous;
  }

  if (previous) {
    previous.next = next;
  } else {
    this.list.first_ = next;
  }

  this.lastReturned = null;
  this.list.length_--;
};

module.exports = Iterator;

},{}],94:[function(require,module,exports){
/* eslint-env node */

module.exports = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  CDATA_SECTION_NODE: 4,
  ENTITY_REFERENCE_NODE: 5,
  ENTITY_NODE: 6,
  PROCESSING_INSTRUCTION_NODE: 7,
  COMMENT_NODE: 8,
  DOCUMENT_NODE: 9,
  DOCUMENT_TYPE_NODE: 10,
  DOCUMENT_FRAGMENT_NODE: 11,
  NOTATION_NODE: 12
};

},{}],95:[function(require,module,exports){
/* eslint-env node */

"use strict";

function BooleanType (value) {
  this.value = value;
}

BooleanType.prototype.asString = function () {
  return "" + this.value;
};

BooleanType.prototype.asNumber = function () {
  return this.value ? 1 : 0;
};

BooleanType.prototype.asBoolean = function () {
  return this.value;
};

module.exports = BooleanType;

},{}],96:[function(require,module,exports){
/* eslint-env node */

/* eslint-disable no-underscore-dangle */

"use strict";

var Adapter = require("../adapter");

var Iterator = require("../iterator");

function NodeSetType (value) {
  this.first_ = null;
  this.last_ = null;
  this.length_ = 0;

  if (value) {
    value.forEach(function (node) {
      this.push(node);
    }, this);
  }
}

NodeSetType.prototype.iterator = function (reversed) {
  return new Iterator(this, reversed);
};

NodeSetType.prototype.first = function () {
  return this.first_;
};

NodeSetType.prototype.last = function () {
  return this.last_;
};

NodeSetType.prototype.length = function () {
  return this.length_;
};

NodeSetType.prototype.empty = function () {
  return this.length() === 0;
};

NodeSetType.prototype.asString = function () {
  if (this.empty()) {
    return "";
  } else {
    return this.first().asString();
  }
};

NodeSetType.prototype.asNumber = function () {
  return +this.asString();
};

NodeSetType.prototype.asBoolean = function () {
  return this.length() !== 0;
};

NodeSetType.prototype.merge = function (b) {
  return NodeSetType.merge(this, b);
};

NodeSetType.prototype.push = function (node) {
  node.next = null;
  node.previous = this.last_;

  if (this.first_) {
    this.last_.next = node;
  } else {
    this.first_ = node;
  }

  this.last_ = node;
  this.length_++;

  return this;
};

NodeSetType.prototype.unshift = function (node) {
  node.previous = null;
  node.next = this.first_;

  if (this.first_) {
    this.first_.previous = node;
  } else {
    this.last_ = node;
  }

  this.first_ = node;
  this.length_++;

  return this;
};

NodeSetType.prototype.filter = function (condition) {
  var node, iter = this.iterator();

  while ((node = iter.next())) {
    if (!condition(node)) {
      iter.remove();
    }
  }

  return this;
};

NodeSetType.merge = function (a, b) {
  var comparator = Adapter.getAdapter().compareDocumentPosition;

  if (comparator) {
    return NodeSetType.mergeWithOrder(a, b, comparator);
  } else {
    return NodeSetType.mergeWithoutOrder(a, b);
  }
};

NodeSetType.mergeWithOrder = function (a, b, comparator) {
  if (!a.first_) {
    return b;
  } else if (!b.first_) {
    return a;
  }

  var aCurr = a.first_;
  var bCurr = b.first_;
  var merged = a, tail = null, next = null, length = 0;

  while (aCurr && bCurr) {
    if (aCurr.getNativeNode() === bCurr.getNativeNode()) {
      next = aCurr;
      aCurr = aCurr.next;
      bCurr = bCurr.next;
    } else {
      var compareResult = comparator(aCurr, bCurr);

      if (compareResult > 0) {
        next = bCurr;
        bCurr = bCurr.next;
      } else {
        next = aCurr;
        aCurr = aCurr.next;
      }
    }

    next.previous = tail;

    if (tail) {
      tail.next = next;
    } else {
      merged.first_ = next;
    }

    tail = next;
    length++;
  }

  next = aCurr || bCurr;

  while (next) {
    next.previous = tail;
    tail.next = next;
    tail = next;
    length++;
    next = next.next;
  }

  merged.last_ = tail;
  merged.length_ = length;

  return merged;
};

NodeSetType.mergeWithoutOrder = function (a, b) {
  var nodes = [], node, iter = a.iterator();

  while ((node = iter.next())) {
    nodes.push(node);
  }

  iter = b.iterator();

  while ((node = iter.next())) {
    var keep = nodes.every(function (addedNode) {
      return addedNode.getNativeNode() !== node.getNativeNode();
    });

    if (keep) {
      nodes.push(node);
    }
  }

  return new NodeSetType(nodes);
};

NodeSetType.prototype.toString = function () {
  var node, iter = this.iterator();

  var nodes = [];

  while ((node = iter.next())) {
    nodes.push("" + node);
  }

  return "NodeSet<" + nodes.join(", ") + ">";
};

module.exports = NodeSetType;

},{"../adapter":26,"../iterator":93}],97:[function(require,module,exports){
/* eslint-env node */

"use strict";

function NumberType (value) {
  this.value = value;
}

NumberType.prototype.asString = function () {
  return "" + this.value;
};

NumberType.prototype.asNumber = function () {
  return this.value;
};

NumberType.prototype.asBoolean = function () {
  return !!this.value;
};

module.exports = NumberType;

},{}],98:[function(require,module,exports){
/* eslint-env node */

"use strict";

function StringType (value) {
  this.value = value;
}

StringType.prototype.asString = function () {
  return this.value;
};

StringType.prototype.asNumber = function () {
  return +this.value;
};

StringType.prototype.asBoolean = function () {
  return this.value.length !== 0;
};

module.exports = StringType;

},{}],99:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathExpression = require("./xpath_expression");

var XPathResult = require("./xpath_result");

var Adapter = require("./adapter");

var Node = require("./node");

function throwNotImplemented () {
  throw new Error("Namespaces are not implemented");
}

module.exports = {
  evaluate: function (expression, context, nsResolver, type) {
    if (nsResolver) {
      throwNotImplemented();
    }

    var value = this.createExpression(expression).evaluate(context, type, Adapter.getAdapter());

    return new XPathResult(type, value);
  },

  createExpression: function (expression, nsResolver) {
    if (nsResolver) {
      throwNotImplemented();
    }

    return new XPathExpression(expression);
  },

  createNSResolver: function () {
    throwNotImplemented();
  },

  setAdapter: function (adapter) {
    Adapter.setAdapter(adapter);
  },

  XPathResult: XPathResult,

  Node: Node
};

},{"./adapter":26,"./node":94,"./xpath_expression":102,"./xpath_result":103}],100:[function(require,module,exports){
/* eslint-env node */

"use strict";

function XPathException (code, message) {
  this.code = code;
  this.message = message;
}

module.exports = XPathException;

},{}],101:[function(require,module,exports){
/* eslint-env node */

module.exports = {
  INVALID_EXPRESSION_ERR: 51,
  TYPE_ERR: 52
};

},{}],102:[function(require,module,exports){
/* eslint-env node */

"use strict";

function XPathExpression (expression) {
  this.expression = expression;
}

module.exports = XPathExpression;

var XPathAnalyzer = require("xpath-analyzer");

var Context = require("./context");

var Evaluators = require("./evaluators");

XPathExpression.evaluate = function (ast, context, type) {
  var evaluator = Evaluators[ast.type];

  return evaluator.evaluate(ast, context, type);
};

XPathExpression.prototype.evaluate = function (context, type, Adapter) {
  var ast = new XPathAnalyzer(this.expression).parse();

  return XPathExpression.evaluate(ast, new Context(new Adapter(context)), type);
};

},{"./context":41,"./evaluators":42,"xpath-analyzer":25}],103:[function(require,module,exports){
/* eslint-env node */

"use strict";

var XPathException = require("./xpath_exception");

var XPathExceptionCode = require("./xpath_exception_code");

var XPathResultType = require("./xpath_result_type");

var NodeSetType = require("./types/node_set_type");

var StringType = require("./types/string_type");

var NumberType = require("./types/number_type");

var BooleanType = require("./types/boolean_type");

function XPathResult (type, value) {
  this.value = value;

  if (type === XPathResultType.ANY_TYPE) {
    if (value instanceof NodeSetType) {
      this.resultType = XPathResultType.UNORDERED_NODE_ITERATOR_TYPE;
    } else if (value instanceof StringType) {
      this.resultType = XPathResultType.STRING_TYPE;
    } else if (value instanceof NumberType) {
      this.resultType = XPathResultType.NUMBER_TYPE;
    } else if (value instanceof BooleanType) {
      this.resultType = XPathResultType.BOOLEAN_TYPE;
    } else {
      throw new Error("Unexpected evaluation result");
    }
  } else {
    this.resultType = type;
  }

  if (this.resultType !== XPathResultType.STRING_TYPE &&
      this.resultType !== XPathResultType.NUMBER_TYPE &&
      this.resultType !== XPathResultType.BOOLEAN_TYPE &&
      !(value instanceof NodeSetType)) {
    throw Error("Value could not be converted to the specified type");
  }

  if (this.resultType === XPathResultType.UNORDERED_NODE_ITERATOR_TYPE ||
      this.resultType === XPathResultType.ORDERED_NODE_ITERATOR_TYPE ||
      this.resultType === XPathResultType.UNORDERED_NODE_SNAPSHOT_TYPE ||
      this.resultType === XPathResultType.ORDERED_NODE_SNAPSHOT_TYPE) {
    this.nodes = [];

    var node, iter = this.value.iterator();

    while ((node = iter.next())) {
      this.nodes.push(node.getNativeNode());
    }
  }

  var self = this;

  var hasDefineProperty = true;

  try {
    Object.defineProperty({}, "x", {});
  } catch (e) {
    hasDefineProperty = false;
  }

  if (hasDefineProperty) {
    Object.defineProperty(this, "numberValue", {get: function () {
      if (self.resultType !== XPathResultType.NUMBER_TYPE) {
        throw new XPathException(XPathExceptionCode.TYPE_ERR, "resultType is not NUMBER_TYPE");
      }

      return self.value.asNumber();
    }});

    Object.defineProperty(this, "stringValue", {get: function () {
      if (self.resultType !== XPathResultType.STRING_TYPE) {
        throw new XPathException(XPathExceptionCode.TYPE_ERR, "resultType is not STRING_TYPE");
      }

      return self.value.asString();
    }});

    Object.defineProperty(this, "booleanValue", {get: function () {
      if (self.resultType !== XPathResultType.BOOLEAN_TYPE) {
        throw new XPathException(XPathExceptionCode.TYPE_ERR, "resultType is not BOOLEAN_TYPE");
      }

      return self.value.asBoolean();
    }});

    Object.defineProperty(this, "singleNodeValue", {get: function () {
      if (self.resultType !== XPathResultType.FIRST_ORDERED_NODE_TYPE &&
          self.resultType !== XPathResultType.ANY_UNORDERED_NODE_TYPE) {
        throw new XPathException(XPathExceptionCode.TYPE_ERR, "resultType is not a node set");
      }

      return self.value.empty() ? null : self.value.first().getNativeNode();
    }});

    Object.defineProperty(this, "invalidIteratorState", {get: function () {
      throw new Error("invalidIteratorState is not implemented");
    }});

    Object.defineProperty(this, "snapshotLength", {get: function () {
      if (self.resultType !== XPathResultType.ORDERED_NODE_SNAPSHOT_TYPE &&
          self.resultType !== XPathResultType.UNORDERED_NODE_SNAPSHOT_TYPE) {
        throw new XPathException(XPathExceptionCode.TYPE_ERR, "resultType is not a node set");
      }

      return self.value.length();
    }});
  } else {
    if (self.resultType === XPathResultType.NUMBER_TYPE) {
      self.numberValue = self.value.asNumber();
    }

    if (self.resultType === XPathResultType.STRING_TYPE) {
      self.stringValue = self.value.asString();
    }

    if (self.resultType === XPathResultType.BOOLEAN_TYPE) {
      self.booleanValue = self.value.asBoolean();
    }

    if (self.resultType === XPathResultType.FIRST_ORDERED_NODE_TYPE ||
        self.resultType === XPathResultType.ANY_UNORDERED_NODE_TYPE) {
      self.singleNodeValue = self.value.empty() ? null : self.value.first().getNativeNode();
    }

    if (self.resultType === XPathResultType.ORDERED_NODE_SNAPSHOT_TYPE ||
        self.resultType === XPathResultType.UNORDERED_NODE_SNAPSHOT_TYPE) {
      self.snapshotLength = self.value.length();
    }
  }
}

XPathResult.prototype.iterateNext = function () {
  if (this.resultType !== XPathResultType.ORDERED_NODE_ITERATOR_TYPE &&
      this.resultType !== XPathResultType.UNORDERED_NODE_ITERATOR_TYPE) {
    throw new XPathException(XPathExceptionCode.TYPE_ERR, "iterateNext called with wrong result type");
  }

  this.index = this.index || 0;

  return (this.index.length >= this.nodes.length) ? null : this.nodes[this.index];
};

XPathResult.prototype.snapshotItem = function (index) {
  if (this.resultType !== XPathResultType.ORDERED_NODE_SNAPSHOT_TYPE &&
      this.resultType !== XPathResultType.UNORDERED_NODE_SNAPSHOT_TYPE) {
    throw new XPathException(XPathExceptionCode.TYPE_ERR, "snapshotItem called with wrong result type");
  }

  return this.nodes[index] || null;
};

for (var resultType in XPathResultType) {
  if (XPathResultType.hasOwnProperty(resultType)) {
    XPathResult[resultType] = XPathResultType[resultType];
  }
}

module.exports = XPathResult;

},{"./types/boolean_type":95,"./types/node_set_type":96,"./types/number_type":97,"./types/string_type":98,"./xpath_exception":100,"./xpath_exception_code":101,"./xpath_result_type":104}],104:[function(require,module,exports){
/* eslint-env node */

module.exports = {
  ANY_TYPE: 0,
  NUMBER_TYPE: 1,
  STRING_TYPE: 2,
  BOOLEAN_TYPE: 3,
  UNORDERED_NODE_ITERATOR_TYPE: 4,
  ORDERED_NODE_ITERATOR_TYPE: 5,
  UNORDERED_NODE_SNAPSHOT_TYPE: 6,
  ORDERED_NODE_SNAPSHOT_TYPE: 7,
  ANY_UNORDERED_NODE_TYPE: 8,
  FIRST_ORDERED_NODE_TYPE: 9
};

},{}],105:[function(require,module,exports){
/* eslint-env node */

"use strict";

function XPathLexer (expression) {
  this.tokens = XPathLexer.tokenize(expression);
  this.index = 0;
}

XPathLexer.prototype.next = function () {
  return this.tokens[this.index++];
};

XPathLexer.prototype.back = function () {
  this.index--;
};

XPathLexer.prototype.peak = function (n) {
  return this.tokens[this.index + (n || 0)];
};

XPathLexer.prototype.empty = function () {
  return this.tokens.length <= this.index;
};

XPathLexer.tokenize = function (expression) {
  var match = expression.match(new RegExp([
    "\\$?(?:(?![0-9-])[\\w-]+:)?(?![0-9-])[\\w-]+",
    "\\d+\\.\\d+",
    "\\.\\d+",
    "\\d+",
    "\\/\\/",
    "\/",
    "\\.\\.",
    "\\.",
    "\\s+",
    "::",
    ",",
    "@",
    "-",
    "=",
    "!=",
    "<=",
    "<",
    ">=",
    ">",
    "\\|",
    "\\+",
    "\\*",
    "\\(",
    "\\)",
    "\\[",
    "\\]",
    "\"[^\"]*\"",
    "'[^']*'"
  ].join("|"), "g"));

  if (!match || match.join("") !== expression) {
    throw new Error("Invalid XPath expression");
  }

  return match.filter(function (token) {
    return !/^\s+$/.test(token);
  });
};

module.exports = XPathLexer;

},{}],106:[function(require,module,exports){
/* eslint-env node */

var XPathEvaluator = require("xpath-evaluator");

var XPathDOM = require("./lib/xpath_dom");

XPathEvaluator.setAdapter(XPathDOM);

module.exports = XPathEvaluator;

},{"./lib/xpath_dom":2,"xpath-evaluator":99}]},{},[1])(1)
});