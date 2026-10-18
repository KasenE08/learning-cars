// DOHC 4-valve cylinder head, cross-section through one intake and one exhaust valve.
import { defs, label } from '../svg.js';
import { lobePath } from '../engine-model.js';

export const viewBox = '-40 0 440 300';
export const defaultLabels = false; // dense drawing: tap for info, labels on demand

export const parts = {
  'intake-cam': { name: 'Intake camshaft', does: 'Its lobes push the intake valves open at the right moment.', connects: 'Driven by the timing chain/belt; presses on the intake buckets.', where: 'Top of the head, intake side.' },
  'exhaust-cam': { name: 'Exhaust camshaft', does: 'Its lobes push the exhaust valves open.', connects: 'Driven by the timing chain/belt; presses on the exhaust buckets.', where: 'Top of the head, exhaust side.' },
  bucket: { name: 'Bucket (tappet)', does: 'Cup the cam lobe slides on. Turns the lobe’s push into straight-line motion for the valve.', connects: 'Cam lobe on top, valve stem tip underneath.', where: 'In bores directly under each cam.' },
  spring: { name: 'Valve spring', does: 'Snaps the valve shut and keeps it following the cam.', connects: 'Spring seat on the head below, retainer + keepers on the stem above.', where: 'Around each valve stem, under the bucket.' },
  guide: { name: 'Valve guide', does: 'Tube that keeps the valve stem moving straight and centered on its seat.', connects: 'Pressed into the head; the stem slides through it.', where: 'Between the spring and the port.' },
  'intake-valve': { name: 'Intake valve', does: 'Opens to let air (and fuel, in port-injected engines) into the cylinder.', connects: 'Seals on its seat; opened by the intake cam.', where: 'Intake side of the chamber. Bigger than the exhaust valve.' },
  'exhaust-valve': { name: 'Exhaust valve', does: 'Opens to let burnt gas out to the exhaust.', connects: 'Seals on its seat; opened by the exhaust cam.', where: 'Exhaust side of the chamber. Runs very hot.' },
  seat: { name: 'Valve seats', does: 'Hard rings the valves seal against. Also pull heat out of the valve.', connects: 'Pressed into the head at the port openings.', where: 'Where each port meets the chamber.' },
  'intake-port': { name: 'Intake port', does: 'Shaped passage that leads air from the intake manifold to the intake valves.', connects: 'Intake manifold ↔ intake valve.', where: 'Cast into the intake side of the head.' },
  'exhaust-port': { name: 'Exhaust port', does: 'Leads burnt gas from the exhaust valves to the exhaust manifold (or turbo).', connects: 'Exhaust valve ↔ exhaust manifold / turbo.', where: 'Cast into the exhaust side of the head.' },
  plug: { name: 'Spark plug', does: 'Makes the spark that lights the mixture.', connects: 'Ignition coil on top; tip sits in the chamber.', where: 'Center of the chamber, between the cams.' },
  injector: { name: 'Direct injector', does: 'Sprays fuel straight into the cylinder at very high pressure (direct injection).', connects: 'High-pressure fuel rail ↔ combustion chamber.', where: 'Under the intake port, aimed into the chamber.' },
  chamber: { name: 'Combustion chamber', does: 'The space where the mixture burns. Its shape sets how fast and evenly the flame spreads.', connects: 'Roof = head; floor = piston crown.', where: 'Underside of the head, above each cylinder.' },
  coolant: { name: 'Coolant passages', does: 'Carry coolant around the hottest areas (chamber, exhaust side, plug).', connects: 'Linked to the block’s water jackets through holes in the head gasket.', where: 'Cast passages all through the head.' },
  gasket: { name: 'Head gasket', does: 'Seals combustion pressure, coolant and oil between head and block.', connects: 'Sandwiched between head and block deck.', where: 'The joint under the head.' },
};

export function svg(id, { labels }) {
  const cam = (x, part) => `<g data-part="${part}" transform="translate(${x} 42)"><circle class="hit" r="30"/><path class="hl d-cam" d="${lobePath(14, 9)}" transform="rotate(${part === 'intake-cam' ? 200 : 160})"/><circle r="4" class="d-cam-hub"/></g>`;
  const valve = (x, part, w) => `<g data-part="${part}"><rect class="hit" x="${x - w - 4}" y="80" width="${2 * w + 8}" height="${190 - 80}"/>
    <path class="hl d-valve" d="M${x - 3},84 L${x - 3},${182 - 8} L${x - w},${182 - 2} L${x - w},${182 + 2} L${x + w},${182 + 2} L${x + w},${182 - 2} L${x + 3},${182 - 8} L${x + 3},84 Z"/></g>`;
  const spring = (x) => { let d = `M${x - 11},82`; for (let i = 1; i <= 7; i++) d += ` L${x + (i % 2 ? 11 : -11)},${82 + i * 5}`; return d; };
  return `${defs(id)}
  <!-- head casting -->
  <g data-part="gasket"><rect class="hit" x="0" y="186" width="360" height="14"/><rect class="hl" x="0" y="190" width="360" height="6" fill="#2b3138" stroke="#8994a1"/></g>
  <path d="M0,10 L360,10 L360,190 L250,190 L232,176 L180,160 L128,176 L110,190 L0,190 Z" fill="url(#${id}-hatch)" class="d-line"/>
  <rect x="8" y="16" width="344" height="58" class="d-cavity"/>
  <g data-part="coolant"><rect class="hit" x="0" y="140" width="40" height="40"/><rect class="hit" x="322" y="140" width="38" height="40"/><rect class="hit" x="150" y="128" width="60" height="20"/>
    <rect class="hl d-coolant" x="6" y="148" width="26" height="22" rx="4"/><rect class="hl d-coolant" x="328" y="148" width="26" height="22" rx="4"/>
    <rect class="hl d-coolant" x="150" y="134" width="12" height="12" rx="2"/><rect class="hl d-coolant" x="198" y="134" width="12" height="12" rx="2"/></g>
  <g data-part="intake-port"><rect class="hit" x="0" y="100" width="70" height="40"/><path class="hl d-port d-port--in" d="M0,100 Q120,100 136,${180} L104,${182} Q90,136 0,136 Z"/></g>
  <g data-part="exhaust-port"><rect class="hit" x="290" y="100" width="70" height="40"/><path class="hl d-port d-port--ex" d="M360,104 Q248,104 228,${180} L256,${182} Q272,136 360,134 Z"/></g>
  <g data-part="chamber"><rect class="hit" x="120" y="164" width="120" height="24"/><path class="hl" fill="rgba(255,107,26,0.08)" stroke="#8994a1" stroke-dasharray="3 3" d="M110,190 L128,176 L180,160 L232,176 L250,190 Z"/></g>
  <g data-part="seat"><rect class="hit" x="96" y="174" width="18" height="16"/><rect class="hit" x="246" y="174" width="18" height="16"/>
    <path class="hl" fill="#c9a24a" stroke="#e6c46a" d="M98,178 L110,178 L112,186 L100,186 Z M250,178 L262,178 L260,186 L248,186 Z"/></g>
  <g data-part="guide"><rect class="hit" x="104" y="116" width="22" height="34"/><rect class="hit" x="238" y="116" width="22" height="34"/>
    <rect class="hl" x="108" y="118" width="12" height="28" fill="#7d6a52" stroke="#b39a84"/><rect class="hl" x="242" y="118" width="12" height="28" fill="#7d6a52" stroke="#b39a84"/></g>
  ${valve(114, 'intake-valve', 20)}
  ${valve(248, 'exhaust-valve', 16)}
  <g data-part="spring"><rect class="hit" x="96" y="80" width="38" height="38"/><rect class="hit" x="230" y="80" width="38" height="38"/>
    <path class="hl d-spring" d="${spring(114)}"/><path class="hl d-spring" d="${spring(248)}"/></g>
  <g data-part="bucket"><rect class="hit" x="96" y="56" width="36" height="26"/><rect class="hit" x="230" y="56" width="36" height="26"/>
    <rect class="hl d-bucket" x="101" y="60" width="26" height="20" rx="2"/><rect class="hl d-bucket" x="235" y="60" width="26" height="20" rx="2"/></g>
  ${cam(114, 'intake-cam')}
  ${cam(248, 'exhaust-cam')}
  <g data-part="plug"><rect class="hit" x="164" y="0" width="32" height="160"/><g class="hl-wrap">
    <rect class="hl" x="173" y="40" width="14" height="118" fill="#8f99a3" stroke="#c9d1d9"/><rect x="170" y="14" width="20" height="14" fill="#a9b3bd"/><rect x="174" y="0" width="12" height="40" fill="#e8e4da"/></g></g>
  <g data-part="injector"><rect class="hit" x="60" y="136" width="70" height="34" transform="rotate(-18 95 155)"/><rect class="hl" x="62" y="150" width="70" height="9" rx="3" transform="rotate(18 97 155)" fill="#4f86b8" stroke="#7fb2e0"/></g>
  ${labels ? `<g class="labels">
    ${label('Intake cam', -34, 30, 100, 36)}
    ${label('Bucket', -34, 66, 101, 68)}
    ${label('Valve spring', -34, 94, 103, 92)}
    ${label('Intake port', -34, 122, 20, 118)}
    ${label('Injector', -34, 170, 70, 158)}
    ${label('Coolant', -34, 216, 18, 168)}
    ${label('Head gasket', -34, 240, 60, 193)}
    ${label('Exhaust cam', 394, 30, 262, 36, 'end')}
    ${label('Spark plug', 394, 56, 187, 50, 'end')}
    ${label('Valve guide', 394, 122, 254, 130, 'end')}
    ${label('Exhaust port', 394, 152, 330, 120, 'end')}
    ${label('Valve seat', 394, 214, 256, 182, 'end')}
    ${label('Exhaust valve', 394, 240, 248, 176, 'end')}
    ${label('Intake valve', -34, 264, 114, 184)}
    ${label('Chamber', 394, 266, 200, 178, 'end')}
  </g>` : ''}`;
}
