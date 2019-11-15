import * as Link from "./link.js";

const entityFromWindow = (options) => {
  const resp = new Response(document.documentElement.outerHTML, {
    status: 200, headers: {"content-type": "text/html;charset=utf-8"}});
  Object.defineProperty(resp, "url", {value: document.URL, writable: false});
  return new Link.Entity(document, resp, options);
};

export const windowLink = (options) => {
  const entity = entityFromWindow(options);
  const elem = document.createElement("a");
  elem.href = entity.uri;
  const link = new Link.Link(elem, "href", options);
  link.cache = entity;
  return link;
};
