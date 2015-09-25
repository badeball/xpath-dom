/* eslint-env node */

"use strict";

module.exports = function(config) {
  config.set({
    frameworks: ["browserify", "mocha", "es5-shim"],

    files: [
      "test/**/*_test.js"
    ],

    preprocessors: {
      "test/**/*_test.js": "browserify"
    },

    browserify: {
      debug: true
    },

    client: {
      mocha: {
        ui: "tdd"
      }
    },

    reporters: ["progress"],

    logLevel: config.LOG_INFO,

    browsers: ["PhantomJS"],

    singleRun: true
  });
};
