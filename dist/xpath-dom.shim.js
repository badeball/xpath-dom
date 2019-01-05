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

},{"./register":108}],2:[function(require,module,exports){
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
  if (a.getNativeNode() instanceof Attr) {
    a = a.getParent();
  }

  if (b.getNativeNode() instanceof Attr) {
    b = b.getParent();
  }

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

},{}],3:[function(require,module,exports){
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
  SELF: "self"
};

},{}],4:[function(require,module,exports){
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
module.exports = {
  COMMENT: "comment",
  NODE: "node",
  PROCESSING_INSTRUCTION: "processing-instruction",
  TEXT: "text"
};

},{}],6:[function(require,module,exports){
"use strict";

var AxisSpecifier = require("../axis_specifier");

var ExprType = require("../expr_type");

var NodeType = require("../node_type");

var Step = require("./step");

module.exports = {
  parse: function (rootParser, lexer) {
    var absoluteLocation = {
      type: ExprType.ABSOLUTE_LOCATION_PATH
    };

    while (!lexer.empty() && lexer.peak()[0] === "/") {
      if (!absoluteLocation.steps) {
        absoluteLocation.steps = [];
      }

      if (lexer.next() === "/") {
        if (Step.isValidOp(lexer)) {
          absoluteLocation.steps.push(Step.parse(rootParser, lexer));
        }
      } else {
        absoluteLocation.steps.push({
          axis: AxisSpecifier.DESCENDANT_OR_SELF,
          test: {
            type: NodeType.NODE
          }
        });

        absoluteLocation.steps.push(Step.parse(rootParser, lexer));
      }
    }

    return absoluteLocation;
  }
};

},{"../axis_specifier":3,"../expr_type":4,"../node_type":5,"./step":22}],7:[function(require,module,exports){
"use strict";

var ExprType = require("../expr_type");

var MultiplicativeExpr = require("./multiplicative_expr");

module.exports = {
  parse: function (rootParser, lexer) {
    var lhs = MultiplicativeExpr.parse(rootParser, lexer);

    var additiveTypes = {
      "+": ExprType.ADDITIVE,
      "-": ExprType.SUBTRACTIVE
    };

    if (additiveTypes.hasOwnProperty(lexer.peak())) {
      var op = lexer.next();

      var rhs = module.exports.parse(rootParser, lexer);

      return {
        type: additiveTypes[op],
        lhs: lhs,
        rhs: rhs
      };
    } else {
      return lhs;
    }
  }
};

},{"../expr_type":4,"./multiplicative_expr":14}],8:[function(require,module,exports){
"use strict";

var ExprType = require("../expr_type");

var EqualityExpr = require("./equality_expr");

module.exports = {
  parse: function (rootParser, lexer) {
    var lhs = EqualityExpr.parse(rootParser, lexer);

    if (lexer.peak() === "and") {
      lexer.next();

      var rhs = module.exports.parse(rootParser, lexer);

      return {
        type: ExprType.AND,
        lhs: lhs,
        rhs: rhs
      };
    } else {
      return lhs;
    }
  }
};

},{"../expr_type":4,"./equality_expr":9}],9:[function(require,module,exports){
"use strict";

var ExprType = require("../expr_type");

var RelationalExpr = require("./relational_expr");

module.exports = {
  parse: function (rootParser, lexer) {
    var lhs = RelationalExpr.parse(rootParser, lexer);

    var equalityTypes = {
      "=": ExprType.EQUALITY,
      "!=": ExprType.INEQUALITY
    };

    if (equalityTypes.hasOwnProperty(lexer.peak())) {
      var op = lexer.next();

      var rhs = module.exports.parse(rootParser, lexer);

      return {
        type: equalityTypes[op],
        lhs: lhs,
        rhs: rhs
      };
    } else {
      return lhs;
    }
  }
};

},{"../expr_type":4,"./relational_expr":20}],10:[function(require,module,exports){
"use strict";

var OrExpr = require("./or_expr");

module.exports = {
  parse: function (lexer) {
    return OrExpr.parse(module.exports, lexer);
  }
};

},{"./or_expr":16}],11:[function(require,module,exports){
"use strict";

var ExprType = require("../expr_type");

var Predicate = require("./predicate");

var PrimaryExpr = require("./primary_expr");

module.exports = {
  parse: function (rootParser, lexer) {
    var primary = PrimaryExpr.parse(rootParser, lexer);

    if (lexer.peak() === "[") {
      var filter = {
        type: ExprType.FILTER,
        primary: primary,
        predicates: []
      };

      while (lexer.peak() === "[") {
        filter.predicates.push(Predicate.parse(rootParser, lexer));
      }

      return filter;
    } else {
      return primary;
    }
  },

  isValidOp: function (lexer) {
    return PrimaryExpr.isValidOp(lexer);
  }
};

},{"../expr_type":4,"./predicate":18,"./primary_expr":19}],12:[function(require,module,exports){
"use strict";

var ExprType = require("../expr_type");

module.exports = {
  parse: function (rootParser, lexer) {
    var functionCall = {
      type: ExprType.FUNCTION_CALL,
      name: lexer.next()
    };

    lexer.next();

    if (lexer.peak() === ")") {
      lexer.next();
    } else {
      functionCall.args = [];

      while (lexer.peak() !== ")") {
        functionCall.args.push(rootParser.parse(lexer));

        if (lexer.peak() === ",") {
          lexer.next();
        }
      }

      lexer.next();
    }

    return functionCall;
  }
};

},{"../expr_type":4}],13:[function(require,module,exports){
"use strict";

var AbsoluteLocationPath = require("./absolute_location_path");

var RelativeLocationPath = require("./relative_location_path");

module.exports = {
  parse: function (rootParser, lexer) {
    var token = lexer.peak(),
        ch = token && token[0];

    if (ch === "/") {
      return AbsoluteLocationPath.parse(rootParser, lexer);
    } else {
      return RelativeLocationPath.parse(rootParser, lexer);
    }
  }
};

},{"./absolute_location_path":6,"./relative_location_path":21}],14:[function(require,module,exports){
"use strict";

var ExprType = require("../expr_type");

var UnaryExpr = require("./unary_expr");

module.exports = {
  parse: function (rootParser, lexer) {
    var lhs = UnaryExpr.parse(rootParser, lexer);

    var multiplicativeTypes = {
      "*": ExprType.MULTIPLICATIVE,
      "div": ExprType.DIVISIONAL,
      "mod": ExprType.MODULUS
    };

    if (multiplicativeTypes.hasOwnProperty(lexer.peak())) {
      var op = lexer.next();

      var rhs = module.exports.parse(rootParser, lexer);

      return {
        type: multiplicativeTypes[op],
        lhs: lhs,
        rhs: rhs
      };
    } else {
      return lhs;
    }
  }
};

},{"../expr_type":4,"./unary_expr":23}],15:[function(require,module,exports){
"use strict";

var NodeType = require("../node_type");

var NodeTypeValidator = require("../validators/node_type");

module.exports = {
  parse: function (rootParser, lexer) {
    if (lexer.peak() === "*") {
      lexer.next();

      return {
        name: "*"
      };
    }

    if (lexer.peak(1) === "(") {
      if (NodeTypeValidator.isValid(lexer.peak())) {
        var test = {
          type: lexer.next()
        };

        lexer.next();

        if (test.type === NodeType.PROCESSING_INSTRUCTION) {
          var token = lexer.peak(),
              ch = token && token[0];

          if (ch === "\"" || ch === "'") {
            test.name = lexer.next().slice(1, -1);
          }
        }

        if (lexer.peak() !== ")") {
          throw new Error("Invalid token at position " + lexer.position() + ", expected closing parenthesis");
        } else {
          lexer.next();
        }

        return test;
      } else {
        throw new Error("Invalid node type at position " + lexer.position());
      }
    }

    return {
      name: lexer.next()
    };
  }
};

},{"../node_type":5,"../validators/node_type":26}],16:[function(require,module,exports){
"use strict";

var ExprType = require("../expr_type");

var AndExpr = require("./and_expr");

module.exports = {
  parse: function (rootParser, lexer) {
    var lhs = AndExpr.parse(rootParser, lexer);

    if (lexer.peak() === "or") {
      lexer.next();

      var rhs = module.exports.parse(rootParser, lexer);

      return {
        type: ExprType.OR,
        lhs: lhs,
        rhs: rhs
      };
    } else {
      return lhs;
    }
  }
};

},{"../expr_type":4,"./and_expr":8}],17:[function(require,module,exports){
"use strict";

var AxisSpecifier = require("../axis_specifier");

var ExprType = require("../expr_type");

var NodeType = require("../node_type");

var FilterExpr = require("./filter_expr");

var LocationPath = require("./location_path");

var Step = require("./step");

module.exports = {
  parse: function (rootParser, lexer) {
    if (FilterExpr.isValidOp(lexer)) {
      var filter = FilterExpr.parse(rootParser, lexer);

      if (!lexer.empty() && lexer.peak()[0] === "/") {
        var path = {
          type: ExprType.PATH,
          filter: filter,
          steps: []
        };

        while (!lexer.empty() && lexer.peak()[0] === "/") {
          if (lexer.next() === "//") {
            path.steps.push({
              axis: AxisSpecifier.DESCENDANT_OR_SELF,
              test: {
                type: NodeType.NODE
              }
            });
          }

          path.steps.push(Step.parse(rootParser, lexer));
        }

        return path;
      } else {
        return filter;
      }
    } else {
      return LocationPath.parse(rootParser, lexer);
    }
  }
};

},{"../axis_specifier":3,"../expr_type":4,"../node_type":5,"./filter_expr":11,"./location_path":13,"./step":22}],18:[function(require,module,exports){
"use strict";

module.exports = {
  parse: function (rootParser, lexer) {
    lexer.next();

    var predicate = rootParser.parse(lexer);

    if (lexer.peak() === "]") {
      lexer.next();
    } else {
      throw new Error("Invalid token at position " + lexer.position() + ", expected closing bracket");
    }

    return predicate;
  }
};

},{}],19:[function(require,module,exports){
"use strict";

var ExprType = require("../expr_type");

var NodeTypeValidator = require("../validators/node_type");

var FunctionCall = require("./function_call");

module.exports = {
  parse: function (rootParser, lexer) {
    var token = lexer.peak(),
        ch = token && token[0];

    if (ch === "(") {
      lexer.next();

      var expr = rootParser.parse(lexer);

      if (lexer.peak() === ")") {
        lexer.next();
      } else {
        throw new Error("Invalid token at position " + lexer.position() + ", expected closing parenthesis");
      }

      return expr;
    }

    if (ch === "\"" || ch === "'") {
      lexer.next();

      return {
        type: ExprType.LITERAL,
        string: token.slice(1, -1)
      };
    }

    if (ch === "$") {
      throw Error("Variable reference are not implemented");
    }

    if (/^\d+$/.test(token) || /^(\d+)?\.\d+$/.test(token)) {
      lexer.next();

      return {
        type: ExprType.NUMBER,
        number: parseFloat(token)
      };
    }

    if (lexer.peak(1) === "(" && !NodeTypeValidator.isValid(lexer.peak())) {
      return FunctionCall.parse(rootParser, lexer);
    }
  },

  isValidOp: function (lexer) {
    var token = lexer.peak(),
        ch = token && token[0];

    return ch === "(" ||
      ch === "\"" ||
      ch === "'" ||
      ch === "$" ||
      /^\d+$/.test(token) ||
      /^(\d+)?\.\d+$/.test(token) ||
      (lexer.peak(1) === "(" && !NodeTypeValidator.isValid(lexer.peak()));
  }
};

},{"../expr_type":4,"../validators/node_type":26,"./function_call":12}],20:[function(require,module,exports){
"use strict";

var ExprType = require("../expr_type");

var AdditiveExpr = require("./additive_expr");

module.exports = {
  parse: function (rootParser, lexer) {
    var lhs = AdditiveExpr.parse(rootParser, lexer);

    var relationalTypes = {
      "<": ExprType.LESS_THAN,
      ">": ExprType.GREATER_THAN,
      "<=": ExprType.LESS_THAN_OR_EQUAL,
      ">=": ExprType.GREATER_THAN_OR_EQUAL
    };

    if (relationalTypes.hasOwnProperty(lexer.peak())) {
      var op = lexer.next();

      var rhs = module.exports.parse(rootParser, lexer);

      return {
        type: relationalTypes[op],
        lhs: lhs,
        rhs: rhs
      };
    } else {
      return lhs;
    }
  }
};

},{"../expr_type":4,"./additive_expr":7}],21:[function(require,module,exports){
"use strict";

var AxisSpecifier = require("../axis_specifier");

var ExprType = require("../expr_type");

var NodeType = require("../node_type");

var Step = require("./step");

module.exports = {
  parse: function (rootParser, lexer) {
    var relativeLocation = {
      type: ExprType.RELATIVE_LOCATION_PATH
    };

    relativeLocation.steps = [Step.parse(rootParser, lexer)];

    while (!lexer.empty() && lexer.peak()[0] === "/") {
      if (lexer.next() === "//") {
        relativeLocation.steps.push({
          axis: AxisSpecifier.DESCENDANT_OR_SELF,
          test: {
            type: NodeType.NODE
          }
        });
      }

      relativeLocation.steps.push(Step.parse(rootParser, lexer));
    }

    return relativeLocation;
  }
};

},{"../axis_specifier":3,"../expr_type":4,"../node_type":5,"./step":22}],22:[function(require,module,exports){
"use strict";

var AxisSpecifier = require("../axis_specifier");

var AxisSpecifierValidator = require("../validators/axis_specifier");

var NodeType = require("../node_type");

var NodeTest = require("./node_test");

var Predicate = require("./predicate");

module.exports = {
  parse: function (rootParser, lexer) {
    var step = {};

    if (lexer.peak(1) === "::") {
      if (AxisSpecifierValidator.isValid(lexer.peak())) {
        step.axis = lexer.next();

        lexer.next();
      } else {
        throw new Error("Invalid axis specifier at position " + lexer.position());
      }
    } else if (lexer.peak() === "@") {
      lexer.next();

      step.axis = AxisSpecifier.ATTRIBUTE;
    } else if (lexer.peak() === "..") {
      lexer.next();

      return {
        axis: AxisSpecifier.PARENT,
        test: {
          type: NodeType.NODE
        }
      };
    } else if (lexer.peak() === ".") {
      lexer.next();

      return {
        axis: AxisSpecifier.SELF,
        test: {
          type: NodeType.NODE
        }
      };
    } else {
      step.axis = AxisSpecifier.CHILD;
    }

    step.test = NodeTest.parse(rootParser, lexer);

    while (lexer.peak() === "[") {
      if (!step.predicates) {
        step.predicates = [];
      }

      step.predicates.push(Predicate.parse(rootParser, lexer));
    }

    return step;
  },

  isValidOp: function (lexer) {
    var token = lexer.peak();

    if (typeof token !== "string") {
      return false;
    }

    return token === "." ||
      token === ".." ||
      token === "@" ||
      token === "*" ||
      /^\w/.test(token);
  }
};

},{"../axis_specifier":3,"../node_type":5,"../validators/axis_specifier":25,"./node_test":15,"./predicate":18}],23:[function(require,module,exports){
"use strict";

var ExprType = require("../expr_type");

var UnionExpr = require("./union_expr");

module.exports = {
  parse: function (rootParser, lexer) {
    if (lexer.peak() === "-") {
      lexer.next();

      return {
        type: ExprType.NEGATION,
        lhs: module.exports.parse(rootParser, lexer)
      };
    } else {
      return UnionExpr.parse(rootParser, lexer);
    }
  }
};

},{"../expr_type":4,"./union_expr":24}],24:[function(require,module,exports){
"use strict";

var ExprType = require("../expr_type");

var PathExpr = require("./path_expr");

module.exports = {
  parse: function (rootParser, lexer) {
    var lhs = PathExpr.parse(rootParser, lexer);

    if (lexer.peak() === "|") {
      lexer.next();

      var rhs = module.exports.parse(rootParser, lexer);

      return {
        type: ExprType.UNION,
        lhs: lhs,
        rhs: rhs
      };
    } else {
      return lhs;
    }
  }
};

},{"../expr_type":4,"./path_expr":17}],25:[function(require,module,exports){
"use strict";

var AxisSpecifier = require("../axis_specifier");

module.exports = {
  isValid: function (specifier) {
    for (var property in AxisSpecifier) {
      if (AxisSpecifier.hasOwnProperty(property) && AxisSpecifier[property] === specifier) {
        return true;
      }
    }

    return false;
  }
};

},{"../axis_specifier":3}],26:[function(require,module,exports){
"use strict";

var NodeType = require("../node_type");

module.exports = {
  isValid: function (type) {
    for (var property in NodeType) {
      if (NodeType.hasOwnProperty(property) && NodeType[property] === type) {
        return true;
      }
    }

    return false;
  }
};

},{"../node_type":5}],27:[function(require,module,exports){
"use strict";

var XPathLexer = require("xpath-lexer");

var AxisSpecifier = require("./axis_specifier");

var ExprType = require("./expr_type");

var NodeType = require("./node_type");

var Expr = require("./parsers/expr");

function XPathAnalyzer (expression) {
  this.lexer = new XPathLexer(expression);
}

XPathAnalyzer.prototype.parse = function () {
  var ast = Expr.parse(this.lexer);

  if (this.lexer.empty()) {
    return ast;
  } else {
    throw new Error("Unexpected token at position " + this.lexer.position());
  }
};

XPathAnalyzer.AxisSpecifier = AxisSpecifier;

XPathAnalyzer.ExprType = ExprType;

XPathAnalyzer.NodeType = NodeType;

module.exports = XPathAnalyzer;

},{"./axis_specifier":3,"./expr_type":4,"./node_type":5,"./parsers/expr":10,"xpath-lexer":107}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

module.exports = {};

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

},{"./axes/ancestor":30,"./axes/ancestor_or_self":31,"./axes/attribute":32,"./axes/child":33,"./axes/descendant":34,"./axes/descendant_or_self":35,"./axes/following":36,"./axes/following_sibling":37,"./axes/namespace":38,"./axes/parent":39,"./axes/preceding":40,"./axes/preceding_sibling":41,"./axes/self":42,"xpath-analyzer":27}],30:[function(require,module,exports){
"use strict";

var Context = require("../context");

var Node = require("../node");

var XPathNodeSet = require("../types/xpath_node_set");

module.exports = {
  evaluate: function (rootEvaluator, context) {
    var nodes = new XPathNodeSet();

    if (context.getNode().getNodeType() !== Node.DOCUMENT_NODE) {
      nodes = nodes.unshift(context.getNode().getParent());

      nodes = nodes.merge(this.evaluate(rootEvaluator, new Context(context.getNode().getParent())));
    }

    return nodes;
  }
};

},{"../context":43,"../node":96,"../types/xpath_node_set":98}],31:[function(require,module,exports){
"use strict";

var XPathNodeSet = require("../types/xpath_node_set");

var Ancestor = require("./ancestor");

module.exports = {
  evaluate: function (rootEvaluator, context) {
    var nodes = new XPathNodeSet([context.getNode()], true);

    return Ancestor.evaluate(rootEvaluator, context).merge(nodes);
  }
};

},{"../types/xpath_node_set":98,"./ancestor":30}],32:[function(require,module,exports){
"use strict";

var XPathNodeSet = require("../types/xpath_node_set");

module.exports = {
  evaluate: function (rootEvaluator, context) {
    return new XPathNodeSet(context.getNode().getAttributes());
  }
};

},{"../types/xpath_node_set":98}],33:[function(require,module,exports){
"use strict";

var XPathNodeSet = require("../types/xpath_node_set");

module.exports = {
  evaluate: function (rootEvaluator, context) {
    return new XPathNodeSet(context.getNode().getChildNodes());
  }
};

},{"../types/xpath_node_set":98}],34:[function(require,module,exports){
"use strict";

var Context = require("../context");

var XPathNodeSet = require("../types/xpath_node_set");

module.exports = {
  evaluate: function (rootEvaluator, context) {
    var nodes = new XPathNodeSet();

    var children = new XPathNodeSet(context.getNode().getChildNodes());

    var child, iter = children.iterator();

    while ((child = iter.next())) {
      nodes = nodes.push(child);

      nodes = nodes.merge(this.evaluate(rootEvaluator, new Context(child)));
    }

    return nodes;
  }
};

},{"../context":43,"../types/xpath_node_set":98}],35:[function(require,module,exports){
"use strict";

var XPathNodeSet = require("../types/xpath_node_set");

var Descendant = require("./descendant");

module.exports = {
  evaluate: function (rootEvaluator, context) {
    var nodes = new XPathNodeSet([context.getNode()]);

    return nodes.merge(Descendant.evaluate(rootEvaluator, context));
  }
};

},{"../types/xpath_node_set":98,"./descendant":34}],36:[function(require,module,exports){
"use strict";

var XPathAnalyzer = require("xpath-analyzer");

module.exports = {
  evaluate: function (rootEvaluator, context) {
    return rootEvaluator.evaluate({
      type: XPathAnalyzer.ExprType.RELATIVE_LOCATION_PATH,
      steps: [{
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
      }]
    }, context);
  }
};

},{"xpath-analyzer":27}],37:[function(require,module,exports){
"use strict";

var XPathNodeSet = require("../types/xpath_node_set");

module.exports = {
  evaluate: function (rootEvaluator, context) {
    return new XPathNodeSet(context.getNode().getFollowingSiblings());
  }
};

},{"../types/xpath_node_set":98}],38:[function(require,module,exports){

},{}],39:[function(require,module,exports){
"use strict";

var Node = require("../node");

var XPathNodeSet = require("../types/xpath_node_set");

module.exports = {
  evaluate: function (rootEvaluator, context) {
    var nodes = new XPathNodeSet();

    if (context.getNode().getNodeType() !== Node.DOCUMENT_NODE) {
      nodes = nodes.push(context.getNode().getParent());
    }

    return nodes;
  }
};

},{"../node":96,"../types/xpath_node_set":98}],40:[function(require,module,exports){
"use strict";

var XPathAnalyzer = require("xpath-analyzer");

module.exports = {
  evaluate: function (rootEvaluator, context) {
    return rootEvaluator.evaluate({
      type: XPathAnalyzer.ExprType.RELATIVE_LOCATION_PATH,
      steps: [{
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
      }]
    }, context);
  }
};

},{"xpath-analyzer":27}],41:[function(require,module,exports){
"use strict";

var XPathNodeSet = require("../types/xpath_node_set");

module.exports = {
  evaluate: function (rootEvaluator, context) {
    return new XPathNodeSet(context.getNode().getPrecedingSiblings());
  }
};

},{"../types/xpath_node_set":98}],42:[function(require,module,exports){
"use strict";

var XPathNodeSet = require("../types/xpath_node_set");

module.exports = {
  evaluate: function (rootEvaluator, context) {
    return new XPathNodeSet([context.getNode()]);
  }
};

},{"../types/xpath_node_set":98}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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

module.exports = {};

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

},{"./evaluators/absolute_location_path":45,"./evaluators/additive":46,"./evaluators/and":47,"./evaluators/divisional":48,"./evaluators/equality":49,"./evaluators/filter":50,"./evaluators/function_call":51,"./evaluators/greater_than":52,"./evaluators/greater_than_or_equal":53,"./evaluators/inequality":55,"./evaluators/less_than":56,"./evaluators/less_than_or_equal":57,"./evaluators/literal":58,"./evaluators/modulus":59,"./evaluators/multiplicative":60,"./evaluators/negation":61,"./evaluators/number":62,"./evaluators/or":63,"./evaluators/path":64,"./evaluators/relative_location_path":65,"./evaluators/subtractive":67,"./evaluators/union":68,"xpath-analyzer":27}],45:[function(require,module,exports){
"use strict";

var Context = require("../context");

var Node = require("../node");

var RelativeLocationPath = require("./relative_location_path");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    if (context.getNode().getNodeType() !== Node.DOCUMENT_NODE) {
      context = new Context(context.getNode().getOwnerDocument());
    }

    return RelativeLocationPath.evaluate(rootEvaluator, ast, context, type);
  }
};

},{"../context":43,"../node":96,"./relative_location_path":65}],46:[function(require,module,exports){
"use strict";

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);

    return new XPathNumber(lhs.asNumber() + rhs.asNumber());
  }
};

},{"../types/xpath_number":99}],47:[function(require,module,exports){
"use strict";

var XPathBoolean = require("../types/xpath_boolean");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

    if (!lhs.asBoolean()) {
      return new XPathBoolean(false);
    }

    return rootEvaluator.evaluate(ast.rhs, context, type);
  }
};

},{"../types/xpath_boolean":97}],48:[function(require,module,exports){
"use strict";

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);

    return new XPathNumber(lhs.asNumber() / rhs.asNumber());
  }
};

},{"../types/xpath_number":99}],49:[function(require,module,exports){
"use strict";

var Helper = require("./helper");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    return Helper.compareNodes(
      ast.type,
      rootEvaluator.evaluate(ast.lhs, context, type),
      rootEvaluator.evaluate(ast.rhs, context, type),
      function (lhs, rhs) {
        return lhs === rhs;
      }
    );
  }
};

},{"./helper":54}],50:[function(require,module,exports){
"use strict";

var Context = require("../context");

var XPathNumber = require("../types/xpath_number");

var XPathNodeSet = require("../types/xpath_node_set");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    var nodes = rootEvaluator.evaluate(ast.primary, context, type);

    var node, position = 0, filteredNodes = [], iter = nodes.iterator();

    while ((node = iter.next())) {
      position++;

      var keep = ast.predicates.every(function (predicate) {
        var result = rootEvaluator.evaluate(predicate, new Context(node, position, nodes.length()), type);

        if (result === null) {
          return false;
        }

        if (result instanceof XPathNumber) {
          return result.asNumber() === position;
        } else {
          return result.asBoolean();
        }
      });

      if (keep) {
        filteredNodes.push(node);
      }
    }

    return new XPathNodeSet(filteredNodes);
  }
};

},{"../context":43,"../types/xpath_node_set":98,"../types/xpath_number":99}],51:[function(require,module,exports){
"use strict";

var Functions = require("../functions");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    var args = (ast.args || []).map(function (arg) {
      return rootEvaluator.evaluate(arg, context, type);
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

},{"../functions":69}],52:[function(require,module,exports){
"use strict";

var Helper = require("./helper");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    return Helper.compareNodes(
      ast.type,
      rootEvaluator.evaluate(ast.lhs, context, type),
      rootEvaluator.evaluate(ast.rhs, context, type),
      function (lhs, rhs) {
        return lhs > rhs;
      }
    );
  }
};

},{"./helper":54}],53:[function(require,module,exports){
"use strict";

var Helper = require("./helper");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    return Helper.compareNodes(
      ast.type,
      rootEvaluator.evaluate(ast.lhs, context, type),
      rootEvaluator.evaluate(ast.rhs, context, type),
      function (lhs, rhs) {
        return lhs >= rhs;
      }
    );
  }
};

},{"./helper":54}],54:[function(require,module,exports){
"use strict";

var XPathAnalyzer = require("xpath-analyzer");

var XPathBoolean = require("../types/xpath_boolean");

var XPathNodeSet = require("../types/xpath_node_set");

var XPathNumber = require("../types/xpath_number");

var XPathString = require("../types/xpath_string");

module.exports = {
  compareNodes: function (type, lhs, rhs, comparator) {
    if (lhs instanceof XPathNodeSet && rhs instanceof XPathNodeSet) {
      var lNode, lIter = lhs.iterator();

      while ((lNode = lIter.next())) {
        var rNode, rIter = rhs.iterator();

        while ((rNode = rIter.next())) {
          if (comparator(lNode.asString(), rNode.asString())) {
            return new XPathBoolean(true);
          }
        }
      }

      return new XPathBoolean(false);
    }

    if (lhs instanceof XPathNodeSet || rhs instanceof XPathNodeSet) {
      var nodeSet, primitive;

      if (lhs instanceof XPathNodeSet) {
        nodeSet = lhs;
        primitive = rhs;
      } else {
        nodeSet = rhs;
        primitive = lhs;
      }

      var node, iter = nodeSet.iterator();

      while ((node = iter.next())) {
        if (primitive instanceof XPathNumber) {
          if (comparator(node.asNumber(), primitive.asNumber())) {
            return new XPathBoolean(true);
          }
        } else if (primitive instanceof XPathBoolean) {
          if (comparator(node.asBoolean(), primitive.asBoolean())) {
            return new XPathBoolean(true);
          }
        } else if (primitive instanceof XPathString) {
          if (comparator(node.asString(), primitive.asString())) {
            return new XPathBoolean(true);
          }
        } else {
          throw new Error("Unknown value type");
        }
      }

      return new XPathBoolean(false);
    }

    // Neither object is a NodeSet at this point.


    if (type === XPathAnalyzer.ExprType.EQUALITY ||
        type === XPathAnalyzer.ExprType.INEQUALITY) {
      if (lhs instanceof XPathBoolean || rhs instanceof XPathBoolean) {
        if (comparator(lhs.asBoolean(), rhs.asBoolean())) {
          return new XPathBoolean(true);
        }
      } else if (rhs instanceof XPathNumber || rhs instanceof XPathNumber) {
        if (comparator(lhs.asNumber(), rhs.asNumber())) {
          return new XPathBoolean(true);
        }
      } else if (rhs instanceof XPathString || rhs instanceof XPathString) {
        if (comparator(lhs.asString(), rhs.asString())) {
          return new XPathBoolean(true);
        }
      } else {
        throw new Error("Unknown value types");
      }

      return new XPathBoolean(false);
    } else {
      return new XPathBoolean(comparator(lhs.asNumber(), rhs.asNumber()));
    }
  }
};

},{"../types/xpath_boolean":97,"../types/xpath_node_set":98,"../types/xpath_number":99,"../types/xpath_string":100,"xpath-analyzer":27}],55:[function(require,module,exports){
"use strict";

var Helper = require("./helper");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    return Helper.compareNodes(
      ast.type,
      rootEvaluator.evaluate(ast.lhs, context, type),
      rootEvaluator.evaluate(ast.rhs, context, type),
      function (lhs, rhs) {
        return lhs !== rhs;
      }
    );
  }
};

},{"./helper":54}],56:[function(require,module,exports){
"use strict";

var Helper = require("./helper");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    return Helper.compareNodes(
      ast.type,
      rootEvaluator.evaluate(ast.lhs, context, type),
      rootEvaluator.evaluate(ast.rhs, context, type),
      function (lhs, rhs) {
        return lhs < rhs;
      }
    );
  }
};

},{"./helper":54}],57:[function(require,module,exports){
"use strict";

var Helper = require("./helper");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    return Helper.compareNodes(
      ast.type,
      rootEvaluator.evaluate(ast.lhs, context, type),
      rootEvaluator.evaluate(ast.rhs, context, type),
      function (lhs, rhs) {
        return lhs <= rhs;
      }
    );
  }
};

},{"./helper":54}],58:[function(require,module,exports){
"use strict";

var XPathString = require("../types/xpath_string");

module.exports = {
  evaluate: function (rootEvaluator, ast) {
    return new XPathString(ast.string);
  }
};

},{"../types/xpath_string":100}],59:[function(require,module,exports){
"use strict";

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);

    return new XPathNumber(lhs.asNumber() % rhs.asNumber());
  }
};

},{"../types/xpath_number":99}],60:[function(require,module,exports){
"use strict";

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);

    return new XPathNumber(lhs.asNumber() * rhs.asNumber());
  }
};

},{"../types/xpath_number":99}],61:[function(require,module,exports){
"use strict";

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

    return new XPathNumber(-lhs.asNumber());
  }
};

},{"../types/xpath_number":99}],62:[function(require,module,exports){
"use strict";

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (rootEvaluator, ast) {
    return new XPathNumber(ast.number);
  }
};

},{"../types/xpath_number":99}],63:[function(require,module,exports){
"use strict";

var XPathBoolean = require("../types/xpath_boolean");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

    if (lhs.asBoolean()) {
      return new XPathBoolean(true);
    }

    return rootEvaluator.evaluate(ast.rhs, context, type);
  }
};

},{"../types/xpath_boolean":97}],64:[function(require,module,exports){
"use strict";

var Context = require("../context");

var RelativeLocationPath = require("./relative_location_path");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    var nodes = rootEvaluator.evaluate(ast.filter, context, type);

    if (ast.steps) {
      var nodeSets = [], node, iter = nodes.iterator();

      while ((node = iter.next())) {
        nodeSets.push(RelativeLocationPath.evaluate(rootEvaluator, ast, new Context(node), type));
      }

      nodes = nodeSets.reduce(function (previousValue, currentValue) {
        return previousValue.merge(currentValue);
      });
    }

    return nodes;
  }
};

},{"../context":43,"./relative_location_path":65}],65:[function(require,module,exports){
"use strict";

var Context = require("../context");

var XPathNodeSet = require("../types/xpath_node_set");

var Step = require("./step");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    var nodeSet = new XPathNodeSet([context.getNode()]),
        nextNodeSet = new XPathNodeSet();

    if (ast.steps) {
      for (var i = 0; i < ast.steps.length; i++) {
        var node, iter = nodeSet.iterator();

        while ((node = iter.next())) {
          var stepResult = Step.evaluate(rootEvaluator, ast.steps[i], new Context(node), type);

          nextNodeSet = nextNodeSet.merge(stepResult);
        }

        nodeSet = nextNodeSet;
        nextNodeSet = new XPathNodeSet();
      }
    }

    return nodeSet;
  }
};

},{"../context":43,"../types/xpath_node_set":98,"./step":66}],66:[function(require,module,exports){
"use strict";

var XPathAnalyzer = require("xpath-analyzer");

var Axes = require("../axes");

var Context = require("../context");

var XPathNumber = require("../types/xpath_number");

var XPathNodeSet = require("../types/xpath_node_set");

var Node = require("../node");

module.exports = {
  evaluate: function (rootEvaluator, step, context, type) {
    var nodes;

    var axisEvaluator = Axes[step.axis];

    if (axisEvaluator) {
      nodes = axisEvaluator.evaluate(rootEvaluator, context, type);
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
          var result = rootEvaluator.evaluate(predicate, new Context(node, position, nodes.length()), type);

          if (result === null) {
            return false;
          }

          if (result instanceof XPathNumber) {
            return result.asNumber() === position;
          } else {
            return result.asBoolean();
          }
        });

        if (keep) {
          filteredNodes.push(node);
        }
      }

      nodes = new XPathNodeSet(filteredNodes);
    }

    return nodes;
  }
};

},{"../axes":29,"../context":43,"../node":96,"../types/xpath_node_set":98,"../types/xpath_number":99,"xpath-analyzer":27}],67:[function(require,module,exports){
"use strict";

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);

    return new XPathNumber(lhs.asNumber() - rhs.asNumber());
  }
};

},{"../types/xpath_number":99}],68:[function(require,module,exports){
"use strict";

module.exports = {
  evaluate: function (rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);

    return lhs.merge(rhs);
  }
};

},{}],69:[function(require,module,exports){
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

module.exports = {};

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

},{"./functions/boolean":70,"./functions/ceiling":71,"./functions/concat":72,"./functions/contains":73,"./functions/count":74,"./functions/false":75,"./functions/floor":76,"./functions/id":77,"./functions/last":78,"./functions/local_name":79,"./functions/name":80,"./functions/normalize_space":81,"./functions/not":82,"./functions/number":83,"./functions/position":84,"./functions/round":85,"./functions/starts_with":86,"./functions/string":87,"./functions/string_length":88,"./functions/substring":89,"./functions/substring_after":90,"./functions/substring_before":91,"./functions/sum":92,"./functions/translate":93,"./functions/true":94}],70:[function(require,module,exports){
"use strict";

var XPathBoolean = require("../types/xpath_boolean");

module.exports = {
  evaluate: function (context, value) {
    if (!value) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    return new XPathBoolean(value.asBoolean());
  }
};

},{"../types/xpath_boolean":97}],71:[function(require,module,exports){
"use strict";

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (context, number) {
    if (!number) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    if (!(number instanceof XPathNumber)) {
      throw new Error("Wrong type of argument");
    }

    return new XPathNumber(Math.ceil(number.asNumber()));
  }
};

},{"../types/xpath_number":99}],72:[function(require,module,exports){
"use strict";

var XPathString = require("../types/xpath_string");

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

    return new XPathString(args.join(""));
  }
};

},{"../types/xpath_string":100}],73:[function(require,module,exports){
"use strict";

var XPathBoolean = require("../types/xpath_boolean");

module.exports = {
  evaluate: function (context, base, contains) {
    if (!contains) {
      throw new Error("Expected two arguments");
    }

    base = base.asString();

    contains = contains.asString();

    return new XPathBoolean(base.indexOf(contains) !== -1);
  }
};

},{"../types/xpath_boolean":97}],74:[function(require,module,exports){
"use strict";

var XPathNodeSet = require("../types/xpath_node_set");

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (context, nodeset) {
    if (!nodeset) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    if (!(nodeset instanceof XPathNodeSet)) {
      throw new Error("Wrong type of argument");
    }

    return new XPathNumber(nodeset.length());
  }
};

},{"../types/xpath_node_set":98,"../types/xpath_number":99}],75:[function(require,module,exports){
"use strict";

var XPathBoolean = require("../types/xpath_boolean");

module.exports = {
  evaluate: function () {
    return new XPathBoolean(false);
  }
};

},{"../types/xpath_boolean":97}],76:[function(require,module,exports){
"use strict";

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (context, number) {
    if (!number) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    if (!(number instanceof XPathNumber)) {
      throw new Error("Wrong type of argument");
    }

    return new XPathNumber(Math.floor(number.asNumber()));
  }
};

},{"../types/xpath_number":99}],77:[function(require,module,exports){
"use strict";

var Node = require("../node");

var XPathNodeSet = require("../types/xpath_node_set");

var XPathString = require("../types/xpath_string");

module.exports = {
  evaluate: function (context, value) {
    if (!value) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    var node, ids = [];

    if (value instanceof XPathNodeSet) {
      var iter = value.iterator();

      while ((node = iter.next())) {
        ids = ids.concat(node.asString().split(/\s+/g));
      }
    } else if (value instanceof XPathString) {
      ids = value.asString().split(/\s+/g);
    } else {
      ids.push(value.asString());
    }

    var nodes = new XPathNodeSet();

    for (var i = 0; i < ids.length; i++) {
      if (context.getNode().getNodeType() === Node.DOCUMENT_NODE) {
        node = context.getNode().getElementById(ids[i]);
      } else {
        node = context.getNode().getOwnerDocument().getElementById(ids[i]);
      }

      if (node) {
        nodes = nodes.merge(new XPathNodeSet([node]));
      }
    }

    return nodes;
  }
};

},{"../node":96,"../types/xpath_node_set":98,"../types/xpath_string":100}],78:[function(require,module,exports){
"use strict";

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (context) {
    return new XPathNumber(context.getLast());
  }
};

},{"../types/xpath_number":99}],79:[function(require,module,exports){
"use strict";

var XPathNodeSet = require("../types/xpath_node_set");

var XPathString = require("../types/xpath_string");

module.exports = {
  evaluate: function (context, nodeset) {
    if (!nodeset) {
      nodeset = new XPathNodeSet([context.getNode()]);
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    if (!(nodeset instanceof XPathNodeSet)) {
      throw new Error("Wrong type of argument");
    }

    if (nodeset.empty()) {
      return new XPathString("");
    } else {
      return new XPathString(nodeset.first().getName());
    }
  }
};

},{"../types/xpath_node_set":98,"../types/xpath_string":100}],80:[function(require,module,exports){
"use strict";

var XPathString = require("../types/xpath_string");

var XPathNodeSet = require("../types/xpath_node_set");

module.exports = {
  evaluate: function (context, nodeset) {
    if (!nodeset) {
      return new XPathString(context.getNode().getName());
    } else {
      if (arguments.length > 2) {
        throw new Error("Unknown argument(s)");
      }

      if (!(nodeset instanceof XPathNodeSet)) {
        throw new Error("Wrong type of argument");
      }

      if (nodeset.empty()) {
        return new XPathString("");
      } else {
        return new XPathString(nodeset.first().getName());
      }
    }
  }
};

},{"../types/xpath_node_set":98,"../types/xpath_string":100}],81:[function(require,module,exports){
"use strict";

var XPathString = require("../types/xpath_string");

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

    return new XPathString(string.trim().replace(/\s{2,}/g, " "));
  }
};

},{"../types/xpath_string":100}],82:[function(require,module,exports){
"use strict";

var XPathBoolean = require("../types/xpath_boolean");

module.exports = {
  evaluate: function (context, value) {
    if (!value) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    return new XPathBoolean(!value.asBoolean());
  }
};

},{"../types/xpath_boolean":97}],83:[function(require,module,exports){
"use strict";

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (context, value) {
    if (!value) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    return new XPathNumber(value.asNumber());
  }
};

},{"../types/xpath_number":99}],84:[function(require,module,exports){
"use strict";

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (context) {
    return new XPathNumber(context.getPosition());
  }
};

},{"../types/xpath_number":99}],85:[function(require,module,exports){
"use strict";

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (context, number) {
    if (!number) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    if (!(number instanceof XPathNumber)) {
      throw new Error("Wrong type of argument");
    }

    return new XPathNumber(Math.round(number.asNumber()));
  }
};

},{"../types/xpath_number":99}],86:[function(require,module,exports){
"use strict";

var XPathBoolean = require("../types/xpath_boolean");

module.exports = {
  evaluate: function (context, base, substring) {
    if (!substring) {
      throw new Error("Expected two arguments");
    }

    base = base.asString();

    substring = substring.asString();

    var index = base.indexOf(substring);

    return new XPathBoolean(index === 0);
  }
};

},{"../types/xpath_boolean":97}],87:[function(require,module,exports){
"use strict";

var XPathNodeSet = require("../types/xpath_node_set");

var XPathString = require("../types/xpath_string");

module.exports = {
  evaluate: function (context, value) {
    if (!value) {
      value = new XPathNodeSet([context.getNode()]);
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    return new XPathString(value.asString());
  }
};

},{"../types/xpath_node_set":98,"../types/xpath_string":100}],88:[function(require,module,exports){
"use strict";

var XPathString = require("../types/xpath_string");

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (context, string) {
    if (!string) {
      string = context.getNode().asString();
    } else {
      if (arguments.length > 2) {
        throw new Error("Unknown argument(s)");
      }

      if (!(string instanceof XPathString)) {
        throw new Error("Wrong type of argument");
      }

      string = string.asString();
    }

    return new XPathNumber(string.length);
  }
};

},{"../types/xpath_number":99,"../types/xpath_string":100}],89:[function(require,module,exports){
"use strict";

var XPathString = require("../types/xpath_string");

module.exports = {
  evaluate: function (context, base, start, length) {
    if (!start) {
      throw new Error("Expected two or three arguments");
    }

    base = base.asString();

    start = Math.round(start.asNumber());

    if (isNaN(start) || start === Infinity || start === -Infinity) {
      return new XPathString("");
    }

    if (length) {
      length = Math.round(length.asNumber());

      if (isNaN(length) || length === -Infinity) {
        return new XPathString("");
      }
    }

    if (length) {
      return new XPathString(base.substring(start - 1, start + length - 1));
    } else {
      return new XPathString(base.substring(start - 1));
    }
  }
};

},{"../types/xpath_string":100}],90:[function(require,module,exports){
"use strict";

var XPathString = require("../types/xpath_string");

module.exports = {
  evaluate: function (context, base, substring) {
    if (!substring) {
      throw new Error("Expected two arguments");
    }

    base = base.asString();

    substring = substring.asString();

    var index = base.indexOf(substring);

    if (index === -1) {
      return new XPathString("");
    } else {
      return new XPathString(base.substring(index + substring.length));
    }
  }
};

},{"../types/xpath_string":100}],91:[function(require,module,exports){
"use strict";

var XPathString = require("../types/xpath_string");

module.exports = {
  evaluate: function (context, base, substring) {
    if (!substring) {
      throw new Error("Expected two arguments");
    }

    base = base.asString();

    substring = substring.asString();

    var index = base.indexOf(substring);

    if (index === -1) {
      return new XPathString("");
    } else {
      return new XPathString(base.substring(0, index));
    }
  }
};

},{"../types/xpath_string":100}],92:[function(require,module,exports){
"use strict";

var XPathNodeSet = require("../types/xpath_node_set");

var XPathNumber = require("../types/xpath_number");

module.exports = {
  evaluate: function (context, nodeset) {
    if (!nodeset) {
      throw new Error("Missing argument");
    }

    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    if (!(nodeset instanceof XPathNodeSet)) {
      throw new Error("Wrong type of argument");
    }

    var sum = 0, node, iter = nodeset.iterator();

    while ((node = iter.next())) {
      sum = sum + node.asNumber();
    }

    return new XPathNumber(sum);
  }
};

},{"../types/xpath_node_set":98,"../types/xpath_number":99}],93:[function(require,module,exports){
"use strict";

var XPathString = require("../types/xpath_string");

module.exports = {
  evaluate: function (context, base, mapFrom, mapTo) {
    if (!mapTo) {
      throw new Error("Expected three arguments");
    }

    if (!(base instanceof XPathString) ||
        !(mapFrom instanceof XPathString) ||
        !(mapTo instanceof XPathString)) {
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

    return new XPathString(base);
  }
};

},{"../types/xpath_string":100}],94:[function(require,module,exports){
"use strict";

var XPathBoolean = require("../types/xpath_boolean");

module.exports = {
  evaluate: function () {
    return new XPathBoolean(true);
  }
};

},{"../types/xpath_boolean":97}],95:[function(require,module,exports){
/* eslint-disable no-underscore-dangle */

"use strict";

function Iterator (list, reversed) {
  this.list = list;
  this.reversed = reversed;
  this.current = reversed ? list.last_ : list.first_;
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

    return this.lastReturned.node;
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

},{}],96:[function(require,module,exports){
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

},{}],97:[function(require,module,exports){
"use strict";

function XPathBoolean (value) {
  this.value = value;
}

XPathBoolean.prototype.asString = function () {
  return "" + this.value;
};

XPathBoolean.prototype.asNumber = function () {
  return this.value ? 1 : 0;
};

XPathBoolean.prototype.asBoolean = function () {
  return this.value;
};

module.exports = XPathBoolean;

},{}],98:[function(require,module,exports){
/* eslint-disable no-underscore-dangle */

"use strict";

var Adapter = require("../adapter");

var Iterator = require("../iterator");

function Entry (node) {
  this.node = node;
}

function XPathNodeSet (value) {
  this.first_ = null;
  this.last_ = null;
  this.length_ = 0;

  if (value) {
    value.forEach(function (node) {
      this.push(node);
    }, this);
  }
}

XPathNodeSet.prototype.iterator = function (reversed) {
  return new Iterator(this, reversed);
};

XPathNodeSet.prototype.first = function () {
  return this.first_.node;
};

XPathNodeSet.prototype.last = function () {
  return this.last_.node;
};

XPathNodeSet.prototype.length = function () {
  return this.length_;
};

XPathNodeSet.prototype.empty = function () {
  return this.length() === 0;
};

XPathNodeSet.prototype.asString = function () {
  if (this.empty()) {
    return "";
  } else {
    return this.first().asString();
  }
};

XPathNodeSet.prototype.asNumber = function () {
  return +this.asString();
};

XPathNodeSet.prototype.asBoolean = function () {
  return this.length() !== 0;
};

XPathNodeSet.prototype.merge = function (b) {
  return XPathNodeSet.merge(this, b);
};

XPathNodeSet.prototype.push = function (node) {
  var entry = new Entry(node);

  entry.next = null;
  entry.previous = this.last_;

  if (this.first_) {
    this.last_.next = entry;
  } else {
    this.first_ = entry;
  }

  this.last_ = entry;
  this.length_++;

  return this;
};

XPathNodeSet.prototype.unshift = function (node) {
  var entry = new Entry(node);

  entry.previous = null;
  entry.next = this.first_;

  if (this.first_) {
    this.first_.previous = entry;
  } else {
    this.last_ = entry;
  }

  this.first_ = entry;
  this.length_++;

  return this;
};

XPathNodeSet.prototype.filter = function (condition) {
  var node, iter = this.iterator();

  while ((node = iter.next())) {
    if (!condition(node)) {
      iter.remove();
    }
  }

  return this;
};

XPathNodeSet.merge = function (a, b) {
  var comparator = Adapter.getAdapter().compareDocumentPosition;

  if (comparator) {
    return XPathNodeSet.mergeWithOrder(a, b, comparator);
  } else {
    return XPathNodeSet.mergeWithoutOrder(a, b);
  }
};

XPathNodeSet.mergeWithOrder = function (a, b, comparator) {
  if (!a.first_) {
    return b;
  } else if (!b.first_) {
    return a;
  }

  var aCurr = a.first_;
  var bCurr = b.first_;
  var merged = a, tail = null, next = null, length = 0;

  while (aCurr && bCurr) {
    if (aCurr.node.isEqual(bCurr.node)) {
      next = aCurr;
      aCurr = aCurr.next;
      bCurr = bCurr.next;
    } else {
      var compareResult = comparator(aCurr.node, bCurr.node);

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

XPathNodeSet.mergeWithoutOrder = function (a, b) {
  var nodes = [], node, iter = a.iterator();

  while ((node = iter.next())) {
    nodes.push(node);
  }

  iter = b.iterator();

  while ((node = iter.next())) {
    var keep = nodes.every(function (addedNode) {
      return !addedNode.isEqual(node);
    });

    if (keep) {
      nodes.push(node);
    }
  }

  return new XPathNodeSet(nodes);
};

XPathNodeSet.prototype.toString = function () {
  var node, iter = this.iterator();

  var nodes = [];

  while ((node = iter.next())) {
    nodes.push("" + node);
  }

  return "NodeSet<" + nodes.join(", ") + ">";
};

module.exports = XPathNodeSet;

},{"../adapter":28,"../iterator":95}],99:[function(require,module,exports){
"use strict";

function XPathNumber (value) {
  this.value = value;
}

XPathNumber.prototype.asString = function () {
  return "" + this.value;
};

XPathNumber.prototype.asNumber = function () {
  return this.value;
};

XPathNumber.prototype.asBoolean = function () {
  return !!this.value;
};

module.exports = XPathNumber;

},{}],100:[function(require,module,exports){
"use strict";

function XPathString (value) {
  this.value = value;
}

XPathString.prototype.asString = function () {
  return this.value;
};

XPathString.prototype.asNumber = function () {
  return +this.value;
};

XPathString.prototype.asBoolean = function () {
  return this.value.length !== 0;
};

module.exports = XPathString;

},{}],101:[function(require,module,exports){
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

},{"./adapter":28,"./node":96,"./xpath_expression":104,"./xpath_result":105}],102:[function(require,module,exports){
"use strict";

function XPathException (code, message) {
  this.code = code;
  this.message = message;
}

module.exports = XPathException;

},{}],103:[function(require,module,exports){
module.exports = {
  INVALID_EXPRESSION_ERR: 51,
  TYPE_ERR: 52
};

},{}],104:[function(require,module,exports){
"use strict";

var XPathAnalyzer = require("xpath-analyzer");

var Context = require("./context");

var Evaluators = require("./evaluators");

function XPathExpression (expression) {
  this.expression = expression;
}

XPathExpression.evaluate = function (ast, context, type) {
  var evaluator = Evaluators[ast.type];

  return evaluator.evaluate(XPathExpression, ast, context, type);
};

XPathExpression.prototype.evaluate = function (context, type, Adapter) {
  var ast = new XPathAnalyzer(this.expression).parse();

  return XPathExpression.evaluate(ast, new Context(new Adapter(context)), type);
};

module.exports = XPathExpression;

},{"./context":43,"./evaluators":44,"xpath-analyzer":27}],105:[function(require,module,exports){
"use strict";

var XPathException = require("./xpath_exception");

var XPathExceptionCode = require("./xpath_exception_code");

var XPathResultType = require("./xpath_result_type");

var XPathNodeSet = require("./types/xpath_node_set");

var XPathString = require("./types/xpath_string");

var XPathNumber = require("./types/xpath_number");

var XPathBoolean = require("./types/xpath_boolean");

function XPathResult (type, value) {
  this.value = value;

  if (type === XPathResultType.ANY_TYPE) {
    if (value instanceof XPathNodeSet) {
      this.resultType = XPathResultType.UNORDERED_NODE_ITERATOR_TYPE;
    } else if (value instanceof XPathString) {
      this.resultType = XPathResultType.STRING_TYPE;
    } else if (value instanceof XPathNumber) {
      this.resultType = XPathResultType.NUMBER_TYPE;
    } else if (value instanceof XPathBoolean) {
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
      !(value instanceof XPathNodeSet)) {
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

  return (this.index >= this.nodes.length) ? null : this.nodes[this.index++];
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

},{"./types/xpath_boolean":97,"./types/xpath_node_set":98,"./types/xpath_number":99,"./types/xpath_string":100,"./xpath_exception":102,"./xpath_exception_code":103,"./xpath_result_type":106}],106:[function(require,module,exports){
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

},{}],107:[function(require,module,exports){
"use strict";

var lexer = new RegExp([
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
].join("|"), "g");

function XPathLexer (expression) {
  var match = expression.match(lexer);

  if (match === null) {
    throw new Error("Invalid character at position 0");
  }

  if (match.join("") !== expression) {
    var position = 0;

    while (expression.indexOf(match[0]) === position) {
      position += match.shift().length;
    }

    throw new Error("Invalid character at position " + position);
  }

  this.tokens = match.map(function (token) {
    return {
      value: token,
      position: 0
    };
  });

  this.tokens.reduce(function (previousToken, nextToken) {
    nextToken.position = previousToken.position + previousToken.value.length;
    return nextToken;
  });

  this.tokens = this.tokens.filter(function (token) {
    return !/^\s+$/.test(token.value);
  });

  this.index = 0;
}

XPathLexer.prototype.length = function () {
  return this.tokens.length;
};

XPathLexer.prototype.next = function () {
  if (this.index === this.tokens.length) {
    return null;
  } else {
    var token = this.tokens[this.index++];

    return token && token.value;
  }
};

XPathLexer.prototype.back = function () {
  if (this.index > 0) {
    this.index--;
  }
};

XPathLexer.prototype.peak = function (n) {
  var token = this.tokens[this.index + (n || 0)];

  return token && token.value;
};

XPathLexer.prototype.empty = function () {
  return this.tokens.length <= this.index;
};

XPathLexer.prototype.position = function () {
  if (this.index === this.tokens.length) {
    var lastToken = this.tokens[this.index - 1];

    return lastToken.position + lastToken.value.length;
  } else {
    return this.tokens[this.index].position;
  }
};

module.exports = XPathLexer;

},{}],108:[function(require,module,exports){
/* eslint-env node */

var XPathEvaluator = require("xpath-evaluator");

var XPathDOM = require("./lib/xpath_dom");

XPathEvaluator.setAdapter(XPathDOM);

module.exports = XPathEvaluator;

},{"./lib/xpath_dom":2,"xpath-evaluator":101}]},{},[1])(1)
});
