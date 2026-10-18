// Direct-injection fuel system: in-tank pump → low-pressure line → cam-driven high-pressure pump → rail → injectors.
import { schematic } from './schematic.js';
export const labelsBuiltIn = true;
export const viewBox = '0 0 360 400';
export const parts = {
  tank: { name: 'Fuel tank', does: 'Stores gasoline; baffles stop it sloshing away from the pump.', connects: 'Fill neck, pump module, vapor (EVAP) lines.', where: 'Under the rear seat.' },
  pump: { name: 'In-tank fuel pump', does: 'Electric pump that pushes fuel forward at low pressure (a few bar). Often speed-controlled by a pump module.', connects: 'Tank → low-pressure line.', where: 'Inside the tank, in a module with the level sender.' },
  'lp-line': { name: 'Low-pressure line', does: 'Carries fuel from the tank to the engine bay.', connects: 'In-tank pump → high-pressure pump.', where: 'Along the underbody.' },
  'hp-pump': { name: 'High-pressure pump', does: 'Driven by a cam lobe; boosts pressure to the very high levels direct injection needs (hundreds of bar).', connects: 'Low-pressure line in → fuel rail out.', where: 'On the cylinder head, driven by a camshaft.' },
  rail: { name: 'Fuel rail', does: 'Thick-walled tube that stores high-pressure fuel and feeds every injector.', connects: 'High-pressure pump → injectors; pressure sensor on it.', where: 'Along the head, under the intake.' },
  injectors: { name: 'Direct injectors', does: 'Solenoid (or piezo) valves the PCM opens for fractions of a millisecond to spray fuel straight into each cylinder.', connects: 'Rail → combustion chamber; wired to the PCM.', where: 'In the head, one per cylinder.' },
  'pressure-sensor': { name: 'Rail pressure sensor', does: 'Reports rail pressure so the PCM can command the pump and size each injection.', connects: 'On the rail; wired to the PCM.', where: 'End of the fuel rail.' },
  evap: { name: 'EVAP canister', does: 'Charcoal canister that soaks up fuel vapor from the tank; the engine later sucks it in and burns it (purge).', connects: 'Tank vent → canister → purge valve → intake.', where: 'Near the tank (position simplified).' },
};
export function svg() {
  return schematic({
    links: [
      { d: 'M60,296 L60,240 Q60,214 90,214 L232,214 Q262,214 262,190', kind: 'fuel' },
      { d: 'M262,150 L262,116 L300,116', kind: 'hpfuel', w: 9 },
      ...[110, 170, 230, 290].map((x) => ({ d: `M${x},98 L${x},128`, kind: 'hpfuel', w: 5 })),
      { d: 'M150,290 L210,290 L210,312', kind: 'vapor', slow: true, w: 5 },
      { d: 'M250,330 L310,330 L310,240', kind: 'vapor', slow: true, w: 5 },
    ],
    extra: '<text class="sx-sub" x="314" y="232" text-anchor="middle">to intake</text>',
    nodes: [
      { id: 'rail', x: 80, y: 80, w: 236, h: 18, label: 'FUEL RAIL', ly: 74 },
      { id: 'pressure-sensor', x: 300, y: 104, w: 40, h: 22, label: 'P', sub: 'sensor', labelAt: 'below', ly: 140 },
      { id: 'injectors', x: 96, y: 126, w: 210, h: 34, shape: 'path', art: [110, 170, 230, 290].map((x) => `<path class="hl sx-node" d="M${x - 7},128 h14 v20 l-7,10 l-7,-10 Z"/>`).join(''), label: 'INJECTORS → CYLINDERS', lx: 136, ly: 180 },
      { id: 'hp-pump', x: 232, y: 150, w: 60, h: 40, label: 'HP PUMP', sub: 'cam-driven' },
      { id: 'lp-line', x: 80, y: 206, w: 160, h: 16, shape: 'path', art: '', label: 'LOW-PRESSURE LINE', ly: 204 },
      { id: 'tank', x: 16, y: 270, w: 134, h: 104, shape: 'tank', label: 'TANK', lx: 110, ly: 360 },
      { id: 'pump', x: 36, y: 296, w: 48, h: 48, shape: 'circle', label: 'PUMP' },
      { id: 'evap', x: 180, y: 312, w: 70, h: 36, shape: 'pill', label: 'EVAP', sub: 'charcoal' },
    ],
  });
}
