// The bench challenges must be solvable: their answers match the simulator's real behavior,
// the grader accepts the right answers and rejects wrong ones, and the formats round-trip.
import { describe, it, expect } from 'vitest';
import { CHALLENGES, gradeChallenge, answerOf } from '../src/content/challenges.js';
import { createCar, runScenario, PERIOD_FULL } from '../src/core/can/sim.js';
import { decode, extractRaw } from '../src/core/can/bits.js';
import { signalByName, MESSAGES } from '../src/core/can/ford.js';
import { toCandump, toSavvyCsv, parseCapture } from '../src/core/can/formats.js';

const last = (frames, id) => frames.filter((f) => f.id === id).at(-1);

describe('challenges', () => {
  it('have unique ids and well-formed fields', () => {
    expect(new Set(CHALLENGES.map((c) => c.id)).size).toBe(CHALLENGES.length);
    for (const c of CHALLENGES) {
      expect(c.fields.length).toBeGreaterThan(0);
      expect(c.hints.length).toBeGreaterThan(0);
      expect(typeof c.reveal()).toBe('string');
    }
  });
  it('accept their own answers and reject wrong ones', () => {
    for (const c of CHALLENGES) {
      const right = Object.fromEntries(c.fields.map((f) => [f.key, answerOf(f)]));
      expect(gradeChallenge(c, right).ok, c.id).toBe(true);
      const wrong = Object.fromEntries(c.fields.map((f) => [f.key, f.kind === 'hex' || f.kind === 'hexset' ? '0x7FF' : '9999']));
      expect(gradeChallenge(c, wrong).ok, c.id).toBe(false);
    }
  });
  it('accept hex in different spellings', () => {
    const c = CHALLENGES.find((x) => x.id === 'turn-id');
    for (const v of ['0x83', '83', '083', '0X83']) expect(gradeChallenge(c, { id: v }).ok, v).toBe(true);
    const b = CHALLENGES.find((x) => x.id === 'brake');
    expect(gradeChallenge(b, { ids: '3C3, 165' }).ok).toBe(true);
    expect(gradeChallenge(b, { ids: '165' }).ok).toBe(false);
  });
});

describe('simulator matches the challenge hints', () => {
  const car = () => { const c = createCar({ full: true }); c.step(2000); return c; };
  it('turn switch: byte 0 = 0x10 left, 0x20 right; lamp flashes byte 6 bit 6', () => {
    const c = car();
    c.inputs.turn = 1; let f = c.step(400);
    expect(last(f, 0x83).data[0]).toBe(0x10);
    const lamp = c.step(2000).filter((x) => x.id === 0x3b3).map((x) => (x.data[6] >> 6) & 1);
    expect(lamp).toContain(0); expect(lamp).toContain(1);
    c.inputs.turn = 2; f = c.step(400);
    expect(last(f, 0x83).data[0]).toBe(0x20);
  });
  it('driver door sets byte 7 = 0x20 in 0x3B3', () => {
    const c = car(); c.inputs.doors = { ...c.inputs.doors, drv: 1 };
    expect(last(c.step(400), 0x3b3).data[7]).toBe(0x20);
  });
  it('brake changes 0x165 and 0x3C3 while parked', () => {
    const c = car(); const a = c.step(500); c.inputs.brake = true; const b = c.step(500);
    expect(last(a, 0x165).data[0]).not.toBe(last(b, 0x165).data[0]);
    expect(last(a, 0x3c3).data[1]).not.toBe(last(b, 0x3c3).data[1]);
  });
  it('steering raw 16000 at center; rpm raw ≈ 350 at idle', () => {
    const c = car(); const f = c.step(500);
    expect(extractRaw(last(f, 0x7e).data, signalByName('StePinComp_An_Est'))).toBeGreaterThan(15990);
    expect(extractRaw(last(f, 0x7e).data, signalByName('StePinComp_An_Est'))).toBeLessThan(16010);
    const rpmRaw = extractRaw(last(f, 0x204).data, signalByName('EngAout_N_Actl'));
    expect(rpmRaw).toBeGreaterThan(330); expect(rpmRaw).toBeLessThan(370);
  });
  it('gear selector D = 3 in 0x176; wheels: outside wheel faster in a right turn', () => {
    const c = car(); c.inputs.lever = 'D'; c.inputs.pedal = 30; c.step(6000); c.inputs.steer = 270;
    const f = c.step(600);
    expect(decode(last(f, 0x176).data, signalByName('TrnRng_D_Rq'))).toBe(3);
    const fl = decode(last(f, 0x217).data, signalByName('WhlFl_W_Meas')), fr = decode(last(f, 0x217).data, signalByName('WhlFr_W_Meas'));
    expect(fl).toBeGreaterThan(fr);
  });
  it('ignition off silences the bus; accessory keeps body messages only', () => {
    const c = car(); c.inputs.ignition = 1; expect(c.step(1000).length).toBe(0);
    c.inputs.ignition = 2; const ids = new Set(c.step(1000).map((f) => f.id));
    expect(ids.has(0x3b3)).toBe(true); expect(ids.has(0x204)).toBe(false);
  });
  it('full mode uses the DBC send rate where the DBC lists one', () => {
    for (const m of MESSAGES) if (m.cycleMs) expect(PERIOD_FULL[m.id]).toBe(m.cycleMs);
  });
});

describe('capture formats', () => {
  const frames = runScenario('blinker', { full: true }).slice(0, 500);
  it('candump round-trips', () => {
    const back = parseCapture(toCandump(frames));
    expect(back.format).toBe('candump'); expect(back.frames.length).toBe(500); expect(back.skipped).toBe(0);
    expect(back.frames[10].id).toBe(frames[10].id); expect([...back.frames[10].data]).toEqual([...frames[10].data]);
  });
  it('SavvyCAN CSV matches its native header and round-trips', () => {
    const csv = toSavvyCsv(frames);
    expect(csv.split('\n')[0]).toBe('Time Stamp,ID,Extended,Dir,Bus,LEN,D1,D2,D3,D4,D5,D6,D7,D8');
    expect(csv.split('\n')[1]).toMatch(/^\d+,[0-9A-F]{8},false,Rx,0,8,([0-9A-F]{2},){8}$/);
    const back = parseCapture(csv);
    expect(back.format).toBe('savvycan'); expect(back.frames.length).toBe(500);
    expect([...back.frames[42].data]).toEqual([...frames[42].data]);
    expect(Math.abs(back.frames[42].t - frames[42].t)).toBeLessThan(1e-6);
  });
  it('skips CAN FD and junk lines, rebases epoch timestamps', () => {
    const r = parseCapture('(1700000000.000000) can0 415#0FA0\n(1700000000.500000) can0 123##1AABB\ngarbage\n(1700000001.000000) can0 7E8#0441\n');
    expect(r.frames.length).toBe(2); expect(r.skipped).toBe(2); expect(r.frames[1].t).toBeCloseTo(1, 6);
  });
});
