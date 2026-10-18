// 12 V system: alternator charges the battery and feeds loads; battery cranks the starter.
import { schematic } from './schematic.js';
export const labelsBuiltIn = true;
export const viewBox = '0 0 360 400';
export const parts = {
  alternator: { name: 'Alternator', does: 'Belt-driven AC generator with a built-in rectifier. Makes about 13.5–14.7 V to run the car and recharge the battery.', connects: 'Belt from the crank; B+ wire to the battery/fuse box; field controlled by the PCM.', where: 'Front of the engine.' },
  belt: { name: 'Accessory belt', does: 'Serpentine belt from the crank pulley that spins the alternator (and other accessories).', connects: 'Crank pulley → alternator pulley, tensioner.', where: 'Front of the engine.' },
  battery: { name: '12 V battery', does: 'Stores energy to crank the engine and steadies the voltage. Start-stop cars use tougher AGM/EFB types.', connects: 'Starter (heavy cable), fuse box, ground to body/engine.', where: 'Engine bay.' },
  starter: { name: 'Starter motor', does: 'High-current motor; its solenoid throws a pinion into the flywheel/flexplate ring gear and spins the engine.', connects: 'Heavy cable from the battery; trigger from the PCM/ignition.', where: 'Where the engine meets the transmission.' },
  'fuse-box': { name: 'Fuse + relay box', does: 'Fuses protect wires from overcurrent; relays let small signals switch big loads.', connects: 'Battery/alternator → every circuit.', where: 'Engine bay and under the dash.' },
  ground: { name: 'Ground (chassis return)', does: 'The body and engine block are the return path, so most circuits need only one wire. Bad grounds cause weird faults.', connects: 'Battery negative → body → engine straps.', where: 'Everywhere metal.' },
  loads: { name: 'Loads', does: 'Lights, fans, pumps, heated seats, every computer module.', connects: 'Fuse box → load → ground.', where: 'All over the car.' },
  pcm: { name: 'PCM (smart charging)', does: 'Commands the alternator’s output, charging harder when braking and easing off to save fuel. Monitors battery state.', connects: 'Alternator field control; battery sensor; CAN bus.', where: 'Engine bay.' },
};
export function svg() {
  return schematic({
    links: [
      { d: 'M110,96 L170,96 L170,150', kind: 'elec', w: 6 },
      { d: 'M110,96 L110,204', kind: 'elec', w: 6 },
      { d: 'M150,236 L230,236 L230,296', kind: 'elec', w: 10 },
      { d: 'M210,176 L290,176', kind: 'elec', w: 5 },
      { d: 'M60,268 L60,342 L320,342 L320,206', kind: 'ground', w: 5, slow: true },
      { d: 'M270,96 L130,96', kind: 'ground', w: 3, slow: true },
    ],
    extra: '<text class="sx-sub" x="180" y="88" text-anchor="middle">field control</text><text class="sx-sub" x="190" y="360" text-anchor="middle">body / engine ground return</text><circle cx="40" cy="96" r="22" class="sx-deco"/><text class="sx-sub" x="40" y="132" text-anchor="middle">crank pulley</text>',
    nodes: [
      { id: 'belt', x: 22, y: 64, w: 70, h: 64, shape: 'path', art: '<path class="hl sx-belt" d="M40,74 L84,62 M40,118 L84,130"/>', label: '' },
      { id: 'alternator', x: 72, y: 64, w: 64, h: 64, shape: 'circle', label: 'ALT', sub: '13.5–14.7 V' },
      { id: 'pcm', x: 270, y: 76, w: 66, h: 40, label: 'PCM' },
      { id: 'fuse-box', x: 130, y: 150, w: 80, h: 52, label: 'FUSES', sub: '+ relays' },
      { id: 'loads', x: 290, y: 150, w: 56, h: 56, label: 'LOADS', sub: 'lights · ECUs' },
      { id: 'battery', x: 40, y: 204, w: 110, h: 64, label: 'BATTERY', sub: '12.6 V rested', deco: '<rect x="56" y="198" width="14" height="8" class="sx-deco"/><rect x="120" y="198" width="14" height="8" class="sx-deco"/>' },
      { id: 'starter', x: 196, y: 296, w: 70, h: 36, shape: 'pill', label: 'STARTER' },
      { id: 'ground', x: 40, y: 330, w: 290, h: 24, shape: 'path', art: '', label: '' },
    ],
  });
}
