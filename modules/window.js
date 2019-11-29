import * as Link from "./link.js";

const entityFromDocument = (doc, options) => {
  const resp = new Response(doc.documentElement.outerHTML, {
    status: 200, headers: {"content-type": "text/html;charset=utf-8"}});
  Object.defineProperty(resp, "url", {value: doc.URL, writable: false});
  return new Link.Entity(doc, resp, options);
};

export const documentLink = (doc, options) => {
  const entity = entityFromDocument(doc, options);
  const elem = doc.createElement("a");
  elem.href = entity.uri;
  const link = new Link.Link(elem, "href", options);
  link.cache = entity;
  return link;
};

export const windowLink = options => documentLink(document, options);
