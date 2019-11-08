import * as Fetch from "./modules/fetch.js";

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
  //console.log(doc.documentElement.outerHTML);
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
