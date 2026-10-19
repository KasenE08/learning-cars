// Attack-surface map of a car (top view): remote, short-range and physical entry points.
// Each: what it is, a landmark public case, and defenses. Concept only.
import { html, el } from '../../dom.js';

export const SURFACES = {
  telematics: { kind: 'remote', name: 'Cellular telematics', x: 180, y: 150, what: 'The built-in modem for app features, emergency calls and over-the-air updates. Reachable from anywhere.', case: '2015: Charlie Miller and Chris Valasek remotely reached a Jeep Cherokee through its Uconnect cellular connection; Chrysler recalled about 1.4 million vehicles and the carrier blocked the exposed port.', defend: 'Firewalled networks, a gateway between telematics and driving systems, signed over-the-air updates, monitoring.' },
  wireless: { kind: 'short', name: 'Wi-Fi / Bluetooth', x: 150, y: 120, what: 'Phone pairing, hotspots and in-car Wi-Fi: short-range radios with complex software behind them.', case: '2016: Keen Security Lab (Tencent) showed an attack chain on a Tesla Model S starting from a fake Wi-Fi hotspot and the web browser; Tesla says it shipped an over-the-air fix within 10 days of the report.', defend: 'Patched radio stacks, isolating infotainment from the driving networks, fast OTA updates.' },
  infotainment: { kind: 'short', name: 'Infotainment & USB', x: 180, y: 112, what: 'Media players, USB ports and apps run large amounts of code that reads untrusted files.', case: '2011: UC San Diego and University of Washington researchers compromised a car through a doctored music file, Bluetooth and the telematics unit (Checkoway et al.).', defend: 'Sandboxed media parsing, code signing, a gateway so the head unit can’t send driving messages.' },
  keyfob: { kind: 'short', name: 'Keyless entry & fob', x: 120, y: 165, what: 'The car talks by radio to your fob to unlock and allow starting.', case: '2011: ETH Zurich researchers (Francillon, Danev, Čapkun) showed relay attacks that unlock and start cars with passive keyless entry from far away.', defend: 'Rolling codes and challenge-response, motion-sensing fobs that sleep, UWB distance measurement, PIN-to-drive.' },
  tpms: { kind: 'short', name: 'Tire-pressure sensors', x: 270, y: 60, what: 'Each wheel radios its pressure to the car, traditionally unencrypted.', case: '2010: Rutgers and University of South Carolina researchers showed TPMS signals could be tracked and spoofed to trigger false warnings (USENIX Security 2010).', defend: 'Plausibility checks, authenticated sensor IDs; impact is mostly privacy and warnings.' },
  obd: { kind: 'physical', name: 'OBD-II port', x: 132, y: 205, what: 'Direct wired access to the car’s networks, meant for repair shops and inspections.', case: '2010: University of Washington and UC San Diego researchers (Koscher et al.) plugged into the OBD port and could control brakes, engine and dashboard on a test car.', defend: 'Secure gateways that filter traffic at the port, authenticated diagnostics (UDS security access), message authentication.' },
  'can-wiring': { kind: 'physical', name: 'Exposed CAN wiring', x: 92, y: 48, what: 'Network wires running to the outside of the car, for example to headlights.', case: '2023: Ken Tindell and Ian Tabor described thieves stealing a Toyota RAV4 by injecting CAN messages through the headlight wiring (“CAN injection”).', defend: 'Message authentication (so a fake “key is valid” message is rejected), keeping critical modules off exposed buses.' },
};
const KIND = { remote: ['Remote (anywhere)', '#ff4d3d'], short: ['Short range (nearby)', '#ffc21a'], physical: ['Physical (hands on the car)', '#7fb2e0'] };

export function mount(host, spec = {}) {
  const S = { sel: SURFACES[spec.highlight] ? spec.highlight : 'telematics' };
  const wrap = el(html`<figure class="vis atk" data-noswipe>
    <svg viewBox="0 0 360 250" class="d" role="img" aria-label="Car attack surfaces"></svg>
    <div class="atk__legend">${Object.values(KIND).map(([t, c]) => html`<span><i style="background:${c}"></i>${t}</span>`)}</div>
    <div class="cf__info atk__info"></div>
    <p class="vis__note">Public research only, all disclosed to the makers and fixed. This is how the field learned where to put defenses, not a how-to.</p>
  </figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg');
  function draw() {
    let g = `<text x="12" y="20" class="awd-sub">front ↑</text>
      <path d="M120,20 Q180,6 240,20 L262,60 L270,180 Q268,232 240,240 L120,240 Q92,232 90,180 L98,60 Z" fill="#14171a" stroke="#5b6470" stroke-width="2"/>
      <path d="M112,96 Q180,82 248,96 L244,128 Q180,120 116,128 Z" fill="#1d2126" stroke="#3a424c"/>
      <rect x="116" y="138" width="128" height="80" rx="6" fill="none" stroke="#262b31"/>
      ${[[88, 58], [272, 58], [88, 196], [272, 196]].map(([x, y]) => `<rect x="${x - 8}" y="${y - 18}" width="16" height="36" rx="4" fill="#262b31"/>`).join('')}`;
    for (const [id, s] of Object.entries(SURFACES)) {
      const c = KIND[s.kind][1], on = id === S.sel;
      g += `<g data-id="${id}" style="cursor:pointer"><circle cx="${s.x}" cy="${s.y}" r="${on ? 13 : 10}" fill="${c}" fill-opacity="${on ? 0.5 : 0.25}" stroke="${c}" stroke-width="${on ? 3 : 1.5}"/>
        <circle cx="${s.x}" cy="${s.y}" r="18" fill="transparent"/></g>`;
    }
    const s = SURFACES[S.sel];
    g += `<text x="${s.x > 200 ? s.x - 18 : s.x + 18}" y="${s.y + 4}" text-anchor="${s.x > 200 ? 'end' : 'start'}" class="awd-lbl" style="paint-order:stroke;stroke:#0c0e10;stroke-width:3px">${s.name}</text>`;
    svg.innerHTML = g;
    wrap.querySelector('.atk__info').innerHTML = `<b style="color:${KIND[s.kind][1]}">${s.name}</b> <span class="mono muted" style="font-size:11px">${KIND[s.kind][0]}</span>
      <p>${s.what}</p><p><b>Landmark case:</b> ${s.case}</p><p><b>Defenses:</b> ${s.defend}</p>`;
  }
  svg.addEventListener('click', (e) => { const g = e.target.closest('[data-id]'); if (g) { S.sel = g.dataset.id; draw(); } });
  draw();
  return { destroy() {} };
}
