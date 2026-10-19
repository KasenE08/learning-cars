// CAN bench challenges (Phase 6). Answers come from the community Ford DBC subset (ford.js), so they
// always match what the simulator sends. Field kinds: hex (an ID), int, num (with tol), hexset (several IDs).
import { signalByName } from '../core/can/ford.js';
import { signalBits } from '../core/can/bits.js';

const sig = (n) => signalByName(n);
const byteOf = (n) => Math.floor(signalBits(sig(n))[0] / 8);           // byte holding the signal's MSB
const bitOf = (n) => signalBits(sig(n))[0] % 8;                         // bit (0–7) of that MSB within its byte
const dbc = (n) => { const s = sig(n); return `${s.message.name} (0x${s.message.id.toString(16).toUpperCase()}) · ${s.name} : ${s.start}|${s.length}@${s.endian === 'big' ? 0 : 1}${s.signed ? '-' : '+'} (${s.scale},${s.offset})`; };

export const CHALLENGES = [
  { id: 'turn-id', level: 1, title: 'Find the turn-signal switch',
    goal: 'Which CAN ID carries the turn-signal **switch** position?',
    steps: ['Park, ignition Run. Press **Record**, wait 5 seconds doing nothing, **Stop**, name it “idle”.', 'Record again: turn the **left signal** on, wait 3 s, turn it off, Stop. Name it “left”.', 'In **Compare**, diff “idle” vs “left”. Orange bytes changed only when you used the signal.', 'Two IDs light up. One changes once (the switch); one keeps flipping (the flashing lamp). The switch is the answer.'],
    fields: [{ key: 'id', label: 'Switch ID (hex)', kind: 'hex', answer: sig('TurnLghtSwtch_D_Stat').message.id }],
    hints: ['A switch changes when you move it and then holds still. A lamp turns on and off about 1.5 times a second.', 'Look for the ID whose byte changed only a handful of times.'],
    reveal: () => `Community DBC: ${dbc('TurnLghtSwtch_D_Stat')}. The flashing one is the lamp status in 0x3B3.` },

  { id: 'turn-values', level: 2, title: 'Decode the switch',
    goal: 'In the switch message: which **byte** changes, and what value does it hold for **Left** and for **Right**? (Read the byte in hex, then think about which bits moved.)',
    steps: ['Filter the view to the switch ID (type it in “IDs”).', 'Switch Left, Off, Right and watch the byte. Note the hex values.', 'Write the changing byte in binary: which two bits move? Shift them down to read the value.'],
    fields: [{ key: 'byte', label: 'Byte number (0–7)', kind: 'int', answer: byteOf('TurnLghtSwtch_D_Stat') },
      { key: 'left', label: 'Value for Left', kind: 'int', answer: 1 }, { key: 'right', label: 'Value for Right', kind: 'int', answer: 2 }],
    hints: ['Left makes byte 0 read 0x10; right makes it 0x20.', '0x10 = 0001 0000: the moving bits are 5 and 4. (byte >> 4) & 0b11 gives the value.'],
    reveal: () => `${dbc('TurnLghtSwtch_D_Stat')}, values 0 Off, 1 Left, 2 Right. Bits 5–4 of byte 0.` },

  { id: 'lamp', level: 3, title: 'Switch vs lamp',
    goal: 'The **left turn lamp** flashes in another message. Which ID, which byte, and which bit (0–7) within that byte?',
    steps: ['Turn the left signal on and watch the Table view: one byte flips on and off.', 'Write that byte in binary when it’s on to find the bit.'],
    fields: [{ key: 'id', label: 'ID (hex)', kind: 'hex', answer: sig('TurnLghtLeftOn_B_Stat').message.id }, { key: 'byte', label: 'Byte', kind: 'int', answer: byteOf('TurnLghtLeftOn_B_Stat') }, { key: 'bit', label: 'Bit within byte (0–7)', kind: 'int', answer: bitOf('TurnLghtLeftOn_B_Stat') }],
    hints: ['It’s in the body message 0x3B3 (forwarded by the gateway).', 'Byte 6 reads 0x40 when the lamp is lit: 0100 0000.'],
    reveal: () => `${dbc('TurnLghtLeftOn_B_Stat')}. DBC bit numbers count byte × 8 + bit, so bit 6 of byte 6 = DBC bit 54.` },

  { id: 'brake', level: 4, title: 'Brake pedal: two places',
    goal: 'Pressing the brake changes **two** IDs (while parked). Which two?',
    steps: ['Record idle, then record pressing and releasing the brake a few times.', 'Compare the two captures.'],
    fields: [{ key: 'ids', label: 'Both IDs (hex, any order)', kind: 'hexset', answer: [sig('BpedDrvAppl_D_Actl').message.id, sig('StopLghtOn_B_Stat').message.id] }],
    hints: ['One comes from the engine computer (brake-switch state), one from the body side (stop lamps).', 'Look at 0x1xx and 0x3xx IDs.'],
    reveal: () => `${dbc('BpedDrvAppl_D_Actl')} (1 = not braking, 2 = braking) and ${dbc('StopLghtOn_B_Stat')}.` },

  { id: 'door', level: 5, title: 'Driver’s door',
    goal: 'Open and close the **driver’s door**. Which byte and which bit (0–7) in the body message 0x3B3 is the driver-door-ajar flag?',
    steps: ['Filter to 3B3. Toggle the Driver door and watch which byte changes.'],
    fields: [{ key: 'byte', label: 'Byte', kind: 'int', answer: byteOf('DrStatDrv_B_Actl') }, { key: 'bit', label: 'Bit within byte', kind: 'int', answer: bitOf('DrStatDrv_B_Actl') }],
    hints: ['It’s near the end of the frame.', 'Byte 7 goes from 0x00 to 0x20: 0010 0000.'],
    reveal: () => `${dbc('DrStatDrv_B_Actl')} (DBC bit 61 = byte 7, bit 5).` },

  { id: 'speed', level: 6, title: 'Vehicle speed',
    goal: 'Find a message carrying **vehicle speed**. Give its ID, how many bits the signal uses, and its scale (km/h per raw step).',
    steps: ['Drive at a steady speed and note the km/h on the dash.', 'Find two bytes that rise smoothly with speed. Read them as one 16-bit big-endian number.', 'Scale = km/h ÷ raw number.'],
    fields: [{ key: 'id', label: 'ID (hex)', kind: 'hex', answer: [sig('Veh_V_ActlBrk').message.id, sig('Veh_V_ActlEng').message.id] }, { key: 'len', label: 'Length (bits)', kind: 'int', answer: 16 }, { key: 'scale', label: 'Scale (km/h per step)', kind: 'num', answer: 0.01, tol: 0.0006 }],
    hints: ['Two messages carry it: one from the ABS module and one from the engine computer.', 'At 64.37 km/h the raw value is 6437.'],
    reveal: () => `${dbc('Veh_V_ActlBrk')} and ${dbc('Veh_V_ActlEng')}. openpilot uses the ABS one as the car’s speed.` },

  { id: 'rpm', level: 7, title: 'Engine rpm',
    goal: 'Find **engine rpm**. ID, length in bits, and scale (rpm per raw step). Careful: it doesn’t start on a byte boundary.',
    steps: ['Rev the engine in Park (gas) and compare with the tach.', 'Look for a value that rises with rpm but uses only part of one byte plus the next byte.', 'Try lengths with the Decode tab off: the bit grid lessons help here.'],
    fields: [{ key: 'id', label: 'ID (hex)', kind: 'hex', answer: sig('EngAout_N_Actl').message.id }, { key: 'len', label: 'Length (bits)', kind: 'int', answer: sig('EngAout_N_Actl').length }, { key: 'scale', label: 'Scale (rpm per step)', kind: 'num', answer: sig('EngAout_N_Actl').scale, tol: 0.05 }],
    hints: ['It’s in 0x204, the same message as the accelerator.', 'Low 5 bits of byte 3 + all of byte 4 = 13 bits. At ~700 rpm the raw value is ~350.'],
    reveal: () => `${dbc('EngAout_N_Actl')}: 13 bits × 2 rpm, so the resolution is 2 rpm.` },

  { id: 'steer', level: 8, title: 'Steering angle',
    goal: 'Find the **steering wheel angle**: ID, scale (degrees per step) and offset (degrees at raw 0).',
    steps: ['Parked: record the wheel centered, full left and full right.', 'The value at center isn’t 0: that’s the offset at work.', 'Two readings (e.g. 0° and +540°) give you scale; then offset = angle − raw × scale.'],
    fields: [{ key: 'id', label: 'ID (hex)', kind: 'hex', answer: sig('StePinComp_An_Est').message.id }, { key: 'scale', label: 'Scale (° per step)', kind: 'num', answer: sig('StePinComp_An_Est').scale, tol: 0.005 }, { key: 'offset', label: 'Offset (°)', kind: 'num', answer: sig('StePinComp_An_Est').offset, tol: 1 }],
    hints: ['It’s the lowest ID on the bus: 0x07E, from the power-steering module.', 'Centered reads 16000 raw (15 bits): 16000 × 0.1 − 1600 = 0.'],
    reveal: () => `${dbc('StePinComp_An_Est')}. An offset instead of a sign bit is how most Ford signals do negatives.` },

  { id: 'gear', level: 9, title: 'Gear selector',
    goal: 'Which ID carries the **gear selector** (P/R/N/D)? What raw value means **Drive**, and what means **Reverse**?',
    steps: ['Foot on the brake, step through P → R → N → D and watch for a small value that steps 0, 1, 2, 3.'],
    fields: [{ key: 'id', label: 'ID (hex)', kind: 'hex', answer: sig('TrnRng_D_Rq').message.id }, { key: 'd', label: 'Value for D', kind: 'int', answer: 3 }, { key: 'r', label: 'Value for R', kind: 'int', answer: 1 }],
    hints: ['It’s in 0x176 from the PCM, and it appears twice in that frame.', 'P=0, then count up in the order of the shifter.'],
    reveal: () => `${dbc('TrnRng_D_Rq')} (and GearLvr_D_ActlDrv) use 0 Park, 1 Reverse, 2 Neutral, 3 Drive.` },

  { id: 'counter', level: 10, title: 'Counter and checksum',
    goal: 'In 0x415, one byte looks random and one 4-bit field counts. Which **byte** is the checksum, and what is the counter’s **highest value** before it wraps?',
    steps: ['Pause the view a few times on 0x415 and compare frames.', 'A counter goes up by one every frame; a checksum jumps around but depends on the other bytes.'],
    fields: [{ key: 'csbyte', label: 'Checksum byte', kind: 'int', answer: byteOf('VehVActlBrk_No_Cs') }, { key: 'max', label: 'Counter max value', kind: 'int', answer: 2 ** sig('VehVActlBrk_No_Cnt').length - 1 }],
    hints: ['The counter is 4 bits wide.', 'Byte 3 changes every frame even when parked.'],
    reveal: () => `${dbc('VehVActlBrk_No_Cnt')} and ${dbc('VehVActlBrk_No_Cs')}. openpilot’s Ford checksum: sum (raw + raw >> 8) of speed, counter and quality, inverted, low byte (decode-05).` },

  { id: 'wheels', level: 11, title: 'Four wheel speeds',
    goal: 'One message holds **all four wheel speeds**. Give its ID and scale (rad/s per step). Bonus thinking: which wheels spin faster in a right turn?',
    steps: ['Drive, then hold a steady right turn. Look for an ID with four similar 15-bit values that split apart in the turn.'],
    fields: [{ key: 'id', label: 'ID (hex)', kind: 'hex', answer: sig('WhlFl_W_Meas').message.id }, { key: 'scale', label: 'Scale (rad/s per step)', kind: 'num', answer: sig('WhlFl_W_Meas').scale, tol: 0.0006 }],
    hints: ['It’s sent every 10 ms by the ABS module: 0x217.', 'At 40 mph the wheels turn ≈ 49 rad/s: raw ≈ 4900.'],
    reveal: () => `${dbc('WhlFl_W_Meas')} (+ FR, RL, RR). In a right turn the left (outside) wheels spin faster: that’s what the differential and ABS see.` },
];

const parseHex = (s) => { const m = String(s).trim().match(/^(?:0x)?([0-9a-f]{1,3})$/i); return m ? parseInt(m[1], 16) : NaN; };

/** Grade answers → { ok, fields: { key: true|false } } */
export function gradeChallenge(ch, answers) {
  const res = {};
  for (const f of ch.fields) {
    const v = answers[f.key] ?? '';
    if (f.kind === 'hex') { const n = parseHex(v); res[f.key] = Array.isArray(f.answer) ? f.answer.includes(n) : n === f.answer; }
    else if (f.kind === 'int') res[f.key] = String(v).trim() !== '' && Number(v) === f.answer;
    else if (f.kind === 'num') { const n = Number(String(v).replace(',', '.')); res[f.key] = Number.isFinite(n) && Math.abs(n - f.answer) <= (f.tol ?? Math.abs(f.answer) * 0.02); }
    else if (f.kind === 'hexset') {
      const got = new Set((String(v).match(/(?:0x)?[0-9a-f]{1,3}/gi) || []).map(parseHex));
      res[f.key] = got.size === f.answer.length && f.answer.every((a) => got.has(a));
    }
  }
  return { ok: Object.values(res).every(Boolean), fields: res };
}

/** The right answers as strings (used by tests and the "show answer" button). */
export const answerOf = (f) => (f.kind === 'hex' ? `0x${[].concat(f.answer)[0].toString(16).toUpperCase()}` : f.kind === 'hexset' ? f.answer.map((a) => `0x${a.toString(16).toUpperCase()}`).join(' ') : String(f.answer));
