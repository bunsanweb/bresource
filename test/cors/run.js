const path = require("path");

const LocalWebServer = require("local-web-server");
const puppeteer = require("puppeteer");

const port = 9000, port1 = 9100, port2 = 9200;
const ws = LocalWebServer.create({port, directory: __dirname});
const ws1 = LocalWebServer.create(
  {port: port1, directory: path.resolve(__dirname, "h1/")});
const ws2 = LocalWebServer.create(
  {port: port2, directory: path.resolve(__dirname, "h2/")});

(async () => {
  const browser = await puppeteer.launch({
    //headless: false, appMode: true, devtools: true,
    //args: ["--disable-web-security"],
  });
  try {
    const page = await browser.newPage();
    page.on("error", err => console.error(err));
    page.on("pageerror", err => console.error(err));
    page.on("console", msg => {
      const {url, lineNumber, columnNumber} = msg.location();
      const fmt = `[${url} ${lineNumber}:${columnNumber}]: ${msg.text()}`;
      if (msg.type() === "assert") console.assert(false, fmt);
      else console[msg.type()](fmt);
    });
    await page.goto(`http://localhost:${port}`, {waitUntil: "networkidle0"});
  } finally {
    await browser.close();
    ws.server.close();
    ws1.server.close();
    ws2.server.close();
  }
})().catch(console.error);
