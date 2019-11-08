// fetch URL as HTMLDocument

export const fetchDocument = async (request, init, fetchImpl = fetch) => {
  // TBD: impl
};

export const createHTMLDocument = (content) => {
  const doc = document.implementation.createHTMLDocument("");
  doc.documentElement.innerHTML = content;
  return doc;
};

export const createHTML = (url, content) => {
  const doc = createHTMLDocument(content);
  const base = doc.createElement("base");
  base.setAttribute("ignore", "ignore"); // TBD: mark
  base.href = url;
  doc.head.prepend(base);
  Object.defineProperty(doc, "URL", {value: url, writable: false,});
  return doc;
};

