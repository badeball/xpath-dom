# xpath-dom

[![Sauce Test Status](https://saucelabs.com/browser-matrix/badeball.svg)](https://saucelabs.com/u/badeball)

A pure JavaScript implementation and shim for the [DOM Level 3 XPath specification][dom3-xpath].

[dom3-xpath]: http://www.w3.org/TR/DOM-Level-3-XPath/

## Usage in the browser

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="xpath-dom.shim.min.js"></script>
    <script>
      document.evaluate("//*", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
    </script>
  </head>
</html>
```

## Usage with Node

It works perfectly well together with [jsdom][jsdom].

[jsdom]: https://github.com/tmpvar/jsdom

```javascript
var XPathEvaluator = require("xpath-dom");

XPathEvaluator.evaluate("//*", document, null, XPath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
```

## Known issues

* Namespaces are not yet supported.

* The `lang()` function is not yet implemented.

* The `namespace-uri()` function is not yet implemented.
