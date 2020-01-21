import * as runner from "../runner.js";

runner.run([
  [import.meta.url, 9000],
  [new URL("./h1/", import.meta.url).href, 9100],
  [new URL("./h2/", import.meta.url).href, 9200],
  [new URL("../../modules/", import.meta.url).href, 10000],
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
