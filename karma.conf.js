"use strict";

const builtins = require("rollup-plugin-node-builtins");
const globals = require("rollup-plugin-node-globals");
const resolve = require("rollup-plugin-node-resolve");

const resolveModuleToTestAgainst = {
  resolveId(id) {
    if (id === "xpath-dom") {
      if (process.env.TEST_AGAINST_BUILD === "1") {
        return "test/unit/export_shims_helper.js";
      } else {
        return "register.js";
      }
    }
  }
};

module.exports = function(config) {
  config.set({
    frameworks: ["mocha", "es5-shim"],

    files: [
      "test/unit/**/*_test.js"
    ],

    preprocessors: {
      "test/unit/**/*_test.js": ["rollup", "babel"]
    },

    rollupPreprocessor: {
      output: {
        format: "iife"
      },
      plugins: [
        builtins(),
        globals(),
        resolve(),
        resolveModuleToTestAgainst
      ]
    },

    babelPreprocessor: {
      options: {
        presets: ["es2015"]
      }
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

      Edge18: {
        base: "SauceLabs",
        browserName: "MicrosoftEdge",
        version: "18",
        platform: "Windows 10"
      },

      Edge17: {
        base: "SauceLabs",
        browserName: "MicrosoftEdge",
        version: "17",
        platform: "Windows 10"
      },

      Edge16: {
        base: "SauceLabs",
        browserName: "MicrosoftEdge",
        version: "16",
        platform: "Windows 10"
      },

      Edge15: {
        base: "SauceLabs",
        browserName: "MicrosoftEdge",
        version: "15",
        platform: "Windows 10"
      },

      Edge14: {
        base: "SauceLabs",
        browserName: "MicrosoftEdge",
        version: "14",
        platform: "Windows 10"
      },

      Edge13: {
        base: "SauceLabs",
        browserName: "MicrosoftEdge",
        version: "13",
        platform: "Windows 10"
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
