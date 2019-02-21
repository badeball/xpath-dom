KARMA := ./node_modules/.bin/karma
ROLLUP := ./node_modules/.bin/rollup
UGLIFYJS := ./node_modules/.bin/uglifyjs

all: lint test

lint:
	echo "Not yet implemented"
	false

test:
	$(KARMA) start

test-ci:
	$(KARMA) start --reporters dots,saucelabs --browsers $(BROWSERS)

test-perf:
	node --no-warnings --experimental-modules test/perf/runner.mjs

build:
	cp symbol.shim.js dist/xpath-dom.shim.js
	$(ROLLUP) install.ts --config --format iife >> dist/xpath-dom.shim.js
	sed -i "s/\/\*\* @class \*\/ /\/\*@__PURE__\*\//g" dist/xpath-dom.shim.js
	$(UGLIFYJS) dist/xpath-dom.shim.js --ie8 --compress warnings=false --mangle --output dist/xpath-dom.shim.min.js
	sed -i -r 's/ {4}/  /g' dist/xpath-dom.shim.js
	sed -i -r 's/ {4}/  /g' dist/xpath-dom.shim.min.js

.PHONY: lint test test-ci test-perf build
