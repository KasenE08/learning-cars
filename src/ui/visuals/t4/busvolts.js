// CAN_H / CAN_L voltages (ISO 11898-2 high-speed CAN, typical levels). Differential = H − L.
import { html, el } from '../../dom.js';

const BITS = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1];

export function mount(host) {
  const S = { noise: false, term: true };
  const wrap = el(html`<figure class="vis bv" data-noswipe>
    <svg viewBox="0 0 360 290" class="d" role="img" aria-label="CAN bus voltages"></svg>
    <div class="cks__bar"><button type="button" class="btn btn--ghost ex__small" data-noise>Add noise</button><button type="button" class="btn btn--ghost ex__small" data-term>Remove a terminator</button></div>
    <p class="vis__note">Typical levels: recessive (1) both wires ≈ 2.5 V; dominant (0) CAN_H ≈ 3.5 V, CAN_L ≈ 1.5 V. A receiver reads dominant when H − L is above ≈ 0.9 V and recessive below ≈ 0.5 V. Two 120 Ω resistors, one at each end of the bus, stop reflections.</p>
  </figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg');

  function draw() {
    const x0 = 40, w = 30, N = 300;
    const vy = (v) => 150 - v * 26;      // volts → y (0..4.5 V in the top plot)
    const dy = (v) => 250 - v * 22;      // differential plot
    const H = [], L = [], D = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * BITS.length, k = Math.min(BITS.length - 1, Math.floor(t));
      const dom = BITS[k] === 0;
      let h = dom ? 3.5 : 2.5, l = dom ? 1.5 : 2.5;
      if (!S.term) {
        const since = t - k, prevDom = k > 0 ? BITS[k - 1] === 0 : dom;
        if (prevDom !== dom) { const ring = 0.9 * Math.exp(-since * 9) * Math.cos(since * 60); h += ring * (dom ? 1 : -1); l -= ring * (dom ? 1 : -1); }
      }
      if (S.noise) { const n = 0.55 * Math.sin(t * 5.3) + 0.2 * Math.sin(t * 23); h += n; l += n; }
      const x = x0 + t * w;
      H.push(`${x.toFixed(1)},${vy(h).toFixed(1)}`); L.push(`${x.toFixed(1)},${vy(l).toFixed(1)}`); D.push(`${x.toFixed(1)},${dy(Math.max(-1.3, Math.min(3.2, h - l))).toFixed(1)}`);
    }
    const labels = BITS.map((b, i) => `<text x="${x0 + i * w + w / 2}" y="16" text-anchor="middle" class="awd-lbl" style="fill:${b ? '#7d7a74' : '#ffc21a'}">${b}</text>`).join('');
    svg.innerHTML = `${labels}<text x="4" y="16" class="awd-sub">bit</text>
      <text x="4" y="${vy(3.5) + 4}" class="awd-sub">3.5V</text><text x="4" y="${vy(2.5) + 4}" class="awd-sub">2.5V</text><text x="4" y="${vy(1.5) + 4}" class="awd-sub">1.5V</text>
      ${[1.5, 2.5, 3.5].map((v) => `<line x1="${x0}" x2="${x0 + BITS.length * w}" y1="${vy(v)}" y2="${vy(v)}" stroke="#262b31" stroke-dasharray="2 3"/>`).join('')}
      <polyline points="${H.join(' ')}" fill="none" stroke="#ff6b1a" stroke-width="2"/>
      <polyline points="${L.join(' ')}" fill="none" stroke="#7fb2e0" stroke-width="2"/>
      <text x="${x0 + BITS.length * w + 4}" y="${vy(3.5) + 4}" class="awd-sub" style="fill:#ff6b1a">H</text>
      <text x="${x0 + BITS.length * w + 4}" y="${vy(1.5) + 4}" class="awd-sub" style="fill:#7fb2e0">L</text>
      <text x="4" y="${dy(3.2) - 6}" class="awd-sub" style="fill:var(--ink)">receiver sees H − L (shaded = no man's land):</text>
      <rect x="${x0}" y="${dy(0.9)}" width="${BITS.length * w}" height="${dy(0.5) - dy(0.9)}" fill="#ffc21a" opacity="0.08"/>
      <line x1="${x0}" x2="${x0 + BITS.length * w}" y1="${dy(0)}" y2="${dy(0)}" stroke="#262b31"/>
      <polyline points="${D.join(' ')}" fill="none" stroke="#ffc21a" stroke-width="2"/>
      <text x="4" y="${dy(2) + 4}" class="awd-sub">2V</text><text x="4" y="${dy(0) + 4}" class="awd-sub">0V</text>`;
    wrap.querySelector('[data-noise]').textContent = S.noise ? 'Remove noise' : 'Add noise';
    wrap.querySelector('[data-term]').textContent = S.term ? 'Remove a terminator' : 'Put terminator back';
  }
  wrap.querySelector('[data-noise]').onclick = () => { S.noise = !S.noise; draw(); };
  wrap.querySelector('[data-term]').onclick = () => { S.term = !S.term; draw(); };
  draw();
  return { destroy() {} };
}
