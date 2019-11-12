// link collectors: Promise<[Link]> => Promise<[Link]>
export const collector = conditions => async links =>
  (await Promise.all((await links).map(link => link.find(conditions)))).flat();

export const flow = (...conditionsFlow) =>
  step(...conditionsFlow.map(collector));

// TBD: collector combinators
export const step = (...collectors) =>
  links => collectors.reduce((links, aCollector) => aCollector(links), links);

export const uniq = aCollector =>
  async links => [...new Set(await aCollector(links))];


// conditions judgments
export const every = prop => vs => vs.every(prop);
export const some = prop => vs => vs.some(prop);
export const partOf = (...values) => vs => vs.every(v => values.includes(v));
export const oneOf = (...values) => vs => vs.some(v => values.includes(v));

