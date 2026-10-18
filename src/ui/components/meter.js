// Segmented "tach" meter. value is 0..1.
import { html } from '../dom.js';

export const meter = (value, { segs = 20, tone = '' } = {}) => {
  const v = Math.max(0, Math.min(1, value || 0));
  return html`<span class="meter ${tone ? `meter--${tone}` : ''}" style="--segs:${segs}" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(v * 100)}"><i style="width:${(v * 100).toFixed(1)}%"></i></span>`;
};

export const pct = (v) => `${Math.round((v || 0) * 100)}%`;
