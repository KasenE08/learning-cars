// ELM327 driver. READ-ONLY by construction: every command passes assertReadOnly() before it is sent,
// so the app can never clear codes, flash, run routines or send any write/control service to the car.
// Transport-agnostic: `transport.request(cmd) -> Promise<string[] lines>` (Web Serial or the demo).
import { PIDS, PID_BYTES, formatPid } from './pids.js';
import { mode01Data, decodeDtcs, decodeReadiness, decodeVin, isStatus } from './decode.js';

// The ONLY AT (adapter) commands we ever send. None of them write to the car.
const ALLOWED_AT = new Set(['ATZ', 'ATE0', 'ATL0', 'ATH0', 'ATH1', 'ATS1', 'ATS0', 'ATSP0', 'ATAT1', 'ATI', 'ATRV', 'ATDPN', 'ATDP']);
// OBD service modes we allow: all read-only diagnostics. 04 (clear), 08 (control) and UDS are refused.
const READ_MODES = new Set(['01', '02', '03', '06', '07', '09', '0A']);

export class ReadOnlyViolation extends Error {}

/** Throw if a command is anything other than a whitelisted read. This is the safety gate. */
export function assertReadOnly(cmd) {
  const c = cmd.trim().toUpperCase().replace(/\s+/g, '');
  if (c.startsWith('AT')) {
    if (!ALLOWED_AT.has(c)) throw new ReadOnlyViolation(`Adapter command not allowed: ${cmd}`);
    return;
  }
  if (!/^[0-9A-F]+$/.test(c) || c.length < 2) throw new ReadOnlyViolation(`Not a valid OBD request: ${cmd}`);
  if (!READ_MODES.has(c.slice(0, 2))) throw new ReadOnlyViolation(`Service 0x${c.slice(0, 2)} is a write/control service and is blocked (this app is read-only).`);
}

const INIT = ['ATZ', 'ATE0', 'ATL0', 'ATS1', 'ATH0', 'ATSP0'];

export function createElm327(transport, { onLog = () => {} } = {}) {
  let closed = false;
  async function send(cmd) {
    assertReadOnly(cmd);                       // never bypassed
    onLog({ dir: 'tx', text: cmd });
    const lines = await transport.request(cmd);
    onLog({ dir: 'rx', text: lines.join(' ⏎ ') });
    return lines;
  }

  return {
    get closed() { return closed; },
    async init() {
      const info = {};
      for (const cmd of INIT) { await send(cmd); }
      try { info.id = (await send('ATI')).join(' '); } catch { /* optional */ }
      try { info.protocol = (await send('ATDPN')).join(' ').replace(/[^0-9A]/gi, '') || null; } catch { /* optional */ }
      return info;
    },
    /** Query one Mode 01 PID → { value, text } or null if the car doesn't answer. */
    async readPid(pid) {
      const lines = await send(`01${pid}`);
      if (isStatus(lines)) return null;
      const data = mode01Data(lines, pid);
      if (!data || (PID_BYTES[pid] && data.length < PID_BYTES[pid])) return null;
      const value = PIDS[pid].calc(data);
      return { pid, value, text: formatPid(pid, value), name: PIDS[pid].name, unit: PIDS[pid].unit, icon: PIDS[pid].icon };
    },
    /** Which of our PIDs this car actually answers (probed once). */
    async probePids() {
      const ok = [];
      for (const pid of Object.keys(PIDS)) { if (closed) break; if (await this.readPid(pid)) ok.push(pid); }
      return ok;
    },
    async readDtcs() { return decodeDtcs(await send('03'), 0x43); },
    async readPendingDtcs() { return decodeDtcs(await send('07'), 0x47); },
    async readReadiness() { const lines = await send('0101'); return isStatus(lines) ? null : decodeReadiness(mode01Data(lines, '01')); },
    async readVin() { return decodeVin(await send('0902')); },
    async readVoltage() { const l = await send('ATRV'); return (l.join(' ').match(/([\d.]+)\s*V/i) || [])[1] || null; },
    async close() { closed = true; await transport.close?.(); },
  };
}
