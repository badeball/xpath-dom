import express from "express";
import path from "path";

var application = express();

application.get("/lodash.js", function (request, response) {
  response.sendFile(path.resolve(path.join("node_modules", "lodash", "lodash.js")));
});

application.get("/benchmark.js", function (request, response) {
  response.sendFile(path.resolve(path.join("node_modules", "benchmark", "benchmark.js")));
});

application.get("/wgxpath.js", function (request, response) {
  response.sendFile(path.resolve(path.join("node_modules", "wgxpath", "wgxpath.install.js")));
});

application.get("/xpath-dom.js", function (request, response) {
  response.sendFile(path.resolve(path.join("dist", "xpath-dom.shim.min.js")));
});

application.get("/", function (request, response) {
  response.sendFile(path.resolve(path.join("test", "perf", "application", "index.html")));
});

export default application;
