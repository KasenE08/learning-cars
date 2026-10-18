// Wet-sump pressure lubrication.
import { schematic } from './schematic.js';
export const labelsBuiltIn = true;
export const viewBox = '0 0 360 410';
export const parts = {
  sump: { name: 'Oil pan (sump)', does: 'Reservoir under the crank. Oil drains back here from everywhere.', connects: 'Pickup; drain plug.', where: 'Bottom of the engine.' },
  pickup: { name: 'Pickup + screen', does: 'Tube with a mesh screen that the pump draws oil through.', connects: 'Sump → pump inlet.', where: 'Near the bottom of the sump.' },
  pump: { name: 'Oil pump', does: 'Gear or vane pump driven by the crank. Many modern pumps vary their output to save power. A relief valve caps pressure.', connects: 'Pickup in → filter out.', where: 'Front of the engine or in the sump.' },
  filter: { name: 'Oil filter', does: 'Traps metal and soot. A bypass valve lets oil skip the filter if it clogs or is cold, because unfiltered oil beats no oil.', connects: 'Pump → filter → main gallery.', where: 'On the side of the block.' },
  gallery: { name: 'Main oil gallery', does: 'Long drilled passage that distributes pressurized oil.', connects: 'Filter → mains, head, turbo, jets.', where: 'Along the block.' },
  mains: { name: 'Main bearings', does: 'Crank journals ride on an oil film here.', connects: 'Gallery → mains → drilled passages in the crank.', where: 'Bottom of the block.' },
  rods: { name: 'Rod bearings', does: 'Fed through holes drilled in the crankshaft from the mains.', connects: 'Crank drillings → big ends.', where: 'On each crankpin.' },
  cams: { name: 'Head: cams + VVT', does: 'Oil goes up to the cam journals, followers and the cam phasers (VVT runs on oil pressure).', connects: 'Gallery → head → drains back to the sump.', where: 'Top of the engine.' },
  'turbo-feed': { name: 'Turbo feed + drain', does: 'The turbo’s bearings run on engine oil. Feed line in, big drain back to the sump.', connects: 'Gallery → turbo center housing → sump.', where: 'Side of the engine.' },
  'piston-jets': { name: 'Piston oil jets', does: 'Spray oil at the underside of each piston to cool it. Common on turbo engines.', connects: 'Gallery → jets.', where: 'In the block, under each cylinder.' },
  'pressure-sensor': { name: 'Oil pressure sensor', does: 'Tells the PCM (and your warning light) if pressure drops.', connects: 'On the gallery; wired to the PCM.', where: 'On the block.' },
};
export function svg() {
  return schematic({
    links: [
      { d: 'M60,350 L60,322', kind: 'oil', w: 6 },
      { d: 'M84,300 L110,300', kind: 'oil' },
      { d: 'M128,276 L128,232 L320,232', kind: 'oil', w: 8 },
      ...[180, 250, 320].map((x) => ({ d: `M${x},232 L${x},258`, kind: 'oil', w: 5 })),
      { d: 'M200,268 L216,290 M270,268 L286,290', kind: 'oil', w: 4 },
      { d: 'M320,232 L320,80 L300,80', kind: 'oil', w: 5 },
      { d: 'M150,232 L150,196 L110,196 L110,148', kind: 'oil', w: 5 },
      ...[210, 270].map((x) => ({ d: `M${x},232 L${x},206`, kind: 'oil', w: 4 })),
      { d: 'M70,120 Q20,180 26,350', kind: 'oil', w: 4, slow: true },
    ],
    extra: '<text class="sx-sub" x="30" y="232">drain</text>',
    nodes: [
      { id: 'cams', x: 150, y: 56, w: 150, h: 40, label: 'HEAD', sub: 'cams · followers · VVT' },
      { id: 'turbo-feed', x: 70, y: 106, w: 80, h: 42, shape: 'pill', label: 'TURBO', sub: 'bearings' },
      { id: 'piston-jets', x: 190, y: 182, w: 100, h: 24, shape: 'path', art: [210, 270].map((x) => `<path class="hl sx-node" d="M${x - 6},206 L${x},186 L${x + 6},206 Z"/>`).join(''), label: 'PISTON JETS', ly: 178 },
      { id: 'pressure-sensor', x: 138, y: 210, w: 24, h: 18, label: 'P', ly: 223 },
      { id: 'gallery', x: 128, y: 226, w: 192, h: 12, shape: 'path', art: '', label: 'MAIN GALLERY', lx: 260, ly: 222 },
      { id: 'mains', x: 168, y: 256, w: 164, h: 24, shape: 'path', art: [180, 250, 320].map((x) => `<circle class="hl sx-node" cx="${x}" cy="268" r="10"/>`).join(''), label: 'MAINS', lx: 340, ly: 300 },
      { id: 'rods', x: 206, y: 286, w: 90, h: 24, shape: 'path', art: [216, 286].map((x) => `<circle class="hl sx-node" cx="${x}" cy="298" r="8"/>`).join(''), label: 'RODS', lx: 250, ly: 326 },
      { id: 'filter', x: 110, y: 276, w: 36, h: 48, shape: 'pill', label: 'FILTER', ly: 340 },
      { id: 'pump', x: 36, y: 278, w: 48, h: 44, label: 'PUMP' },
      { id: 'pickup', x: 52, y: 322, w: 16, h: 30, shape: 'path', art: '<rect class="hl sx-node" x="50" y="346" width="20" height="8" rx="2"/>', label: '' },
      { id: 'sump', x: 20, y: 352, w: 320, h: 44, shape: 'tank', label: 'SUMP', ly: 380 },
    ],
  });
}
