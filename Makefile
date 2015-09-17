MOCHA := ./node_modules/.bin/mocha
ESLINT := ./node_modules/.bin/eslint
BROWSERIFY := ./node_modules/.bin/browserify
UGLIFYJS := ./node_modules/.bin/uglifyjs

all: lint test

lint:
	@$(ESLINT) .

test:
	@$(MOCHA) --recursive --reporter dot --ui tdd

build:
	[[ -d dist ]] || mkdir dist
	$(BROWSERIFY) install.js -s xpath-dom -o dist/xpath-dom.shim.js
	$(UGLIFYJS) dist/xpath-dom.shim.js --compress warnings=false --mangle --output dist/xpath-dom.shim.min.js


.PHONY: lint test
