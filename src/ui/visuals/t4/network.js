// Car network map: ECUs on several buses joined by a gateway; the OBD port hangs off the gateway.
import { html, el } from '../../dom.js';
import { chips } from '../controls.js';

const INFO = {
  ecm: 'Engine computer: fuel, spark, boost, throttle, emissions. The main OBD-II responder.',
  tcm: 'Transmission computer: shift timing and torque-converter lockup.',
  abs: 'ABS / stability control: wheel speeds, brake pressure, traction and stability control.',
  eps: 'Electric power steering: steering assist, torque and angle sensing; lane-keep steering requests go here.',
  srs: 'Airbag / restraints computer: crash sensing, seatbelt status.',
  cam: 'Front camera behind the windshield: lane keeping, auto high beams, pre-collision assist.',
  awd: 'All-wheel-drive control: decides how much torque goes to the rear axle.',
  bcm: 'Body computer: lights, locks, wipers, turn signals, keyless entry.',
  ipc: 'Instrument cluster: gauges and warning lights; it listens to almost everything.',
  info: 'Infotainment head unit: screen, phone, Bluetooth, apps.',
  tcu: 'Telematics unit: the cellular modem (remote start from an app, emergency calls, over-the-air updates).',
  gw: 'Gateway: routes only the messages each bus needs, and acts as a firewall between them and the OBD port.',
  obd: 'OBD-II port: on modern cars it connects to the gateway, not straight to every bus.',
};

const PRESETS = {
  generic: {
    note: 'A typical layout. Real cars differ in bus names, speeds and which modules sit where.',
    buses: [['Powertrain CAN · 500 kbit/s', ['ecm', 'tcm']], ['Chassis CAN · 500 kbit/s', ['abs', 'eps', 'srs']], ['Body CAN · lower speed', ['bcm', 'ipc']], ['Infotainment', ['info', 'tcu']]],
    names: { ecm: 'ECM', tcm: 'TCM', abs: 'ABS', eps: 'EPS', srs: 'SRS', bcm: 'BCM', ipc: 'Cluster', info: 'Head unit', tcu: 'Telematics', gw: 'Gateway', obd: 'OBD' },
  },
  ford: {
    note: 'Simplified Ford-style layout. PCM, ABS_ESC, PSCM, IPMA, RCM and GWM are module names in the community openpilot DBC; exact Bronco Sport wiring isn’t public.',
    buses: [['High-speed CAN (powertrain/chassis)', ['ecm', 'abs', 'eps']], ['High-speed CAN (driver assist)', ['cam', 'srs']], ['Body CAN', ['bcm', 'ipc']], ['Infotainment', ['info', 'tcu']]],
    names: { ecm: 'PCM', abs: 'ABS/ESC', eps: 'PSCM', cam: 'IPMA', srs: 'RCM', bcm: 'BCM', ipc: 'IPC', info: 'APIM (SYNC)', tcu: 'TCU modem', gw: 'GWM', obd: 'OBD' },
  },
};

export function mount(host, spec = {}) {
  const S = { preset: PRESETS[spec.preset] ? spec.preset : 'generic', sel: spec.highlight || 'gw' };
  const wrap = el(html`<figure class="vis net" data-noswipe>
    <svg viewBox="0 0 360 330" class="d" role="img" aria-label="Vehicle network map"></svg>
    <div class="cf__info net__info"></div>
    <div class="ctl"></div>
    <p class="vis__note"></p>
  </figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg');
  function draw() {
    const P = PRESETS[S.preset];
    let g = `<rect data-m="gw" x="10" y="30" width="62" height="252" rx="6" fill="${S.sel === 'gw' ? 'rgba(255,107,26,.3)' : '#1d2126'}" stroke="${S.sel === 'gw' ? '#ff6b1a' : '#ffc21a'}" stroke-width="2" style="cursor:pointer"/>
      <text x="41" y="160" text-anchor="middle" class="awd-lbl" transform="rotate(-90 41 156)" style="pointer-events:none">${P.names.gw}</text>
      <rect data-m="obd" x="14" y="294" width="54" height="28" rx="4" fill="${S.sel === 'obd' ? 'rgba(255,107,26,.3)' : '#14171a'}" stroke="#c9d1d9" style="cursor:pointer"/>
      <text x="41" y="313" text-anchor="middle" class="awd-lbl" style="pointer-events:none">${P.names.obd}</text>
      <line x1="41" x2="41" y1="282" y2="294" stroke="#c9d1d9" stroke-width="2"/>`;
    P.buses.forEach(([name, mods], i) => {
      const y = 62 + i * 70;
      g += `<line x1="72" x2="350" y1="${y}" y2="${y}" stroke="#ff6b1a" stroke-width="3"/><line x1="72" x2="350" y1="${y + 4}" y2="${y + 4}" stroke="#7fb2e0" stroke-width="3"/>
        <text x="84" y="${y + 18}" class="awd-sub">${name}</text>`;
      mods.forEach((m, j) => {
        const x = 96 + j * 86;
        const on = S.sel === m;
        g += `<line x1="${x + 36}" x2="${x + 36}" y1="${y - 12}" y2="${y}" stroke="#5b6470" stroke-width="2"/>
          <g data-m="${m}" style="cursor:pointer"><rect x="${x}" y="${y - 40}" width="72" height="28" rx="4" fill="${on ? 'rgba(255,107,26,.3)' : '#262b31'}" stroke="${on ? '#ff6b1a' : '#5b6470'}" stroke-width="${on ? 2 : 1}"/>
          <text x="${x + 36}" y="${y - 21}" text-anchor="middle" class="awd-lbl" style="font-size:${P.names[m].length > 8 ? 9 : 11}px">${P.names[m]}</text></g>`;
      });
    });
    svg.innerHTML = g;
    wrap.querySelector('.net__info').innerHTML = `<b>${P.names[S.sel] || S.sel}</b><p>${INFO[S.sel]}</p>`;
    wrap.querySelector('.vis__note').textContent = P.note;
  }
  svg.addEventListener('click', (e) => { const m = e.target.closest('[data-m]'); if (m) { S.sel = m.dataset.m; draw(); } });
  wrap.querySelector('.ctl').append(chips([{ value: 'generic', label: 'Typical car' }, { value: 'ford', label: 'Ford-style' }], { value: S.preset, onPick(v) { S.preset = v; if (!PRESETS[v].names[S.sel]) S.sel = 'gw'; draw(); } }).el);
  draw();
  return { destroy() {} };
}
