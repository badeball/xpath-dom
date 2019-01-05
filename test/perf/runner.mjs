import puppeteer from "puppeteer";
import application from "./application";

var server = application.listen(8080, async () => {
  try {
    var browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      var page = await browser.newPage();

      await page.goto("http://localhost:8080");

      page.on("console", (consoleMessage) => {
        for (var arg of consoleMessage.args()) {
          console.log(String(arg).replace(/^JSHandle:/, ""));
        }
      });

      await page.evaluate(() => {
        var expression = ".//p[contains(., 'Hello world!')]";

        var suite = new Benchmark.Suite();

        var mockWindow = {
          document: {}
        };

        wgxpath.install(mockWindow);

        suite.
          add("native#evaluate", function () {
            document.native_evaluate(expression, document.body, null, native_XPathResult.FIRST_ORDERED_NODE_TYPE);
          }).
          add("xpath-domOM#evaluate", function () {
            document.evaluate(expression, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE);
          }).
          add("wgxpath#evaluate", function () {
            mockWindow.document.evaluate(expression, document.body, null, mockWindow.XPathResult.FIRST_ORDERED_NODE_TYPE);
          }).
          on("cycle", function(event) {
            console.log(String(event.target));
          }).
          run({ async: false });
      });

      server.close();
    } finally {
      await browser.close();
    }
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
});
