// CAN fault confinement: transmit/receive error counters and the three node states (ISO 11898-1 rules,
// simplified: transmit error +8, receive error +1, successful transmit −1, successful receive −1).
import { html, el } from '../../dom.js';

export function mount(host) {
  const S = { tec: 0, rec: 0, recover: 0 };
  const state = () => (S.tec > 255 ? 'off' : S.tec > 127 || S.rec > 127 ? 'passive' : 'active');
  const wrap = el(html`<figure class="vis er" data-noswipe>
    <div class="er__states"><span data-s="active">Error-active</span><span data-s="passive">Error-passive</span><span data-s="off">Bus-off</span></div>
    <div class="er__bars"></div>
    <p class="er__msg"></p>
    <div class="cks__bar">
      <button type="button" class="btn btn--ghost ex__small" data-a="txerr">My frame had an error (+8)</button>
      <button type="button" class="btn btn--ghost ex__small" data-a="rxerr">Saw a bad frame (+1)</button>
      <button type="button" class="btn btn--ghost ex__small" data-a="ok">Good frame (−1)</button>
      <button type="button" class="btn btn--primary ex__small" data-a="burst">Faulty node: 10 errors</button>
    </div>
    <p class="vis__note">Simplified counting rules. The point: a node that keeps causing errors ends up shutting itself off (bus-off) so one broken module can't jam the whole car. Bus-off recovery needs 128 × 11 recessive bits.</p>
  </figure>`);
  host.append(wrap);
  function draw() {
    const st = state();
    wrap.querySelectorAll('[data-s]').forEach((e) => e.classList.toggle('is-on', e.dataset.s === st));
    const bar = (label, v, max) => `<div class="er__bar"><span>${label}</span><div><i style="width:${Math.min(100, (v / max) * 100)}%"></i><b style="left:${(128 / max) * 100}%"></b>${max > 256 ? `<b style="left:${(256 / max) * 100}%"></b>` : ''}</div><output class="mono">${v}</output></div>`;
    wrap.querySelector('.er__bars').innerHTML = bar('TEC', S.tec, 300) + bar('REC', S.rec, 300);
    wrap.querySelector('.er__msg').textContent = st === 'active' ? 'Normal: the node sends “active” error flags (6 dominant bits) that destroy a bad frame for everyone.'
      : st === 'passive' ? 'Error-passive: the node can still talk, but its error flags are recessive (they no longer disrupt others) and it waits longer before sending again.'
        : 'Bus-off: the node has disconnected itself from the bus. The rest of the network carries on.';
  }
  wrap.querySelector('.cks__bar').addEventListener('click', (e) => {
    const a = e.target.closest('[data-a]')?.dataset.a;
    if (!a) return;
    if (state() === 'off') { if (a === 'ok') { S.tec = 0; S.rec = 0; } draw(); return; }
    if (a === 'txerr') S.tec += 8;
    if (a === 'rxerr') S.rec += 1;
    if (a === 'ok') { S.tec = Math.max(0, S.tec - 1); S.rec = Math.max(0, S.rec - 1); }
    if (a === 'burst') S.tec += 80;
    draw();
  });
  draw();
  return { destroy() {} };
}
