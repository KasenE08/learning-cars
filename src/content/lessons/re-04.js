// Diffing captures
const SETUP = `def parse_line(line):
    """(t, can_id, data) from one
    candump line."""
    ts, iface, frame = line.split()
    id_hex, data_hex = frame.split("#")
    t = float(ts.strip("()"))
    cid = int(id_hex, 16)
    return t, cid, bytes.fromhex(data_hex)

def byte_values(path):
    """{(can_id, byte_index): set of
    values} for a whole log file"""
    vals = {}
    for line in open(path):
        t, cid, data = parse_line(line)
        for i, b in enumerate(data):
            vals.setdefault((cid, i), set())
            vals[(cid, i)].add(b)
    return vals

idle = byte_values("idle.log")
brake = byte_values("brake.log")
`;

export default {
  steps: [
    { tag: 'metaphor', title: 'Spot the difference',
      body: [
        'Those puzzles with two almost-identical photos: you don’t study each one alone, you **compare them** and the differences jump out.',
        'Diffing captures works the same: record the car doing nothing, record it again doing **one thing**, and let the computer list what’s different.',
        'Same car, same state, same length; only one difference you caused.',
      ] },
    { tag: 'how', title: 'Diff two files, not two moments',
      body: [
        'Last lesson compared two **windows** of one capture. [[diffing]] compares two separate **captures**: a baseline (idle) and an action (brake pressed three times).',
        'For every (ID, byte), collect the values seen in each capture. A byte that was constant in the baseline but varies in the action capture is a suspect.',
        'Then narrow it to **bits**: XOR two values (`a ^ b`) and the 1s are the bits that differ.',
        'Real tools do this for you: SavvyCAN and [[cabana]] can compare and graph captures, and comma.ai’s `can_bit_transition.py` hunts for flipping bits.',
      ] },
    { tag: 'see', title: 'Idle vs brake', visualFirst: true,
      visual: { type: 'capdiff', base: 'idle', action: 'brake' },
      body: [
        'Both captures are **simulated**, 10 s, parked. The only difference: the brake pedal goes down at 1, 4 and 7 s.',
        'Only the bytes that change in the action capture light up. Tap one to see its values.',
      ] },
    { tag: 'code', title: 'Diff, then find the bits',
      body: [
        '`idle` and `brake` are ready: for each `(id, byte)` they hold the set of values that byte took.',
        'Two short functions: one diffs the captures, one shows which bits flip.',
      ],
      code: {
        id: 're-04-diff',
        prompt: 'Finish `diff(base, action)` and `flipped_bits(values)`.',
        setup: SETUP,
        files: { 'idle.log': 'sim:idle', 'brake.log': 'sim:brake' },
        starter: `def diff(base, action):
    """(id, byte) keys that were
    constant in base but take more
    than one value in action."""
    found = []
    for key in action:
        if ___:
            found.append(key)
    return sorted(found)

def flipped_bits(values):
    """Bits that differ between the
    values, as one mask."""
    values = list(values)
    first = values[0]
    mask = 0
    for v in values:
        # XOR marks differing bits,
        # OR collects them all
        mask = mask | ___
    return mask

for key in diff(idle, brake):
    m = flipped_bits(brake[key])
    print(hex(key[0]), "byte", key[1],
          "bits", bin(m))
`,
        tests: [
          { name: 'Finds exactly two bytes: 0x165 byte 0 and 0x3C3 byte 1', code: 'got = diff(idle, brake)\nassert got == [(0x165, 0), (0x3C3, 1)], f"got {[(hex(c), i) for c, i in got]}"' },
          { name: '0x10 vs 0x20: bits 5 and 4 flip (mask 0x30)', code: 'm = flipped_bits({0x10, 0x20})\nassert m == 0x30, f"got {hex(m)}"' },
          { name: 'The stop-lamp byte flips only bit 0', code: 'm = flipped_bits(brake[(0x3C3, 1)])\nassert m == 0x01, f"got {hex(m)}"' },
          { name: 'One value means no bits flip', code: 'm = flipped_bits({0x40})\nassert m == 0, f"got {hex(m)}"' },
        ],
        hints: [
          'Constant in base: `len(base[key]) == 1`. Varies in action: `len(action[key]) > 1`. Join them with `and`.',
          'Each value’s differing bits are `v ^ first`.',
          '`len(base[key]) == 1 and len(action[key]) > 1`, and `mask | (v ^ first)`.',
        ],
        solution: `def diff(base, action):
    """(id, byte) keys that were
    constant in base but take more
    than one value in action."""
    found = []
    for key in action:
        steady = len(base[key]) == 1
        moves = len(action[key]) > 1
        if steady and moves:
            found.append(key)
    return sorted(found)

def flipped_bits(values):
    """Bits that differ between the
    values, as one mask."""
    values = list(values)
    first = values[0]
    mask = 0
    for v in values:
        mask = mask | (v ^ first)
    return mask

for key in diff(idle, brake):
    m = flipped_bits(brake[key])
    print(hex(key[0]), "byte", key[1],
          "bits", bin(m))
`,
      } },
    { tag: 'how', title: 'Reading the result', visualFirst: true,
      visual: { type: 'bitfield', signal: 'BpedDrvAppl_D_Actl', data: '2000000000000000' },
      body: [
        '**0x165 byte 0, bits 5–4** = `BpedDrvAppl_D_Actl`, a 2-bit state: **1 = Driver_Not_Braking, 2 = Driver_Braking**. 0 and 3 are “Not_Allowed”.',
        'Why not just 0/1? A likely reason: a field stuck all-low reads 0 and stuck all-high reads 3, and **both are invalid**, so a fault can’t pass for a real “not braking”.',
        '**0x3C3 byte 1, bit 0** = `StopLghtOn_B_Stat`: the brake lamps are lit. Driver input vs lamp output again, like the turn signal.',
        'Signal names and value tables: community DBC (openpilot), not Ford. The captures are simulated.',
      ] },
    { tag: 'why', title: 'Why real diffs are messier',
      body: [
        'A real car is never perfectly still: the cooling fan cycles, the A/C compressor kicks in, the battery charge changes, clocks tick. Each can look like a “difference”.',
        'Fixes: keep both captures short and back to back, do the action **several times at known moments**, and check the suspect lines up with every one.',
        'Our simulator replays identical noise in both captures, which is why the diff comes out perfectly clean. Real data won’t be this kind.',
      ] },
  ],
  quiz: [
    { type: 'tap', q: 'Which part’s position does `BpedDrvAppl_D_Actl` report? Tap it.', visual: { type: 'parts', drawing: 'brakes' }, answer: 'pedal',
      why: '“Bped…DrvAppl” = brake pedal, driver applied. It reports whether the driver is pressing the pedal, not brake pressure at the wheels.',
      wrong: { master: 'The master cylinder makes the pressure; this signal is about the driver pressing the pedal.', caliper: 'That’s where the clamping happens, far downstream of the pedal switch.' } },
    { type: 'num', q: 'A byte reads **0x10** in one frame and **0x20** in the next. How many bits flipped?', answer: 2, tol: 0,
      hint: '0x10 ^ 0x20 = 0x30. Count the 1s in its binary form.', why: '0x10 = 0001 0000, 0x20 = 0010 0000. XOR = 0011 0000: **two** bits (5 and 4), one 2-bit field going from 1 to 2.' },
    { type: 'mc', q: 'Why might Ford encode “not braking / braking” as **1 and 2** instead of 0 and 1?',
      options: ['To save bandwidth', 'So stuck-at-0 or stuck-at-1 faults read as invalid values', 'Because CAN can’t send 0', 'It’s random'], answer: 1,
      why: 'With 1 and 2 as the valid states, 0 (all bits low) and 3 (all bits high) mean something is wrong. A safety-relevant signal shouldn’t look valid when a wire fails.' },
    { type: 'mc', q: 'Your real-car diff flags 12 bytes, but you only pressed the brake. Best next step?',
      options: ['Assume all 12 are the brake', 'Repeat the brake at known times and keep only bytes that follow every press', 'Diff against a different car', 'Delete the baseline'], answer: 1,
      why: 'Real cars have background changes (fans, A/C, clocks). A byte that moves with every press, and only then, is your signal.' },
  ],
  cards: [
    { id: 'diff', front: 'What does diffing two captures find?', back: 'Bytes constant in the baseline that change in the action capture.' },
    { id: 'xor', front: 'How do you find which bits differ between two bytes?', back: 'XOR them: `a ^ b`. The 1s are the differing bits.' },
    { id: 'brake', front: 'Brake pedal on the Ford bus (community DBC)?', back: '0x165 byte 0 bits 5–4 `BpedDrvAppl_D_Actl`: 1 = not braking, 2 = braking.' },
    { id: 'invalid', front: 'Why use 1/2 for a two-state signal?', back: '0 and 3 become invalid, so stuck wires can’t look like a valid state.' },
    { id: 'messy', front: 'Why are real diffs noisier than simulated ones?', back: 'Fans, A/C, charging, clocks: the car keeps changing. Repeat the action at known times.' },
  ],
};
