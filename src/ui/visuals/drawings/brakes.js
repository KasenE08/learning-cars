// Hydraulic brakes with ABS, one wheel shown in detail.
import { schematic } from './schematic.js';
export const labelsBuiltIn = true;
export const viewBox = '0 0 360 400';
export const parts = {
  pedal: { name: 'Brake pedal', does: 'A lever: your foot force is multiplied by the pedal ratio before it reaches the booster.', connects: 'Pushrod → booster.', where: 'Driver footwell.' },
  booster: { name: 'Brake booster', does: 'Uses engine vacuum (or an electric/vacuum pump) to multiply your push several times.', connects: 'Pedal pushrod → master cylinder.', where: 'On the firewall.' },
  master: { name: 'Master cylinder', does: 'Turns the push into hydraulic pressure. Two circuits, so one leak doesn’t take out all four brakes. Reservoir on top.', connects: 'Booster → brake lines → ABS unit.', where: 'On the booster.' },
  lines: { name: 'Brake lines', does: 'Steel lines and flexible hoses full of brake fluid. Fluid barely compresses, so pressure arrives instantly.', connects: 'Master → ABS → each caliper.', where: 'Along the body to every wheel.' },
  abs: { name: 'ABS / stability unit', does: 'Valves + pump + computer. Can hold, drop or (for stability/traction control) build pressure at each wheel on its own.', connects: 'Between master and calipers; reads wheel-speed sensors.', where: 'Engine bay.' },
  caliper: { name: 'Caliper', does: 'Pistons inside are pushed by fluid pressure and squeeze the pads onto the rotor.', connects: 'Brake hose → caliper pistons → pads.', where: 'Over the rotor at each wheel.' },
  rotor: { name: 'Rotor (disc)', does: 'Iron disc bolted to the hub. Friction turns motion into heat here; vented rotors shed it faster.', connects: 'Hub; gripped by the pads.', where: 'Inside each wheel.' },
  pads: { name: 'Pads', does: 'Friction material on steel backing plates. They wear and get replaced.', connects: 'In the caliper, either side of the rotor.', where: 'Inside the caliper.' },
  'wheel-sensor': { name: 'Wheel-speed sensor', does: 'Reads a toothed tone ring so the ABS unit knows if a wheel is about to lock or spin.', connects: 'Hub tone ring → ABS unit (also feeds speed to other modules).', where: 'At each hub.' },
};
export function svg() {
  return schematic({
    links: [
      { d: 'M70,96 L104,96', kind: 'ground', w: 5 },
      { d: 'M166,96 L196,96', kind: 'ground', w: 5 },
      { d: 'M250,116 L250,166', kind: 'brake' },
      { d: 'M250,214 L250,262 L200,262', kind: 'brake' },
      { d: 'M290,190 L340,190 L340,380 M290,200 L320,200 L320,380', kind: 'brake', w: 5 },
      { d: 'M150,300 Q120,240 210,206', kind: 'elec', w: 3, slow: true },
    ],
    extra: '<text class="sx-sub" x="330" y="396" text-anchor="middle">to other wheels</text><text class="sx-sub" x="120" y="244">speed signal</text>',
    nodes: [
      { id: 'pedal', x: 20, y: 60, w: 50, h: 80, shape: 'path', art: '<path class="hl sx-belt" d="M36,64 L46,126"/><rect class="hl sx-node" x="30" y="124" width="30" height="10" rx="3"/>', label: 'PEDAL', ly: 154 },
      { id: 'booster', x: 104, y: 64, w: 62, h: 62, shape: 'circle', label: 'BOOSTER' },
      { id: 'master', x: 196, y: 76, w: 108, h: 40, label: 'MASTER CYL.', deco: '<rect x="216" y="62" width="40" height="14" rx="3" class="sx-deco"/>' },
      { id: 'abs', x: 210, y: 166, w: 80, h: 48, label: 'ABS', sub: 'valves · pump' },
      { id: 'lines', x: 196, y: 252, w: 60, h: 20, shape: 'path', art: '', label: 'LINES', lx: 270, ly: 252 },
      { id: 'rotor', x: 60, y: 260, w: 120, h: 120, shape: 'circle', label: '' , deco: '<circle cx="120" cy="320" r="22" class="sx-deco"/>' },
      { id: 'caliper', x: 150, y: 262, w: 50, h: 50, label: 'CALIPER', ly: 250 },
      { id: 'pads', x: 156, y: 270, w: 38, h: 34, shape: 'path', art: '<rect class="hl sx-pad" x="158" y="272" width="8" height="30" rx="2"/><rect class="hl sx-pad" x="184" y="272" width="8" height="30" rx="2"/>', label: '' },
      { id: 'wheel-sensor', x: 128, y: 296, w: 26, h: 16, label: 'WSS', ly: 330 },
    ],
  });
}
