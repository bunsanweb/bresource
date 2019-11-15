// fetch URL as HTMLDocument

// implementation defaults
export const fetchImpl = options => {
  if (options && typeof options.fetch === "function") return options.fetch;
  return fetch;
};
export const docImpl = options => {
  if (options && typeof options.docimpl === "object") return options.docimpl;
  return document.implementation;
};

export const fetchDocument = async (request, init, options) => {
  const resp = await fetchImpl(options)(request, init).catch(
    err => new Response(err.message, {status: 502, headers: {
      "content-type": "text/plain;charset=utf-8"}}));
  const type = resp.headers.get("content-type");
  if (type.startsWith("text/html")) {
    const content = await resp.text();
    const doc = createHTML(resp.url, content, options);
    return [doc, resp];
  } else if (type.startsWith("text/")) {
    const content = await resp.text();
    const doc = createHTMLForText(resp.url, content, type, options);
    return [doc, resp];
  } else {
    const doc = createHTMLForOthers(resp, options);
      return [doc, resp];
  }
};

export const createHTMLDocument = (content, options) => {
  const doc = docImpl(options).createHTMLDocument("");
  doc.documentElement.innerHTML = content;
  return doc;
};

export const createHTML = (url, content, options) => {
  const doc = createHTMLDocument(content, options);
  const base = doc.createElement("base");
  base.href = url;
  setExtra(base);
  doc.head.prepend(base);
  Object.defineProperty(doc, "URL", {value: url, writable: false,});
  return doc;
};

// mark fetch added extra element for DOM functionalities
// TBD: how to mark elements
export const setExtra = elem => elem.setAttribute("ignore", "ignore");
export const isExtra = elem => elem.getAttribute("ignore") === "ignore";

export const createHTMLForText = (url, content, type, options) => {
  const doc = createHTML(url, "", options);
  const meta = doc.createElement("meta");
  meta.setAttribute("http-equiv", "content-type");
  meta.setAttribute("content", type);
  doc.head.append(meta);
  const pre = doc.createElement("pre");
  pre.textContent = content;
  doc.body.append(pre);
  return doc;
};

export const createHTMLForOthers = (resp, options) => {
  // TBD:
  const type = resp.headers.get("content-type");
  const doc = createHTML(resp.url, "", options);
  const meta = doc.createElement("meta");
  meta.setAttribute("http-equiv", "content-type");
  meta.setAttribute("content", type);
  doc.head.append(meta);
  // embed as blob?
  return doc;
};
