# xpath-dom

A DOM adapter for [xpath-evaluator][xpath-evaluator]. Together with its
dependencies, it serves as a full shim for the [DOM Level 3 XPath
specification][dom3-xpath].

[xpath-evaluator]: https://github.com/badeball/xpath-evaluator
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
var XPath = require("xpath-dom");

XPath.evaluate("//*", document, null, XPath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
```

## Known issues

* The shim is not actually tested in real browser environments yet.

* Namespaces are not yet supported.

* The `lang()` function is not yet implemented.

* The `namespace-uri()` function is not yet implemented.

* The `string()` function does not behave correctly on document nodes.
