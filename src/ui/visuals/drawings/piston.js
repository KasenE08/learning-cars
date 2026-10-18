// Piston + rod small end, front view with the lower half cut away to show the pin.
import { defs, label } from '../svg.js';

export const viewBox = '-20 0 400 330';

export const parts = {
  crown: { name: 'Crown', does: 'Top face of the piston. Takes the full heat and pressure of combustion.', connects: 'Forms the floor of the combustion chamber.', where: 'Top of the piston, facing the cylinder head.' },
  'top-ring': { name: 'Top compression ring', does: 'Seals combustion pressure so it pushes the piston instead of leaking past it.', connects: 'Sits in the top groove; presses outward against the cylinder wall.', where: 'Highest groove, just under the crown.' },
  'second-ring': { name: 'Second ring', does: 'Backup seal for the top ring, and scrapes oil downward.', connects: 'Second groove; rides on the cylinder wall.', where: 'Middle groove.' },
  'oil-ring': { name: 'Oil control ring', does: 'Scrapes excess oil off the cylinder wall and drains it back through holes in the groove, so it isn’t burned.', connects: 'Bottom groove; two thin rails and a wavy expander.', where: 'Lowest groove, above the pin.' },
  lands: { name: 'Ring lands', does: 'The bands of piston metal between the grooves that hold the rings in place.', connects: 'Between crown and skirt.', where: 'Between each ring groove.' },
  skirt: { name: 'Skirt', does: 'Keeps the piston square in the bore so it doesn’t rock (“piston slap”).', connects: 'Slides on the cylinder wall on an oil film.', where: 'Lower sides of the piston, below the rings.' },
  'pin-boss': { name: 'Pin boss', does: 'Thick metal supports that carry the wrist pin and the combustion load into it.', connects: 'Holds both ends of the wrist pin.', where: 'Inside the piston, either side of the rod.' },
  'wrist-pin': { name: 'Wrist pin', does: 'Hardened steel pin that lets the rod pivot while the piston moves straight.', connects: 'Piston pin bosses ↔ rod small end. Clips keep it from sliding out.', where: 'Through the middle of the piston.' },
  'small-end': { name: 'Rod small end', does: 'Eye at the top of the connecting rod that wraps around the wrist pin (often with a bronze bushing).', connects: 'Wrist pin above, rod beam below.', where: 'Inside the piston, between the pin bosses.' },
  rod: { name: 'Connecting rod beam', does: 'Carries the push from the piston down to the crankshaft.', connects: 'Small end (top) to big end on the crankpin (bottom).', where: 'Below the piston, down into the crankcase.' },
};

export function svg(id, { labels }) {
  return `${defs(id)}
  <!-- rod (behind piston) -->
  <g data-part="rod"><rect class="hit" x="150" y="190" width="60" height="130"/><path class="hl d-rod" d="M164,186 L196,186 L190,320 L170,320 Z"/></g>
  <!-- skirt with cutaway window -->
  <g data-part="skirt"><rect class="hit" x="86" y="118" width="188" height="92"/>
    <path class="hl" fill="url(#${id}-metal)" stroke="#8994a1" stroke-width="1.4" d="M90,118 L270,118 L266,206 L224,206 L224,150 L136,150 L136,206 L94,206 Z"/></g>
  <!-- pin bosses -->
  <g data-part="pin-boss"><rect class="hit" x="128" y="140" width="22" height="66"/><rect class="hit" x="210" y="140" width="22" height="66"/>
    <path class="hl" fill="#6d7782" stroke="#a9b3bd" d="M136,150 L154,150 L154,200 L136,200 Z M206,150 L224,150 L224,200 L206,200 Z"/></g>
  <!-- small end -->
  <g data-part="small-end"><rect class="hit" x="154" y="152" width="52" height="46"/><path class="hl d-rod" d="M158,175 A22,22 0 1 1 202,175 L196,190 L164,190 Z"/></g>
  <!-- wrist pin -->
  <g data-part="wrist-pin"><rect class="hit" x="128" y="162" width="104" height="24"/><rect class="hl d-pin" x="132" y="166" width="96" height="18" rx="4"/><line x1="132" x2="228" y1="172" y2="172" stroke="#aab4bf" stroke-width="1"/></g>
  <!-- lands (piston body around rings) -->
  <g data-part="lands"><rect class="hit" x="86" y="56" width="188" height="62"/><rect class="hl" fill="url(#${id}-metal)" stroke="#8994a1" stroke-width="1.4" x="90" y="56" width="180" height="62"/></g>
  <!-- rings -->
  <g data-part="top-ring"><rect class="hit" x="80" y="58" width="200" height="14"/><rect class="hl" x="86" y="62" width="188" height="6" fill="#2b3138" stroke="#d0d7de" stroke-width="1"/></g>
  <g data-part="second-ring"><rect class="hit" x="80" y="74" width="200" height="14"/><rect class="hl" x="86" y="78" width="188" height="6" fill="#2b3138" stroke="#d0d7de" stroke-width="1"/></g>
  <g data-part="oil-ring"><rect class="hit" x="80" y="90" width="200" height="18"/><rect class="hl" x="86" y="94" width="188" height="10" fill="#2b3138" stroke="#d0d7de" stroke-width="1"/>
    <path d="M90,99 l6,-3 l6,3 l6,-3 l6,3 l6,-3 l6,3 l6,-3 l6,3 l6,-3 l6,3 l6,-3 l6,3 l6,-3 l6,3 l6,-3 l6,3 l6,-3 l6,3 l6,-3 l6,3 l6,-3 l6,3 l6,-3 l6,3 l6,-3 l6,3 l6,-3 l6,3 l6,-3 l6,3" fill="none" stroke="#ffc21a" stroke-width="1"/></g>
  <!-- crown -->
  <g data-part="crown"><rect class="hit" x="86" y="22" width="188" height="36"/>
    <path class="hl" fill="url(#${id}-metal)" stroke="#8994a1" stroke-width="1.4" d="M90,56 L90,36 Q180,24 270,36 L270,56 Z"/>
    <path d="M140,33 Q180,46 220,33" fill="none" stroke="#5a6470" stroke-width="1.2"/></g>
  ${labels ? `<g class="labels">
    ${label('Crown', -14, 30, 120, 36)}
    ${label('Top ring', -14, 60, 92, 65)}
    ${label('2nd ring', -14, 82, 92, 81)}
    ${label('Oil ring', -14, 104, 92, 99)}
    ${label('Skirt', -14, 196, 100, 190)}
    ${label('Rod', -14, 290, 172, 290)}
    ${label('Ring lands', 374, 74, 262, 72, 'end')}
    ${label('Wrist pin', 374, 150, 226, 172, 'end')}
    ${label('Pin boss', 374, 214, 218, 196, 'end')}
    ${label('Small end', 374, 244, 196, 186, 'end')}
  </g>` : ''}`;
}
