const path = require("path");

const LocalWebServer = require("local-web-server");
const puppeteer = require("puppeteer");

const port = 9000;
const ws = LocalWebServer.create({port, directory: __dirname,});

(async () => {
  const browser = await puppeteer.launch({
    //headless: false, appMode: true, devtools: true,
    //args: ["--disable-web-security"],
  });
  try {
    const page = await browser.newPage();
    page.on("pageerror", err => console.log(err.message));
    await page.goto(`http://localhost:${port}`, {waitUntil: "networkidle0"});
    const message = await page.$eval("body", el => el.textContent);
    console.log(message);
  } finally {
    await browser.close();
    ws.server.close();
  }
})().catch(console.error);
