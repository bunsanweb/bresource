import * as Link from "./modules/link.js";
import * as Collector from "./modules/collector.js";

(async () => {
  //[Link methods]
  // a.html =follow-list=> a-list.html =webid,foaf=> a.html,b.html,c.html
  const a = new Link.Link(document.links[0], "href");

  const aFollowList = await a.find([
    {"rel#list": vs => vs.some(v => v.includes("follow-list"))}]);
  
  console.assert(
    aFollowList[0].uri == new URL("a-list.html", location.href).href,
    "a-list url");
  
  const aFollows = (await Promise.all(aFollowList.map(l => l.find([
    {"rel#list": vs => vs.some(v => v.includes("foaf") || v.includes("webid"))}
  ])))).flat();
  
  console.assert(aFollows.length == 3, "a follow count");
  //console.log(aFollows.flatMap(l => l.attribute("rel#list")).join(","));
  console.assert(
    aFollows.flatMap(l => l.attribute("rel#list").every(
      v => ["foaf", "webid"].includes(v))), "rels of a follow");
  
  // a.html => a-list.html => a.html,b.html,c.html  
  const b = new Link.Link(document.links[1], "href");
  const bFollows = await b.find([{
    "rel#list": vs => vs.some(v => v.includes("follow"))}]);
  console.assert(bFollows.length == 3, "b follow count");
  //console.log(bFollows.flatMap(l => l.attribute("rel#list")).join(","));
  console.assert(
    bFollows.flatMap(l => l.attribute("rel#list").every(
      v => ["follow", "foaf", "webid"].includes(v))), "rels of a follow");
})().catch(err => console.error(err.message));

(async () => {
  //[Collector version]
  const webidCollector = Collector.flow(
    [{"rel#list": Collector.some(Collector.oneOf("follow-list"))}],
    [{"rel#list": Collector.some(Collector.oneOf("foaf", "webid"))}]);
  const foafCollector = Collector.collector(
    [{"rel#list": Collector.some(Collector.oneOf("follow"))}]);
  
  // a.html =follow-list=> a-list.html =webid,foaf=> a.html,b.html,c.html
  const a = new Link.Link(document.links[0], "href");
  const aFollows = await webidCollector([a]);
  console.assert(aFollows.length == 3, "a follow count by collector");
  //console.log(aFollows.flatMap(l => l.attribute("rel#list")).join(","));
  console.assert(
    aFollows.flatMap(l => l.attribute("rel#list").every(
      v => ["foaf", "webid"].includes(v))), "rels of a follow by collector");
  
  // a.html => a-list.html => a.html,b.html,c.html  
  const b = new Link.Link(document.links[1], "href");
  const bFollows = await foafCollector([b]);
  console.assert(bFollows.length == 3, "b follow count by collector");
  //console.log(bFollows.flatMap(l => l.attribute("rel#list")).join(","));
  console.assert(
    bFollows.flatMap(l => l.attribute("rel#list").every(
      v => ["follow", "foaf", "webid"].includes(v))),
    "rels of a follow by collector");
})().catch(err => console.error(err.message));
