// link collectors: Promise<[Link]> => Promise<[Link]>
export const collector = conditions => async links =>
  (await Promise.all((await links).map(link => link.find(conditions)))).flat();

export const flow = (...conditionsFlow) => links => conditionsFlow.reduce(
  (links, conditions) => collector(conditions)(links), links);

// conditions judgments
export const every = prop => vs => vs.every(prop);
export const some = prop => vs => vs.some(prop);
export const partOf = (...values) => vs => vs.every(v => values.includes(v));
export const oneOf = (...values) => vs => vs.some(v => values.includes(v));

