// Twin-clutch rear drive unit, schematic top view (Badlands). Generic twin-clutch layout:
// no differential gears; one clutch pack per wheel. Internal details are illustrative.
import { label } from '../svg.js';

export const viewBox = '-40 0 480 300';

export const parts = {
  input: { name: 'Input flange', does: 'Where the driveshaft bolts on. Spins whenever the car rolls.', connects: 'Driveshaft (from the PTU) → pinion.', where: 'Front face of the unit.' },
  pinion: { name: 'Pinion gear', does: 'Small bevel gear that turns the drive 90° toward the wheels and multiplies torque.', connects: 'Input flange ↔ ring gear.', where: 'Inside, at the front.' },
  ring: { name: 'Ring gear + center drum', does: 'Big bevel gear driven by the pinion. It spins a center drum that both clutch packs grip.', connects: 'Pinion in; clutch packs on both sides.', where: 'Middle of the unit.' },
  'clutch-l': { name: 'Left clutch pack', does: 'Stack of plates. Squeeze it and the left wheel gets drive; relax it and it slips or frees the wheel.', connects: 'Center drum ↔ left output shaft.', where: 'Left of the ring gear.' },
  'clutch-r': { name: 'Right clutch pack', does: 'Same as the left, for the right wheel. Squeezing one harder than the other sends more torque to that side: torque vectoring.', connects: 'Center drum ↔ right output shaft.', where: 'Right of the ring gear.' },
  actuators: { name: 'Clutch actuators', does: 'Squeeze each clutch pack on command from the computer. How hard sets how much torque each wheel can get.', connects: 'Controlled by the AWD module over the car’s network.', where: 'Outboard of each clutch pack (illustrative).' },
  outputs: { name: 'Output shafts', does: 'Carry drive out to the left and right halfshafts.', connects: 'Clutch packs → CV halfshafts → rear wheels.', where: 'Both sides.' },
  case: { name: 'Housing + fluid', does: 'Holds the gears and clutches in gear oil. The oil also cools the clutches, which is why its condition matters.', connects: 'Bolted to the rear subframe; has a vent.', where: 'Between the rear wheels.' },
};

export function svg(id, { labels = true } = {}) {
  const pack = (x0, part) => {
    let plates = '';
    for (let i = 0; i < 7; i++) plates += `<rect x="${x0 + i * 7}" y="104" width="4" height="92" rx="1" fill="${i % 2 ? '#c9a24a' : '#9aa5b1'}"/>`;
    return `<g data-part="${part}"><rect class="hit" x="${x0 - 4}" y="96" width="56" height="108"/><rect x="${x0 - 4}" y="98" width="54" height="104" rx="4" class="hl" fill="rgba(255,194,26,0.06)" stroke="#ffc21a" stroke-dasharray="3 3"/>${plates}</g>`;
  };
  return `
  <g data-part="case"><rect class="hit" x="30" y="56" width="340" height="16"/><rect x="34" y="60" width="332" height="180" rx="22" class="hl" fill="#14171a" stroke="#8994a1" stroke-width="1.6"/></g>
  <g data-part="outputs"><rect class="hit" x="-30" y="138" width="80" height="24"/><rect class="hit" x="350" y="138" width="80" height="24"/>
    <rect x="-28" y="142" width="96" height="16" rx="3" class="hl" fill="#c9d1d9"/><rect x="332" y="142" width="96" height="16" rx="3" class="hl" fill="#c9d1d9"/></g>
  <g data-part="actuators"><rect class="hit" x="66" y="110" width="24" height="80"/><rect class="hit" x="310" y="110" width="24" height="80"/>
    <rect x="70" y="114" width="16" height="72" rx="3" class="hl" fill="#262b31" stroke="#ff6b1a"/><rect x="314" y="114" width="16" height="72" rx="3" class="hl" fill="#262b31" stroke="#ff6b1a"/></g>
  ${pack(96, 'clutch-l')}${pack(260, 'clutch-r')}
  <g data-part="ring"><rect class="hit" x="150" y="80" width="100" height="140"/>
    <rect x="152" y="126" width="96" height="48" rx="6" class="hl" fill="#3a424c" stroke="#8994a1"/>
    <path d="M178,84 L196,84 L196,216 L178,216 Z" class="hl" fill="#ff6b1a" stroke="#ffa060"/>
    <path d="M178,90 h18 M178,100 h18 M178,110 h18 M178,120 h18 M178,180 h18 M178,190 h18 M178,200 h18 M178,210 h18" stroke="#1a0c03" stroke-width="1.5"/></g>
  <g data-part="pinion"><rect class="hit" x="190" y="196" width="40" height="40"/><path d="M198,204 L222,204 L218,232 L202,232 Z" class="hl" fill="#ffc21a" stroke="#ffe08a"/></g>
  <g data-part="input"><rect class="hit" x="190" y="232" width="40" height="64"/><rect x="200" y="232" width="20" height="40" class="hl" fill="#c9d1d9"/><rect x="192" y="270" width="36" height="10" rx="2" class="hl" fill="#8994a1"/><path d="M210,280 v16" stroke="#c9d1d9" stroke-width="6"/></g>
  <text x="210" y="298" text-anchor="middle" style="font-size:10px" class="geo-t">FROM DRIVESHAFT</text>
  <text x="0" y="132" class="geo-t" style="font-size:10px">LEFT WHEEL</text><text x="400" y="132" text-anchor="end" class="geo-t" style="font-size:10px">RIGHT WHEEL</text>
  ${labels ? `<g class="labels">
    ${label('Clutch pack', 96, 30, 120, 98)}
    ${label('Actuator', -30, 70, 78, 116)}
    ${label('Ring gear', 230, 30, 188, 84)}
    ${label('Center drum', 286, 50, 236, 130)}
  </g>` : ''}`;
}
