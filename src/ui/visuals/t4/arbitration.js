// Bitwise arbitration: nodes send their 11-bit IDs at once; the bus is a wired-AND (0 dominant).
// A node that sends 1 but reads 0 has lost and goes quiet. Lowest ID wins, and its frame is untouched.
import { html, el } from '../../dom.js';

const hex = (n) => n.toString(16).toUpperCase().padStart(3, '0');
const COLORS = ['#ff6b1a', '#7fb2e0', '#c9a3e8'];

export function arbitrate(ids) {
  const rows = ids.map((id) => ({ id, bits: Array.from({ length: 11 }, (_, i) => (id >> (10 - i)) & 1), lostAt: null }));
  const bus = [];
  for (let i = 0; i < 11; i++) {
    const live = rows.filter((r) => r.lostAt == null);
    const b = Math.min(...live.map((r) => r.bits[i]));
    bus.push(b);
    for (const r of live) if (r.bits[i] === 1 && b === 0) r.lostAt = i;
  }
  return { rows, bus, winner: rows.find((r) => r.lostAt == null) };
}

export function mount(host, spec = {}) {
  const S = { ids: (spec.ids || [0x204, 0x415, 0x07e]).slice(0, 3), step: 11, playing: false };
  const wrap = el(html`<figure class="vis arb" data-noswipe>
    <svg viewBox="0 0 360 200" class="d" role="img" aria-label="CAN arbitration"></svg>
    <p class="arb__msg"></p>
    <div class="cf__inputs arb__in">${S.ids.map((id, i) => html`<label><span style="color:${COLORS[i]}">Node ${String.fromCharCode(65 + i)} ID</span><input class="mono" data-i="${i}" value="${hex(id)}" spellcheck="false" autocapitalize="characters"></label>`)}</div>
    <div class="cks__bar"><button type="button" class="btn btn--primary ex__small" data-play>Play bit by bit</button><button type="button" class="btn btn--ghost ex__small" data-step>Step</button></div>
    <p class="vis__note">0 is dominant: if anyone sends 0, the bus reads 0. Each sender checks the bus after every bit. Real Ford IDs from the community DBC: 0x07E steering (PSCM), 0x204 pedal/rpm, 0x415 brake-system speed.</p>
  </figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg');
  let timer = 0;

  function draw() {
    const { rows, bus, winner } = arbitrate(S.ids);
    const x0 = 64, w = 25;
    let g = `<text x="8" y="16" class="awd-sub">bit →</text>` + Array.from({ length: 11 }, (_, i) => `<text x="${x0 + i * w + 12}" y="16" text-anchor="middle" class="awd-sub">${10 - i}</text>`).join('');
    rows.forEach((r, k) => {
      const y = 28 + k * 38;
      g += `<text x="8" y="${y + 18}" class="awd-lbl" style="fill:${COLORS[k]}">${String.fromCharCode(65 + k)} ${hex(r.id)}</text>`;
      r.bits.forEach((b, i) => {
        if (i >= S.step) return;
        const lost = r.lostAt != null && i > r.lostAt;
        const here = r.lostAt === i;
        g += `<rect x="${x0 + i * w}" y="${y}" width="${w - 3}" height="26" rx="3" fill="${lost ? '#16191d' : COLORS[k]}" fill-opacity="${lost ? 1 : 0.25}" stroke="${here ? '#ff4d3d' : lost ? '#262b31' : COLORS[k]}" stroke-width="${here ? 2 : 1}"/>
          <text x="${x0 + i * w + 11}" y="${y + 18}" text-anchor="middle" class="awd-lbl" style="fill:${lost ? '#4b4945' : '#ebe8e2'}">${lost ? '·' : b}</text>`;
      });
    });
    const yb = 28 + rows.length * 38 + 6;
    g += `<text x="8" y="${yb + 18}" class="awd-lbl">BUS</text>` + bus.map((b, i) => (i < S.step ? `<rect x="${x0 + i * w}" y="${yb}" width="${w - 3}" height="26" rx="3" fill="#0d0f12" stroke="#ffc21a"/><text x="${x0 + i * w + 11}" y="${yb + 18}" text-anchor="middle" class="awd-lbl" style="fill:#ffc21a">${b}</text>` : '')).join('');
    const done = S.step >= 11;
    const lostNow = rows.filter((r) => r.lostAt != null && r.lostAt < S.step);
    wrap.querySelector('.arb__msg').textContent = `${done ? `Winner: node ${String.fromCharCode(65 + rows.indexOf(winner))} (ID ${hex(winner.id)}), lowest ID. Losers retry after this frame.` : lostNow.length ? `${lostNow.map((r) => `${String.fromCharCode(65 + rows.indexOf(r))} sent 1, read 0 at bit ${10 - r.lostAt}: lost, now listening`).join('; ')}` : 'All nodes still transmitting...'}`;
    svg.setAttribute('viewBox', `0 0 360 ${yb + 32}`);
    svg.innerHTML = g;
  }

  const play = () => {
    clearInterval(timer); S.step = 0; draw();
    timer = setInterval(() => { S.step++; draw(); if (S.step >= 11) clearInterval(timer); }, 450);
  };
  wrap.querySelector('[data-play]').onclick = play;
  wrap.querySelector('[data-step]').onclick = () => { clearInterval(timer); if (S.step >= 11) S.step = 0; S.step++; draw(); };
  wrap.querySelector('.arb__in').addEventListener('change', (e) => {
    const i = Number(e.target.dataset.i), v = parseInt(e.target.value, 16);
    if (Number.isFinite(v) && v >= 0 && v <= 0x7ff && !S.ids.some((x, j) => j !== i && x === v)) S.ids[i] = v;
    e.target.value = hex(S.ids[i]);
    S.step = 11; draw();
  });
  draw();
  return { destroy() { clearInterval(timer); } };
}
