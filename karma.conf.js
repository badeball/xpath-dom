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

    reporters: ["progress", "saucelabs"],

    logLevel: config.LOG_INFO,

    customLaunchers: {
      Firefox: {
        base: "SauceLabs",
        browserName: "Firefox",
        platform: "Windows 10"
      },

      Chrome: {
        base: "SauceLabs",
        browserName: "Chrome",
        platform: "Windows 10"
      },

      Safari: {
        base: "SauceLabs",
        browserName: "Safari",
        platform: "OS X 10.11"
      },

      IE11: {
        base: "SauceLabs",
        browserName: "Internet Explorer",
        version: "11",
        platform: "Windows 10"
      },

      IE10: {
        base: "SauceLabs",
        browserName: "Internet Explorer",
        version: "10",
        platform: "Windows 8"
      },

      IE9: {
        base: "SauceLabs",
        browserName: "Internet Explorer",
        version: "9",
        platform: "Windows 7"
      },

      IE8: {
        base: "SauceLabs",
        browserName: "Internet Explorer",
        version: "8",
        platform: "Windows 7"
      }
    },

    browsers: ["PhantomJS"],

    singleRun: true
  });
};
