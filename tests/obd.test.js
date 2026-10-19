// OBD-II / ELM327 reader: the read-only guard is the safety-critical piece, so it's tested hard,
// along with response decoding and the demo transport that backs the no-hardware demo.
import { describe, it, expect } from 'vitest';
import { assertReadOnly, ReadOnlyViolation, createElm327 } from '../src/core/obd/elm327.js';
import { decodeDtc, decodeDtcs, decodeReadiness, decodeVin, mode01Data, lineBytes } from '../src/core/obd/decode.js';
import { formatPid } from '../src/core/obd/pids.js';
import { encodeDtc } from '../src/ui/visuals/t4/dtc.js';
import { createDemoTransport, DEMO_VIN } from '../src/core/obd/transport-demo.js';

describe('read-only guard', () => {
  it('allows the read-only diagnostics and the init commands', () => {
    for (const c of ['010C', '01 0C', '03', '07', '0902', '0101', '06', '0A', 'ATZ', 'ATE0', 'ATH0', 'ATSP0', 'ATRV', 'ATDPN']) {
      expect(() => assertReadOnly(c), c).not.toThrow();
    }
  });
  it('blocks every write / control / UDS service and unknown AT commands', () => {
    for (const c of ['04', '0420', '08', '0801', '2E F190 01', '2706', '34', '36', '31', '3E', 'ATMA', 'ATPC', 'STPX', 'garbage', '']) {
      expect(() => assertReadOnly(c), c).toThrow(ReadOnlyViolation);
    }
  });
});

describe('decode', () => {
  it('DTC bytes round-trip with the encoder', () => {
    for (const code of ['P0301', 'P0171', 'P0420', 'U0100', 'C0035', 'B1ABC']) {
      const [b0, b1] = encodeDtc(code);
      expect(decodeDtc(b0, b1)).toBe(code);
    }
  });
  it('decodeDtcs reads a Mode 03 reply and drops padding', () => {
    expect(decodeDtcs(['43 02 01 71 04 20 00 00'], 0x43)).toEqual(['P0171', 'P0420']);
    expect(decodeDtcs(['43 00 00 00'], 0x43)).toEqual([]);
  });
  it('lineBytes drops a multi-frame counter', () => {
    expect(lineBytes('0: 49 02 01 33 46')).toEqual([0x49, 0x02, 0x01, 0x33, 0x46]);
  });
  it('mode01Data finds the bytes after 41 <pid>', () => {
    expect(mode01Data(['41 0C 1A F8'], '0C')).toEqual([0x1a, 0xf8]);
    expect(mode01Data(['NO DATA'], '0C')).toBeNull();
  });
  it('readiness decodes MIL, count and monitors', () => {
    const r = decodeReadiness([0x82, 0x07, 0xe0, 0x00]);
    expect(r.milOn).toBe(true); expect(r.dtcCount).toBe(2);
    expect(r.monitors.find((m) => m.name === 'Misfire').supported).toBe(true);
    expect(r.allReady).toBe(true);
  });
  it('formatPid shows both units', () => {
    expect(formatPid('05', 90)).toBe('90 °C (194 °F)');
    expect(formatPid('0D', 64)).toBe('64 km/h (40 mph)');
  });
});

describe('demo transport through the ELM327 driver', () => {
  it('reads plausible live data, the VIN, codes and readiness — using only allowed commands', async () => {
    const sent = [];
    const demo = createDemoTransport();
    const spy = { request: (c) => { sent.push(c); return demo.request(c); }, close: demo.close };
    const elm = createElm327(spy);
    await elm.init();
    const rpm = await elm.readPid('0C');
    expect(rpm.value).toBeGreaterThan(400); expect(rpm.value).toBeLessThan(1500);
    const temp = await elm.readPid('05');
    expect(temp.value).toBeGreaterThan(20); expect(temp.value).toBeLessThanOrEqual(97);
    expect(await elm.readVin()).toBe(DEMO_VIN);
    expect(await elm.readDtcs()).toContain('P0171');
    expect((await elm.readReadiness()).milOn).toBe(false);
    const probed = await elm.probePids();
    expect(probed).toContain('0C'); expect(probed).toContain('42');
    // every command the driver ever sent must pass the read-only gate
    for (const c of sent) expect(() => assertReadOnly(c), c).not.toThrow();
  });
});
