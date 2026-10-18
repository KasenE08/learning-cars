// Visual registry. Each module exports mount(host, spec) → { destroy(), ...api }.
const loaders = {
  cylinder: () => import('./cylinder.js'),
  parts: () => import('./parts.js'),
  displacement: () => import('./displacement.js'),
  crank: () => import('./crank.js'),
  valvetrain: () => import('./valvetrain.js'),
  timing: () => import('./timing.js'),
  compression: () => import('./compression.js'),
  exploded: () => import('./exploded.js'),
  awd: () => import('./awd.js'),
};

export const visualTypes = Object.keys(loaders);

export async function mountVisual(host, spec) {
  const load = loaders[spec.type];
  if (!load) throw new Error(`Unknown visual ${spec.type}`);
  const m = await load();
  return m.mount(host, spec) || { destroy() {} };
}
