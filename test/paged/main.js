import * as Link from "./modules/link.js";
import * as Collector from "./modules/collector.js";


(async () => {
  // paged items
  const itemCollector = Collector.collector(["li{a[href]}href"]);
  const nextCollector = Collector.first(Collector.collector(
    [{"rel#list": Collector.some(Collector.oneOf("next"))}]));
  const pagedCollector = Collector.paged(itemCollector, nextCollector);

  const p1 = [new Link.Link(document.links[0], "href")];
  /*
  const p2 = await Collector.collect(nextCollector(p1));
  const p3 = await Collector.collect(nextCollector(p2));
  const p4 = await Collector.collect(nextCollector(p3));
  console.log(p1[0].uri, p2[0].uri, p3[0].uri, p4[0].uri);
  const p1items = await Collector.collect(itemCollector(p1));
  const p2items = await Collector.collect(itemCollector(p2));
  const p3items = await Collector.collect(itemCollector(p3));
  const p4items = await Collector.collect(itemCollector(p4));
  console.log(p1items.length, p2items.length, p3items.length, p4items.length);
  for await (const item of pagedCollector(p1)) {
    console.log(item.uri);
  }
  */
  
  
  console.error("[INFO] next 404 error is spawned in fetch(); not assertion");
  const items = await Collector.collect(pagedCollector(p1));
  console.assert(items.length == 9, `item in pages: ${items.length}`);

  // paged items with iterate combinator
  {
    const pagesCollector = Collector.iterate(nextCollector);
    const pagedCollector = Collector.step(pagesCollector, itemCollector);
    const items = await Collector.collect(pagedCollector(p1));
    console.assert(items.length == 9, `item in pages: ${items.length}`);
  }
})().catch(err => console.error(err.message));
