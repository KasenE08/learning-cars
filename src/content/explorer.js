// Drill-down explorer: car → system → part → detail. Each node shows one or more views.
// `drills` maps a tapped part to the node it opens.

export const nodes = {
  car: {
    title: 'Bronco Sport', kicker: 'Full vehicle · X-ray',
    intro: 'Tap any system. Orange buttons drill deeper. Positions are simplified, not exact Ford packaging.',
    views: [
      { label: 'Top', visual: { type: 'parts', drawing: 'car-top' } },
      { label: 'Side', visual: { type: 'parts', drawing: 'car-side' } },
    ],
    drills: { engine: 'engine', turbo: 'turbo', transmission: 'drivetrain', ptu: 'drivetrain', driveshaft: 'drivetrain', rdu: 'rdu', axles: 'drivetrain' },
    facts: ['bronco.engine', 'bronco.mounting', 'bronco.4x4', 'bronco.suspension', 'bronco.brakes', 'bronco.clearance'],
  },
  engine: {
    parent: 'car', title: 'Engine', kicker: '2.0 EcoBoost · one cylinder slice',
    intro: 'Every cylinder looks like this. Drill into the head or the piston, or take the whole thing apart.',
    views: [
      { label: 'Section', visual: { type: 'parts', drawing: 'engine-section' } },
      { label: 'Running', visual: { type: 'cylinder', mode: 'cycle' } },
      { label: 'Exploded', visual: { type: 'exploded', assembly: 'engine' } },
    ],
    drills: { head: 'head', valves: 'valve', camshaft: 'valve', piston: 'piston', rod: 'piston', crank: 'crank' },
    facts: ['bronco.engine', 'bronco.boreStroke', 'bronco.compression'],
  },
  head: {
    parent: 'engine', title: 'Cylinder head', kicker: 'DOHC · 4 valves per cylinder',
    views: [{ label: 'Section', visual: { type: 'parts', drawing: 'head' } }],
    drills: { 'intake-valve': 'valve', 'exhaust-valve': 'valve', 'intake-cam': 'valve', 'exhaust-cam': 'valve', bucket: 'valve', spring: 'valve' },
    facts: ['bronco.valvetrain', 'bronco.injection'],
  },
  valve: {
    parent: 'head', title: 'Valve + cam', kicker: 'One valve, one lobe',
    views: [
      { label: 'Valvetrain', visual: { type: 'valvetrain' } },
      { label: 'Timing', visual: { type: 'timing', view: 'circle' } },
    ],
  },
  piston: {
    parent: 'engine', title: 'Piston + rod', kicker: 'Rotating assembly',
    views: [{ label: 'Parts', visual: { type: 'parts', drawing: 'piston' } }, { label: 'Geometry', visual: { type: 'cylinder', mode: 'geometry' } }],
  },
  crank: {
    parent: 'engine', title: 'Crankshaft', kicker: 'Inline-4 · 1-3-4-2',
    views: [{ label: 'Firing', visual: { type: 'crank', orders: true, shake: false } }, { label: 'Chain drive', visual: { type: 'timing', view: 'chain' } }],
    facts: ['bronco.firingOrder', 'bronco.timingDrive'],
  },
  turbo: {
    parent: 'car', title: 'Turbocharger', kicker: 'Exploded view',
    intro: 'Exhaust spins the turbine (hot side); a shaft spins the compressor (cold side). Full lessons in Forced Induction.',
    views: [{ label: 'Exploded', visual: { type: 'exploded', assembly: 'turbo' } }],
  },
  drivetrain: {
    parent: 'car', title: '4x4 drivetrain', kicker: 'Advanced 4x4 · twin-clutch RDU',
    intro: 'Pick a mode and a situation; watch where the torque goes. Ford doesn’t publish its control logic, so the numbers are illustrative.',
    views: [
      { label: 'Torque flow', visual: { type: 'awd' } },
      { label: 'Open diff', visual: { type: 'exploded', assembly: 'diff' } },
      { label: 'Gearbox', visual: { type: 'exploded', assembly: 'gearbox' } },
      { label: 'Clutch', visual: { type: 'exploded', assembly: 'clutch' } },
    ],
    facts: ['bronco.trans', 'bronco.ptu', 'bronco.rdu', 'bronco.rearLock', 'bronco.goat'],
  },
  rdu: {
    parent: 'drivetrain', title: 'Rear drive unit', kicker: 'Twin-clutch · Badlands',
    intro: 'No spider gears: each rear wheel has its own clutch pack. Internal details are a generic twin-clutch layout.',
    views: [{ label: 'Schematic', visual: { type: 'parts', drawing: 'rdu' } }, { label: 'Clutch pack', visual: { type: 'exploded', assembly: 'wetclutch' } }],
    facts: ['bronco.rdu', 'bronco.rearLock'],
  },

  // ---------------- motorcycle ----------------
  moto: {
    title: 'Sport bike', kicker: 'Ninja 500 / RS 457 class · X-ray',
    intro: 'Original drawing of a faired 450–500 cc sport twin. Tap a part; notes say where the two bikes differ.',
    views: [{ label: 'Side', visual: { type: 'parts', drawing: 'moto-side' } }],
    drills: { engine: 'moto-engine', clutch: 'moto-clutch', gearbox: 'moto-gearbox' },
    facts: ['ninja.engine', 'rs457.engine', 'ninja.chassis', 'rs457.chassis', 'rs457.electronics'],
  },
  'moto-engine': {
    parent: 'moto', title: 'Bike engine', kicker: 'One cylinder of the twin',
    intro: 'Same four strokes as the car, just smaller pistons and much higher rpm. Bike-specific engine lessons come in Track 2.',
    views: [
      { label: 'Section', visual: { type: 'parts', drawing: 'engine-section' } },
      { label: 'Size', visual: { type: 'displacement', cylinders: true, preset: 'ninja' } },
    ],
    drills: { head: 'head', valves: 'valve', piston: 'piston', rod: 'piston' },
    facts: ['ninja.boreStroke', 'rs457.boreStroke', 'ninja.compression'],
  },
  'moto-clutch': {
    parent: 'moto', title: 'Wet clutch', kicker: 'Multi-plate · runs in oil',
    views: [{ label: 'Exploded', visual: { type: 'exploded', assembly: 'wetclutch' } }],
    facts: ['ninja.clutch'],
  },
  'moto-gearbox': {
    parent: 'moto', title: 'Gearbox', kicker: 'Constant-mesh',
    intro: 'Bikes use sequential constant-mesh boxes: same gear-on-shaft idea as this, but dogs instead of synchros, and a shift drum.',
    views: [{ label: 'Exploded', visual: { type: 'exploded', assembly: 'gearbox' } }],
  },
};

/** Root → node path for breadcrumbs. */
export function trail(id) {
  const out = [];
  for (let n = id; n && nodes[n]; n = nodes[n].parent) out.unshift(n);
  return out;
}

export const exploded = ['engine', 'gearbox', 'diff', 'turbo', 'clutch', 'wetclutch'];
