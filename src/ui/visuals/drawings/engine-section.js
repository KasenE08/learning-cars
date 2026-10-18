// Whole single-cylinder slice: top end (head) + bottom end (block, crank, pan). Static.
import { defs, label } from '../svg.js';
import { lobePath } from '../engine-model.js';

export const viewBox = '-60 0 440 430';

export const parts = {
  head: { name: 'Cylinder head', does: 'Lid on the cylinders. Holds valves, ports, spark plugs and (DOHC) the camshafts.', connects: 'Bolted to the block over the head gasket; intake and exhaust bolt to its sides.', where: 'Top of the engine. “Top end.”' },
  camshaft: { name: 'Camshaft', does: 'Spinning shaft with lobes that open the valves.', connects: 'Driven from the crank by the timing chain/belt at half speed.', where: 'In the head, above the valves.' },
  valves: { name: 'Valves', does: 'Doors that let air in and exhaust out.', connects: 'Opened by the cam, closed by springs; seal on seats in the head.', where: 'In the head, above each cylinder.' },
  plug: { name: 'Spark plug', does: 'Lights the air-fuel mixture.', connects: 'Ignition coil ↔ combustion chamber.', where: 'Center of the head, above the cylinder.' },
  gasket: { name: 'Head gasket', does: 'Seals the joint between head and block.', connects: 'Head above, block deck below.', where: 'Between head and block.' },
  block: { name: 'Cylinder block', does: 'Main structure. Holds the cylinders and the crankshaft.', connects: 'Head on top, oil pan underneath, transmission bolts to the back.', where: 'The middle of the engine. “Bottom end” with the crank.' },
  cylinder: { name: 'Cylinder (bore)', does: 'Precise tube the piston slides in. Its diameter is the bore.', connects: 'Machined into (or lined inside) the block.', where: 'Inside the block, under the head.' },
  jacket: { name: 'Water jacket', does: 'Coolant passages around the cylinders that carry heat away.', connects: 'Water pump → jacket → head → radiator.', where: 'Cast into the block around each cylinder.' },
  piston: { name: 'Piston', does: 'Gets pushed down by combustion; also does the sucking, squeezing and pushing of the other strokes.', connects: 'Wrist pin → connecting rod.', where: 'Inside the cylinder.' },
  rod: { name: 'Connecting rod', does: 'Links piston to crank; turns straight push into a turning push.', connects: 'Wrist pin (top) ↔ crankpin (bottom).', where: 'Between piston and crank.' },
  crank: { name: 'Crankshaft', does: 'Turns the pistons’ up-down motion into rotation that drives the car.', connects: 'Rods, main bearings in the block, flywheel/flexplate, timing drive.', where: 'Bottom of the block.' },
  pan: { name: 'Oil pan (sump)', does: 'Holds the engine oil. The oil pump draws from here.', connects: 'Bolted under the block; drain plug at the bottom.', where: 'Very bottom of the engine.' },
};

export function svg(id, { labels }) {
  const top = 196; // piston crown at ~90°
  return `${defs(id)}
  <g data-part="pan"><rect class="hit" x="60" y="380" width="200" height="40"/><path class="hl" fill="#14171a" stroke="#8994a1" stroke-width="1.4" d="M70,382 L250,382 L246,414 L74,414 Z"/><rect x="74" y="400" width="172" height="13" class="d-oil"/></g>
  <g data-part="block"><rect class="hit" x="60" y="140" width="40" height="240"/><rect class="hit" x="220" y="140" width="40" height="240"/>
    <path class="hl" fill="url(#${id}-hatch)" stroke="#8994a1" stroke-width="1.4" d="M70,140 L105,140 L105,256 Q80,300 92,382 L70,382 Z M250,140 L215,140 L215,256 Q240,300 228,382 L250,382 Z"/></g>
  <g data-part="jacket"><rect class="hit" x="80" y="150" width="20" height="80"/><rect class="hit" x="220" y="150" width="20" height="80"/>
    <rect class="hl d-coolant" x="84" y="154" width="10" height="70" rx="2"/><rect class="hl d-coolant" x="226" y="154" width="10" height="70" rx="2"/></g>
  <g data-part="cylinder"><rect class="hit" x="105" y="140" width="110" height="50"/><rect class="hl" x="105" y="128" width="110" height="${top - 128}" fill="rgba(79,134,184,0.14)" stroke="#8994a1" stroke-dasharray="4 3"/></g>
  <g data-part="crank"><rect class="hit" x="100" y="290" width="120" height="90"/><g transform="translate(160 330)"><path class="hl d-counterweight" d="M-46,22 A51,51 0 0 0 46,22 L18,0 L16,-40 A16,16 0 0 0 -16,-40 L-18,0 Z" transform="rotate(70)"/><circle r="10" class="d-journal"/></g></g>
  <g data-part="rod"><rect class="hit" x="150" y="230" width="50" height="70"/><path class="hl d-rod" d="M154,222 L166,222 L203,318 L183,322 Z"/><circle cx="197" cy="316" r="11" class="d-journal"/></g>
  <g data-part="piston"><rect class="hit" x="105" y="${top}" width="110" height="56"/><rect class="hl" x="107" y="${top}" width="106" height="56" rx="2" fill="url(#${id}-metal)" stroke="#8994a1" stroke-width="1.4"/>
    <line x1="107" x2="213" y1="${top + 8}" y2="${top + 8}" class="d-ring"/><line x1="107" x2="213" y1="${top + 14}" y2="${top + 14}" class="d-ring"/><circle cx="160" cy="${top + 26}" r="7" class="d-pin"/></g>
  <g data-part="gasket"><rect class="hit" x="60" y="134" width="200" height="12"/><rect class="hl" x="66" y="138" width="188" height="5" fill="#2b3138" stroke="#8994a1"/></g>
  <g data-part="head"><rect class="hit" x="60" y="20" width="40" height="118"/><rect class="hit" x="220" y="20" width="40" height="118"/>
    <path class="hl" fill="url(#${id}-hatch)" stroke="#8994a1" stroke-width="1.4" d="M60,20 L260,20 L260,138 L215,138 L215,126 L105,126 L105,138 L60,138 Z"/>
    <rect x="66" y="26" width="188" height="36" class="d-cavity"/>
    <path d="M60,84 Q142,84 143,126 L117,126 Q117,112 60,112 Z" class="d-port d-port--in"/><path d="M260,84 Q178,84 177,126 L203,126 Q203,112 260,112 Z" class="d-port d-port--ex"/></g>
  <g data-part="valves"><rect class="hit" x="112" y="62" width="36" height="66"/><rect class="hit" x="172" y="62" width="36" height="66"/>
    <path class="hl d-valve" d="M127,62 L127,120 L117,125 L117,127 L143,127 L143,125 L133,120 L133,62 Z M187,62 L187,120 L177,125 L177,127 L203,127 L203,125 L193,120 L193,62 Z"/></g>
  <g data-part="camshaft"><circle class="hit" cx="130" cy="40" r="20"/><circle class="hit" cx="190" cy="40" r="20"/>
    <path class="hl d-cam" d="${lobePath(12, 10)}" transform="translate(130 40) rotate(150)"/><path class="hl d-cam" d="${lobePath(12, 10)}" transform="translate(190 40) rotate(250)"/></g>
  <g data-part="plug"><rect class="hit" x="150" y="0" width="20" height="128"/><rect class="hl" x="154" y="44" width="12" height="80" fill="#8f99a3" stroke="#c9d1d9"/><rect x="151" y="14" width="18" height="12" fill="#a9b3bd"/><rect x="155" y="0" width="10" height="44" fill="#e8e4da"/></g>
  ${labels ? `<g class="labels">
    ${label('Camshaft', -54, 44, 118, 40)}
    ${label('Valves', -54, 76, 127, 90)}
    ${label('Cylinder head', -54, 108, 64, 70)}
    ${label('Head gasket', -54, 146, 68, 140)}
    ${label("Piston", -54, 214, 110, top + 30)}
    ${label('Connecting rod', -54, 280, 170, 260)}
    ${label('Crankshaft', -54, 352, 130, 345)}
    ${label('Spark plug', 374, 10, 166, 20, 'end')}
    ${label('Cylinder', 374, 164, 200, 160, 'end')}
    ${label('Water jacket', 374, 196, 231, 196, 'end')}
    ${label('Block', 374, 290, 236, 300, 'end')}
    ${label('Oil pan', 374, 404, 246, 400, 'end')}
  </g>` : ''}`;
}
