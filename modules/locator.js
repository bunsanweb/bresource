
// locator points to one of metadata for a link element (a, img, ...)
// locator consists `{root, selector, property, type}`
// - root: denote ancestor element of the link element
//     - root resolved with `parentElement` and `matches(selector)`
// - selector: denote an element that contains metadata from the root
// - property: denote metadata propery of the element
//     - resolved with `element[property]`
// - type: denote metadata value type from string value

// default locator elements:
// - root "": the link element 
// - selector "": the root element
// - property "": textContent
// - type "": string 

// locator text: serialized locator
// - format: [[root] `{` [selector] `}`] [property] [`#` [type]]
// - default text: `"{}"`

export const serialize = ({
  root = "", selector = "", property = "", type = "",
}) => `${root}{${selector}}${property}#${type}`;

export const parse = (locatorText = "") => {
  // TBD: for attribute matching selector such as `div[data-value="{"]`
  const i1 = locatorText.indexOf("{");
  const i2 = locatorText.indexOf("}");
  // TBD: case for  i1 < 0 or i2 < 0 or i1 > i2
  const selectorExisted = i1 >= 0 && i2 >= 0 && i1 < i2;
  const root = selectorExisted ? locatorText.slice(0, i1) : "";
  const selector = selectorExisted ? locatorText.slice(i1 + 1, i2) : "";
  const propType = selectorExisted ? locatorText.slice(i2 + 1) : locatorText;
  const i3 = propType.lastIndexOf("#");
  const property = i3 < 0 ? propType : propType.slice(0, i3);
  const type = i3 < 0 ? "" : propType.slice(i3 + 1);
  return {root, selector, property, type};
};

// locator resolver: resolve metadata values of locator
export const resolve =
  (link, locatorText) => resolveLocator(link, parse(locatorText));

export const resolveLocator = (link, {
  root = "", selector = "", property = "", type = "",
}) => {
  const rootElem = resolveRoot(link, root);
  if (!rootElem) return [];
  const elems = resolveElements(rootElem, selector);
  const props = resolveProperties(elems, property);
  return props.map(text => resolveType(text, type));
};

export const resolveRoot = (elem, root) => {
  if (!elem) return null;
  if (root === ""|| elem.matches(root)) return elem;
  return resolveRoot(elem.parentElement, root);
};

export const resolveElements = (root, selector) => {
  try {
    return selector ? [...root.querySelectorAll(selector)] : [root];
  } catch (err) {
    return [root];
  }
};

export const resolveProperties = (elems, property) => {
  return elems.map(elem => {
    if (!property) return elem.textContent;
    if (Reflect.has(elem.attributes, property)) {
      return elem.attributes[property].value;
    }
    if (Reflect.has(elem, property)) return String(elem[property]);
    return "";
  });
};

// collection of string to typed value parser
// -  fallbacks to default value of each types
const valueParsers = {
  // builtin types: same as `typeof value`
  string: String,
  number: Number,
  boolean: Boolean,
  // TBD: apply ES6+ types?
  symbol: Symbol,
  bigint: text => {try {return BigInt(text);} catch (err) {return BigInt(0);}},
  // object types
  date: text => new Date(text), // fallback to Date("Invalid Date")
  url: text => {
    try {
      return new URL(text);
    } catch (err) {
      return new URL(`data:,`); //  or "void:" or other uris
    }
  },
  json: text => {
    try {
      return JSON.parse(text);
    } catch (err) {
      return undefined; // TBD: fallback to undefined or null or {}?
    }
  },
  list: text => text.trim().split(/\s+/u), // as classList manner
};

export const resolveType =
  (text, type) => (valueParsers[type] || valueParsers.string)(text);
