// DBC files
const HELPER = `def motorola(data, start, length):
    """Raw value of a Motorola (big-endian)
    DBC signal: start bit = MSB."""
    value = int.from_bytes(data, "big")
    msb = (start // 8) * 8 + (7 - start % 8)
    shift = len(data) * 8 - msb - length
    return (value >> shift) & ((1 << length) - 1)
`;

export default {
  steps: [
    { tag: 'metaphor', title: 'The legend on the map',
      body: [
        'A CAN log is a map with no legend: thousands of hex bytes, no labels.',
        'A [[dbc-file]] is the **legend**: for each ID, which bits are which signal, how to scale them, and what the values mean.',
        'With the right DBC, `415#0FA0…` stops being noise and becomes “**speed 40.00 km/h, quality OK**”.',
      ] },
    { tag: 'how', title: 'What’s inside a DBC',
      body: [
        'A plain-text format that started with Vector’s CANdb tools and became the industry’s de facto standard.',
        '`BO_` = a message: `BO_ 1045 BrakeSysFeatures: 8 ABS_ESC` → ID **in decimal** (1045 = `0x415`), name, 8 bytes, sending module.',
        '`SG_` lines under it = its signals. `VAL_` = names for values. `BA_` = attributes, e.g. `BA_ "GenMsgCycleTime" BO_ 1045 20;` (sent every 20 ms).',
        '`VAL_ 1045 VehVActlBrk_D_Qf 3 "OK" 2 "Not_Within_Specifications" 1 "No_Data_Exists" 0 "Faulty";` is where the quality-flag names come from.',
      ] },
    { tag: 'see', title: 'Reading one SG_ line', visualFirst: true,
      visual: { type: 'bitfield', signal: 'Veh_V_ActlBrk' },
      body: [
        '`SG_ Veh_V_ActlBrk : 7|16@0+ (0.01,0) [0|655.35] "kph" TCCM,…,GWM`',
        '`7|16` start bit 7, 16 bits · `@0` Motorola · `+` unsigned · `(0.01,0)` scale, offset.',
        '`[0|655.35]` min and max physical value · `"kph"` unit · then the **receivers** (modules that listen).',
        'Everything from the last four lessons, in one line.',
      ] },
    { tag: 'how', title: 'Where DBCs come from',
      body: [
        'Car makers keep their own DBCs private. [[opendbc]] (by comma.ai, MIT license) is an open-source collection, mostly **reverse-engineered** by the community.',
        'The app’s Ford data comes from opendbc’s `ford_lincoln_base_pt.dbc`: openpilot’s community work, **not a Ford document**. All of its signals are Motorola and unsigned.',
        'Real tools: the Python library **cantools** loads a DBC (`cantools.database.load_file(...)`) and `db.decode_message(id, data)` returns a dict of signals. **python-can** reads interfaces and log files.',
        'The app’s Python has only the standard library, so you’ll build a mini decoder yourself, which is the best way to understand what those tools do.',
      ] },
    { tag: 'see', title: 'What your decoder will produce',
      visual: { type: 'sigplot', scenario: 'drive', id: 0x415, start: 7, length: 16, endian: 'big' },
      body: [
        '**Simulated** 30-second drive (made-up values): pull away, cruise at about 40 mph, brake to a stop.',
        'Your code will turn the raw log into this curve’s numbers: a list of `(time, km/h)` points.',
      ] },
    { tag: 'code', title: 'Capstone: decode a drive log',
      body: [
        '`drive.log` is the whole **simulated** drive: 10 different IDs mixed together. Keep only `0x415` and decode its speed.',
        '`motorola(data, start, length)` is loaded for you (or reuse your own two-byte version from Endianness).',
        '`"(0.002000)".strip("()")` removes the brackets from both ends. `continue` skips straight to the next line.',
      ],
      code: {
        id: 'decode-06-log',
        prompt: 'Finish `decode_log(path)` so it returns a list of `(time, kph)` tuples for every `0x415` frame.',
        setup: HELPER,
        files: { 'drive.log': 'sim:drive' },
        starter: `def decode_log(path):
    """Speed points for ID 0x415."""
    points = []
    for line in open(path):
        parts = line.split()
        # '(0.002000)' → 0.002
        t = float(___)
        frame = parts[2]
        id_hex, data_hex = frame.split("#")
        # skip every other ID
        if int(id_hex, 16) != ___:
            continue
        data = bytes.fromhex(data_hex)
        # Veh_V_ActlBrk 7|16@0+ (0.01,0)
        kph = ___
        points.append((t, kph))
    return points

points = decode_log("drive.log")
fastest = 0
for t, kph in points:
    if kph > fastest:
        fastest = kph
print(len(points), "speed frames")
print(f"top speed {fastest:.2f} km/h")
`,
        tests: [
          { name: 'Keeps only ID 0x415: 1,500 frames (30 s × 50 per second)', code: 'p = decode_log("drive.log")\nassert len(p) == 1500, f"got {len(p)} points; are other IDs sneaking in?"' },
          { name: 'Times are numbers in seconds (first frame at 0.002 s)', code: 'p = decode_log("drive.log")\nt0 = p[0][0]\nassert isinstance(t0, float) and abs(t0 - 0.002) < 1e-9, f"first time is {t0!r}"' },
          { name: 'Starts and ends at 0 km/h (parked, then stopped)', code: 'p = decode_log("drive.log")\nassert p[0][1] == 0 and p[-1][1] == 0, f"first {p[0][1]!r}, last {p[-1][1]!r}"' },
          { name: 'Top speed ≈ 64.26 km/h (≈ 39.9 mph), reached at ≈ 20 s', code: 'p = decode_log("drive.log")\nt, v = max(p, key=lambda x: x[1])\nassert abs(v - 64.26) < 0.01, f"top speed {v!r}; check the bits and the 0.01 scale"\nassert abs(t - 19.98) < 0.05, f"top speed at {t!r} s"' },
        ],
        hints: [
          'Time: take `parts[0]` and strip the brackets: `parts[0].strip("()")`.',
          'The ID to keep is `0x415`. Speed is the raw value of `7|16` times 0.01.',
          '`t = float(parts[0].strip("()"))`, `!= 0x415`, `kph = motorola(data, 7, 16) * 0.01`',
        ],
        solution: `def decode_log(path):
    """Speed points for ID 0x415."""
    points = []
    for line in open(path):
        parts = line.split()
        t = float(parts[0].strip("()"))
        frame = parts[2]
        id_hex, data_hex = frame.split("#")
        if int(id_hex, 16) != 0x415:
            continue
        data = bytes.fromhex(data_hex)
        # 7|16@0+ (0.01,0) → km/h
        kph = motorola(data, 7, 16) * 0.01
        points.append((t, kph))
    return points

points = decode_log("drive.log")
fastest = 0
for t, kph in points:
    if kph > fastest:
        fastest = kph
print(len(points), "speed frames")
print(f"top speed {fastest:.2f} km/h")
`,
      } },
    { tag: 'bronco', title: 'From simulation to your truck',
      body: [
        'Same DBC, same code idea as openpilot on a Bronco Sport (listed as supported for 2021–24). Only the data source changes.',
        'Caveat: openpilot listens at the windshield camera. At the OBD port a [[gateway]] decides what you see, so a real capture may look different.',
        'The app will only ever **read** from a car. Decoding is listening; nothing here sends a frame.',
      ],
      facts: ['bronco.openpilotListing'] },
  ],
  quiz: [
    { type: 'order', q: 'Put the parts of an `SG_` line in order.',
      items: ['Signal name', '`start|length`', '`@` byte order + sign', '`(scale,offset)`', '`[min|max]`', '`"unit"`', 'Receivers'],
      why: '`SG_ Veh_V_ActlBrk : 7|16@0+ (0.01,0) [0|655.35] "kph" TCCM,…` reads left to right in exactly this order.' },
    { type: 'mc', q: '`BO_ 1045 BrakeSysFeatures: 8 ABS_ESC`: what is `1045`?', options: ['The ID in decimal (0x415)', 'The ID in hex', 'The cycle time in ms', 'The number of signals'], answer: 0,
      why: 'DBC files write IDs in decimal. 1045 = 4 × 256 + 1 × 16 + 5 = `0x415`. The `8` is the length in bytes; `ABS_ESC` the sender.' },
    { type: 'mc', q: 'Where does the app’s Ford DBC data come from?', options: ['Ford’s official engineering documents', 'openpilot’s opendbc project, reverse-engineered by the community', 'The OBD-II standard', 'It was guessed for the simulator'], answer: 1,
      why: 'It’s generated from opendbc’s `ford_lincoln_base_pt.dbc` (MIT license). Treat it as community knowledge, not a Ford spec.' },
  ],
  cards: [
    { id: 'dbc', front: 'What is a DBC file?', back: 'A text database describing each CAN message (`BO_`) and its signals (`SG_`): bits, byte order, scaling, units, value names.' },
    { id: 'bo', front: 'Read `BO_ 1045 BrakeSysFeatures: 8 ABS_ESC`.', back: 'ID 1045 decimal (`0x415`), name, 8 data bytes, sent by ABS_ESC.' },
    { id: 'sg', front: 'Read `7|16@0+ (0.01,0)`.', back: 'Start bit 7, 16 bits, Motorola, unsigned, × 0.01 + 0.' },
    { id: 'opendbc', front: 'What is opendbc?', back: 'comma.ai’s open-source collection of mostly community-reverse-engineered DBC files (used by openpilot).' },
    { id: 'cantools', front: 'Python library that decodes CAN with a DBC?', back: '**cantools**: `load_file(...)`, then `db.decode_message(id, data)`.' },
  ],
};
