// Turbo spool simulator. Simplified physics: exhaust energy ∝ rpm × load; shaft speed chases it with lag;
// boost ∝ shaft speed²; wastegate caps boost at target; optional BOV vents on a sudden lift.
import { html, el } from '../dom.js';
import { slider } from './controls.js';

export const TARGET_PSI = 18; // illustrative target

export function step(s, { throttle, rpm, dt, bov }) {
  const load = throttle;                                   // 0..1
  const energy = Math.min(1.2, rpm / 4200) * (0.25 + 0.75 * load); // available exhaust energy (small turbo: full boost ~3,000 rpm)
  const gateOpen = Math.max(0, Math.min(1, (s.boost - TARGET_PSI * 0.92) / (TARGET_PSI * 0.08)));
  const drive = energy * (1 - 0.85 * gateOpen);
  const tau = 0.9;                                          // seconds: spool lag
  s.shaft += ((drive - s.shaft) * dt) / tau;               // 0..1 ≈ 0..~200k rpm
  let boost = Math.max(-10, 32 * s.shaft * s.shaft - 14 * (1 - throttle) * (rpm / 6000) - 2);
  if (throttle < 0.15 && s.prevThrottle > 0.5 && s.boost > 6) s.surge = 0.6;  // throttle snapped shut
  if (s.surge > 0) {
    s.surge -= dt;
    if (bov) { s.vent = 1; boost = Math.min(boost, 0); } else s.flutter = 1;
  } else { s.vent = Math.max(0, (s.vent || 0) - dt * 2); s.flutter = Math.max(0, (s.flutter || 0) - dt * 2); }
  s.boost = boost; s.gate = gateOpen; s.prevThrottle = throttle;
  return s;
}

export function mount(host, spec = {}) {
  const bov = !!spec.bov;
  const S = { shaft: 0.1, boost: -8, gate: 0, prevThrottle: 0, surge: 0 };
  const I = { throttle: 0.1, rpm: 2000 };
  const wrap = el(html`<figure class="vis" data-noswipe>
    <svg viewBox="0 0 360 250" class="d" role="img" aria-label="Turbo spool simulator">
      <path d="M20,70 L120,70" class="sx-pipe" style="stroke-width:12px"/><path class="tb-in sx-flow" d="M20,70 L120,70" style="stroke:#7fb2e0;stroke-width:6px"/>
      <path d="M240,70 L340,70" class="sx-pipe" style="stroke-width:12px"/><path class="tb-out sx-flow" d="M240,70 L340,70" style="stroke:#ff8a45;stroke-width:6px"/>
      <path d="M20,190 L120,190" class="sx-pipe" style="stroke-width:12px"/><path class="tb-ex sx-flow" d="M20,190 L120,190" style="stroke:#ff6b1a;stroke-width:6px"/>
      <path d="M240,190 L340,190" class="sx-pipe" style="stroke-width:12px"/><path class="tb-ex2 sx-flow" d="M240,190 L340,190" style="stroke:#b39a84;stroke-width:6px"/>
      <path class="tb-gate" d="M100,190 Q180,236 260,190" fill="none" stroke="#b39a84" stroke-width="5" stroke-dasharray="4 6"/>
      <circle cx="180" cy="70" r="56" fill="rgba(127,178,224,0.08)" stroke="#7fb2e0" stroke-width="2"/>
      <circle cx="180" cy="190" r="50" fill="rgba(255,138,69,0.08)" stroke="#ff8a45" stroke-width="2"/>
      <rect x="170" y="110" width="20" height="40" fill="#c9d1d9"/>
      <g class="tb-comp" transform="translate(180 70)">${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M0,0 L${(40 * Math.cos((i * Math.PI) / 4)).toFixed(1)},${(40 * Math.sin((i * Math.PI) / 4)).toFixed(1)}" stroke="#c9d1d9" stroke-width="5" stroke-linecap="round"/>`).join('')}<circle r="10" fill="#5a6470"/></g>
      <g class="tb-turb" transform="translate(180 190)">${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M0,0 L${(36 * Math.cos((i * Math.PI) / 4)).toFixed(1)},${(36 * Math.sin((i * Math.PI) / 4)).toFixed(1)}" stroke="#ff8a45" stroke-width="5" stroke-linecap="round"/>`).join('')}<circle r="9" fill="#5a2a0a"/></g>
      <text x="22" y="56" class="awd-sub">air in</text><text x="338" y="56" text-anchor="end" class="awd-sub">to intercooler</text>
      <text x="22" y="176" class="awd-sub">exhaust in</text><text x="338" y="176" text-anchor="end" class="awd-sub">to cat</text>
      <text x="180" y="244" text-anchor="middle" class="awd-sub tb-gt">wastegate</text>
      <g class="tb-bov" opacity="0"><path d="M300,62 l14,-22 M310,64 l20,-16 M300,64 l4,-26" stroke="#a8d8ff" stroke-width="3" stroke-linecap="round"/><text x="300" y="30" class="awd-slip" style="fill:#a8d8ff">PSSHH</text></g>
      <g class="tb-flutter" opacity="0"><text x="250" y="30" class="awd-slip">surge flutter</text></g>
    </svg>
    <div class="big-out"></div><div class="ctl"></div>
    <p class="vis__note">Simplified model with an illustrative ${TARGET_PSI} psi target. Try: low rpm + full throttle (lag), then high rpm. ${bov ? 'Then snap the throttle shut.' : ''}</p>
  </figure>`);
  host.append(wrap);
  const $ = (q) => wrap.querySelector(q);
  const out = $('.big-out');
  let raf = 0, last = performance.now(), ang = 0, visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(wrap);
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (visible) {
      step(S, { ...I, dt, bov });
      ang += dt * 360 * (0.5 + 30 * S.shaft);
      $('.tb-comp').setAttribute('transform', `translate(180 70) rotate(${ang})`);
      $('.tb-turb').setAttribute('transform', `translate(180 190) rotate(${ang})`);
      const sp = `${Math.max(0.15, 1.2 - S.shaft)}s`;
      for (const k of ['.tb-in', '.tb-out', '.tb-ex', '.tb-ex2']) $(k).style.animationDuration = sp;
      $('.tb-gate').setAttribute('opacity', S.gate > 0.02 ? 0.3 + 0.7 * S.gate : 0.1);
      $('.tb-gt').textContent = S.gate > 0.05 ? `wastegate ${Math.round(S.gate * 100)}% open` : 'wastegate shut';
      $('.tb-bov').setAttribute('opacity', S.vent || 0);
      $('.tb-flutter').setAttribute('opacity', S.flutter || 0);
      const psi = S.boost;
      out.innerHTML = `<span class="ro ro--hl"><small>Boost</small><b>${psi >= 0 ? `${psi.toFixed(1)} psi` : `${(-psi * 2.036).toFixed(0)} inHg vac`}</b></span>
        <span class="ro"><small>bar (gauge)</small><b>${(psi / 14.5).toFixed(2)}</b></span>
        <span class="ro"><small>Shaft speed</small><b>~${Math.round(S.shaft * 200)}k rpm</b></span>
        <span class="ro"><small>Pressure ratio</small><b>${((14.7 + Math.max(psi, -10)) / 14.7).toFixed(2)}</b></span>`;
    }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  $('.ctl').append(
    slider({ label: 'Throttle', min: 0, max: 100, value: 10, fmt: (v) => `${v}%`, onInput(v) { I.throttle = v / 100; } }).el,
    slider({ label: 'Engine rpm', min: 1000, max: 6500, step: 100, value: 2000, fmt: (v) => v.toLocaleString('en-US'), onInput(v) { I.rpm = v; } }).el,
  );
  return { destroy() { cancelAnimationFrame(raf); io.disconnect(); } };
}
