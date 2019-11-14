// link collectors: AsyncItor<Link> => AsyncItor<Link>

// async iterator utils
export const split = async function* (pa) {
  return yield* (await pa);
};
export const slice = (begin, end) => async function* (ai) {
  for (let i = 0; i < begin; i++) await ai.next();
  for (let i = begin; i < end; i++) {
    const {value, done} = await ai.next();
    if (done) return value;
    yield value;
  }
  throw Error("unreachable");
};
export const collect = async ai => {
  const r = [];
  for await (const v of ai) r.push(v);
  return r;
};
export const wrap = links => {
  if (typeof links[Symbol.asyncIterator] === "function") return links;
  return split(links);
};

// collectors
export const collector = conditions => async function* (links) {
  for await (const link of wrap(links)) yield* wrap(link.find(conditions));
};

export const flow = (...conditionsFlow) =>
  step(...conditionsFlow.map(collector));

// collector combinators
export const step = (aCollector, ...collectors) => async function* (links) {
  if (!aCollector) return yield* links;
  return yield* step(...collectors)(aCollector(links));
};
export const uniq = aCollector => async function* (links) {
  const cache = new Set();
  for await (const link of aCollector(links)) {
    if (cache.has(link)) continue;
    cache.add(link);
    yield link;
  }
};

export const first = aCollector => async function* (links) {
  for await (const link of aCollector(links)) return yield link;
};
export const paged = (itemCollector, nextCollector) => async function* (links) {
  const resolved = await collect(links);
  if (resolved.length === 0) return;
  yield* itemCollector(resolved);
  yield* paged(itemCollector, nextCollector)(nextCollector(resolved));
};

export const id = links => links;
export const uniqUri = (aCollector, cache = new Set()) =>
  async function* (links) {
    for await (const link of aCollector(links)) {
      if (cache.has(link.uri)) continue;
      cache.add(link.uri);
      yield link;
    }
  };
export const iterate = (aCollector, cache = new Set()) =>
  async function* (links) {
    const resolved = await collect(uniqUri(id, cache)(links));
    if (resolved.length === 0) return;
    yield* resolved;
    yield* iterate(aCollector, cache)(aCollector(resolved));
  };


// conditions judgments
export const every = prop => vs => vs.every(prop);
export const some = prop => vs => vs.some(prop);
export const partOf = (...values) => vs => vs.every(v => values.includes(v));
export const oneOf = (...values) => vs => vs.some(v => values.includes(v));

