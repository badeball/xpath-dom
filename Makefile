KARMA := ./node_modules/.bin/karma
ESLINT := ./node_modules/.bin/eslint
ROLLUP := ./node_modules/.bin/rollup
UGLIFYJS := ./node_modules/.bin/uglifyjs

all: lint test

lint:
	@$(ESLINT) .

test:
	@$(KARMA) start

test-ci:
	@$(KARMA) start --reporters dots,saucelabs --browsers $(BROWSERS)

test-perf:
	@node --no-warnings --experimental-modules test/perf/runner.mjs

build:
	$(ROLLUP) install.js --config --format iife --file dist/xpath-dom.shim.js
	$(UGLIFYJS) dist/xpath-dom.shim.js --ie8 --compress warnings=false --mangle --output dist/xpath-dom.shim.min.js

.PHONY: lint test test-ci test-perf build
