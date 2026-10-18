// Side X-ray of a Bronco Sport–shaped compact SUV. Front to the right. Layout simplified.
import { label } from '../svg.js';
import { parts as top } from './car-top.js';

export const viewBox = '0 0 600 330';
export const defaultLabels = false;

const pick = (ids) => Object.fromEntries(ids.map((k) => [k, top[k]]));
export const parts = {
  ...pick(['engine', 'turbo', 'radiator', 'battery', 'transmission', 'ptu', 'driveshaft', 'rdu', 'wheels', 'brakes', 'susp-front', 'susp-rear', 'steering', 'exhaust', 'fuel-tank', 'intercooler']),
  body: { name: 'Unibody', does: 'Body and frame are one welded steel shell (no separate ladder frame). Lighter, stiffer, better on-road.', connects: 'Subframes carry the engine and suspension.', where: 'Everything you can see.' },
};

export function svg(id, { labels } = {}) {
  const wheel = (cx) => `<circle cx="${cx}" cy="262" r="46" class="hl" fill="#14171a" stroke="#8994a1" stroke-width="2"/><circle cx="${cx}" cy="262" r="28" fill="#1d2126" stroke="#5b6470"/>`;
  return `
  <g data-part="body"><rect class="hit" x="40" y="40" width="530" height="40"/>
    <path class="hl" d="M44,250 L44,170 Q46,140 70,132 L170,118 L214,62 Q220,54 232,54 L478,52 Q494,52 500,64 L548,140 Q560,146 562,170 L564,250" fill="rgba(255,255,255,0.025)" stroke="#5b6470" stroke-width="1.8"/>
    <path d="M232,62 L232,124 M354,58 L354,124 M470,58 L470,124 M214,124 L540,124" stroke="#3a424c" stroke-width="1.2" fill="none"/>
    <path d="M250,44 L480,42" stroke="#5b6470" stroke-width="3"/><path d="M270,44 v-6 M460,42 v-6" stroke="#5b6470" stroke-width="3"/></g>
  <path d="M250,150 l26,0 l6,60 l-26,0 Z M370,150 l26,0 l6,60 l-26,0 Z" fill="none" stroke="#2a3038"/>
  <g data-part="wheels"><rect class="hit" x="88" y="214" width="96" height="96"/><rect class="hit" x="416" y="214" width="96" height="96"/>${wheel(136)}${wheel(464)}</g>
  <g data-part="brakes"><circle class="hit" cx="136" cy="262" r="26"/><circle class="hit" cx="464" cy="262" r="26"/>
    <circle cx="136" cy="262" r="22" class="hl" fill="#3a424c" stroke="#9aa5b1" stroke-width="2"/><circle cx="464" cy="262" r="22" class="hl" fill="#3a424c" stroke="#9aa5b1" stroke-width="2"/>
    <rect x="150" y="244" width="10" height="20" rx="2" class="hl" fill="#ff6b1a"/><rect x="478" y="244" width="10" height="20" rx="2" class="hl" fill="#ff6b1a"/></g>
  <g data-part="susp-front"><rect class="hit" x="448" y="150" width="34" height="96"/><path d="M462,156 L470,240" class="hl" stroke="#7fb2e0" stroke-width="7"/><path d="M458,170 l16,6 l-16,6 l16,6 l-16,6 l16,6" class="hl" stroke="#ffc21a" stroke-width="2" fill="none"/></g>
  <g data-part="susp-rear"><rect class="hit" x="120" y="160" width="40" height="90"/><path d="M128,170 L140,244" class="hl" stroke="#7fb2e0" stroke-width="6"/><path d="M100,250 L172,248" class="hl" stroke="#7fb2e0" stroke-width="3"/></g>
  <g data-part="radiator"><rect class="hit" x="540" y="150" width="20" height="70"/><rect x="544" y="154" width="10" height="62" class="hl" fill="#1f5d80" stroke="#7fb2e0"/></g>
  <g data-part="intercooler"><rect class="hit" x="526" y="210" width="34" height="24"/><rect x="530" y="214" width="26" height="14" class="hl" fill="#2b5f86" stroke="#7fb2e0"/></g>
  <g data-part="battery"><rect class="hit" x="486" y="134" width="34" height="24"/><rect x="490" y="138" width="26" height="16" class="hl" fill="#3a424c" stroke="#ffc21a"/></g>
  <g data-part="engine"><rect class="hit" x="420" y="136" width="70" height="80"/><path d="M426,142 L486,142 L490,206 L424,210 Z" class="hl" fill="#4a535e" stroke="#c9d1d9" stroke-width="1.4"/><path d="M434,152 h44 M434,160 h44" stroke="#262b31" stroke-width="3"/></g>
  <g data-part="transmission"><rect class="hit" x="396" y="176" width="34" height="46"/><path d="M402,182 L426,180 L426,218 L404,214 Z" class="hl" fill="#3a424c" stroke="#8994a1"/></g>
  <g data-part="turbo"><circle class="hit" cx="412" cy="164" r="14"/><circle cx="412" cy="164" r="10" class="hl" fill="#ff6b1a" stroke="#ffa060"/></g>
  <g data-part="steering"><rect class="hit" x="370" y="110" width="60" height="70"/><path d="M380,128 L428,196" class="hl" stroke="#a9b3bd" stroke-width="3"/><ellipse cx="380" cy="126" rx="5" ry="16" class="hl" fill="none" stroke="#a9b3bd" stroke-width="3" transform="rotate(-30 380 126)"/></g>
  <g data-part="ptu"><rect class="hit" x="384" y="214" width="26" height="22"/><rect x="388" y="218" width="18" height="14" rx="3" class="hl" fill="#ffc21a"/></g>
  <g data-part="driveshaft"><rect class="hit" x="170" y="218" width="220" height="16"/><path d="M386,226 L176,236" class="hl" stroke="#c9d1d9" stroke-width="5"/></g>
  <g data-part="rdu"><rect class="hit" x="150" y="224" width="34" height="30"/><rect x="154" y="228" width="26" height="22" rx="4" class="hl" fill="#ff6b1a" stroke="#ffa060"/></g>
  <g data-part="fuel-tank"><rect class="hit" x="196" y="196" width="110" height="34"/><path d="M200,200 L300,200 L302,224 L198,226 Z" class="hl" fill="rgba(255,194,26,0.12)" stroke="#ffc21a"/></g>
  <g data-part="exhaust"><rect class="hit" x="40" y="236" width="360" height="20"/><path d="M406,176 L398,240 L120,246 L60,248 L44,244" class="hl" fill="none" stroke="#b39a84" stroke-width="5" stroke-linejoin="round"/>
    <rect x="356" y="236" width="34" height="12" rx="5" class="hl" fill="#7d6a52" stroke="#c9ad94"/><rect x="60" y="240" width="54" height="14" rx="6" class="hl" fill="#5b4d40" stroke="#c9ad94"/></g>
  <text x="572" y="320" text-anchor="end" class="geo-t">FRONT →</text>
  ${labels ? `<g class="labels">
    ${label('Fuel tank', 230, 180, 250, 210)}
    ${label('Driveshaft', 250, 290, 300, 230)}
    ${label('Rear drive unit', 60, 210, 166, 236)}
    ${label('Muffler', 40, 300, 84, 248)}
    ${label('Engine', 470, 112, 450, 150, 'end')}
    ${label('Turbo', 380, 150, 404, 164, 'end')}
    ${label('PTU', 360, 290, 396, 226, 'end')}
    ${label('Strut', 520, 300, 466, 210, 'end')}
    ${label('Radiator', 596, 130, 550, 160, 'end')}
  </g>` : ''}`;
}
