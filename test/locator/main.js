import * as Locator from "./modules/locator.js";

{
  const link = document.links[0];
  {
    const siblings = Locator.resolve(link, `details{h1}`);
    console.assert(siblings.some(v => v.startsWith("foo")), "siblings");
  }
  {
    const child = Locator.resolve(link, `{[class~="inner"]}#number`);
    console.assert(child.some(v => v === 10), "child");
  }
  {
    const ancestor = Locator.resolve(link, `[class~="reference"]{}class#list`);
    console.assert(ancestor.some(v => v.includes("a1")), "ancestor");
  }
}
