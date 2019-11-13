import {resolve} from "./locator.js";
import {fetchDocument, isExtra} from "./fetch.js";

export const isNotEmpty = vs => vs.some(
  v => Array.isArray(v) && v.length > 0 || Boolean(v));

export const Link = class {
  constructor(element, uriKey, options = {}) {
    this.element = element;
    this.uriKey = uriKey;
    this.options = options;
    this.cache = null;
  }
  get uri() {return this.element[this.uriKey];}
  // methods for link source metadata
  attribute(locatorText) {
    return resolve(this.element, locatorText);
  }
  match(condition) {
    // `condition` as {locatorText: judgement, ...}
    //  - judgement: a function for  value list => boolean
    if (typeof condition === "string") condition = {[condition]: isNotEmpty};
    try {
      return Object.keys(condition).every(locatorText => {
        return condition[locatorText](this.attribute(locatorText));
      });
    } catch (err) {
      return false;
    }
  }
  matches(conditions = []) {
    try {
      return [...conditions].some(condition => this.match(condition));
    } catch (err) {
      return false;
    }
  }

  // methods for link destination
  async entity(options = this.options) {
    if (!this.cache) {
      const [doc, resp] = await fetchDocument(this.uri, options);
      this.cache = new Entity(doc, resp, options);
    }
    return this.cache;
  }
  get links() {
    return this.entity().then(entity => entity.links);
  }
  async find(conditions) {
    return (await this.entity()).find(conditions);
  }
};

export const Entity = class {
  constructor(doc, resp, options) {
    this.doc = doc;
    this.resp = resp;
    this.options = options;
    this.cache = new WeakMap();
  }
  get ok() {
    return this.resp.ok;
  }
  get status() {
    return this.resp.status;
  }
  get uri() {
    return this.resp.url;
  }
  get contentType() {
    return this.resp.headers.get("content-type");
  }
  get links() {
    const selector = "[href],[src]";
    const elems = [...this.doc.querySelectorAll(selector)].filter(
      elem => !isExtra(elem));
    return elems.map(elem => {
      if (!this.cache.has(elem)) {
        const uriKey = Reflect.has(elem, "href") ? "href" : "src";
        this.cache.set(elem, new Link(elem, uriKey, this.options));
      }
      return this.cache.get(elem);
    });
  }
  find(conditions) {
    return this.links.filter(link => link.matches(conditions));
  }
};
