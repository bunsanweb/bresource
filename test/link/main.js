import * as Link from "./modules/link.js";

(async () => {
  // a.html =follow-list=> a-list.html =webid,foaf=> a.html,b.html,c.html
  const a = new Link.Link(document.links[0], "href");
  //const aFollowList = await a.find([{"[rel~=follow-list]": _ => true}]);
  const aFollowList = await a.find(["[rel~=follow-list]"]);
  console.assert(
    aFollowList[0].uri == new URL("a-list.html", location.href).href,
    "a-list url");
  const aFollows = (await Promise.all(aFollowList.map(
    l => l.find(["[rel~=foaf]", "[rel[~=webid]"])))).flat();
  console.assert(aFollows.length == 3, "a follow count");
  //console.log(aFollows.flatMap(l => l.attribute("rel#list")).join(","));
  console.assert(
    aFollows.flatMap(l => l.attribute("rel#list").every(
      v => ["foaf", "webid"].includes(v))), "rels of a follow");
  
  // a.html => a-list.html => a.html,b.html,c.html  
  const b = new Link.Link(document.links[1], "href");
  const bFollows = await b.find(["[rel~=follo"]);
  console.assert(bFollows.length == 3, "b follow count");
  //console.log(bFollows.flatMap(l => l.attribute("rel#list")).join(","));
  console.assert(
    bFollows.flatMap(l => l.attribute("rel#list").every(
      v => ["follow", "foaf", "webid"].includes(v))), "rels of a follow");
})().catch(err => console.error(err.message));
