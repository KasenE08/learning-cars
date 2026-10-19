// Classic CAN vs CAN FD: payload size, faster data phase, efficiency. Bit counts are approximate.
import { html, el } from '../../dom.js';
import { slider, chips } from '../controls.js';

const FD_LENGTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 16, 20, 24, 32, 48, 64];

export function mount(host) {
  const S = { bytes: 64, dataRate: 2000000 };
  const wrap = el(html`<figure class="vis fd" data-noswipe>
    <div class="fd__rows"></div>
    <div class="big-out"></div><div class="ctl"></div>
    <p class="vis__note">Approximate bit counts (overhead ≈ 47 bits classic, ≈ 67+ bits FD, ignoring stuff bits). CAN FD lengths jump 8 → 12 → 16 … 64 bytes. Arbitration still runs at the slow rate (here 500 kbit/s) because every node must hear every bit then.</p>
  </figure>`);
  host.append(wrap);
  function draw() {
    const n = S.bytes;
    const classicFrames = Math.ceil(n / 8), classicBits = classicFrames * (47 + 64);
    const classicUs = (classicBits / 500000) * 1e6;
    const fdArb = 30, fdData = 37 + n * 8 + (n > 16 ? 21 : 17);
    const fdUs = (fdArb / 500000 + fdData / S.dataRate) * 1e6;
    const scale = Math.max(classicUs, fdUs);
    wrap.querySelector('.fd__rows').innerHTML = `
      <div class="fd__row"><span>Classic CAN<br><small>${classicFrames} frame${classicFrames > 1 ? 's' : ''} × 8 B</small></span><div><i class="c" style="width:${(classicUs / scale) * 100}%"></i></div><output class="mono">${classicUs.toFixed(0)} µs</output></div>
      <div class="fd__row"><span>CAN FD<br><small>1 frame × ${n} B</small></span><div><i class="a" style="width:${((fdArb / 500000) * 1e6 / scale) * 100}%"></i><i class="f" style="width:${(((fdData / S.dataRate) * 1e6) / scale) * 100}%"></i></div><output class="mono">${fdUs.toFixed(0)} µs</output></div>`;
    wrap.querySelector('.big-out').innerHTML = String(html`<span class="ro ro--hl"><small>FD is faster by</small><b>${(classicUs / fdUs).toFixed(1)}×</b></span><span class="ro"><small>Payload share (FD)</small><b>${Math.round((n * 8) / (fdArb + fdData) * 100)}%</b></span><span class="ro"><small>Payload share (classic)</small><b>${Math.round((n * 8) / classicBits * 100)}%</b></span>`);
  }
  wrap.querySelector('.ctl').append(
    slider({ label: 'Payload', min: 0, max: FD_LENGTHS.length - 1, value: FD_LENGTHS.length - 1, fmt: (i) => `${FD_LENGTHS[i]} bytes`, onInput(i) { S.bytes = Math.max(1, FD_LENGTHS[i]); draw(); } }).el,
    chips([{ value: 1000000, label: 'Data 1 Mbit/s' }, { value: 2000000, label: '2 Mbit/s' }, { value: 5000000, label: '5 Mbit/s' }], { value: S.dataRate, onPick(v) { S.dataRate = v; draw(); } }).el,
  );
  draw();
  return { destroy() {} };
}
