"use strict";

var Benchmark = require("benchmark");

var XPathDOM = require("../../register");

var wgxpath = require("wgxpath");

var Suite = new Benchmark.Suite();

var expression = ".//p[contains(., 'Hello world!')]";

var mockWindow = {
  document: {}
};

wgxpath.install(mockWindow);

Suite.

add("document#evaluate", function () {
  document.evaluate(expression, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE);
}).

add("XPathDOM#evaluate", function () {
  XPathDOM.evaluate(expression, document.body, null, XPathDOM.XPathResult.FIRST_ORDERED_NODE_TYPE);
}).

add("wgxpath#evaluate", function () {
  mockWindow.document.evaluate(expression, document.body, null, mockWindow.XPathResult.FIRST_ORDERED_NODE_TYPE);
}).

on("cycle", function(event) {
  document.write(String(event.target) + "\n");
}).

on("complete", function() {
  document.write("Fastest is " + this.filter("fastest").pluck("name") + "\n");
}).

run({async: true});
