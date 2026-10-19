// SIMULATED Bronco-Sport-like CAN traffic. Message layouts come from the community Ford DBC (ford.js);
// the values, timing and vehicle behavior are a simple model, NOT recordings from a real car.
// Deterministic: same scenario + seed → same frames, so exercises can be auto-checked.
import { MESSAGES, CHECKSUM_FIELDS } from './ford.js';
import { insertRaw, encodeValue, extractRaw, toHex } from './bits.js';

// Ford 8F35 ratios and final drive (Ford-published; see vehicles facts). Tire ≈ 28.5 in.
const RATIOS = [4.69, 3.31, 3.01, 1.92, 1.45, 1.0, 0.75, 0.62];
const FINAL = 3.81, TIRE_IN = 28.5, IDLE = 700;
const WHEEL_RPM_PER_KPH = 1e6 / 60 / (Math.PI * TIRE_IN * 25.4);    // ≈ 7.33 wheel rpm per km/h

// How often each message is sent (ms). Plausible guesses for the simulator, not measured values.
export const PERIOD_MS = { 0x7e: 20, 0x91: 20, 0x202: 20, 0x204: 20, 0x415: 20, 0x165: 50, 0x176: 50, 0x83: 100, 0x3b3: 100, 0x3c3: 200 };

// Full mode (Phase 6 bench): more messages, and the DBC's own GenMsgCycleTime where it lists one.
// The original 10-message mode above stays unchanged because Phase 5 exercises depend on it.
const GUESS_MS = { 0x4c: 500, 0x83: 100, 0x91: 20, 0x156: 100, 0x3b3: 100, 0x3c3: 200, 0x202: 20, 0x217: 10 };
export const PERIOD_FULL = Object.fromEntries(MESSAGES.map((m) => [m.id, m.cycleMs || GUESS_MS[m.id] || 100]));
const BODY_IDS = new Set([0x4c, 0x83, 0x178, 0x3b3, 0x3c3]); // still talk with ignition in Accessory
const TIRE_R = (TIRE_IN * 0.0254) / 2, TRACK = 1.58, WHEELBASE = 2.67, STEER_RATIO = 17.7; // wheelbase & steer ratio: openpilot CarSpecs

/** Small seeded PRNG (mulberry32). */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** openpilot's ford_checksum: sum (raw + raw >> 8) over the listed fields, then invert, low byte. */
export function fordChecksum(bytes, msg, fields) {
  let sum = 0;
  for (const name of fields) {
    const s = msg.signals.find((x) => x.name === name);
    const v = extractRaw(bytes, s);
    sum += v + (v >> 8);
  }
  return ~sum & 0xff;
}

const GEAR_LEVER = { P: 0, R: 1, N: 2, D: 3 };

/** A simulated car. Set car.inputs, call step(dtMs) → frames due in that time. */
export function createCar({ seed = 7, full = false } = {}) {
  const rand = rng(seed), rand2 = rng(seed * 31 + 1);
  const PERIODS = full ? PERIOD_FULL : PERIOD_MS;
  const inputs = { pedal: 0, brake: false, steer: 0, turn: 0, lever: 'P', doors: { drv: 0, psg: 0, rl: 0, rr: 0, tgate: 0 }, headlights: 0, ignition: 4, parkBrake: false, wipers: 0, belt: 1, highBeam: 0 };
  const st = { t: 0, kph: 0, rpm: IDLE, gear: 0, yaw: 0, counters: {}, due: {}, blinkT: 0, engine: true, crank: 0, coolant: 24, oil: 22, ambient: 21, steerPrev: 0, steerRate: 0, map: -60, wheels: [0, 0, 0, 0] };
  for (const id of Object.keys(PERIODS)) st.due[id] = Number(id) % 7; // stagger start times

  function physics(dt) {
    const s = dt / 1000;
    const driving = inputs.lever === 'D' || inputs.lever === 'R';
    const drive = driving ? (inputs.pedal / 100) * 5.5 + (inputs.brake ? 0 : 0.25) : 0; // m/s² (creep 0.25)
    const brake = inputs.brake ? 3.5 : 0;
    const drag = 0.0004 * st.kph * st.kph / 3.6 + (st.kph > 0 ? 0.15 : 0);
    let v = st.kph / 3.6 + (drive - brake - drag) * s;
    st.kph = Math.max(0, Math.min(180, v * 3.6));
    if (inputs.lever === 'P' || inputs.lever === 'N') st.kph = Math.max(0, st.kph - 20 * s);
    // automatic: upshift around 2,200 rpm at light throttle, later with more pedal
    const up = 1900 + inputs.pedal * 30, down = 1100;
    if (inputs.lever === 'D') {
      if (st.gear === 0) st.gear = 1;
      const wheel = st.kph * WHEEL_RPM_PER_KPH * FINAL;
      if (st.gear < 8 && wheel * RATIOS[st.gear - 1] > up) st.gear++;
      if (st.gear > 1 && wheel * RATIOS[st.gear - 1] < down) st.gear--;
    } else st.gear = inputs.lever === 'R' ? 1 : 0;
    const coupled = st.gear ? st.kph * WHEEL_RPM_PER_KPH * FINAL * RATIOS[st.gear - 1] : 0;
    const target = Math.max(IDLE + inputs.pedal * (st.gear ? 6 : 45), coupled + inputs.pedal * 8);
    st.rpm += (Math.min(6200, target) - st.rpm) * Math.min(1, s * 6);
    st.yaw = (st.kph / 3.6) * Math.tan((inputs.steer / 15.6) * Math.PI / 180) / 2.67; // bicycle model, rad/s
    st.blinkT += dt;
    if (full) fullPhysics(s);
  }

  function fullPhysics(s) {
    // ignition: 1 Off, 2 Accessory, 4 Run, 8 Start (Ford's Ignition_Status values)
    if (inputs.ignition === 8) { st.crank += s; st.engine = false; st.rpm = 220; if (st.crank > 0.8) { inputs.ignition = 4; st.engine = true; st.crank = 0; st.rpm = 1100; } }
    if (inputs.ignition === 1 || inputs.ignition === 2) { st.engine = false; st.rpm = 0; }
    if (!st.engine) { st.rpm = inputs.ignition === 8 ? st.rpm : 0; st.kph = Math.max(0, st.kph - 2 * s); }
    const v = st.kph / 3.6, ang = (inputs.steer / STEER_RATIO) * Math.PI / 180;
    st.yaw = v * Math.tan(ang) / WHEELBASE;
    // per-wheel speeds: in a turn the outside wheels travel farther (track width ≈ 1.58 m, illustrative)
    const k = (TRACK / 2) * (Math.tan(ang) / WHEELBASE), w = v / TIRE_R;
    st.wheels = [w * (1 + k), w * (1 - k), w * (1 + k * 0.95), w * (1 - k * 0.95)].map((x) => Math.max(0, x)); // FL, FR, RL, RR (right turn = +steer)
    st.steerRate = (inputs.steer - st.steerPrev) / Math.max(s, 1e-3); st.steerPrev = inputs.steer;
    // warm-up (sped up so you can watch it), fan holds ≈ 95 °C
    if (st.engine) { st.coolant += s * (1.4 + inputs.pedal * 0.02) * Math.max(0, 1 - (st.coolant - 20) / 80); st.oil += (st.coolant - 6 - st.oil) * s * 0.08; }
    else { st.coolant += (st.ambient - st.coolant) * s * 0.002; st.oil += (st.ambient - st.oil) * s * 0.002; }
    st.coolant = Math.min(97, st.coolant);
    // manifold pressure (appears to be gauge kPa in the DBC: offset allows negatives): vacuum at idle, boost under load
    const load = inputs.pedal / 100, boost = st.rpm > 1800 ? load * Math.min(1, (st.rpm - 1800) / 1500) * 110 : 0;
    const target = st.engine ? -62 + load * 60 + boost : 0;
    st.map += (target - st.map) * Math.min(1, s * 4);
  }

  const lampOn = () => Math.floor(st.blinkT / 333) % 2 === 0; // ~1.5 Hz flash

  function values(id) {
    const noise = (a) => (rand() - 0.5) * 2 * a;
    if (full) {
      const n2 = (a) => (rand2() - 0.5) * 2 * a;
      switch (id) {
        case 0x4c: return { FirstRowBuckleDriver: inputs.belt ? 1 : 2, FirstRowBucklePsngr: 2 };
        case 0x82: return { SteeringColumnTorque: Math.max(-7.9, Math.min(7.8, st.steerRate * 0.012 + n2(0.06))), EPAS_Failure: 0 };
        case 0x156: return { EngClnt_Te_Actl: st.coolant, EngOil_Te_Actl: st.oil, EngClntTe_D_Qf: 3 };
        case 0x178: return { AirAmb_Te_Actl: st.ambient + n2(0.1), AirAmb_P_Actl: 1010, AirAmbTe_D_Qf: 3 };
        case 0x217: return { WhlFl_W_Meas: st.wheels[0], WhlFr_W_Meas: st.wheels[1], WhlRl_W_Meas: st.wheels[2], WhlRr_W_Meas: st.wheels[3] };
        case 0x43e: return { EngMnfld_P_Actl: st.map + n2(0.4), BattULoChrg_U_Cmd: st.engine ? 14.2 : 12.6 };
        case 0x83: return { TurnLghtSwtch_D_Stat: inputs.turn, WiprFront_D_Stat: inputs.wipers, HeadLghtHiFlash_D_Stat: inputs.highBeam };
        case 0x176: return { TrnRng_D_Rq: GEAR_LEVER[inputs.lever], GearPos_D_Actl: inputs.lever === 'R' ? 14 : st.gear, GearLvr_D_ActlDrv: GEAR_LEVER[inputs.lever] };
        default: break;
      }
    }
    switch (id) {
      case 0x7e: return { StePinComp_An_Est: inputs.steer + noise(0.05), StePinCompAnEst_D_Qf: 3 };
      case 0x83: return { TurnLghtSwtch_D_Stat: inputs.turn, WiprFront_D_Stat: 0, HeadLghtHiFlash_D_Stat: 0 };
      case 0x91: return { VehYaw_W_Actl: st.yaw + noise(0.0004), VehRol_W_Actl: noise(0.0004), VehYawWActl_D_Qf: 3, VehRolWActl_D_Qf: 3 };
      case 0x165: return { BpedDrvAppl_D_Actl: inputs.brake ? 2 : 1, CcStat_D_Actl: 0 };
      case 0x176: return { TrnRng_D_Rq: GEAR_LEVER[inputs.lever], GearPos_D_Actl: inputs.lever === 'R' ? 14 : st.gear };
      case 0x202: return { Veh_V_ActlEng: st.kph, VehVActlEng_D_Qf: 3 };
      case 0x204: return { ApedPos_Pc_ActlArb: inputs.pedal, EngAout_N_Actl: st.rpm + noise(4), ApedPosPcActl_D_Qf: 3 };
      case 0x3b3: {
        const on = inputs.turn && lampOn();
        return { Ignition_Status: inputs.ignition, DrStatDrv_B_Actl: inputs.doors.drv, DrStatPsngr_B_Actl: inputs.doors.psg, DrStatRl_B_Actl: inputs.doors.rl, DrStatRr_B_Actl: inputs.doors.rr, DrStatTgate_B_Actl: inputs.doors.tgate, TurnLghtLeftOn_B_Stat: on && inputs.turn === 1 ? 1 : 0, TurnLghtRightOn_B_Stat: on && inputs.turn === 2 ? 1 : 0, PrkBrkActv_B_Actl: inputs.parkBrake ? 1 : 0 };
      }
      case 0x3c3: return { StopLghtOn_B_Stat: inputs.brake ? 1 : 0, RvrseLghtOn_B_Stat: inputs.lever === 'R' ? 1 : 0, HeadLghtSwtch_D_Stat: inputs.headlights };
      case 0x415: return { Veh_V_ActlBrk: st.kph, VehVActlBrk_D_Qf: 3 };
      default: return {};
    }
  }

  function build(id) {
    const msg = MESSAGES.find((m) => m.id === id);
    const bytes = new Uint8Array(msg.dlc);
    const vals = values(id);
    for (const s of msg.signals) {
      if (s.name.endsWith('_No_Cnt')) {
        const c = (st.counters[id] = ((st.counters[id] ?? -1) + 1) % 2 ** s.length);
        insertRaw(bytes, s, c);
      } else if (s.name in vals) insertRaw(bytes, s, encodeValue(s, vals[s.name]));
    }
    const cs = msg.signals.find((s) => s.name.endsWith('_No_Cs'));
    if (cs) {
      // Real field list where openpilot documents one; elsewhere the simulator reuses the same formula.
      const fields = CHECKSUM_FIELDS[id] || msg.signals.filter((s) => s !== cs).map((s) => s.name);
      insertRaw(bytes, cs, fordChecksum(bytes, msg, fields));
    }
    return bytes;
  }

  function step(dtMs) {
    const frames = [];
    const end = st.t + dtMs;
    while (st.t < end) {
      const tick = Math.min(10, end - st.t);
      physics(tick);
      st.t += tick;
      for (const [k, p] of Object.entries(PERIODS)) {
        const id = Number(k);
        while (st.due[k] <= st.t) {
          const awake = !full || inputs.ignition === 4 || inputs.ignition === 8 || (inputs.ignition === 2 && BODY_IDS.has(id));
          if (awake) frames.push({ t: st.due[k] / 1000, id, data: build(id) });
          st.due[k] += p;
        }
      }
    }
    return frames.sort((a, b) => a.t - b.t || a.id - b.id);
  }

  return { inputs, state: st, step };
}

// Scenario keyframes: [timeSeconds, { input changes }]. Inputs hold until changed.
export const SCENARIOS = {
  idle: { seconds: 10, label: 'Parked, engine idling', keys: [[0, { lever: 'P' }]] },
  drive: { seconds: 30, label: 'Pull away, cruise ≈ 40 mph, brake to a stop', keys: [
    [0, { lever: 'P', brake: true }], [1, { lever: 'D' }], [2, { brake: false, pedal: 12 }], [4, { pedal: 35 }], [12, { pedal: 9 }],
    [20, { pedal: 0 }], [21, { brake: true }], [28, { lever: 'P' }],
  ] },
  blinker: { seconds: 12, label: 'Parked: left signal, then right signal', keys: [[0, { lever: 'P' }], [2, { turn: 1 }], [6, { turn: 0 }], [8, { turn: 2 }], [11, { turn: 0 }]] },
  steer: { seconds: 12, label: 'Parked: wheel turned left, then right', ramps: [['steer', [[0, 0], [1, 0], [4, -180], [5, -180], [8, 180], [9, 180], [11, 0]]]], keys: [[0, { lever: 'P' }]] },
  doors: { seconds: 10, label: 'Parked: driver door opens and closes, then passenger door', keys: [[0, { lever: 'P' }], [2, { doors: { drv: 1, psg: 0, rl: 0, rr: 0, tgate: 0 } }], [5, { doors: { drv: 0, psg: 0, rl: 0, rr: 0, tgate: 0 } }], [6, { doors: { drv: 0, psg: 1, rl: 0, rr: 0, tgate: 0 } }], [8, { doors: { drv: 0, psg: 0, rl: 0, rr: 0, tgate: 0 } }]] },
  pedal: { seconds: 10, label: 'Parked: accelerator pressed three times', ramps: [['pedal', [[0, 0], [1, 0], [1.5, 25], [2.5, 25], [3, 0], [4, 0], [4.5, 40], [5.5, 40], [6, 0], [7, 0], [7.5, 15], [8.5, 15], [9, 0]]]], keys: [[0, { lever: 'P' }]] },
  brake: { seconds: 10, label: 'Parked: brake pedal pressed three times', keys: [[0, { lever: 'P' }], [1, { brake: true }], [2, { brake: false }], [4, { brake: true }], [5, { brake: false }], [7, { brake: true }], [8, { brake: false }]] },
};

const interp = (pts, t) => {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const [t0, v0] = pts[i - 1], [t1, v1] = pts[i]; return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0); }
  return pts[pts.length - 1][1];
};

/** Run a named scenario → frames [{ t, id, data }]. Optional ids filter. */
export function runScenario(name, { seed = 7, ids = null, full = false } = {}) {
  const sc = SCENARIOS[name];
  if (!sc) throw new Error(`Unknown scenario ${name}`);
  const car = createCar({ seed, full });
  const frames = [];
  let k = 0;
  for (let t = 0; t < sc.seconds * 1000; t += 10) {
    while (k < sc.keys.length && sc.keys[k][0] * 1000 <= t) Object.assign(car.inputs, sc.keys[k++][1]);
    for (const [input, pts] of sc.ramps || []) car.inputs[input] = interp(pts, t / 1000);
    frames.push(...car.step(10));
  }
  return ids ? frames.filter((f) => ids.includes(f.id)) : frames;
}

/** candump -l style: "(0.020000) can0 415#0FA0..." */
export const candumpLine = (f, iface = 'can0') => `(${f.t.toFixed(6)}) ${iface} ${f.id.toString(16).toUpperCase().padStart(3, '0')}#${toHex(f.data)}`;
export const candumpText = (frames) => frames.map((f) => candumpLine(f)).join('\n') + '\n';

/** "sim:drive", "sim:drive?ids=415,204", "sim:drive?full" or "sim:drive?full&ids=217" → candump text.
 *  `full` = the Phase 6 bench car (more messages, DBC send rates). Used by exercise data files. */
export function simFile(ref) {
  const m = /^sim:(\w+)(?:\?(.*))?$/.exec(ref);
  if (!m) throw new Error(`Bad sim file reference ${ref}`);
  const q = new URLSearchParams(m[2] || '');
  const ids = q.get('ids') ? q.get('ids').split(',').map((h) => parseInt(h, 16)) : null;
  return candumpText(runScenario(m[1], { ids, full: q.has('full') }));
}
