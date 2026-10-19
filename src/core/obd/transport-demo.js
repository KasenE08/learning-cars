// Demo transport: answers ELM327 requests from the SIMULATED car, so the whole real-car screen
// works with no hardware. Everything it returns is made-up (a parked, idling Bronco-like car).
import { createCar } from '../can/sim.js';

const h2 = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).toUpperCase().padStart(2, '0');
// value → Mode 01 data bytes, inverse of pids.js calc()
const ENC = {
  '04': (v) => [(v * 255) / 100], '05': (v) => [v + 40], '0B': (v) => [v], '0C': (v) => { const r = v * 4; return [r >> 8, r & 255]; },
  '0D': (v) => [v], '0F': (v) => [v + 40], 10: (v) => { const r = v * 100; return [r >> 8, r & 255]; }, 11: (v) => [(v * 255) / 100],
  '1F': (v) => { const r = v; return [r >> 8, r & 255]; }, '2F': (v) => [(v * 255) / 100], 42: (v) => { const r = v * 1000; return [r >> 8, r & 255]; }, 46: (v) => [v + 40], '5C': (v) => [v + 40],
};
// A made-up VIN with a valid check digit (Ford WMI 3FM..., not a real vehicle).
export const DEMO_VIN = '3FMCR9B62RRA12345';
const DEMO_DTCS = ['P0171'];     // one example stored code so the reader shows a decoded result

export function createDemoTransport() {
  const car = createCar({ full: true });
  Object.assign(car.inputs, { ignition: 4, lever: 'P', pedal: 0 });
  car.step(1500);
  let last = Date.now();
  const tick = () => { const now = Date.now(); car.step(Math.min(2000, now - last)); last = now; };
  const vals = () => {
    tick();
    const s = car.state, n = (a) => (Math.random() - 0.5) * 2 * a;
    const absMap = Math.max(18, 101 + s.map);                 // gauge → absolute kPa, idle vacuum ≈ 35
    return { '0C': s.rpm + n(12), '0D': 0, '05': s.coolant, '0F': s.ambient + 8 + n(0.5), 11: 14 + n(0.4), '04': 22 + n(1),
      '0B': absMap + n(0.5), 10: 3.2 + n(0.1), '1F': Math.min(65535, s.t / 1000), '2F': 64, 42: s.engine ? 14.2 : 12.4, 46: s.ambient, '5C': s.oil };
  };
  const bytes = (arr) => arr.map(h2).join(' ');

  async function request(cmd) {
    const c = cmd.trim().toUpperCase().replace(/\s+/g, '');
    await new Promise((r) => setTimeout(r, 25 + Math.random() * 35));   // feel like a slow serial link
    if (c === 'ATZ') return ['ELM327 v1.5'];
    if (c === 'ATI') return ['ELM327 v1.5 (demo)'];
    if (c === 'ATDPN') return ['6'];                                     // ISO 15765-4 CAN 11-bit/500k
    if (c === 'ATRV') return ['14.2V'];
    if (c.startsWith('AT')) return ['OK'];
    if (c === '0101') { const v = vals(); return [`41 01 00 07 ${v['05'] > 70 ? 'E0 00' : 'E0 20'}`]; } // MIL off, monitors mostly ready
    if (c === '03') return [`43 ${DEMO_DTCS.length} ${DEMO_DTCS.map((d) => dtcBytes(d)).join(' ')}`];
    if (c === '07') return ['47 00 00 00'];
    if (c === '0902') {
      const hex = [...DEMO_VIN].map((ch) => h2(ch.charCodeAt(0)));
      return [`49 02 01 ${hex.slice(0, 3).join(' ')}`, `49 02 02 ${hex.slice(3, 10).join(' ')}`, `49 02 03 ${hex.slice(10, 17).join(' ')}`];
    }
    if (c.startsWith('01') && c.length === 4) {
      const pid = c.slice(2);
      const v = vals()[pid];
      if (v == null || !ENC[pid]) return ['NO DATA'];
      return [`41 ${pid} ${bytes(ENC[pid](v))}`];
    }
    return ['NO DATA'];
  }
  return { request, close() {}, demo: true };
}

function dtcBytes(code) {
  const sys = 'PCBU'.indexOf(code[0]);
  const b0 = (sys << 6) | (Number(code[1]) << 4) | parseInt(code[2], 16);
  const b1 = parseInt(code.slice(3), 16);
  return `${b0.toString(16).toUpperCase().padStart(2, '0')} ${b1.toString(16).toUpperCase().padStart(2, '0')}`;
}
