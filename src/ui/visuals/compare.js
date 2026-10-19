// Side-by-side comparison bars. spec: { title?, metrics: [{ key, label, unit?, lower? }], items: [{ name, note?, values: {} }] }
// `lower: true` marks metrics where smaller is better (e.g. weight, seat height): the best bar is still highlighted.
import { html, el } from '../dom.js';

const COLORS = ['#ff6b1a', '#ffc21a', '#7fb2e0', '#c9ad94', '#9fb89a', '#e07a7a'];
const fmt = (v) => (typeof v === 'number' ? v.toLocaleString('en-US', { maximumFractionDigits: 1 }) : v);

export function mount(host, spec = {}) {
  const items = spec.items || [], metrics = spec.metrics || [];
  const wrap = el(html`<figure class="vis cmp" data-noswipe>
    ${spec.title ? html`<span class="kicker">${spec.title}</span>` : ''}
    <div class="cmp__legend">${items.map((it, i) => html`<span><i style="background:${COLORS[i % COLORS.length]}"></i>${it.name}</span>`)}</div>
    ${metrics.map((m) => {
      const vals = items.map((it) => it.values?.[m.key]).filter((v) => typeof v === 'number');
      const max = Math.max(...vals, 0) || 1;
      const best = vals.length ? (m.lower ? Math.min(...vals) : Math.max(...vals)) : null;
      return html`<div class="cmp__m"><span class="cmp__label">${m.label}${m.unit ? html` <small>(${m.unit})</small>` : ''}</span>
        ${items.map((it, i) => { const v = it.values?.[m.key]; const ok = typeof v === 'number'; return html`<div class="cmp__row"><span class="cmp__bar ${ok && v === best ? 'is-best' : ''}" style="width:${ok ? Math.max(4, (v / max) * 100) : 0}%;background:${COLORS[i % COLORS.length]}"></span><span class="cmp__v mono">${ok ? fmt(v) : v ?? 'n/a'}</span></div>`; })}
      </div>`;
    })}
    ${items.some((it) => it.note) ? html`<ul class="cmp__notes">${items.filter((it) => it.note).map((it) => html`<li><b>${it.name}:</b> ${it.note}</li>`)}</ul>` : ''}
  </figure>`);
  host.append(wrap);
  return { destroy() {} };
}
