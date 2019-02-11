if (typeof Symbol === "undefined") {
  window.Symbol = function () {};
  window.Symbol.iterator = "@@iterator";
}
(function () {
  'use strict';

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
  };

  function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
      next: function () {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  }

  function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
    }
    return ar;
  }

  function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
    return ar;
  }

  var lexer = new RegExp([
    "\\$?(?:(?![0-9-])[\\w-]+:)?(?![0-9-])[\\w-]+",
    "\\d+\\.\\d+",
    "\\.\\d+",
    "\\d+",
    "\\/\\/",
    "/",
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
  var XPathLexer = /*@__PURE__*/(function () {
    function XPathLexer(expression) {
      var match = expression.match(lexer);
      if (match === null) {
        throw new Error("Invalid character at position 0");
      }
      if (match.join("") !== expression) {
        var position = 0;
        for (var i = 0; i < match.length; i++) {
          if (expression.indexOf(match[i]) !== position) {
            break;
          }
          position += match[i].length;
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
      }
      else {
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
      }
      else {
        return this.tokens[this.index].position;
      }
    };
    return XPathLexer;
  }());

  var ABSOLUTE_LOCATION_PATH = "absolute-location-path";
  var ADDITIVE = "additive";
  var AND = "and";
  var DIVISIONAL = "divisional";
  var EQUALITY = "equality";
  var FILTER = "filter";
  var FUNCTION_CALL = "function-call";
  var GREATER_THAN = "greater-than";
  var GREATER_THAN_OR_EQUAL = "greater-than-or-equal";
  var INEQUALITY = "inequality";
  var LESS_THAN = "less-than";
  var LESS_THAN_OR_EQUAL = "less-than-or-equal";
  var LITERAL = "literal";
  var MODULUS = "modulus";
  var MULTIPLICATIVE = "multiplicative";
  var NEGATION = "negation";
  var NUMBER = "number";
  var OR = "or";
  var PATH = "path";
  var RELATIVE_LOCATION_PATH = "relative-location-path";
  var SUBTRACTIVE = "subtractive";
  var UNION = "union";
  var NODE_NAME_TEST = "node-name-test";
  var NODE_TYPE_TEST = "node-type-test";
  var PROCESSING_INSTRUCTION_TEST = "processing-instruction-test";
  var ANCESTOR = "ancestor";
  var ANCESTOR_OR_SELF = "ancestor-or-self";
  var ATTRIBUTE = "attribute";
  var CHILD = "child";
  var DESCENDANT = "descendant";
  var DESCENDANT_OR_SELF = "descendant-or-self";
  var FOLLOWING = "following";
  var FOLLOWING_SIBLING = "following-sibling";
  var NAMESPACE = "namespace";
  var PARENT = "parent";
  var PRECEDING = "preceding";
  var PRECEDING_SIBLING = "preceding-sibling";
  var SELF = "self";
  var COMMENT = "comment";
  var NODE = "node";
  var PROCESSING_INSTRUCTION = "processing-instruction";
  var TEXT = "text";
  function parse(rootParser, lexer) {
    lexer.next();
    var predicate = rootParser.parse(lexer);
    if (lexer.peak() === "]") {
      lexer.next();
    }
    else {
      throw new Error("Invalid token at position " + lexer.position() + ", expected closing bracket");
    }
    return predicate;
  }
  function isValid(type) {
    return type == COMMENT ||
      type == NODE ||
      type == PROCESSING_INSTRUCTION ||
      type == TEXT;
  }
  var BOOLEAN = "boolean";
  var CEILING = "ceiling";
  var CONCAT = "concat";
  var CONTAINS = "contains";
  var COUNT = "count";
  var FALSE = "false";
  var FLOOR = "floor";
  var ID = "id";
  var LAST = "last";
  var LOCAL_NAME = "local-name";
  var NAME = "name";
  var NORMALIZE_SPACE = "normalize-space";
  var NOT = "not";
  var POSITION = "position";
  var ROUND = "round";
  var STARTS_WITH = "starts-with";
  var STRING_LENGTH = "string-length";
  var STRING = "string";
  var SUBSTRING_AFTER = "substring-after";
  var SUBSTRING_BEFORE = "substring-before";
  var SUBSTRING = "substring";
  var SUM = "sum";
  var TRANSLATE = "translate";
  var TRUE = "true";
  function isValid$1(name) {
    return name == BOOLEAN ||
      name == CEILING ||
      name == CONCAT ||
      name == CONTAINS ||
      name == COUNT ||
      name == FALSE ||
      name == FLOOR ||
      name == ID ||
      name == LAST ||
      name == LOCAL_NAME ||
      name == NAME ||
      name == NORMALIZE_SPACE ||
      name == NOT ||
      name == NUMBER ||
      name == POSITION ||
      name == ROUND ||
      name == STARTS_WITH ||
      name == STRING_LENGTH ||
      name == STRING ||
      name == SUBSTRING_AFTER ||
      name == SUBSTRING_BEFORE ||
      name == SUBSTRING ||
      name == SUM ||
      name == TRANSLATE ||
      name == TRUE;
  }
  function parse$1(rootParser, lexer) {
    var functionName = lexer.peak();
    if (!isValid$1(functionName)) {
      throw new Error("Invalid function at position " + lexer.position());
    }
    lexer.next();
    var functionCall = {
      type: FUNCTION_CALL,
      name: functionName,
      args: []
    };
    lexer.next();
    if (lexer.peak() === ")") {
      lexer.next();
    }
    else {
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
  function parse$2(rootParser, lexer) {
    var token = lexer.peak(), ch = token && token[0];
    if (ch === "(") {
      lexer.next();
      var expr = rootParser.parse(lexer);
      if (lexer.peak() === ")") {
        lexer.next();
      }
      else {
        throw new Error("Invalid token at position " + lexer.position() + ", expected closing parenthesis");
      }
      return expr;
    }
    if (ch === "\"" || ch === "'") {
      lexer.next();
      return {
        type: LITERAL,
        string: token.slice(1, -1)
      };
    }
    if (ch === "$") {
      throw Error("Variable reference are not implemented");
    }
    if (/^\d+$/.test(token) || /^(\d+)?\.\d+$/.test(token)) {
      lexer.next();
      return {
        type: NUMBER,
        number: parseFloat(token)
      };
    }
    if (lexer.peak(1) === "(" && !isValid(lexer.peak())) {
      return parse$1(rootParser, lexer);
    }
    throw new Error("Unexpected token at position " + lexer.position());
  }
  function isValidOp(lexer) {
    var token = lexer.peak(), ch = token && token[0];
    return ch === "(" ||
      ch === "\"" ||
      ch === "'" ||
      ch === "$" ||
      /^\d+$/.test(token) ||
      /^(\d+)?\.\d+$/.test(token) ||
      (lexer.peak(1) === "(" && !isValid(lexer.peak()));
  }
  function parse$3(rootParser, lexer) {
    var primary = parse$2(rootParser, lexer);
    if (lexer.peak() === "[") {
      var filter = {
        type: FILTER,
        primary: primary,
        predicates: []
      };
      while (lexer.peak() === "[") {
        filter.predicates.push(parse(rootParser, lexer));
      }
      return filter;
    }
    else {
      return primary;
    }
  }
  function isValidOp$1(lexer) {
    return isValidOp(lexer);
  }
  function isValid$2(specifier) {
    return specifier == ANCESTOR ||
      specifier == ANCESTOR_OR_SELF ||
      specifier == ATTRIBUTE ||
      specifier == CHILD ||
      specifier == DESCENDANT ||
      specifier == DESCENDANT_OR_SELF ||
      specifier == FOLLOWING ||
      specifier == FOLLOWING_SIBLING ||
      specifier == NAMESPACE ||
      specifier == PARENT ||
      specifier == PRECEDING ||
      specifier == PRECEDING_SIBLING ||
      specifier == SELF;
  }
  function parse$4(rootParser, lexer) {
    if (lexer.peak() === "*") {
      lexer.next();
      return {
        type: NODE_NAME_TEST,
        name: "*"
      };
    }
    if (lexer.peak(1) === "(") {
      if (isValid(lexer.peak())) {
        var test, type = lexer.next();
        lexer.next();
        if (type === PROCESSING_INSTRUCTION) {
          var token = lexer.peak(), ch = token && token[0];
          test = {
            type: PROCESSING_INSTRUCTION_TEST,
            name: (ch === "\"" || ch === "'") ? lexer.next().slice(1, -1) : undefined
          };
        }
        else {
          test = {
            type: NODE_TYPE_TEST,
            name: type
          };
        }
        if (lexer.peak() !== ")") {
          throw new Error("Invalid token at position " + lexer.position() + ", expected closing parenthesis");
        }
        else {
          lexer.next();
        }
        return test;
      }
      else {
        throw new Error("Invalid node type at position " + lexer.position());
      }
    }
    return {
      type: NODE_NAME_TEST,
      name: lexer.next()
    };
  }
  function parse$5(rootParser, lexer) {
    if (lexer.peak() === "..") {
      lexer.next();
      return {
        axis: PARENT,
        test: {
          type: NODE_TYPE_TEST,
          name: NODE
        },
        predicates: []
      };
    }
    else if (lexer.peak() === ".") {
      lexer.next();
      return {
        axis: SELF,
        test: {
          type: NODE_TYPE_TEST,
          name: NODE
        },
        predicates: []
      };
    }
    var axis;
    if (lexer.peak(1) === "::") {
      var possiblyAxis = lexer.peak();
      if (isValid$2(possiblyAxis)) {
        axis = possiblyAxis;
        lexer.next();
        lexer.next();
      }
      else {
        throw new Error("Invalid axis specifier at position " + lexer.position());
      }
    }
    else if (lexer.peak() === "@") {
      lexer.next();
      axis = ATTRIBUTE;
    }
    else {
      axis = CHILD;
    }
    var step = {
      axis: axis,
      test: parse$4(rootParser, lexer),
      predicates: []
    };
    while (lexer.peak() === "[") {
      step.predicates.push(parse(rootParser, lexer));
    }
    return step;
  }
  function isValidOp$2(lexer) {
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
  function parse$6(rootParser, lexer) {
    var absoluteLocation = {
      type: ABSOLUTE_LOCATION_PATH,
      steps: []
    };
    while (!lexer.empty() && lexer.peak()[0] === "/") {
      if (lexer.next() === "/") {
        if (isValidOp$2(lexer)) {
          absoluteLocation.steps.push(parse$5(rootParser, lexer));
        }
      }
      else {
        absoluteLocation.steps.push({
          axis: DESCENDANT_OR_SELF,
          test: {
            type: NODE_TYPE_TEST,
            name: NODE
          },
          predicates: []
        });
        absoluteLocation.steps.push(parse$5(rootParser, lexer));
      }
    }
    return absoluteLocation;
  }
  function parse$7(rootParser, lexer) {
    var relativeLocation = {
      type: RELATIVE_LOCATION_PATH,
      steps: [parse$5(rootParser, lexer)]
    };
    while (!lexer.empty() && lexer.peak()[0] === "/") {
      if (lexer.next() === "//") {
        relativeLocation.steps.push({
          axis: DESCENDANT_OR_SELF,
          test: {
            type: NODE_TYPE_TEST,
            name: NODE
          },
          predicates: []
        });
      }
      relativeLocation.steps.push(parse$5(rootParser, lexer));
    }
    return relativeLocation;
  }
  function parse$8(rootParser, lexer) {
    var token = lexer.peak(), ch = token && token[0];
    if (ch === "/") {
      return parse$6(rootParser, lexer);
    }
    else {
      return parse$7(rootParser, lexer);
    }
  }
  function parse$9(rootParser, lexer) {
    if (isValidOp$1(lexer)) {
      var filter = parse$3(rootParser, lexer);
      if (!lexer.empty() && lexer.peak()[0] === "/") {
        var path = {
          type: PATH,
          filter: filter,
          steps: []
        };
        while (!lexer.empty() && lexer.peak()[0] === "/") {
          if (lexer.next() === "//") {
            path.steps.push({
              axis: DESCENDANT_OR_SELF,
              test: {
                type: NODE_TYPE_TEST,
                name: NODE
              },
              predicates: []
            });
          }
          path.steps.push(parse$5(rootParser, lexer));
        }
        return path;
      }
      else {
        return filter;
      }
    }
    else {
      return parse$8(rootParser, lexer);
    }
  }
  function parse$a(rootParser, lexer) {
    var lhs = parse$9(rootParser, lexer);
    if (lexer.peak() === "|") {
      lexer.next();
      var rhs = parse$a(rootParser, lexer);
      return {
        type: UNION,
        lhs: lhs,
        rhs: rhs
      };
    }
    else {
      return lhs;
    }
  }
  function parse$b(rootParser, lexer) {
    if (lexer.peak() === "-") {
      lexer.next();
      return {
        type: NEGATION,
        lhs: parse$b(rootParser, lexer)
      };
    }
    else {
      return parse$a(rootParser, lexer);
    }
  }
  function parse$c(rootParser, lexer) {
    var lhs = parse$b(rootParser, lexer);
    var multiplicativeTypes = {
      "*": MULTIPLICATIVE,
      "div": DIVISIONAL,
      "mod": MODULUS
    };
    if (multiplicativeTypes.hasOwnProperty(lexer.peak())) {
      var op = lexer.next();
      var rhs = parse$c(rootParser, lexer);
      return {
        type: multiplicativeTypes[op],
        lhs: lhs,
        rhs: rhs
      };
    }
    else {
      return lhs;
    }
  }
  function parse$d(rootParser, lexer) {
    var lhs = parse$c(rootParser, lexer);
    var additiveTypes = {
      "+": ADDITIVE,
      "-": SUBTRACTIVE
    };
    if (additiveTypes.hasOwnProperty(lexer.peak())) {
      var op = lexer.next();
      var rhs = parse$d(rootParser, lexer);
      return {
        type: additiveTypes[op],
        lhs: lhs,
        rhs: rhs
      };
    }
    else {
      return lhs;
    }
  }
  function parse$e(rootParser, lexer) {
    var lhs = parse$d(rootParser, lexer);
    var relationalTypes = {
      "<": LESS_THAN,
      ">": GREATER_THAN,
      "<=": LESS_THAN_OR_EQUAL,
      ">=": GREATER_THAN_OR_EQUAL
    };
    if (relationalTypes.hasOwnProperty(lexer.peak())) {
      var op = lexer.next();
      var rhs = parse$e(rootParser, lexer);
      return {
        type: relationalTypes[op],
        lhs: lhs,
        rhs: rhs
      };
    }
    else {
      return lhs;
    }
  }
  function parse$f(rootParser, lexer) {
    var lhs = parse$e(rootParser, lexer);
    var equalityTypes = {
      "=": EQUALITY,
      "!=": INEQUALITY
    };
    if (equalityTypes.hasOwnProperty(lexer.peak())) {
      var op = lexer.next();
      var rhs = parse$f(rootParser, lexer);
      return {
        type: equalityTypes[op],
        lhs: lhs,
        rhs: rhs
      };
    }
    else {
      return lhs;
    }
  }
  function parse$g(rootParser, lexer) {
    var lhs = parse$f(rootParser, lexer);
    if (lexer.peak() === "and") {
      lexer.next();
      var rhs = parse$g(rootParser, lexer);
      return {
        type: AND,
        lhs: lhs,
        rhs: rhs
      };
    }
    else {
      return lhs;
    }
  }
  function parse$h(rootParser, lexer) {
    var lhs = parse$g(rootParser, lexer);
    if (lexer.peak() === "or") {
      lexer.next();
      var rhs = parse$h(rootParser, lexer);
      return {
        type: OR,
        lhs: lhs,
        rhs: rhs
      };
    }
    else {
      return lhs;
    }
  }
  function parse$i(lexer) {
    return parse$h({ parse: parse$i }, lexer);
  }
  var XPathAnalyzer = /*@__PURE__*/(function () {
    function XPathAnalyzer(expression) {
      this.lexer = new XPathLexer(expression);
    }
    XPathAnalyzer.prototype.parse = function () {
      var ast = parse$i(this.lexer);
      if (this.lexer.empty()) {
        return ast;
      }
      else {
        throw new Error("Unexpected token at position " + this.lexer.position());
      }
    };
    return XPathAnalyzer;
  }());

  var Context = /*@__PURE__*/(function () {
    function Context(node, position, last) {
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
    return Context;
  }());
  var NodeWrapper = /*@__PURE__*/(function () {
    function NodeWrapper(node) {
      this.node = node;
    }
    return NodeWrapper;
  }());
  var ListBounds = /*@__PURE__*/(function () {
    function ListBounds(head, tail) {
      this.head = head;
      this.tail = tail;
    }
    return ListBounds;
  }());
  var EmptyIterator = /*@__PURE__*/(function () {
    function EmptyIterator() {
    }
    EmptyIterator.prototype[Symbol.iterator] = function () {
      return this;
    };
    EmptyIterator.prototype.next = function () {
      return {
        done: true,
        value: null
      };
    };
    EmptyIterator.prototype.remove = function () { };
    return EmptyIterator;
  }());
  var Iterator = /*@__PURE__*/(function () {
    function Iterator(list, reversed) {
      if (reversed === void 0) { reversed = false; }
      this.list = list;
      this.reversed = reversed;
      this.current = reversed ? list.tail() : list.head();
      this.lastReturned = null;
      this.i = 0;
    }
    Iterator.prototype[Symbol.iterator] = function () {
      return this;
    };
    Iterator.prototype.next = function () {
      this.i++;
      if (this.i > 10000) {
        throw new Error("An error has probably ocurred!");
      }
      if (this.current) {
        this.lastReturned = this.current;
        if (this.reversed) {
          this.current = this.current.previous;
        }
        else {
          this.current = this.current.next;
        }
        return {
          done: false,
          value: this.lastReturned.node
        };
      }
      else {
        /**
         * Somehwere along the road, iterators and strictNullChecks stopped working well together.
         *
         * @see https://github.com/Microsoft/TypeScript/issues/11375
         */
        return {
          done: true,
          value: null
        };
      }
    };
    Iterator.prototype.remove = function () {
      if (!this.lastReturned) {
        throw new Error("Iterator.remove() was called before iterating");
      }
      if (!this.list.bounds_) {
        throw new Error("Iterator.remove() was somehow invoked on an empty list");
      }
      var next = this.lastReturned.next, previous = this.lastReturned.previous;
      if (next && previous) {
        next.previous = previous;
        previous.next = next;
      }
      else if (next) {
        next.previous = previous;
        this.list.bounds_.head = next;
      }
      else if (previous) {
        previous.next = next;
        this.list.bounds_.tail = previous;
      }
      else {
        this.list.bounds_ = null;
      }
      this.lastReturned = null;
      this.list.length_--;
    };
    return Iterator;
  }());
  var LinkedList = /*@__PURE__*/(function () {
    function LinkedList(nodes) {
      this.length_ = 0;
      if (nodes) {
        nodes.forEach(function (node) {
          this.push(node);
        }, this);
      }
    }
    LinkedList.prototype.iterator = function (reversed) {
      if (this.bounds_) {
        return new Iterator(this, reversed);
      }
      else {
        return new EmptyIterator();
      }
    };
    LinkedList.prototype.head = function () {
      return this.bounds_ && this.bounds_.head;
    };
    LinkedList.prototype.tail = function () {
      return this.bounds_ && this.bounds_.tail;
    };
    LinkedList.prototype.length = function () {
      return this.length_;
    };
    LinkedList.prototype.empty = function () {
      return this.length_ === 0;
    };
    LinkedList.prototype.push = function (node) {
      var entry = new NodeWrapper(node);
      if (this.bounds_) {
        entry.previous = this.bounds_.tail;
        this.bounds_.tail.next = entry;
        this.bounds_.tail = entry;
      }
      else {
        this.bounds_ = new ListBounds(entry, entry);
      }
      this.length_++;
      return this;
    };
    LinkedList.prototype.unshift = function (node) {
      var entry = new NodeWrapper(node);
      if (this.bounds_) {
        entry.next = this.bounds_.head;
        this.bounds_.head.previous = entry;
        this.bounds_.head = entry;
      }
      else {
        this.bounds_ = new ListBounds(entry, entry);
      }
      this.length_++;
      return this;
    };
    LinkedList.prototype.filter = function (condition) {
      var e_1, _a;
      var iter = this.iterator();
      try {
        for (var iter_1 = __values(iter), iter_1_1 = iter_1.next(); !iter_1_1.done; iter_1_1 = iter_1.next()) {
          var node = iter_1_1.value;
          if (!condition(node)) {
            iter.remove();
          }
        }
      }
      catch (e_1_1) { e_1 = { error: e_1_1 }; }
      finally {
        try {
          if (iter_1_1 && !iter_1_1.done && (_a = iter_1["return"])) _a.call(iter_1);
        }
        finally { if (e_1) throw e_1.error; }
      }
      return this;
    };
    return LinkedList;
  }());
  var XPathNodeSet = /*@__PURE__*/(function (_super) {
    __extends(XPathNodeSet, _super);
    function XPathNodeSet() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    XPathNodeSet.prototype.asString = function () {
      var first = this.first();
      if (first) {
        return first.asString();
      }
      else {
        return "";
      }
    };
    XPathNodeSet.prototype.first = function () {
      return this.bounds_ && this.bounds_.head.node;
    };
    XPathNodeSet.prototype.last = function () {
      return this.bounds_ && this.bounds_.tail.node;
    };
    XPathNodeSet.prototype.asNumber = function () {
      return +this.asString();
    };
    XPathNodeSet.prototype.asBoolean = function () {
      return this.length() !== 0;
    };
    XPathNodeSet.prototype.merge = function (b) {
      var a = this;
      var merged = new XPathNodeSet();
      var aCurr = a.bounds_ && a.bounds_.head;
      var bCurr = b.bounds_ && b.bounds_.head;
      while (aCurr && bCurr) {
        if (aCurr.node.isEqual(bCurr.node)) {
          merged.push(aCurr.node);
          aCurr = aCurr.next;
          bCurr = bCurr.next;
        }
        else {
          var compareResult = aCurr.node.compareDocumentPosition(bCurr.node);
          if (compareResult > 0) {
            merged.push(bCurr.node);
            bCurr = bCurr.next;
          }
          else {
            merged.push(aCurr.node);
            aCurr = aCurr.next;
          }
        }
      }
      var next = aCurr || bCurr;
      while (next) {
        merged.push(next.node);
        next = next.next;
      }
      return merged;
    };
    XPathNodeSet.prototype.toString = function () {
      var e_2, _a;
      var nodes = [];
      try {
        for (var _b = __values(this.iterator()), _c = _b.next(); !_c.done; _c = _b.next()) {
          var node = _c.value;
          nodes.push("" + node);
        }
      }
      catch (e_2_1) { e_2 = { error: e_2_1 }; }
      finally {
        try {
          if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
      }
      return "NodeSet<" + nodes.join(", ") + ">";
    };
    return XPathNodeSet;
  }(LinkedList));
  var ELEMENT_NODE = 1;
  var ATTRIBUTE_NODE = 2;
  var TEXT_NODE = 3;
  var PROCESSING_INSTRUCTION_NODE = 7;
  var COMMENT_NODE = 8;
  var DOCUMENT_NODE = 9;
  function evaluate(rootEvaluator, context, type) {
    var nodes = new XPathNodeSet();
    if (context.getNode().getNodeType() !== DOCUMENT_NODE) {
      nodes = nodes.unshift(context.getNode().getParent());
      nodes = nodes.merge(evaluate(rootEvaluator, new Context(context.getNode().getParent(), 1, 1), type));
    }
    return nodes;
  }
  function evaluate$1(rootEvaluator, context, type) {
    var nodes = new XPathNodeSet([context.getNode()]);
    return evaluate(rootEvaluator, context, type).merge(nodes);
  }
  function evaluate$2(rootEvaluator, context, type) {
    return new XPathNodeSet(context.getNode().getAttributes());
  }
  function evaluate$3(rootEvaluator, context, type) {
    return new XPathNodeSet(context.getNode().getChildNodes());
  }
  function evaluate$4(rootEvaluator, context, type) {
    var e_3, _a;
    var nodes = new XPathNodeSet();
    var children = new XPathNodeSet(context.getNode().getChildNodes());
    try {
      for (var _b = __values(children.iterator()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var child = _c.value;
        nodes = nodes.push(child);
        nodes = nodes.merge(evaluate$4(rootEvaluator, new Context(child, 1, 1), type));
      }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
      try {
        if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
      }
      finally { if (e_3) throw e_3.error; }
    }
    return nodes;
  }
  function evaluate$5(rootEvaluator, context, type) {
    var nodes = new XPathNodeSet([context.getNode()]);
    return nodes.merge(evaluate$4(rootEvaluator, context, type));
  }
  function evaluate$6(rootEvaluator, context, type) {
    return rootEvaluator.evaluate({
      type: RELATIVE_LOCATION_PATH,
      steps: [{
          axis: ANCESTOR_OR_SELF,
          test: {
            type: NODE_TYPE_TEST,
            name: NODE
          },
          predicates: []
        }, {
          axis: FOLLOWING_SIBLING,
          test: {
            type: NODE_TYPE_TEST,
            name: NODE
          },
          predicates: []
        }, {
          axis: DESCENDANT_OR_SELF,
          test: {
            type: NODE_TYPE_TEST,
            name: NODE
          },
          predicates: []
        }]
    }, context, type);
  }
  function evaluate$7(rootEvaluator, context, type) {
    return new XPathNodeSet(context.getNode().getFollowingSiblings());
  }
  function evaluate$8(rootEvaluator, context, type) {
    throw new Error("Namespace axis is not implemented");
  }
  function evaluate$9(rootEvaluator, context, type) {
    var nodes = new XPathNodeSet();
    if (context.getNode().getNodeType() !== DOCUMENT_NODE) {
      nodes = nodes.push(context.getNode().getParent());
    }
    return nodes;
  }
  function evaluate$a(rootEvaluator, context, type) {
    return rootEvaluator.evaluate({
      type: RELATIVE_LOCATION_PATH,
      steps: [{
          axis: ANCESTOR_OR_SELF,
          test: {
            type: NODE_TYPE_TEST,
            name: NODE
          },
          predicates: []
        }, {
          axis: PRECEDING_SIBLING,
          test: {
            type: NODE_TYPE_TEST,
            name: NODE
          },
          predicates: []
        }, {
          axis: DESCENDANT_OR_SELF,
          test: {
            type: NODE_TYPE_TEST,
            name: NODE
          },
          predicates: []
        }]
    }, context, type);
  }
  function evaluate$b(rootEvaluator, context, type) {
    return new XPathNodeSet(context.getNode().getPrecedingSiblings());
  }
  function evaluate$c(rootEvaluator, context, type) {
    return new XPathNodeSet([context.getNode()]);
  }
  var XPathNumber = /*@__PURE__*/(function () {
    function XPathNumber(value) {
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
    return XPathNumber;
  }());
  function getAxisEvaluator(axis) {
    switch (axis) {
      case ANCESTOR: return evaluate;
      case ANCESTOR_OR_SELF: return evaluate$1;
      case ATTRIBUTE: return evaluate$2;
      case CHILD: return evaluate$3;
      case DESCENDANT: return evaluate$4;
      case DESCENDANT_OR_SELF: return evaluate$5;
      case FOLLOWING: return evaluate$6;
      case FOLLOWING_SIBLING: return evaluate$7;
      case NAMESPACE: return evaluate$8;
      case PARENT: return evaluate$9;
      case PRECEDING: return evaluate$a;
      case PRECEDING_SIBLING: return evaluate$b;
      case SELF: return evaluate$c;
    }
  }
  function evaluate$d(rootEvaluator, ast, context, type) {
    var e_4, _a;
    var nodes = getAxisEvaluator(ast.axis)(rootEvaluator, context, type);
    var test = ast.test;
    if (test.type === NODE_NAME_TEST || (test.type == PROCESSING_INSTRUCTION_TEST && test.name)) {
      var name = ast.test.name;
      nodes = nodes.filter(function (node) {
        return (name === "*" && !!node.getName()) || node.getName() === ast.test.name;
      });
    }
    if ((test.type === NODE_TYPE_TEST && test.name !== NODE) || test.type === PROCESSING_INSTRUCTION_TEST) {
      var nodeType;
      if (test.type === NODE_TYPE_TEST) {
        switch (test.name) {
          case COMMENT:
            nodeType = COMMENT_NODE;
            break;
          case PROCESSING_INSTRUCTION:
            nodeType = PROCESSING_INSTRUCTION_NODE;
            break;
          case TEXT:
            nodeType = TEXT_NODE;
            break;
          default:
            throw new Error("Unknown node nodeType " + test.name);
        }
      }
      else {
        nodeType = PROCESSING_INSTRUCTION_NODE;
      }
      nodes = nodes.filter(function (node) {
        return node.getNodeType() === nodeType;
      });
    }
    if (ast.predicates.length > 0) {
      var reversed = (ast.axis === ANCESTOR ||
        ast.axis === ANCESTOR_OR_SELF ||
        ast.axis === PRECEDING ||
        ast.axis === PRECEDING_SIBLING);
      var position = 0, length = nodes.length(), iter = nodes.iterator(reversed);
      try {
        for (var iter_2 = __values(iter), iter_2_1 = iter_2.next(); !iter_2_1.done; iter_2_1 = iter_2.next()) {
          var node = iter_2_1.value;
          position++;
          var keep = ast.predicates.every(function (predicate) {
            var result = rootEvaluator.evaluate(predicate, new Context(node, position, length), type);
            if (result === null) {
              return false;
            }
            if (result instanceof XPathNumber) {
              return result.asNumber() === position;
            }
            else {
              return result.asBoolean();
            }
          });
          if (!keep) {
            iter.remove();
          }
        }
      }
      catch (e_4_1) { e_4 = { error: e_4_1 }; }
      finally {
        try {
          if (iter_2_1 && !iter_2_1.done && (_a = iter_2["return"])) _a.call(iter_2);
        }
        finally { if (e_4) throw e_4.error; }
      }
    }
    return nodes;
  }
  function evaluate$e(rootEvaluator, ast, context, type) {
    var e_5, _a;
    var nodeSet = new XPathNodeSet([context.getNode()]), nextNodeSet = new XPathNodeSet();
    if (ast.steps) {
      for (var i = 0; i < ast.steps.length; i++) {
        try {
          for (var _b = __values(nodeSet.iterator()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var node = _c.value;
            var stepResult = evaluate$d(rootEvaluator, ast.steps[i], new Context(node, 1, 1), type);
            nextNodeSet = nextNodeSet.merge(stepResult);
          }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
          try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
          }
          finally { if (e_5) throw e_5.error; }
        }
        nodeSet = nextNodeSet;
        nextNodeSet = new XPathNodeSet();
      }
    }
    return nodeSet;
  }
  function evaluate$f(rootEvaluator, ast, context, type) {
    return evaluate$e(rootEvaluator, {
      type: RELATIVE_LOCATION_PATH,
      steps: ast.steps
    }, new Context(context.getNode().getOwnerDocument(), 1, 1), type);
  }
  function evaluate$g(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    return new XPathNumber(lhs.asNumber() + rhs.asNumber());
  }
  var XPathBoolean = /*@__PURE__*/(function () {
    function XPathBoolean(value) {
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
    return XPathBoolean;
  }());
  function evaluate$h(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    if (!lhs.asBoolean()) {
      return new XPathBoolean(false);
    }
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    return new XPathBoolean(rhs.asBoolean());
  }
  function evaluate$i(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    return new XPathNumber(lhs.asNumber() / rhs.asNumber());
  }
  var XPathString = /*@__PURE__*/(function () {
    function XPathString(value) {
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
    return XPathString;
  }());
  function compareNodes(type, lhs, rhs, comparator) {
    var e_6, _a, e_7, _b, e_8, _c;
    if (lhs instanceof XPathNodeSet && rhs instanceof XPathNodeSet) {
      try {
        for (var _d = __values(lhs.iterator()), _e = _d.next(); !_e.done; _e = _d.next()) {
          var lNode = _e.value;
          try {
            for (var _f = __values(rhs.iterator()), _g = _f.next(); !_g.done; _g = _f.next()) {
              var rNode = _g.value;
              if (comparator(lNode.asString(), rNode.asString())) {
                return new XPathBoolean(true);
              }
            }
          }
          catch (e_7_1) { e_7 = { error: e_7_1 }; }
          finally {
            try {
              if (_g && !_g.done && (_b = _f["return"])) _b.call(_f);
            }
            finally { if (e_7) throw e_7.error; }
          }
        }
      }
      catch (e_6_1) { e_6 = { error: e_6_1 }; }
      finally {
        try {
          if (_e && !_e.done && (_a = _d["return"])) _a.call(_d);
        }
        finally { if (e_6) throw e_6.error; }
      }
      return new XPathBoolean(false);
    }
    if (lhs instanceof XPathNodeSet || rhs instanceof XPathNodeSet) {
      var nodeSet, primitive;
      if (lhs instanceof XPathNodeSet) {
        nodeSet = lhs;
        primitive = rhs;
      }
      else {
        nodeSet = rhs;
        primitive = lhs;
      }
      if (primitive instanceof XPathBoolean) {
        if (comparator(nodeSet.asBoolean(), primitive.asBoolean())) {
          return new XPathBoolean(true);
        }
      }
      else {
        try {
          for (var _h = __values(nodeSet.iterator()), _j = _h.next(); !_j.done; _j = _h.next()) {
            var node = _j.value;
            if (primitive instanceof XPathNumber) {
              if (comparator(node.asNumber(), primitive.asNumber())) {
                return new XPathBoolean(true);
              }
            }
            else if (primitive instanceof XPathString) {
              if (comparator(node.asString(), primitive.asString())) {
                return new XPathBoolean(true);
              }
            }
            else {
              throw new Error("Unknown value type");
            }
          }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
          try {
            if (_j && !_j.done && (_c = _h["return"])) _c.call(_h);
          }
          finally { if (e_8) throw e_8.error; }
        }
      }
      return new XPathBoolean(false);
    }
    // Neither object is a NodeSet at this point.
    if (type === EQUALITY ||
      type === INEQUALITY) {
      if (lhs instanceof XPathBoolean || rhs instanceof XPathBoolean) {
        if (comparator(lhs.asBoolean(), rhs.asBoolean())) {
          return new XPathBoolean(true);
        }
      }
      else if (lhs instanceof XPathNumber || rhs instanceof XPathNumber) {
        if (comparator(lhs.asNumber(), rhs.asNumber())) {
          return new XPathBoolean(true);
        }
      }
      else if (lhs instanceof XPathString || rhs instanceof XPathString) {
        if (comparator(lhs.asString(), rhs.asString())) {
          return new XPathBoolean(true);
        }
      }
      else {
        throw new Error("Unknown value types");
      }
      return new XPathBoolean(false);
    }
    else {
      return new XPathBoolean(comparator(lhs.asNumber(), rhs.asNumber()));
    }
  }
  function evaluate$j(rootEvaluator, ast, context, type) {
    return compareNodes(ast.type, rootEvaluator.evaluate(ast.lhs, context, type), rootEvaluator.evaluate(ast.rhs, context, type), function (lhs, rhs) {
      return lhs === rhs;
    });
  }
  function evaluate$k(rootEvaluator, ast, context, type) {
    var e_9, _a;
    var nodes = rootEvaluator.evaluate(ast.primary, context, type);
    if (!(nodes instanceof XPathNodeSet)) {
      throw new Error("Predicates can only be used when primary expression yields a node-set");
    }
    var position = 0, length = nodes.length(), iter = nodes.iterator();
    try {
      for (var iter_3 = __values(iter), iter_3_1 = iter_3.next(); !iter_3_1.done; iter_3_1 = iter_3.next()) {
        var node = iter_3_1.value;
        position++;
        var keep = ast.predicates.every(function (predicate) {
          var result = rootEvaluator.evaluate(predicate, new Context(node, position, length), type);
          if (result === null) {
            return false;
          }
          if (result instanceof XPathNumber) {
            return result.asNumber() === position;
          }
          else {
            return result.asBoolean();
          }
        });
        if (!keep) {
          iter.remove();
        }
      }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
      try {
        if (iter_3_1 && !iter_3_1.done && (_a = iter_3["return"])) _a.call(iter_3);
      }
      finally { if (e_9) throw e_9.error; }
    }
    return nodes;
  }
  function evaluate$l(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (args.length !== 1) {
      throw new Error("Expected a single argument");
    }
    return new XPathBoolean(args[0].asBoolean());
  }
  function evaluate$m(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (args.length !== 1) {
      throw new Error("Expected a single argument");
    }
    var number = args[0];
    if (!(number instanceof XPathNumber)) {
      throw new Error("Wrong type of argument");
    }
    return new XPathNumber(Math.ceil(number.asNumber()));
  }
  function evaluate$n(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (args.length === 0) {
      throw new Error("Expected some arguments");
    }
    return new XPathString(args.map(function (arg) {
      return arg.asString();
    }).join(""));
  }
  function evaluate$o(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (args.length !== 2) {
      throw new Error("Expected two arguments");
    }
    var base = args[0].asString();
    var contains = args[1].asString();
    return new XPathBoolean(base.indexOf(contains) !== -1);
  }
  function evaluate$p(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (args.length !== 1) {
      throw new Error("Expected a single argument");
    }
    var nodeset = args[0];
    if (!(nodeset instanceof XPathNodeSet)) {
      throw new Error("Wrong type of argument");
    }
    return new XPathNumber(nodeset.length());
  }
  function evaluate$q(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    return new XPathBoolean(false);
  }
  function evaluate$r(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (args.length !== 1) {
      throw new Error("Expected a single argument");
    }
    var number = args[0];
    if (!(number instanceof XPathNumber)) {
      throw new Error("Wrong type of argument");
    }
    return new XPathNumber(Math.floor(number.asNumber()));
  }
  function evaluate$s(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    var e_10, _a;
    if (args.length !== 1) {
      throw new Error("Expected a single argument");
    }
    var value = args[0];
    var node, ids = [];
    if (value instanceof XPathNodeSet) {
      try {
        for (var _b = __values(value.iterator()), _c = _b.next(); !_c.done; _c = _b.next()) {
          node = _c.value;
          ids = ids.concat(node.asString().split(/\s+/g));
        }
      }
      catch (e_10_1) { e_10 = { error: e_10_1 }; }
      finally {
        try {
          if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_10) throw e_10.error; }
      }
    }
    else if (value instanceof XPathString) {
      ids = value.asString().split(/\s+/g);
    }
    else {
      ids.push(value.asString());
    }
    var nodes = new XPathNodeSet();
    for (var i = 0; i < ids.length; i++) {
      node = context.getNode().getOwnerDocument().getElementById(ids[i]);
      if (node) {
        nodes = nodes.merge(new XPathNodeSet([node]));
      }
    }
    return nodes;
  }
  function evaluate$t(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    return new XPathNumber(context.getLast());
  }
  function evaluate$u(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    var nodeset = args[0];
    if (!nodeset) {
      nodeset = new XPathNodeSet([context.getNode()]);
    }
    if (args.length > 1) {
      throw new Error("Expected at most one argument");
    }
    if (!(nodeset instanceof XPathNodeSet)) {
      throw new Error("Wrong type of argument");
    }
    var first = nodeset.first();
    if (first) {
      return new XPathString(first.getName());
    }
    else {
      return new XPathString("");
    }
  }
  function evaluate$v(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    var nodeset = args[0];
    if (!nodeset) {
      return new XPathString(context.getNode().getName());
    }
    else {
      if (args.length > 1) {
        throw new Error("Expected at most one argument");
      }
      if (!(nodeset instanceof XPathNodeSet)) {
        throw new Error("Wrong type of argument");
      }
      if (nodeset.empty()) {
        return new XPathString("");
      }
      else {
        return new XPathString(nodeset.first().getName());
      }
    }
  }
  function evaluate$w(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    var value = args[0];
    var string;
    if (!value) {
      string = context.getNode().asString();
    }
    else {
      if (args.length > 1) {
        throw new Error("Expected at most one argument");
      }
      string = value.asString();
    }
    return new XPathString(string.trim().replace(/\s{2,}/g, " "));
  }
  function evaluate$x(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (args.length !== 1) {
      throw new Error("Expected a single argument");
    }
    return new XPathBoolean(!args[0].asBoolean());
  }
  function evaluate$y(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (args.length !== 1) {
      throw new Error("Expected a single argument");
    }
    return new XPathNumber(args[0].asNumber());
  }
  function evaluate$z(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    return new XPathNumber(context.getPosition());
  }
  function evaluate$A(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (args.length !== 1) {
      throw new Error("Expected a single argument");
    }
    var number = args[0];
    if (!(number instanceof XPathNumber)) {
      throw new Error("Wrong type of argument");
    }
    return new XPathNumber(Math.round(number.asNumber()));
  }
  function evaluate$B(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (args.length !== 2) {
      throw new Error("Expected two arguments");
    }
    var base = args[0].asString();
    var substring = args[1].asString();
    var index = base.indexOf(substring);
    return new XPathBoolean(index === 0);
  }
  function evaluate$C(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    var string = args[0];
    if (!string) {
      return new XPathNumber(context.getNode().asString().length);
    }
    else {
      if (args.length > 1) {
        throw new Error("Expected at most one argument");
      }
      if (!(string instanceof XPathString)) {
        throw new Error("Wrong type of argument");
      }
      return new XPathNumber(string.asString().length);
    }
  }
  function evaluate$D(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    var value = args[0];
    if (!value) {
      value = new XPathNodeSet([context.getNode()]);
    }
    if (args.length > 1) {
      throw new Error("Expected at most one argument");
    }
    return new XPathString(value.asString());
  }
  function evaluate$E(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (args.length !== 2) {
      throw new Error("Expected two arguments");
    }
    var base = args[0].asString();
    var substring = args[1].asString();
    var index = base.indexOf(substring);
    if (index === -1) {
      return new XPathString("");
    }
    else {
      return new XPathString(base.substring(index + substring.length));
    }
  }
  function evaluate$F(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (args.length !== 2) {
      throw new Error("Expected two arguments");
    }
    var base = args[0].asString();
    var substring = args[1].asString();
    var index = base.indexOf(substring);
    if (index === -1) {
      return new XPathString("");
    }
    else {
      return new XPathString(base.substring(0, index));
    }
  }
  function evaluate$G(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (args.length !== 2 && args.length !== 3) {
      throw new Error("Expected two or three arguments");
    }
    var base = args[0].asString();
    var start = Math.round(args[1].asNumber());
    var length = args[2];
    if (isNaN(start) || start === Infinity || start === -Infinity) {
      return new XPathString("");
    }
    if (length) {
      var roundedLength = Math.round(length.asNumber());
      if (isNaN(roundedLength) || roundedLength === -Infinity) {
        return new XPathString("");
      }
      return new XPathString(base.substring(start - 1, start + roundedLength - 1));
    }
    else {
      return new XPathString(base.substring(start - 1));
    }
  }
  function evaluate$H(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    var e_11, _a;
    if (args.length !== 1) {
      throw new Error("Expected a single argument");
    }
    var nodeset = args[0];
    if (!(nodeset instanceof XPathNodeSet)) {
      throw new Error("Wrong type of argument");
    }
    var sum = 0;
    try {
      for (var _b = __values(nodeset.iterator()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var node = _c.value;
        sum = sum + node.asNumber();
      }
    }
    catch (e_11_1) { e_11 = { error: e_11_1 }; }
    finally {
      try {
        if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
      }
      finally { if (e_11) throw e_11.error; }
    }
    return new XPathNumber(sum);
  }
  function evaluate$I(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (args.length !== 3) {
      throw new Error("Expected three arguments");
    }
    if (!(args[0] instanceof XPathString) ||
      !(args[1] instanceof XPathString) ||
      !(args[2] instanceof XPathString)) {
      throw new Error("Expected string arguments");
    }
    var base = args[0].asString(), mapFrom = args[1].asString(), mapTo = args[2].asString();
    for (var i = 0; i < mapFrom.length; i++) {
      if (i < mapTo.length) {
        base = base.replace(new RegExp(mapFrom[i], "g"), mapTo[i]);
      }
      else {
        base = base.replace(new RegExp(mapFrom[i], "g"), "");
      }
    }
    return new XPathString(base);
  }
  function evaluate$J(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    return new XPathBoolean(true);
  }
  function getFunctionEvaluator(name) {
    switch (name) {
      case BOOLEAN: return evaluate$l;
      case CEILING: return evaluate$m;
      case CONCAT: return evaluate$n;
      case CONTAINS: return evaluate$o;
      case COUNT: return evaluate$p;
      case FALSE: return evaluate$q;
      case FLOOR: return evaluate$r;
      case ID: return evaluate$s;
      case LAST: return evaluate$t;
      case LOCAL_NAME: return evaluate$u;
      case NAME: return evaluate$v;
      case NORMALIZE_SPACE: return evaluate$w;
      case NOT: return evaluate$x;
      case NUMBER: return evaluate$y;
      case POSITION: return evaluate$z;
      case ROUND: return evaluate$A;
      case STARTS_WITH: return evaluate$B;
      case STRING_LENGTH: return evaluate$C;
      case STRING: return evaluate$D;
      case SUBSTRING_AFTER: return evaluate$E;
      case SUBSTRING_BEFORE: return evaluate$F;
      case SUBSTRING: return evaluate$G;
      case SUM: return evaluate$H;
      case TRANSLATE: return evaluate$I;
      case TRUE: return evaluate$J;
    }
  }
  function evaluate$K(rootEvaluator, ast, context, type) {
    var args = ast.args.map(function (arg) {
      return rootEvaluator.evaluate(arg, context, type);
    });
    return getFunctionEvaluator(ast.name).apply(void 0, __spread([context], args));
  }
  function evaluate$L(rootEvaluator, ast, context, type) {
    return compareNodes(ast.type, rootEvaluator.evaluate(ast.lhs, context, type), rootEvaluator.evaluate(ast.rhs, context, type), function (lhs, rhs) {
      return lhs > rhs;
    });
  }
  function evaluate$M(rootEvaluator, ast, context, type) {
    return compareNodes(ast.type, rootEvaluator.evaluate(ast.lhs, context, type), rootEvaluator.evaluate(ast.rhs, context, type), function (lhs, rhs) {
      return lhs >= rhs;
    });
  }
  function evaluate$N(rootEvaluator, ast, context, type) {
    return compareNodes(ast.type, rootEvaluator.evaluate(ast.lhs, context, type), rootEvaluator.evaluate(ast.rhs, context, type), function (lhs, rhs) {
      return lhs !== rhs;
    });
  }
  function evaluate$O(rootEvaluator, ast, context, type) {
    return compareNodes(ast.type, rootEvaluator.evaluate(ast.lhs, context, type), rootEvaluator.evaluate(ast.rhs, context, type), function (lhs, rhs) {
      return lhs < rhs;
    });
  }
  function evaluate$P(rootEvaluator, ast, context, type) {
    return compareNodes(ast.type, rootEvaluator.evaluate(ast.lhs, context, type), rootEvaluator.evaluate(ast.rhs, context, type), function (lhs, rhs) {
      return lhs <= rhs;
    });
  }
  function evaluate$Q(rootEvaluator, ast, context, type) {
    return new XPathString(ast.string);
  }
  function evaluate$R(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    return new XPathNumber(lhs.asNumber() % rhs.asNumber());
  }
  function evaluate$S(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    return new XPathNumber(lhs.asNumber() * rhs.asNumber());
  }
  function evaluate$T(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    return new XPathNumber(-lhs.asNumber());
  }
  function evaluate$U(rootEvaluator, ast, context, type) {
    return new XPathNumber(ast.number);
  }
  function evaluate$V(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    if (lhs.asBoolean()) {
      return new XPathBoolean(true);
    }
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    return new XPathBoolean(rhs.asBoolean());
  }
  function evaluate$W(rootEvaluator, ast, context, type) {
    var e_12, _a;
    var nodes = rootEvaluator.evaluate(ast.filter, context, type);
    if (!(nodes instanceof XPathNodeSet)) {
      throw new Error("Paths can only be used when filter expression yields a node-set");
    }
    var nodeSets = [];
    try {
      for (var _b = __values(nodes.iterator()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var node = _c.value;
        nodeSets.push(evaluate$e(rootEvaluator, {
          type: RELATIVE_LOCATION_PATH,
          steps: ast.steps
        }, new Context(node, 1, 1), type));
      }
    }
    catch (e_12_1) { e_12 = { error: e_12_1 }; }
    finally {
      try {
        if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
      }
      finally { if (e_12) throw e_12.error; }
    }
    return nodeSets.reduce(function (previousValue, currentValue) {
      return previousValue.merge(currentValue);
    });
  }
  function evaluate$X(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    return new XPathNumber(lhs.asNumber() - rhs.asNumber());
  }
  function evaluate$Y(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    if (!(lhs instanceof XPathNodeSet)) {
      throw new Error("Union operator can only be used with expression yielding node-set");
    }
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    if (!(rhs instanceof XPathNodeSet)) {
      throw new Error("Union operator can only be used with expression yielding node-set");
    }
    return lhs.merge(rhs);
  }
  var XPathException = /*@__PURE__*/(function () {
    function XPathException(code, message) {
      this.code = code;
      this.message = message;
    }
    return XPathException;
  }());
  var TYPE_ERR = 52;
  var ANY_TYPE = 0;
  var NUMBER_TYPE = 1;
  var STRING_TYPE = 2;
  var BOOLEAN_TYPE = 3;
  var UNORDERED_NODE_ITERATOR_TYPE = 4;
  var ORDERED_NODE_ITERATOR_TYPE = 5;
  var UNORDERED_NODE_SNAPSHOT_TYPE = 6;
  var ORDERED_NODE_SNAPSHOT_TYPE = 7;
  var ANY_UNORDERED_NODE_TYPE = 8;
  var FIRST_ORDERED_NODE_TYPE = 9;
  var XPathResult = /*@__PURE__*/(function () {
    function XPathResult(type, value) {
      var e_13, _a;
      this.invalidIteratorState = false;
      this.ANY_TYPE = ANY_TYPE;
      this.NUMBER_TYPE = NUMBER_TYPE;
      this.STRING_TYPE = STRING_TYPE;
      this.BOOLEAN_TYPE = BOOLEAN_TYPE;
      this.UNORDERED_NODE_ITERATOR_TYPE = UNORDERED_NODE_ITERATOR_TYPE;
      this.ORDERED_NODE_ITERATOR_TYPE = ORDERED_NODE_ITERATOR_TYPE;
      this.UNORDERED_NODE_SNAPSHOT_TYPE = UNORDERED_NODE_SNAPSHOT_TYPE;
      this.ORDERED_NODE_SNAPSHOT_TYPE = ORDERED_NODE_SNAPSHOT_TYPE;
      this.ANY_UNORDERED_NODE_TYPE = ANY_UNORDERED_NODE_TYPE;
      this.FIRST_ORDERED_NODE_TYPE = FIRST_ORDERED_NODE_TYPE;
      this.value = value;
      if (type === ANY_TYPE) {
        if (value instanceof XPathNodeSet) {
          this.resultType = UNORDERED_NODE_ITERATOR_TYPE;
        }
        else if (value instanceof XPathString) {
          this.resultType = STRING_TYPE;
        }
        else if (value instanceof XPathNumber) {
          this.resultType = NUMBER_TYPE;
        }
        else if (value instanceof XPathBoolean) {
          this.resultType = BOOLEAN_TYPE;
        }
        else {
          throw new Error("Unexpected evaluation result");
        }
      }
      else {
        this.resultType = type;
      }
      if (this.resultType !== STRING_TYPE &&
        this.resultType !== NUMBER_TYPE &&
        this.resultType !== BOOLEAN_TYPE &&
        !(value instanceof XPathNodeSet)) {
        throw Error("Value could not be converted to the specified type");
      }
      if (this.resultType === UNORDERED_NODE_ITERATOR_TYPE ||
        this.resultType === ORDERED_NODE_ITERATOR_TYPE ||
        this.resultType === UNORDERED_NODE_SNAPSHOT_TYPE ||
        this.resultType === ORDERED_NODE_SNAPSHOT_TYPE) {
        this.nodes = [];
        try {
          for (var _b = __values(this.value.iterator()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var node = _c.value;
            this.nodes.push(node.getNativeNode());
          }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
          try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
          }
          finally { if (e_13) throw e_13.error; }
        }
      }
      var self = this;
      var hasDefineProperty = true;
      try {
        Object.defineProperty({}, "x", {});
      }
      catch (e) {
        hasDefineProperty = false;
      }
      if (hasDefineProperty) {
        Object.defineProperty(this, "numberValue", { get: function () {
            if (self.resultType !== NUMBER_TYPE) {
              throw new XPathException(TYPE_ERR, "resultType is not NUMBER_TYPE");
            }
            return self.value.asNumber();
          } });
        Object.defineProperty(this, "stringValue", { get: function () {
            if (self.resultType !== STRING_TYPE) {
              throw new XPathException(TYPE_ERR, "resultType is not STRING_TYPE");
            }
            return self.value.asString();
          } });
        Object.defineProperty(this, "booleanValue", { get: function () {
            if (self.resultType !== BOOLEAN_TYPE) {
              throw new XPathException(TYPE_ERR, "resultType is not BOOLEAN_TYPE");
            }
            return self.value.asBoolean();
          } });
        Object.defineProperty(this, "singleNodeValue", { get: function () {
            if (self.resultType !== FIRST_ORDERED_NODE_TYPE &&
              self.resultType !== ANY_UNORDERED_NODE_TYPE) {
              throw new XPathException(TYPE_ERR, "resultType is not a node set");
            }
            var first = self.value.first();
            return first && first.getNativeNode();
          } });
        Object.defineProperty(this, "invalidIteratorState", { get: function () {
            throw new Error("invalidIteratorState is not implemented");
          } });
        Object.defineProperty(this, "snapshotLength", { get: function () {
            if (self.resultType !== ORDERED_NODE_SNAPSHOT_TYPE &&
              self.resultType !== UNORDERED_NODE_SNAPSHOT_TYPE) {
              throw new XPathException(TYPE_ERR, "resultType is not a node set");
            }
            return self.value.length();
          } });
      }
      else {
        if (this.resultType === NUMBER_TYPE) {
          this.numberValue = this.value.asNumber();
        }
        if (this.resultType === STRING_TYPE) {
          this.stringValue = this.value.asString();
        }
        if (this.resultType === BOOLEAN_TYPE) {
          this.booleanValue = this.value.asBoolean();
        }
        if (this.resultType === FIRST_ORDERED_NODE_TYPE ||
          this.resultType === ANY_UNORDERED_NODE_TYPE) {
          var first = this.value.first();
          this.singleNodeValue = first && first.getNativeNode();
        }
        if (this.resultType === ORDERED_NODE_SNAPSHOT_TYPE ||
          this.resultType === UNORDERED_NODE_SNAPSHOT_TYPE) {
          this.snapshotLength = this.value.length();
        }
      }
    }
    XPathResult.prototype.iterateNext = function () {
      if (this.resultType !== ORDERED_NODE_ITERATOR_TYPE &&
        this.resultType !== UNORDERED_NODE_ITERATOR_TYPE) {
        throw new XPathException(TYPE_ERR, "iterateNext called with wrong result type");
      }
      this.index = this.index || 0;
      return (this.index >= this.nodes.length) ? null : this.nodes[this.index++];
    };
    XPathResult.prototype.snapshotItem = function (index) {
      if (this.resultType !== ORDERED_NODE_SNAPSHOT_TYPE &&
        this.resultType !== UNORDERED_NODE_SNAPSHOT_TYPE) {
        throw new XPathException(TYPE_ERR, "snapshotItem called with wrong result type");
      }
      return this.nodes[index] || null;
    };
    return XPathResult;
  }());
  XPathResult.ANY_TYPE = ANY_TYPE;
  XPathResult.NUMBER_TYPE = NUMBER_TYPE;
  XPathResult.STRING_TYPE = STRING_TYPE;
  XPathResult.BOOLEAN_TYPE = BOOLEAN_TYPE;
  XPathResult.UNORDERED_NODE_ITERATOR_TYPE = UNORDERED_NODE_ITERATOR_TYPE;
  XPathResult.ORDERED_NODE_ITERATOR_TYPE = ORDERED_NODE_ITERATOR_TYPE;
  XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE = UNORDERED_NODE_SNAPSHOT_TYPE;
  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = ORDERED_NODE_SNAPSHOT_TYPE;
  XPathResult.ANY_UNORDERED_NODE_TYPE = ANY_UNORDERED_NODE_TYPE;
  XPathResult.FIRST_ORDERED_NODE_TYPE = FIRST_ORDERED_NODE_TYPE;
  var XPathExpression = /*@__PURE__*/(function () {
    function XPathExpression(expression, adapter) {
      this.ast = new XPathAnalyzer(expression).parse();
      this.adapter = adapter;
    }
    XPathExpression.prototype.evaluate = function (nativeContext, type) {
      var Adapter = this.adapter;
      var evaluate = function (ast, context, type) {
        switch (ast.type) {
          case ABSOLUTE_LOCATION_PATH:
            return evaluate$f({ evaluate: evaluate }, ast, context, type);
          case ADDITIVE:
            return evaluate$g({ evaluate: evaluate }, ast, context, type);
          case AND:
            return evaluate$h({ evaluate: evaluate }, ast, context, type);
          case DIVISIONAL:
            return evaluate$i({ evaluate: evaluate }, ast, context, type);
          case EQUALITY:
            return evaluate$j({ evaluate: evaluate }, ast, context, type);
          case FILTER:
            return evaluate$k({ evaluate: evaluate }, ast, context, type);
          case FUNCTION_CALL:
            return evaluate$K({ evaluate: evaluate }, ast, context, type);
          case GREATER_THAN:
            return evaluate$L({ evaluate: evaluate }, ast, context, type);
          case GREATER_THAN_OR_EQUAL:
            return evaluate$M({ evaluate: evaluate }, ast, context, type);
          case INEQUALITY:
            return evaluate$N({ evaluate: evaluate }, ast, context, type);
          case LESS_THAN:
            return evaluate$O({ evaluate: evaluate }, ast, context, type);
          case LESS_THAN_OR_EQUAL:
            return evaluate$P({ evaluate: evaluate }, ast, context, type);
          case LITERAL:
            return evaluate$Q({ evaluate: evaluate }, ast, context, type);
          case MODULUS:
            return evaluate$R({ evaluate: evaluate }, ast, context, type);
          case MULTIPLICATIVE:
            return evaluate$S({ evaluate: evaluate }, ast, context, type);
          case NEGATION:
            return evaluate$T({ evaluate: evaluate }, ast, context, type);
          case NUMBER:
            return evaluate$U({ evaluate: evaluate }, ast, context, type);
          case OR:
            return evaluate$V({ evaluate: evaluate }, ast, context, type);
          case PATH:
            return evaluate$W({ evaluate: evaluate }, ast, context, type);
          case RELATIVE_LOCATION_PATH:
            return evaluate$e({ evaluate: evaluate }, ast, context, type);
          case SUBTRACTIVE:
            return evaluate$X({ evaluate: evaluate }, ast, context, type);
          case UNION:
            return evaluate$Y({ evaluate: evaluate }, ast, context, type);
        }
      };
      var value = evaluate(this.ast, new Context(new Adapter(nativeContext), 1, 1), type);
      return new XPathResult(type, value);
    };
    return XPathExpression;
  }());
  function throwNotImplemented() {
    throw new Error("Namespaces are not implemented");
  }
  var XPathEvaluator = /*@__PURE__*/(function () {
    function XPathEvaluator(adapter) {
      this.adapter = adapter;
    }
    XPathEvaluator.prototype.evaluate = function (expression, context, nsResolver, type, result) {
      if (nsResolver) {
        throwNotImplemented();
      }
      return this.createExpression(expression).evaluate(context, type);
    };
    XPathEvaluator.prototype.createExpression = function (expression, nsResolver) {
      if (nsResolver) {
        throwNotImplemented();
      }
      return new XPathExpression(expression, this.adapter);
    };
    XPathEvaluator.prototype.createNSResolver = function (resolver) {
      throwNotImplemented();
    };
    return XPathEvaluator;
  }());

  var DocumentPosition = {
    DISCONNECTED: 1,
    PRECEDING: 2,
    FOLLOWING: 4,
    CONTAINS: 8,
    CONTAINED_BY: 16,
    IMPLEMENTATION_SPECIFIC: 32
  };
  function isDocumentNode(node) {
    return node.nodeType === DOCUMENT_NODE;
  }
  function isElementNode(node) {
    return node.nodeType === ELEMENT_NODE;
  }
  var XPathDOM = /*@__PURE__*/(function () {
    function XPathDOM(nativeNode) {
      if (!nativeNode) {
        throw new Error("This should not happen!");
      }
      this.nativeNode = nativeNode;
      return this;
    }
    XPathDOM.prototype.getNativeNode = function () {
      return this.nativeNode;
    };
    XPathDOM.prototype.asString = function () {
      if (typeof this.nativeNode.textContent === "string") {
        return this.nativeNode.textContent;
      }
      else {
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
      else {
        return "";
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
      var node = this.nativeNode.parentNode || this.nativeNode.ownerElement;
      return new XPathDOM(node);
    };
    XPathDOM.prototype.getOwnerDocument = function () {
      if (this.nativeNode.ownerDocument) {
        return new XPathDOM(this.nativeNode.ownerDocument);
      }
      else {
        return this;
      }
    };
    XPathDOM.prototype.getElementById = function (id) {
      if (isDocumentNode(this.nativeNode)) {
        var node = this.nativeNode.getElementById(id);
        if (node) {
          return new XPathDOM(node);
        }
        else {
          return null;
        }
      }
      else {
        return this.getOwnerDocument().getElementById(id);
      }
    };
    XPathDOM.prototype.isEqual = function (node) {
      return this.getNativeNode() === node.getNativeNode();
    };
    XPathDOM.prototype.compareDocumentPosition = function (other) {
      var self = this;
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
      }
      else if (comparing & DocumentPosition.FOLLOWING) {
        return -1;
      }
      else {
        return 0;
      }
    };
    XPathDOM.prototype.toString = function () {
      var name = "";
      if (isElementNode(this.nativeNode)) {
        if (this.nativeNode.tagName) {
          name = this.nativeNode.tagName.toLowerCase();
        }
        else {
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
    };
    return XPathDOM;
  }());

  var evaluator = new XPathEvaluator(XPathDOM);
  function evaluate$Z(expression, context, nsResolver, type) {
    return evaluator.evaluate(expression, context, nsResolver, type);
  }
  function createExpression(expression, nsResolver) {
    return evaluator.createExpression(expression, nsResolver);
  }
  function createNSResolver(nodeResolver) {
    return evaluator.createNSResolver(nodeResolver);
  }

  var document = window.document;
  if (!document.evaluate) {
    document.evaluate = evaluate$Z;
    document.createExpression = createExpression;
    document.createNSResolver = createNSResolver;
    window.XPathResult = XPathResult;
  }

}());
