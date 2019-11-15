import * as BResource from "./modules/bresource.js";

const customFetch = (req, init) => {
  const passUrl = new URL("p4.html", location.href).href;
  // client side block to access "p4.html" as status 404
  if (typeof req === "string" && new URL(req, location.href).href === passUrl ||
      req instanceof Request &&
      new URL(req.url, location.href).href === passUrl) {
    const res = new Response("Not Found", {
      status: 404,
      headers: {"Content-Type": "text/plain;charset=utf-8"}
    });
    Object.defineProperty(res, "url", {value: passUrl, writable: false});
    return Promise.resolve(res);
  }
  return fetch(req, init);
};

(async () => {
  // paged items
  const itemCollector = BResource.collector(["li{a[href]}href"]);
  const nextCollector = BResource.first(BResource.collector(
    [{"rel#list": BResource.some(BResource.oneOf("next"))}]));
  const pagedCollector = BResource.paged(itemCollector, nextCollector);

  const options = {fetch: customFetch};
  const p1 = await BResource.windowLink(options).find(
    [`a[rel~="page"][href]{}`]);
  
  /*
  const p2 = await BResource.collect(nextCollector(p1));
  const p3 = await BResource.collect(nextCollector(p2));
  const p4 = await BResource.collect(nextCollector(p3));
  console.log(p1[0].uri, p2[0].uri, p3[0].uri, p4[0].uri);
  const p1items = await BResource.collect(itemCollector(p1));
  const p2items = await BResource.collect(itemCollector(p2));
  const p3items = await BResource.collect(itemCollector(p3));
  const p4items = await BResource.collect(itemCollector(p4));
  console.log(p1items.length, p2items.length, p3items.length, p4items.length);
  for await (const item of pagedCollector(p1)) {
    console.log(item.uri);
  }
  //*/
  
  const items = await BResource.collect(pagedCollector(p1));
  console.assert(items.length == 9, `item in pages: ${items.length}`);

  // paged items with iterate combinator
  {
    const pagesCollector = BResource.iterate(nextCollector);
    const pagedCollector = BResource.step(pagesCollector, itemCollector);
    const items = await BResource.collect(pagedCollector(p1));
    console.assert(items.length == 9, `item in pages: ${items.length}`);
  }
})().catch(err => console.error(err.message));
