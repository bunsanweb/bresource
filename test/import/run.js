import * as runner from "../runner.js";

runner.run([
  [import.meta.url, 9000],
], {
  launch: {
    //headless: false, appMode: true, devtools: true,
    //args: ["--disable-web-security"],
  }, 
  goto: {
    waitUntil: "networkidle0",
    // timeout: 300 * 1000, 
  },
  //timeout: 300 * 1000,
}).catch(console.error);

/*
import path from "path";

import LocalWebServer from "local-web-server";
import puppeteer from "puppeteer";

const port = 9000;
const directory = path.dirname(new URL(import.meta.url).pathname);
const ws = LocalWebServer.create({port, directory});

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
*/
