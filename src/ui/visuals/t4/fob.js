// Key fob concepts: rolling codes (counter + acceptance window) and relay attacks with countermeasures.
// Concept only; numbers are illustrative.
import { html, el } from '../../dom.js';
import { chips } from '../controls.js';

const WINDOW = 16;

export function mount(host, spec = {}) {
  const S = { mode: spec.mode === 'relay' ? 'relay' : 'rolling', fob: 100, car: 100, captured: null, log: [], relay: false, motion: false, uwb: false, dist: 30 };
  const wrap = el(html`<figure class="vis fobv" data-noswipe>
    <div class="fob__body"></div>
    <div class="ctl"></div>
    <p class="vis__note"></p>
  </figure>`);
  host.append(wrap);
  const body = wrap.querySelector('.fob__body'), note = wrap.querySelector('.vis__note');

  function code(n) { return ((n * 2654435761) >>> 0).toString(16).toUpperCase().slice(0, 6); } // stand-in for the encrypted code

  function rolling() {
    const lo = S.car + 1, hi = S.car + WINDOW;
    body.innerHTML = `<div class="fob__row"><div class="fob__dev"><b>Fob</b><span class="mono">counter ${S.fob}</span></div><div class="fob__dev"><b>Car</b><span class="mono">last ${S.car} · accepts ${lo}–${hi}</span></div></div>
      <div class="cks__bar">
        <button type="button" class="btn btn--primary ex__small" data-a="press">Press unlock</button>
        <button type="button" class="btn btn--ghost ex__small" data-a="away">Press out of range</button>
        <button type="button" class="btn btn--ghost ex__small" data-a="replay">Replay a recorded code</button>
      </div>
      <ol class="cks__log">${S.log.map((l) => `<li class="${l.ok ? 'is-ok' : 'is-bad'}"><b>${l.t}</b> <span class="mono">${l.c}</span><br>${l.ok ? '✓' : '✗'} ${l.why}</li>`).join('')}</ol>`;
    note.textContent = 'Each press sends a new code from a counter that only ever goes up (encrypted, so the next code can’t be guessed). The car accepts codes a little ahead of the last one it saw (presses out of range) but never an old one, so a recording is useless. (Real windows are larger; numbers here are illustrative.)';
  }
  function relay() {
    const inRange = S.dist <= 2 || S.relay;
    const asleep = S.motion && S.dist > 2; // fob lying still at home → asleep
    const uwbBlocks = S.uwb && S.relay; // time-of-flight shows the fob is really far away
    const ok = inRange && !asleep && !uwbBlocks;
    const why = !inRange ? 'Fob too far away: no answer, car stays locked.' : asleep ? 'Fob has been still for a while: its motion sensor put it to sleep, so it never answers the relay.' : uwbBlocks ? 'Ultra-wideband ranging timed the radio round trip: the fob is far away, so the car refuses.' : S.relay ? 'Relay worked: the car thinks the fob is next to it and unlocks.' : 'Fob is next to the car: unlock.';
    body.innerHTML = `<svg viewBox="0 0 340 120" class="d"><rect x="10" y="44" width="70" height="40" rx="10" fill="#262b31" stroke="#8994a1"/><text x="45" y="68" text-anchor="middle" class="awd-lbl">CAR</text>
      <rect x="260" y="30" width="70" height="70" rx="4" fill="none" stroke="#5b6470"/><text x="295" y="24" text-anchor="middle" class="awd-sub">house</text>
      <circle cx="${S.dist <= 2 ? 100 : 295}" cy="70" r="9" fill="#ffc21a"/><text x="${S.dist <= 2 ? 100 : 295}" y="92" text-anchor="middle" class="awd-sub">fob</text>
      ${S.relay ? `<rect x="120" y="58" width="22" height="22" rx="3" fill="#ff4d3d"/><rect x="220" y="58" width="22" height="22" rx="3" fill="#ff4d3d"/><path d="M142,69 H220" stroke="#ff4d3d" stroke-width="2" stroke-dasharray="5 4"/><text x="181" y="52" text-anchor="middle" class="awd-sub" style="fill:#ff4d3d">relay boxes</text>` : ''}
      <text x="170" y="114" text-anchor="middle" class="awd-lbl" style="fill:${ok ? '#4fd27f' : '#ff4d3d'}">${ok ? 'UNLOCKED' : 'LOCKED'}</text></svg>
      <p class="fob__why">${why}</p>`;
    note.textContent = 'Concept only. Passive keyless entry unlocks when the fob answers nearby; a relay just carries the radio conversation over a longer distance. Defenses work by noticing the fob isn’t really there.';
  }
  const draw = () => (S.mode === 'rolling' ? rolling() : relay());

  body.addEventListener('click', (e) => {
    const a = e.target.closest('[data-a]')?.dataset.a;
    if (!a) return;
    if (a === 'press' || a === 'away') {
      S.fob++;
      const c = code(S.fob);
      if (!S.captured) S.captured = { n: S.fob, c };
      if (a === 'press') {
        const ok = S.fob > S.car && S.fob <= S.car + WINDOW;
        S.log.unshift({ t: `#${S.fob}`, c, ok, why: ok ? 'new code inside the window: unlock' : 'too far ahead: resync needed' });
        if (ok) S.car = S.fob;
      } else S.log.unshift({ t: `#${S.fob}`, c, ok: false, why: 'car never heard it (out of range)' });
    }
    if (a === 'replay' && S.captured) {
      const ok = S.captured.n > S.car && S.captured.n <= S.car + WINDOW;
      S.log.unshift({ t: `replay #${S.captured.n}`, c: S.captured.c, ok, why: ok ? 'still unused, accepted (that’s why some attacks jam the real press first)' : 'old counter value: rejected' });
      if (ok) S.car = S.captured.n;
    }
    S.log = S.log.slice(0, 5);
    draw();
  });

  const ctl = wrap.querySelector('.ctl');
  const build = () => {
    ctl.replaceChildren(chips([{ value: 'rolling', label: 'Rolling codes' }, { value: 'relay', label: 'Relay attack' }], { value: S.mode, onPick(v) { S.mode = v; build(); draw(); } }).el);
    if (S.mode === 'relay') {
      ctl.append(
        chips([{ value: 1, label: 'Fob next to car' }, { value: 30, label: 'Fob in the house' }], { value: S.dist, onPick(v) { S.dist = v; draw(); } }).el,
        chips([{ value: false, label: 'No relay' }, { value: true, label: 'Thieves relay' }], { value: S.relay, onPick(v) { S.relay = v; draw(); } }).el,
        chips([{ value: false, label: 'Plain fob' }, { value: true, label: 'Motion-sleep fob' }], { value: S.motion, onPick(v) { S.motion = v; draw(); } }).el,
        chips([{ value: false, label: 'No UWB' }, { value: true, label: 'UWB distance check' }], { value: S.uwb, onPick(v) { S.uwb = v; draw(); } }).el,
      );
    }
  };
  build(); draw();
  return { destroy() {} };
}
