// Finding counters, checksums & constants
const SETUP = `def parse_line(line):
    """(t, can_id, data) from one
    candump line."""
    ts, iface, frame = line.split()
    id_hex, data_hex = frame.split("#")
    t = float(ts.strip("()"))
    cid = int(id_hex, 16)
    data = bytes.fromhex(data_hex)
    return t, cid, data

frames = [parse_line(l)
          for l in open("pedal.log")]
# just ID 0x204: (t, data) pairs
pedal = [(t, d) for t, cid, d in frames
         if cid == 0x204]
`;

export default {
  steps: [
    { tag: 'metaphor', title: 'Reading a stranger’s letters',
      body: [
        'Imagine a stack of letters from one sender. The **letterhead** never changes. The **page number** goes up by one every letter. A **signature stamp** looks different each time but proves the letter is genuine.',
        'And somewhere in the middle is the **actual news**.',
        'Every periodic CAN message has the same parts: constants, a [[rolling-counter]], a [[checksum]], and the signal you want. Learn to spot the first three and the fourth is what’s left.',
      ] },
    { tag: 'how', title: 'Fingerprints of each field',
      body: [
        '**Counter**: +1 every frame, wraps around (a 4-bit one goes 0…15, 0…). Changes even when the car is still.',
        '**Checksum**: often a full byte that looks random, changes every frame (because the counter changes) and changes again when the signal does. decode-05 showed how to recompute Ford’s.',
        '**Constant / [[quality-flag]]**: never changes in healthy data. Often a status like “3 = OK”.',
        '**Signal**: still when you’re still, moves **with your action**, and follows a smooth shape.',
      ] },
    { tag: 'see', title: 'Plot the bits you think are the pedal', visualFirst: true,
      visual: { type: 'sigplot', scenario: 'pedal', id: 0x204, start: 15, length: 8, endian: 'big', editable: true },
      body: [
        '**Simulated** capture, parked: accelerator pressed three times, peaking at **25%, 40% and 15%**.',
        'This plot starts with byte 1 alone. Look at the middle press: it comes out *smaller* than the first, which can’t be right. Try moving the start bit and length until the shape matches 25 / 40 / 15.',
      ] },
    { tag: 'code', title: 'Crack 0x204',
      body: [
        '`pedal` holds every 0x204 frame as `(t, data)`. Print a few (`data.hex(" ")`) around the peaks at about 2, 5 and 8 s, and look at bytes 0 and 1 in binary with `bin()`.',
        'Three answers to find: the pedal’s raw number, its scale, and the counter.',
      ],
      code: {
        id: 're-05-pedal',
        prompt: 'Write `pedal_raw(data)`, set `SCALE`, and write `counter(data)`. Tests check them on the whole capture.',
        setup: SETUP,
        files: { 'pedal.log': 'sim:pedal' },
        starter: `def pedal_raw(data):
    """Raw accelerator number (an int)
    from one 0x204 payload.
    Clue: at the 40% press byte 1 is
    0x90 (144), less than at 25%
    (0xFA, 250). Where's the rest?"""
    ___

# percent per raw step
SCALE = ___

def counter(data):
    """The 4-bit counter hiding in
    byte 0 (0..15, +1 per frame)."""
    ___

# explore: one frame every 0.5 s
for t, d in pedal[::25]:
    print(round(t, 2), d.hex(" "),
          bin(d[0]))
`,
        tests: [
          { name: 'Pedal at rest reads 0', code: 'rest = {pedal_raw(d) for t, d in pedal if t < 1}\nassert rest == {0}, f"got {sorted(rest)[:5]}"' },
          { name: 'Raw peaks come out in the ratio 25 : 40 : 15', code: 'peaks = [max(pedal_raw(d) for t, d in pedal if a <= t < b) for a, b in [(1, 3.5), (4, 6.5), (7, 9.5)]]\nassert peaks == [250, 400, 150], f"got {peaks}"' },
          { name: 'SCALE turns the peaks into 25%, 40%, 15%', code: 'pct = [round(r * SCALE, 1) for r in (250, 400, 150)]\nassert pct == [25.0, 40.0, 15.0], f"got {pct}"' },
          { name: 'counter() goes up by 1 every frame and wraps at 15', code: 'c = [counter(d) for t, d in pedal]\nbad = [i for i in range(1, len(c)) if (c[i] - c[i-1]) % 16 != 1]\nassert not bad and set(c) == set(range(16)), f"first values {c[:18]}"' },
        ],
        hints: [
          'In binary, byte 0 looks like `0b11cccc pp`: the top two bits never change (a constant), the next four tick (the counter), and the lowest two only change during the 40% press.',
          'The pedal is 10 bits: the low 2 bits of byte 0 are its top, byte 1 its bottom 8. Mask with `& 0x03`, shift left 8, OR with byte 1. The scale is 40 ÷ that peak.',
          '`((data[0] & 0x03) << 8) | data[1]`, `SCALE = 40 / 400`, and the counter is `(data[0] >> 2) & 0x0F`.',
        ],
        solution: `def pedal_raw(data):
    """Raw accelerator number (an int)
    from one 0x204 payload."""
    # low 2 bits of byte 0 are the
    # top of the 10-bit number
    high = data[0] & 0x03
    return (high << 8) | data[1]

# 40% ÷ 400 raw = 0.1 % per step
SCALE = 40 / 400

def counter(data):
    """The 4-bit counter hiding in
    byte 0 (0..15, +1 per frame)."""
    # bits 5..2: shift down, keep 4
    return (data[0] >> 2) & 0x0F

for t, d in pedal[::25]:
    print(round(t, 2), d.hex(" "),
          bin(d[0]))
`,
      } },
    { tag: 'how', title: 'What you just reverse-engineered', visualFirst: true,
      visual: { type: 'bitfield', signal: 'ApedPos_Pc_ActlArb', data: 'C5900003D5920000' },
      body: [
        '`ApedPos_Pc_ActlArb`: start bit 1, **10 bits**, Motorola order, **0.1 % per bit**. The trap was the byte boundary: 400 doesn’t fit in one byte.',
        'Byte 0 also holds `ApedPosPcActl_No_Cnt` (bits 5–2, the counter) and `ApedPosPcActl_D_Qf` (bits 7–6, always 3 = “OK”: the constant).',
        'Byte 5 changes every frame: `ApedPosPcActl_No_Cs`, the checksum.',
        'Bytes 3–4 rose too: engine rpm (`EngAout_N_Actl`, 2 rpm per bit). A [[correlated-signal]] moves with your action but lags and has a different shape. The pedal is flat on each plateau; rpm isn’t.',
        'From the community DBC (openpilot), not Ford; the capture is simulated.',
      ] },
    { tag: 'key', title: 'Confirm, then document',
      body: [
        '**Predict**: with your formula, a 60% press should read raw 600. A new test that matches is your confirmation.',
        '**Check the checksum** by recomputing it (decode-05). If yours matches every frame, you’ve also found which fields it covers.',
        '**Counters and checksums are integrity, not secrecy.** They catch stale or garbled frames; they don’t stop a deliberate fake. The Security unit picks that up.',
        'Write it into a DBC: start bit, length, byte order, scale, offset, unit. That file is the real output of reverse engineering.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'A 4-bit field reads 3, 4, 5, 6 … 15, 0, 1 in consecutive frames while the car sits still. It’s a…',
      options: ['Signal', 'Rolling counter', 'Checksum', 'Constant'], answer: 1,
      why: '+1 per frame and wrapping at 2⁴ − 1 = 15, regardless of what the car does: the textbook counter.' },
    { type: 'num', q: 'Byte 0’s low two bits are **01** and byte 1 is **0x90**. With a 10-bit signal (byte 0 bits on top), what’s the raw value?', answer: 400, tol: 0,
      hint: '01 shifted left 8 = 256. Add 0x90.', why: '`(0b01 << 8) | 0x90` = 256 + 144 = **400**. × 0.1 % = 40%.' },
    { type: 'mc', q: 'Bytes 3–4 of 0x204 also rise when you press the pedal. Why aren’t they the pedal?',
      options: ['They’re a checksum', 'They’re engine rpm: correlated, but lagging and a different shape', 'They’re a counter', 'They’re a constant'], answer: 1,
      why: 'Pressing the pedal while parked revs the engine, so rpm moves too. The pedal signal sits flat at 25/40/15%; rpm ramps and settles. Correlated is not the same as identical.' },
    { type: 'mc', q: 'What do rolling counters and checksums protect against?',
      options: ['Attackers forging frames', 'Stale, repeated or corrupted frames', 'Eavesdropping', 'Bus overload'], answer: 1,
      why: 'Anyone who knows the formula (it’s in public code) can compute a valid checksum. They’re integrity checks against faults, not security. Authenticated messages ([[secoc|SecOC]]) are the security answer.' },
  ],
  cards: [
    { id: 'four', front: 'Four kinds of fields in a periodic message?', back: 'Constants/quality flags, rolling counter, checksum, and the signal(s).' },
    { id: 'counter', front: 'Fingerprint of a counter?', back: '+1 every frame, wraps (4-bit: 0–15), moves even when nothing happens.' },
    { id: 'checksum', front: 'Fingerprint of a checksum?', back: 'Random-looking, changes every frame, changes again when data changes.' },
    { id: 'pedal', front: 'Accelerator in Ford 0x204 (community DBC)?', back: '`ApedPos_Pc_ActlArb`: 10 bits spanning bytes 0–1, 0.1 % per bit.' },
    { id: 'correlated', front: 'Correlated vs the real signal?', back: 'Both move with your action; the real one matches its known shape (e.g. flat 25/40/15%), the correlated one lags or differs.' },
  ],
};
