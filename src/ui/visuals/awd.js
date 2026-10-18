// Bronco Sport Badlands 4x4 torque flow. Illustrative model: Ford doesn't publish its
// control strategy, so numbers show the behavior, not real calibration values.
import { html, el } from '../dom.js';
import { chips } from './controls.js';

export const MODES = [
  { value: 'eco', label: 'Eco', rear: 0.03 }, { value: 'normal', label: 'Normal', rear: 0.05 }, { value: 'sport', label: 'Sport', rear: 0.15 },
  { value: 'slippery', label: 'Slippery', rear: 0.2 }, { value: 'sand', label: 'Sand', rear: 0.3 }, { value: 'mud', label: 'Mud/Ruts', rear: 0.35 }, { value: 'rock', label: 'Rock Crawl', rear: 0.4 },
];
export const SCENES = [
  { value: 'cruise', label: 'Cruising, dry' }, { value: 'launch', label: 'Hard launch' }, { value: 'ice', label: 'Front-left on ice' },
  { value: 'air', label: 'Rear-right in the air' }, { value: 'turn', label: 'Tight right turn' },
];

/** Returns torque fractions per wheel (of what the engine sends), slip/brake flags, clutch clamp and an explanation. */
export function compute(mode, scene, lock) {
  const m = MODES.find((x) => x.value === mode);
  const W = { fl: 0, fr: 0, rl: 0, rr: 0 };
  const slip = {}, brake = {}, grip = { fl: 1, fr: 1, rl: 1, rr: 1 };
  let clutch = { l: 0, r: 0 }, text = '', lost = 0;
  if (scene === 'cruise') {
    const r = lock ? 0.5 : m.rear;
    W.rl = W.rr = r / 2; W.fl = W.fr = (1 - r) / 2;
    clutch = { l: r * 2, r: r * 2 };
    text = lock ? 'Locked on dry pavement at speed isn’t how it’s meant to be used: the lock only works in a set speed range and will scrub in turns.' : `Dry and steady: mostly front-wheel drive. The rear clutches stay light to save fuel and tires. ${m.rear >= 0.2 ? 'This mode keeps some rear preload so it’s ready before anything slips.' : 'Eco/Normal keep the rear nearly idle.'}`;
  } else if (scene === 'launch') {
    const r = lock ? 0.5 : Math.min(0.5, Math.max(m.rear, mode === 'sport' ? 0.5 : 0.4));
    W.rl = W.rr = r / 2; W.fl = W.fr = (1 - r) / 2;
    clutch = { l: r * 2, r: r * 2 };
    text = 'Hard throttle shifts weight onto the rear tires. The system clamps the rear clutches before the fronts can spin, instead of waiting to react.';
  } else if (scene === 'ice') {
    grip.fl = 0.05; slip.fl = true; brake.fl = true;
    W.fl = 0.05; W.fr = 0.2; W.rl = W.rr = 0.25; lost = 0.25;
    clutch = { l: 1, r: 1 };
    text = 'The front diff is open: it gives both fronts the same torque, so the icy wheel sets the limit and spins. Two fixes stack up: brake-based traction control grabs the spinning wheel (so the other front gets drive), and the rear clutches clamp to send up to half the torque rearward.';
  } else if (scene === 'air') {
    grip.rr = 0; slip.rr = true;
    W.fl = W.fr = 0.25;
    if (lock) { W.rl = 0.5; W.rr = 0; clutch = { l: 1, r: 1 }; text = 'Locked: both clutch packs clamp hard and stay clamped, so both rear wheels are forced to turn together. The airborne wheel takes no torque, so it all goes to the grounded left wheel. Steady drive for crawling over things.'; }
    else { W.rl = 0.35; W.rr = 0.02; lost = 0.13; clutch = { l: 0.9, r: 0.15 }; text = 'Unlocked: the computer sees the right wheel spinning, eases its clutch and clamps the left one, so the grounded wheel still gets drive. That’s the big advantage over an open diff, which would send almost nothing. It reacts to slip, though, so it’s less steady than locked.'; }
  } else if (scene === 'turn') {
    W.fl = W.fr = 0.3;
    if (lock) { W.rl = 0.2; W.rr = 0.2; clutch = { l: 1, r: 1 }; text = 'Locked in a tight turn: the rear wheels need different speeds but the clamped clutches fight it. One source says the clutches still slip a little to allow the turn; it isn’t a true mechanical locker.'; }
    else { W.rl = 0.3; W.rr = 0.1; clutch = { l: 0.8, r: 0.25 }; text = 'Torque vectoring: in a right turn the outer (left) rear clutch is clamped harder, so the outside wheel gets more torque. That helps rotate the car into the turn. An open diff can’t do this.'; }
  }
  return { W, slip, brake, grip, clutch, lost, text };
}

export function mount(host, spec = {}) {
  let mode = spec.mode || 'normal', scene = spec.scene || 'cruise', lock = false;
  const wrap = el(html`<figure class="vis vis--awd" data-noswipe>
    <svg viewBox="0 0 360 420" class="d" role="img" aria-label="4x4 torque flow"></svg>
    <div class="vis__readout awd__text"></div>
    <div class="ctl">
      <span class="kicker">Situation</span><div class="sc"></div>
      <span class="kicker">G.O.A.T. mode</span><div class="md"></div>
      <div class="lk"></div>
    </div>
    <p class="vis__note">Illustrative. Ford doesn’t publish the 4x4 control logic, so these percentages show how the hardware behaves, not real calibration. Rear share is capped at 50% here for clarity.</p>
  </figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg');

  const shaft = (d, t, cls = '') => `<path d="${d}" class="awd-bg"/><path d="${d}" class="awd-flow ${cls}" style="stroke-width:${(2 + t * 18).toFixed(1)}px;opacity:${t > 0.005 ? 1 : 0}"/>`;
  const wheel = (x, y, k, r) => {
    const t = r.W[k];
    return `<g class="awd-w ${r.slip[k] ? 'is-slip' : ''}">
      <rect x="${x - 15}" y="${y - 34}" width="30" height="68" rx="7" class="awd-tire ${r.grip[k] < 0.1 && r.grip[k] > 0 ? 'is-ice' : ''} ${r.grip[k] === 0 ? 'is-air' : ''}"/>
      ${r.brake[k] ? `<rect x="${x - 19}" y="${y - 12}" width="38" height="24" rx="4" class="awd-brake"/><text x="${x}" y="${y + 4}" text-anchor="middle" class="awd-bt">TC</text>` : ''}
      <text x="${x}" y="${y + (y < 200 ? -44 : 56)}" text-anchor="middle" class="awd-pct">${Math.round(t * 100)}%</text>
      ${r.slip[k] ? `<text x="${x}" y="${y + (y < 200 ? 56 : -44)}" text-anchor="middle" class="awd-slip">${r.grip[k] === 0 ? 'IN AIR' : 'SPIN'}</text>` : ''}
    </g>`;
  };
  const draw = () => {
    const r = compute(mode, scene, lock);
    const front = r.W.fl + r.W.fr, rear = r.W.rl + r.W.rr;
    svg.innerHTML = `
      ${shaft('M60,110 L180,110', r.W.fl * 2)}${shaft('M300,110 L180,110', r.W.fr * 2)}
      ${shaft('M180,140 L180,330', rear)}
      ${shaft('M60,350 L150,350', r.W.rl * 2)}${shaft('M300,350 L210,350', r.W.rr * 2)}
      <rect x="110" y="84" width="140" height="52" rx="6" class="awd-box"/><text x="180" y="104" text-anchor="middle" class="awd-lbl">ENGINE + 8-SPEED</text><text x="180" y="124" text-anchor="middle" class="awd-sub">open front diff</text>
      <rect x="162" y="140" width="36" height="22" rx="4" class="awd-ptu"/><text x="208" y="156" class="awd-sub">PTU</text>
      <text x="190" y="246" class="awd-sub">driveshaft · ${Math.round(rear * 100)}% to rear</text>
      <rect x="140" y="328" width="80" height="44" rx="6" class="awd-box"/>
      <rect x="148" y="336" width="14" height="28" rx="2" class="awd-clutch" style="opacity:${0.25 + 0.75 * r.clutch.l}"/><rect x="198" y="336" width="14" height="28" rx="2" class="awd-clutch" style="opacity:${0.25 + 0.75 * r.clutch.r}"/>
      <text x="180" y="355" text-anchor="middle" class="awd-sub">RDU</text>
      <text x="155" y="390" text-anchor="middle" class="awd-sub">L ${Math.round(r.clutch.l * 100)}%</text><text x="205" y="390" text-anchor="middle" class="awd-sub">R ${Math.round(r.clutch.r * 100)}%</text>
      <text x="180" y="408" text-anchor="middle" class="awd-sub">clutch clamp ${lock ? '· LOCKED' : ''}</text>
      ${wheel(48, 110, 'fl', r)}${wheel(312, 110, 'fr', r)}${wheel(48, 350, 'rl', r)}${wheel(312, 350, 'rr', r)}
      <text x="180" y="30" text-anchor="middle" class="geo-t">FRONT · ${Math.round(front * 100)}%</text>
      ${r.lost ? `<text x="180" y="56" text-anchor="middle" class="awd-lost">${Math.round(r.lost * 100)}% lost to wheelspin / TC braking</text>` : ''}`;
    wrap.querySelector('.awd__text').innerHTML = `<p>${r.text}</p>`;
  };
  wrap.querySelector('.sc').replaceWith(chips(SCENES, { value: scene, onPick(v) { scene = v; draw(); } }).el);
  wrap.querySelector('.md').replaceWith(chips(MODES, { value: mode, onPick(v) { mode = v; draw(); } }).el);
  const lk = chips([{ value: 'off', label: 'Rear lock off' }, { value: 'on', label: 'Rear diff lock' }], { value: 'off', onPick(v) { lock = v === 'on'; draw(); } });
  wrap.querySelector('.lk').replaceWith(lk.el);
  draw();
  return { destroy() {} };
}
