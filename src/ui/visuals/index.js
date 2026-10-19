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
  layout: () => import('./layout.js'),
  diffturn: () => import('./diffturn.js'),
  turbo: () => import('./turbo.js'),
  clutchengage: () => import('./clutchengage.js'),
  gearshift: () => import('./gearshift.js'),
  planetary: () => import('./planetary.js'),
  torqueconv: () => import('./torqueconv.js'),
  dyno: () => import('./dyno.js'),
  gearing: () => import('./gearing.js'),
  suspension: () => import('./suspension.js'),
  tire: () => import('./tire.js'),
  circuit: () => import('./circuit.js'),
  aero: () => import('./aero.js'),
  lean: () => import('./lean.js'),
  raketrail: () => import('./raketrail.js'),
  slipper: () => import('./slipper.js'),
  quickshift: () => import('./quickshift.js'),
  traction: () => import('./traction.js'),
  timeline: () => import('./history.js'),
  compare: () => import('./compare.js'),
  checklist: () => import('./checklist.js'),
};

export const visualTypes = Object.keys(loaders);

export async function mountVisual(host, spec) {
  const load = loaders[spec.type];
  if (!load) throw new Error(`Unknown visual ${spec.type}`);
  const m = await load();
  return m.mount(host, spec) || { destroy() {} };
}
