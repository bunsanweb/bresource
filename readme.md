# BResource

BResource API is of information access interface for hyperlinked URIs 
on modern browser enviromment.
Information about a URI is not only in a content of the URI, 
but also in a HTML document of the hyperlink source.
BResource model focuses hyperlink HTML elements
surrounded information (a.k.a. metadata) about their linked URI.

On BResource model, clinets pick up links with metadata from HTML, 
then access the URL for get new link container as HTML document 
to pick up next links, until the links with target metadata are found.

## Example

Supporse the paged link list URLs such as:

```html
<!-- page1.html -->
<html>
  <body>
    <ul>
      <li><a href="item11.html">item-11</a></li>
      <li><a href="item12.html">item-12</a></li>
      <li><a href="item13.html">item-13</a></li>
    </ul>
    <a href="page2.html" rel="next">next</a>
  </body>
</html>
```

```html
<!-- page2.html -->
<html>
  <body>
    <ul>
      <li><a href="item21.html">item-21</a></li>
      <li><a href="item22.html">item-22</a></li>
      <li><a href="item23.html">item-23</a></li>
    </ul>
    <a href="page3.html" rel="next">next</a>
  </body>
</html>
```

With BResource API, programs run on browser engines
can iterate these item links in pages as:

```html
<html>
  <head>
    <script type="module">
import * as BResource from "./modules/bresource.js";

(async () => {
  // 1. declare collectors for iterating items in mutiple paged list
  //    - collectors are function that find links from links asynchronously
  //    - `iterate` and `step` are combinators for building complex collectors
  const itemsCollector = BResource.collector([`li{}`]);
  const nextCollector = BResource.collector([`[rel~="page"][href]{}`]);
  const pagesCollector = BResource.iterate(nextCollector);
  const pagedItemsCollector = BResource.step(pagesCollector, itemsCollector);
  
  // 2. make this `window.document` as a root link
  //    - link is a primary object on BResource model
  //    - link ia a handle to access metadata in link source document 
  //      and target content
  const rootLink = BResource.windowLink();
  
  // 3. find links to "page1.html" in this `document` 
  //    with locators and their conditions
  //    - locator is typed ponter to metadata values from each link element
  //    - locator condition is judgement function as `[value] => boolean`
  //    - (former primitive collectors are made with locator conditions)
  const page1Link = await rootLink.find([{
    `[rel~="page"][href]{}rel#string`: values => values.some(v => v === "page"))
  }]);
  
  // 4. iterate each item in multiple pages with ES2018 for-await-of loop
  for await (const itemLink of pagedItemsCollector(page1Link)) {
    console.log(itemLink.uri, itemLink.attribute("textContent")[0]);
  }
})().catch(console.error);
    </script>
  </head>
  <body>
    <a href="page1.html" rel="page">page</a>
  </body>
</html>
```

Open this HTML code as `http://localhost:8000/index.html`, 
its outputs on web console as:

```text
http://localhost:8000/item11.html item-11
http://localhost:8000/item12.html item-12
http://localhost:8000/item13.html item-13
http://localhost:8000/item21.html item-21
http://localhost:8000/item22.html item-22
http://localhost:8000/item23.html item-23
```

