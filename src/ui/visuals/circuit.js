// 12 V circuits: fuse protection (Ohm's law) and a relay (small control current switching a big load).
import { html, el } from '../dom.js';
import { slider, chips } from './controls.js';

export function current(volts, ohms) { return volts / Math.max(ohms, 0.001); }

export function mount(host, spec = {}) {
  const view = spec.view || 'fuse';
  const wrap = el(html`<figure class="vis" data-noswipe><svg viewBox="0 0 360 230" class="d" role="img" aria-label="12 volt circuit"></svg><div class="big-out"></div><div class="ctl"></div></figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg'), out = wrap.querySelector('.big-out'), ctl = wrap.querySelector('.ctl');
  const wire = (d, live, cls = '') => `<path d="${d}" class="ci-w"/>${live ? `<path d="${d}" class="ci-flow ${cls}"/>` : ''}`;
  if (view === 'fuse') {
    const S = { R: 2.4, on: true, blown: false, rating: 10 };
    const draw = () => {
      const I = S.on && !S.blown ? current(12.6, S.R) : 0;
      if (I > S.rating) S.blown = true;
      const live = S.on && !S.blown;
      const Ishow = live ? I : 0;
      svg.innerHTML = `${wire('M60,60 L130,60', live)}${wire('M170,60 L230,60', live)}${wire('M270,60 L310,60 L310,170 L60,170 L60,130', live)}
        <rect x="30" y="80" width="60" height="50" rx="4" fill="#3a424c" stroke="#ffc21a"/><text x="60" y="110" text-anchor="middle" class="awd-lbl">12.6 V</text>
        <rect x="130" y="50" width="40" height="20" rx="6" fill="${S.blown ? '#3a1410' : '#2b3138'}" stroke="${S.blown ? '#ff4d3d' : '#c9d1d9'}"/><path d="${S.blown ? 'M136,60 L148,56 M152,64 L164,60' : 'M136,60 L164,60'}" stroke="${S.blown ? '#ff4d3d' : '#ffc21a'}" stroke-width="2"/><text x="150" y="40" text-anchor="middle" class="awd-sub">${S.rating} A fuse${S.blown ? ' · BLOWN' : ''}</text>
        <path d="M230,60 L262,${S.on ? 60 : 44}" stroke="#c9d1d9" stroke-width="4" stroke-linecap="round"/><circle cx="230" cy="60" r="4" fill="#c9d1d9"/><circle cx="270" cy="60" r="4" fill="#c9d1d9"/><text x="250" y="40" text-anchor="middle" class="awd-sub">switch</text>
        <circle cx="310" cy="115" r="22" fill="${live ? `rgba(255,224,138,${Math.min(1, Ishow / 6)})` : '#14171a'}" stroke="#ffe08a" stroke-width="2"/><text x="310" y="150" text-anchor="middle" class="awd-sub">load ${S.R < 0.1 ? '(SHORT)' : `${S.R.toFixed(1)} Ω`}</text>
        <text x="180" y="196" text-anchor="middle" class="awd-sub">ground return (body)</text>`;
      out.innerHTML = `<span class="ro ro--hl"><small>Current I = V ÷ R</small><b>${Ishow.toFixed(1)} A</b></span><span class="ro"><small>Power P = V × I</small><b>${(12.6 * Ishow).toFixed(0)} W</b></span><span class="ro"><small>Status</small><b style="font-size:13px">${S.blown ? 'Fuse blew: it protected the wire' : !S.on ? 'Switch open' : 'Working'}</b></span>`;
    };
    const r = slider({ label: 'Load resistance', min: 0.05, max: 12, step: 0.05, value: S.R, fmt: (v) => `${v.toFixed(2)} Ω`, onInput(v) { S.R = v; draw(); } });
    const b = el(html`<div class="btn-row"><button class="btn" type="button" data-sw>Toggle switch</button><button class="btn btn--danger" type="button" data-short>Short to ground</button><button class="btn btn--ghost" type="button" data-fix>Replace fuse</button></div>`);
    b.querySelector('[data-sw]').onclick = () => { S.on = !S.on; draw(); };
    b.querySelector('[data-short]').onclick = () => { S.R = 0.05; r.set(0.05); draw(); };
    b.querySelector('[data-fix]').onclick = () => { S.blown = false; if (S.R < 1.3) { S.R = 2.4; r.set(2.4); } draw(); };
    ctl.append(r.el, b);
    draw();
  } else {
    const S = { on: false };
    const draw = () => {
      svg.innerHTML = `<text x="20" y="20" class="awd-sub" style="fill:#7fb2e0">CONTROL CIRCUIT · tiny current</text><text x="200" y="20" class="awd-sub" style="fill:#ffe08a">LOAD CIRCUIT · big current</text>
        ${wire('M40,50 L90,50', S.on, 'is-ctl')}${wire('M120,50 L150,50 L150,90', S.on, 'is-ctl')}${wire('M150,150 L150,190 L40,190 L40,50', S.on, 'is-ctl')}
        <path d="M90,50 L118,${S.on ? 50 : 36}" stroke="#c9d1d9" stroke-width="4" stroke-linecap="round"/><text x="104" y="74" text-anchor="middle" class="awd-sub">dash switch</text>
        <rect x="132" y="90" width="36" height="60" rx="4" fill="#1f5d80" stroke="#7fb2e0"/><path d="M138,100 h24 M138,110 h24 M138,120 h24 M138,130 h24 M138,140 h24" stroke="#7fb2e0"/><text x="150" y="168" text-anchor="middle" class="awd-sub">coil</text>
        <path d="M176,120 L${S.on ? 216 : 212},${S.on ? 120 : 104}" stroke="#ffe08a" stroke-width="4" stroke-linecap="round"/><text x="196" y="96" text-anchor="middle" class="awd-sub">contacts</text>
        ${wire('M216,120 L300,120 L300,170', S.on)}${wire('M300,210 L300,222 L200,222 L200,60 L176,60 L176,120', S.on)}
        <rect x="232" y="50" width="34" height="18" rx="6" fill="#2b3138" stroke="#c9d1d9"/><text x="249" y="44" text-anchor="middle" class="awd-sub">30 A fuse</text>
        <circle cx="300" cy="190" r="20" fill="#262b31" stroke="#ffe08a" stroke-width="2"/><g transform="translate(300 190)" class="${S.on ? 'ci-spin' : ''}"><path d="M0,-14 v28 M-14,0 h28" stroke="#ffe08a" stroke-width="3"/></g><text x="336" y="194" class="awd-sub">fan</text>`;
      out.innerHTML = `<span class="ro"><small>Control current</small><b>${S.on ? '0.15 A' : '0 A'}</b></span><span class="ro ro--hl"><small>Load current</small><b>${S.on ? '20 A' : '0 A'}</b></span><span class="ro"><small>Why</small><b style="font-size:13px">small switch + thin wire control a big load</b></span>`;
    };
    const b = el(html`<button class="btn btn--primary" type="button">Flip the switch</button>`);
    b.onclick = () => { S.on = !S.on; draw(); };
    ctl.append(b);
    wrap.append(el(html`<p class="vis__note">Typical numbers for illustration. In modern cars the “switch” is often a module (a transistor output), not your finger.</p>`));
    draw();
  }
  return { destroy() {} };
}
