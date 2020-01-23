import * as Fetch from "http://localhost:10000/fetch.js";

{
  const doc = Fetch.createHTML("http://example.com/test/", `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
</head>
<body>
<h1>Hello HTML</h1>
<a href="foo.html">link</a>
</body>
</html>
`);
  //console.debug(doc.documentElement.outerHTML);
  console.assert(
    doc.head.querySelector("meta").outerHTML === `<meta charset="utf-8">`,
    "head");
  console.assert(
    doc.body.querySelector("h1").outerHTML === "<h1>Hello HTML</h1>",
    "body");
  
  // URL 
  console.assert(doc.URL === "http://example.com/test/", "document URL");
  console.assert(
    doc.links[0].href === "http://example.com/test/foo.html", "resolved URL");
}

(async () => {
  // HTML content-type
  const url0 = document.links[0].href;
  const [doc0, resp0] = await Fetch.fetchDocument(url0);
  //console.debug(doc.documentElement.outerHTML);
  console.assert(doc0.URL === url0, "html url");
  console.assert(
    doc0.links[0].href === new URL("b.txt", location.href).href,
    "resolved URL in doc0");

  // other text content-type
  const url1 = doc0.links[0].href;
  const [doc1, resp1] = await Fetch.fetchDocument(url1);
  //console.debug(doc1.documentElement.outerHTML);
  console.assert(doc1.URL === url1, "text url");
  console.assert(doc1.links.length === 0, "text url links");
  console.assert(doc1.body.textContent === "Hello Text\n", "text url content");

  // binary content-type
  const url2 = doc0.links[1].href;
  const [doc2, resp2] = await Fetch.fetchDocument(url2);
  //console.debug(doc2.documentElement.outerHTML);
  console.assert(doc2.URL === url2, "binary url");
  console.assert(
    doc2.querySelector(`meta[http-equiv="content-type"i]`).content.startsWith(
    "application/octet-stream"), "binary url content-type");

  // not found url
  const url3 = doc0.links[1].href;
  const [doc3, resp3] = await Fetch.fetchDocument(url3);
  //console.debug(doc3.documentElement.outerHTML);
  console.assert(doc3.URL === url3, "not found url");
})().catch(err => console.error(err.message));

