
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
// - selector "": the link element
// - property "": textContent
// - type "": string 

// locator text: serialized locator
// - format: [root] `{` [selector] `}` [property] [`#` [type]]
// - default text: `"{}"`

export const serialize = ({
  root = "", selector = "", property = "", type = "",
}) => `${root}{${selector}}${property}#${type}`;

export const parse = (locatorText = "") => {
  // TBD: for attribute matching selector such as `div[data-value="{"]`
  const i1 = locatorText.indexOf("{");
  const i2 = locatorText.indexOf("}");
  // TBD: case for  i1 < 0 or i2 < 0 or i1 > i2
  console.assert(i1 >= 0 && i2 >= 0 && i1 < i2, "unimplemented");
  const root = locatorText.slice(0, i1);
  const selector = locatorText.slice(i1 + 1, i2);
  const propType = locatorText.slice(i2 + 1);
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
  const root = resolveRoot(link. root);
  const elems = selector ? [link] : [...root.querySelectorAll(selector)];
  const props = elems.map(elem => elem[property || "textContent"] || "");
  return props.map(text => resolveType(text, type));
};

export const resolveRoot = (elem, root) => {
  if (root === ""|| elem.matches(root)) return elem;
  if (!elem.parentElement) return elem; // TBD: case of documentElement
  return resolveRoot(elem.parentElement, root);
};

// collection of string to typed value parser
// -  fallbacks to default value of each types
const typeParsers = {
  // builtin types
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
  (text, type) => (typeParsers[type] || typeParsers.string)(text);
