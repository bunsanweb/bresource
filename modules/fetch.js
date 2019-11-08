// fetch URL as HTMLDocument

export const fetchDocument = async (request, init, fetchImpl = fetch) => {
  const resp = await fetchImpl(request, init);
  const type = resp.headers.get("content-type");
  if (type.startsWith("text/html")) {
    const content = await resp.text();
    const doc = createHTML(resp.url, content);
    return [doc, resp];
  } else if (type.startsWith("text/")) {
    const content = await resp.text();
    const doc = createHTMLForText(resp.url, content, type);
    return [doc, resp];
  } else {
    const doc = createHTMLForOthers(resp);
    return [doc, resp];
  }
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

export const createHTMLForText = (url, content, type) => {
  const doc = createHTML(url, "");
  const meta = doc.createElement("meta");
  meta.setAttribute("http-equiv", "content-type");
  meta.setAttribute("content", type);
  doc.head.append(meta);
  const pre = doc.createElement("pre");
  pre.textContent = content;
  doc.body.append(pre);
  return doc;
};

export const createHTMLForOthers = (resp) => {
  // TBD:
  const type = resp.headers.get("content-type");
  const doc = createHTML(resp.url, "");
  const meta = doc.createElement("meta");
  meta.setAttribute("http-equiv", "content-type");
  meta.setAttribute("content", type);
  doc.head.append(meta);
  // embed as blob?
  return doc;
};
