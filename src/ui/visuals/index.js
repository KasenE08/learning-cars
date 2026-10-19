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
  // Track 4 (Phase 5)
  network: () => import('./t4/network.js'),
  sensorloop: () => import('./t4/sensorloop.js'),
  obdport: () => import('./t4/obdport.js'),
  pid: () => import('./t4/pid.js'),
  dtc: () => import('./t4/dtc.js'),
  busvolts: () => import('./t4/busvolts.js'),
  canframe: () => import('./t4/canframe.js'),
  arbitration: () => import('./t4/arbitration.js'),
  bittiming: () => import('./t4/bittiming.js'),
  errors: () => import('./t4/errors.js'),
  canfd: () => import('./t4/canfd.js'),
  isotp: () => import('./t4/isotp.js'),
  uds: () => import('./t4/uds.js'),
  bitfield: () => import('./t4/bitfield.js'),
  scaling: () => import('./t4/scaling.js'),
  twos: () => import('./t4/twos.js'),
  checksum: () => import('./t4/checksum.js'),
  candump: () => import('./t4/candump.js'),
  capdiff: () => import('./t4/capdiff.js'),
  sigplot: () => import('./t4/sigplot.js'),
  ecumap: () => import('./t4/ecumap.js'),
  attack: () => import('./t4/attack.js'),
  fob: () => import('./t4/fob.js'),
  canbench: () => import('./t4/canbench.js'),
};

export const visualTypes = Object.keys(loaders);

export async function mountVisual(host, spec) {
  const load = loaders[spec.type];
  if (!load) throw new Error(`Unknown visual ${spec.type}`);
  const m = await load();
  return m.mount(host, spec) || { destroy() {} };
}
