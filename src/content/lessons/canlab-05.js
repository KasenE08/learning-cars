// Analyze a capture in Python
const SETUP = `def motorola(data, start, length):
    """Raw value of a Motorola (big-endian)
    signal: start bit = MSB."""
    value = int.from_bytes(data, "big")
    msb = (start // 8) * 8 + (7 - start % 8)
    shift = len(data) * 8 - msb - length
    return (value >> shift) & ((1 << length) - 1)

def parse_line(line):
    ts, iface, frame = line.split()
    id_hex, data_hex = frame.split("#")
    t = float(ts.strip("()"))
    return t, int(id_hex, 16), bytes.fromhex(data_hex)

frames = [parse_line(l)
          for l in open("drive.log")]
`;

export default {
  steps: [
    { tag: 'metaphor', title: 'Two witnesses, one story',
      body: [
        'A detective trusts a fact more when **two independent witnesses** agree. If the tire tracks and the gas receipt both say the car was across town, the alibi holds.',
        'A car bus has independent witnesses too: the ABS module reports **wheel speeds**, and it also reports a **vehicle speed**. They’re computed differently.',
        'If you decode the wheels yourself and the number lands on the car’s own speed signal, your decode is almost certainly right.',
      ] },
    { tag: 'how', title: 'The plan',
      body: [
        'ID **0x217** (`WheelSpeed`, sender `ABS_ESC`) packs **four 15-bit** values: FL, FR, RL, RR, each **0.01 rad/s** per step, Motorola order. Starts: 6, 22, 38, 54.',
        'A wheel turning at ω rad/s on a tire of radius r rolls at **v = ω × r** (m/s). Average the four wheels, multiply by r, and you have road speed.',
        'Tire ≈ 28.5 in diameter → **r ≈ 0.362 m**. Then km/h = m/s × 3.6.',
        'The capture is a **full-mode** log, so both 0x217 and the speed message 0x415 are in it. Decode one, check against the other.',
      ] },
    { tag: 'see', title: 'Watch the four wheels', visualFirst: true,
      visual: { type: 'canbench', controls: ['pedals', 'shifter'], ids: [0x217], view: 'decode' },
      body: [
        '**Simulated.** Hold BRAKE, pick D, hold GAS: the four `Whl*_W_Meas` values climb together.',
        'Driving straight, all four match. In a turn the outside wheels would read faster, which is exactly how the differential and ABS see a corner.',
        'Decode view uses the community DBC: it names and scales the signals for you. Your Python will do the same by hand.',
      ] },
    { tag: 'see', title: 'One wheel, 15 bits', visualFirst: true,
      visual: { type: 'bitfield', signal: 'WhlFl_W_Meas' },
      body: [
        '`WhlFl_W_Meas`: start bit 6, **15 bits**, Motorola, 0.01 rad/s per step.',
        'Four of these tile the 8-byte frame (15 bits each = 60 bits, plus a little slack). The grid shows FL’s bits; the others follow at 22, 38, 54.',
      ] },
    { tag: 'code', title: 'Decode the wheels, check the speed',
      body: [
        '`motorola`, `parse_line` and `frames` (the whole drive) are loaded. `drive.log` is a **simulated** full-mode capture with only 0x217 and 0x415.',
        'Decode the four wheel speeds, average them, and find the top road speed. The test confirms it lands on the car’s own speed signal.',
      ],
      code: {
        id: 'canlab-05-wheels',
        prompt: 'Finish `wheel_speeds(data)` and the loop that fills `top_kph`.',
        setup: SETUP,
        files: { 'drive.log': 'sim:drive?full&ids=217,415' },
        starter: `TIRE_R = 0.362  # metres (28.5 in)

def wheel_speeds(data):
    """[FL, FR, RL, RR] in rad/s."""
    starts = (6, 22, 38, 54)
    # 15 bits each, 0.01 rad/s/step
    return [motorola(data, s, 15) * ___
            for s in starts]

top_kph = 0
for t, cid, data in frames:
    # only the wheel-speed message
    if cid != ___:
        continue
    ws = wheel_speeds(data)
    avg = sum(ws) / 4
    # rad/s → m/s → km/h
    kph = avg * TIRE_R * ___
    if kph > top_kph:
        top_kph = kph

print(f"top speed {top_kph:.2f} km/h")
`,
        tests: [
          { name: 'Decodes four wheel speeds (FL first, start bit 6)', code: 'd = next(data for t, c, data in frames if c == 0x217 and any(data))\nws = wheel_speeds(d)\nassert len(ws) == 4, f"got {ws!r}"\nassert abs(ws[0] - motorola(d, 6, 15) * 0.01) < 1e-9, f"FL is {ws[0]!r}"' },
          { name: 'Parked wheels read 0 rad/s', code: 'd0 = next(data for t, c, data in frames if c == 0x217)\nassert wheel_speeds(d0) == [0, 0, 0, 0], f"got {wheel_speeds(d0)!r}"' },
          { name: 'Driving straight, all four wheels agree', code: 'd = max((data for t, c, data in frames if c == 0x217), key=lambda x: sum(wheel_speeds(x)))\nws = wheel_speeds(d)\nassert max(ws) - min(ws) < 1e-6, f"wheels differ: {ws!r}"' },
          { name: 'Top speed from the wheels ≈ 64.3 km/h', code: 'assert abs(top_kph - 64.27) < 0.3, f"got {top_kph!r}; check the 0.01 scale, the ID and the ×3.6"' },
          { name: 'And it matches the car’s own speed signal (0x415)', code: 'pk = max(motorola(data, 7, 16) * 0.01 for t, c, data in frames if c == 0x415)\nassert abs(top_kph - pk) < 0.5, f"wheels say {top_kph:.2f}, speed signal says {pk:.2f}"' },
        ],
        hints: [
          'The scale is 0.01 rad/s per step; the ID to keep is `0x217`.',
          'rad/s → m/s is × TIRE_R; m/s → km/h is × 3.6.',
          '`motorola(data, s, 15) * 0.01`, `if cid != 0x217:`, and `kph = avg * TIRE_R * 3.6`.',
        ],
        solution: `TIRE_R = 0.362  # metres (28.5 in)

def wheel_speeds(data):
    """[FL, FR, RL, RR] in rad/s."""
    starts = (6, 22, 38, 54)
    return [motorola(data, s, 15) * 0.01
            for s in starts]

top_kph = 0
for t, cid, data in frames:
    if cid != 0x217:
        continue
    ws = wheel_speeds(data)
    avg = sum(ws) / 4
    # rad/s → m/s → km/h
    kph = avg * TIRE_R * 3.6
    if kph > top_kph:
        top_kph = kph

print(f"top speed {top_kph:.2f} km/h")
`,
      } },
    { tag: 'why', title: 'What you just proved',
      body: [
        'Two signals from the same module, computed from different sensors, agreed. That’s strong evidence your bits, scale and byte order are right.',
        'The tiny gap (wheels ≈ 64.27, speed signal ≈ 64.26 km/h) is rounding and the rough tire radius, **not** a decode error. Real data would differ a bit more.',
        '**Turn direction** is the same idea: left wheels minus right wheels. A steady positive difference means the left wheels (outside) are faster: a right turn. The simulated *drive* is straight, so here the difference is zero.',
        'Everything is **simulated**, and the layouts are community-reverse-engineered (openpilot), not from Ford.',
      ] },
    { tag: 'bronco', title: 'Why this is honest work',
      body: [
        'On a real Bronco Sport the ABS module really does broadcast these four wheel speeds (openpilot reads 0x217 at the camera). The method is identical; only the numbers are real.',
        'Cross-checking signals is how you catch a wrong tire size, a mislabeled signal, or an off-by-one bit, without ever touching the car.',
        'Decoding is listening. Nothing here transmits, and the app’s real-car link will stay read-only.',
      ],
      facts: ['bronco.openpilotListing'] },
  ],
  quiz: [
    { type: 'mc', q: 'Why check your decoded wheel speed against the 0x415 speed signal?',
      options: ['To save bandwidth', 'Two independent signals agreeing is strong evidence the decode is right', 'Because 0x217 is fake', '0x415 is the only real one'], answer: 1,
      why: 'They come from different sensors/computation. If your hand-decode lands on the car’s own speed, your bits, scale and byte order are almost certainly correct.' },
    { type: 'mc', q: 'In a steady **right** turn, which wheels read faster on 0x217?',
      options: ['The right (inside) wheels', 'The left (outside) wheels', 'All four equally', 'The rear wheels only'], answer: 1,
      why: 'The outside wheels travel a longer arc, so they spin faster. In a right turn the outside is the left side. The difference is how ABS and the differential sense a corner.',
      wrong: { 0: 'The inside wheels travel the shorter arc and read slower.', 2: 'Equal speeds mean straight-line driving.' } },
    { type: 'tap', q: 'The four values in 0x217 come from sensors located where? Tap them on the Bronco.',
      visual: { type: 'parts', drawing: 'car-top' }, answer: 'wheels',
      why: 'A wheel-speed sensor at each wheel reads a toothed ring on the hub and feeds the ABS module, which broadcasts all four on 0x217.',
      wrong: { brakes: 'The brakes act on the wheels, but the speed sensors read the hubs; this message is speed, not brake pressure.', pcm: 'The engine computer sends its own speed estimate (0x202); the four wheel speeds come from the ABS module’s sensors.' } },
  ],
  cards: [
    { id: 'id217', front: 'What does 0x217 carry (community DBC)?', back: 'Four wheel speeds (FL, FR, RL, RR), 15 bits each, 0.01 rad/s per step, from ABS_ESC.' },
    { id: 'rolling', front: 'Wheel angular speed → road speed?', back: 'v = ω × r. With r ≈ 0.362 m (28.5 in tire), km/h = ω × r × 3.6.' },
    { id: 'cross', front: 'How do you gain confidence in a decode?', back: 'Cross-check against an independent signal (wheels vs the 0x415 speed signal).' },
    { id: 'turn', front: 'Reading turn direction from wheel speeds?', back: 'Left minus right: outside wheels are faster, so left-faster = right turn.' },
  ],
};
