// Turbo engine exhaust: manifold → turbine (wastegate bypass) → O2 → cat → O2 → resonator → muffler → tailpipe.
import { schematic } from './schematic.js';
export const labelsBuiltIn = true;
export const viewBox = '0 0 360 470';
export const parts = {
  manifold: { name: 'Exhaust manifold', does: 'Collects exhaust from every cylinder into one outlet. Many turbo engines cast it into the head.', connects: 'Exhaust ports → turbine inlet.', where: 'Exhaust side of the cylinder head.' },
  turbine: { name: 'Turbine (turbo hot side)', does: 'Exhaust spins the turbine wheel, which drives the compressor. It also quiets the exhaust a lot.', connects: 'Manifold → turbine → downpipe.', where: 'Bolted to the manifold.' },
  wastegate: { name: 'Wastegate', does: 'Valve that lets some exhaust bypass the turbine to cap boost.', connects: 'Turbine inlet → bypass → downpipe.', where: 'In the turbine housing.' },
  'o2-up': { name: 'Upstream O2 sensor', does: 'Measures oxygen left in the exhaust. The PCM uses it to trim fuel toward the target air-fuel ratio.', connects: 'In the pipe before the cat; wired to the PCM.', where: 'Right after the turbo.' },
  cat: { name: 'Catalytic converter', does: 'Ceramic honeycomb coated with platinum, palladium and rhodium. Turns CO, unburned HC and NOx into CO₂, H₂O and N₂.', connects: 'Between the two O2 sensors.', where: 'Close to the turbo so it heats up fast.' },
  'o2-down': { name: 'Downstream O2 sensor', does: 'Watches the cat. If its signal starts copying the upstream sensor, the cat isn’t storing oxygen: efficiency code.', connects: 'In the pipe after the cat; wired to the PCM.', where: 'Right after the cat.' },
  resonator: { name: 'Resonator', does: 'Tuned chamber that cancels specific droning frequencies.', connects: 'Mid-pipe.', where: 'Under the middle of the car.' },
  muffler: { name: 'Muffler', does: 'Chambers, perforated tubes and packing that absorb and reflect sound waves.', connects: 'Mid-pipe → muffler → tailpipe.', where: 'Rear of the car.' },
  tailpipe: { name: 'Tailpipe', does: 'Final exit. Its size and tip shape barely change performance; they change the look and some tone.', connects: 'Muffler outlet → outside.', where: 'Under the rear bumper.' },
};
export function svg() {
  return schematic({
    links: [
      { d: 'M180,74 L180,104', kind: 'exhaust', w: 10 },
      { d: 'M180,156 L180,196', kind: 'exhaust', w: 9 },
      { d: 'M214,118 Q262,118 262,150 Q262,180 186,184', kind: 'exhaust', w: 5 },
      { d: 'M180,208 L180,230', kind: 'exhaust', w: 9 },
      { d: 'M180,290 L180,320', kind: 'exhaust', w: 9 },
      { d: 'M180,350 L180,366', kind: 'exhaust', w: 8 },
      { d: 'M180,390 L180,404', kind: 'exhaust', w: 8 },
      { d: 'M270,430 L340,430', kind: 'exhaust', w: 8 },
    ],
    extra: [70, 130, 230, 290].map((x) => `<path d="M${x},18 L${x},40 Q${x},52 180,56" class="sx-pipe" style="stroke-width:7px"/><path d="M${x},18 L${x},40 Q${x},52 180,56" class="sx-flow" style="stroke:#ff8a45;stroke-width:3px"/>`).join('') + '<text class="sx-sub" x="40" y="14">from cylinders 1–4</text>',
    nodes: [
      { id: 'manifold', x: 110, y: 48, w: 140, h: 26, label: 'EXHAUST MANIFOLD' },
      { id: 'turbine', x: 150, y: 100, w: 60, h: 60, shape: 'circle', label: 'TURBINE' },
      { id: 'wastegate', x: 238, y: 140, w: 48, h: 22, label: 'W/GATE', ly: 155 },
      { id: 'o2-up', x: 196, y: 192, w: 58, h: 18, shape: 'pill', label: 'O2 UP', ly: 205 },
      { id: 'cat', x: 140, y: 230, w: 80, h: 60, label: 'CAT', sub: 'CO · HC · NOx', deco: [0, 1, 2, 3, 4].map((i) => `<path d="M${150 + i * 15},234 v52" class="sx-deco"/>`).join('') },
      { id: 'o2-down', x: 196, y: 296, w: 70, h: 18, shape: 'pill', label: 'O2 DOWN', ly: 309 },
      { id: 'resonator', x: 156, y: 320, w: 48, h: 30, shape: 'pill', label: 'RES.' },
      { id: 'muffler', x: 90, y: 366, w: 180, h: 64, shape: 'pill', label: 'MUFFLER', deco: '<path d="M110,382 h140 M110,398 h140 M110,414 h140" class="sx-deco"/>' },
      { id: 'tailpipe', x: 300, y: 420, w: 50, h: 20, shape: 'pill', label: 'TIP', ly: 456 },
    ],
  });
}
