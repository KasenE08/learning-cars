// Turbocharged intake path (Bronco-style): outside air → filter → MAF → compressor → intercooler → throttle → manifold.
import { schematic } from './schematic.js';
export const labelsBuiltIn = true;
export const viewBox = '0 0 360 380';
export const parts = {
  snorkel: { name: 'Intake snorkel', does: 'Pulls outside air in, ideally cool air from in front of the radiator rather than hot engine-bay air.', connects: 'Outside → air filter box.', where: 'Front of the engine bay.' },
  filter: { name: 'Air filter', does: 'Pleated paper (or oiled cotton) that stops dust from sanding the cylinders and turbo.', connects: 'Snorkel → filter → MAF sensor.', where: 'Air box at the front of the bay.' },
  maf: { name: 'MAF sensor', does: 'Mass airflow sensor: a heated wire or film measures how much air (by mass) is flowing. The PCM uses it to pick the fuel amount.', connects: 'After the filter, before the turbo.', where: 'In the tube right after the air box.' },
  compressor: { name: 'Turbo compressor', does: 'Spun by exhaust, it squeezes intake air above atmospheric pressure (boost). The air gets hot doing it.', connects: 'MAF tube in → hot pressurized air out to the intercooler.', where: 'Cold side of the turbo, on the engine.' },
  intercooler: { name: 'Intercooler', does: 'Radiator for intake air. Cooling the charge makes it denser and less likely to knock.', connects: 'Compressor → intercooler → throttle body.', where: 'Low in the nose, in the airflow.' },
  throttle: { name: 'Throttle body', does: 'Electronically controlled butterfly valve that sets how much air reaches the engine. Your pedal is just a sensor.', connects: 'Intercooler pipe → throttle → intake manifold.', where: 'On the intake manifold.' },
  map: { name: 'MAP sensor', does: 'Manifold absolute pressure: reads vacuum and boost after the throttle. Used for load, boost control and as a check on the MAF.', connects: 'Port on the manifold; wired to the PCM.', where: 'On the intake manifold.' },
  manifold: { name: 'Intake manifold (plenum)', does: 'Chamber that spreads air evenly to every cylinder.', connects: 'Throttle → plenum → runners.', where: 'Bolted to the cylinder head’s intake side.' },
  runners: { name: 'Runners', does: 'One tube per cylinder. Their length tunes pressure waves to help fill the cylinder at certain rpm.', connects: 'Plenum → intake ports → intake valves.', where: 'Between the plenum and the head.' },
};
export function svg() {
  return schematic({
    links: [
      { d: 'M78,50 L118,50', kind: 'air' },
      { d: 'M196,50 L226,50', kind: 'air' },
      { d: 'M276,50 Q318,52 318,118', kind: 'air' },
      { d: 'M290,160 L246,160', kind: 'hot', w: 9 },
      { d: 'M144,160 L104,160', kind: 'cool', w: 9 },
      { d: 'M70,182 L70,232', kind: 'cool', w: 9 },
      ...[90, 150, 210, 270].map((x) => ({ d: `M${x},284 L${x},340`, kind: 'cool' })),
    ],
    nodes: [
      { id: 'snorkel', x: 14, y: 34, w: 64, h: 32, shape: 'pill', label: 'SNORKEL' },
      { id: 'filter', x: 118, y: 22, w: 78, h: 56, label: 'AIR FILTER', deco: '<path d="M126,36 l6,28 l6,-28 l6,28 l6,-28 l6,28 l6,-28 l6,28 l6,-28 l6,28" class="sx-deco"/>', labelAt: 'below' },
      { id: 'maf', x: 226, y: 36, w: 50, h: 28, label: 'MAF' },
      { id: 'compressor', x: 290, y: 128, w: 62, h: 62, shape: 'circle', label: 'TURBO', sub: 'compressor' },
      { id: 'intercooler', x: 144, y: 132, w: 102, h: 56, label: 'INTERCOOLER', deco: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${152 + i * 12},136 v48" class="sx-deco"/>`).join(''), labelAt: 'below' },
      { id: 'throttle', x: 40, y: 140, w: 60, h: 40, label: 'THROTTLE', deco: '<path d="M60,148 L80,172" class="sx-valve"/>', labelAt: 'below' },
      { id: 'manifold', x: 40, y: 232, w: 260, h: 52, label: 'INTAKE MANIFOLD', sub: 'plenum' },
      { id: 'map', x: 252, y: 212, w: 40, h: 16, label: 'MAP', ly: 224 },
      { id: 'runners', x: 70, y: 300, w: 220, h: 40, shape: 'path', art: '<rect class="hl sx-node" x="70" y="324" width="220" height="16" rx="4"/>', label: 'RUNNERS → INTAKE PORTS', ly: 362 },
    ],
  });
}
