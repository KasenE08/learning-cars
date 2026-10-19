// Sniffing traffic
const PARSE = `def parse_line(line):
    """(t, can_id, data) from one
    candump line."""
    ts, iface, frame = line.split()
    id_hex, data_hex = frame.split("#")
    t = float(ts.strip("()"))
    cid = int(id_hex, 16)
    data = bytes.fromhex(data_hex)
    return t, cid, data
`;

export default {
  steps: [
    { tag: 'metaphor', title: 'A train station departure board',
      body: [
        'Some trains leave **every 10 minutes like clockwork**. Others only run **when something happens**: a special event, a charter.',
        'A car bus is the same. Most messages are [[periodic-message|periodic]]: sent on a fixed timer whether or not anything changed. A few are [[event-message|event-driven]].',
        '[[sniffing|Sniffing]] starts there: before decoding anything, read the timetable: which IDs, how often, how busy.',
      ] },
    { tag: 'how', title: 'Why most messages repeat',
      body: [
        'A periodic sender says “I’m alive and here’s the latest value” every cycle. If frames stop, receivers notice a **timeout** and fall back to a safe state.',
        'Fast-changing, safety-related data (speed, steering, pedal, rpm) is typically sent every **10–20 ms**. Slow status (doors, lamps) every **100 ms or more**.',
        'Event messages appear only on a change (or a request, like a diagnostic reply). In a capture they’re the IDs with **no steady rate**.',
        'Many periodic messages also carry a [[rolling-counter]] so a receiver can tell a fresh frame from a stuck or repeated one.',
      ] },
    { tag: 'see', title: 'Read the timetable', visualFirst: true,
      visual: { type: 'candump', scenario: 'drive', highlight: true },
      body: [
        'Switch to **Table view**: count and rate per ID. Note the groups: some at 50 Hz, some at 20, 10 or 5.',
        'These rates are the **simulator’s guesses**, not measured from a real Bronco Sport.',
      ] },
    { tag: 'math', title: 'How busy is the bus?',
      body: [
        '[[bus-load]] = bits on the wire per second ÷ bit rate.',
        'One classic frame with an 11-bit ID and 8 data bytes is **111 bits** (108 + 3-bit gap between frames) before [[bit-stuffing|stuff bits]], up to ≈135 with them.',
        'The simulated drive: **9,452 frames in 30 s** ≈ 315 frames/s × ≈111–135 bits ≈ 35–43 kbit/s. On a 500 kbit/s bus that’s about **7–9%**.',
        'A real car carries many more IDs than our 10, so real loads are far higher. Designers keep headroom so high-priority frames never wait too long.',
      ] },
    { tag: 'code', title: 'Count frames and rates per ID',
      body: [
        'Tally every frame by ID, then divide by the log’s length to get each rate in Hz. `parse_line` is ready for you; this version also returns the timestamp.',
        'The log is the **simulated** 30 s drive.',
      ],
      code: {
        id: 're-02-rates',
        prompt: 'Fill in the two blanks: count frames per ID in `counts`, then turn counts into rounded rates (Hz) in `rates`.',
        setup: PARSE,
        files: { 'drive.log': 'sim:drive' },
        starter: `counts = {}
last_t = 0.0

for line in open("drive.log"):
    t, can_id, data = parse_line(line)
    last_t = t
    # add 1 to this ID's tally
    # (.get gives 0 the first time)
    counts[can_id] = ___

rates = {}
for can_id, n in counts.items():
    # frames ÷ seconds, rounded
    rates[can_id] = ___

for can_id in sorted(counts):
    print(hex(can_id), counts[can_id],
          rates[can_id], "Hz")
`,
        tests: [
          { name: 'Finds all 10 IDs in the log', code: 'assert len(counts) == 10, f"got {len(counts)} IDs"' },
          { name: 'Counts 1,500 frames of 0x415 (speed)', code: 'n = counts.get(0x415)\nassert n == 1500, f"got {n!r}"' },
          { name: '0x415 comes out at 50 Hz', code: 'r = rates.get(0x415)\nassert r == 50, f"got {r!r}"' },
          { name: 'The lamp message 0x3C3 is a slow 5 Hz', code: 'r = rates.get(0x3C3)\nassert r == 5, f"got {r!r}"' },
        ],
        hints: [
          '`counts.get(can_id, 0)` is the tally so far (0 if this ID is new). Add 1 to it.',
          'The log starts at 0 s, so `last_t` (the final timestamp) is its length in seconds.',
          '`counts.get(can_id, 0) + 1` and `round(n / last_t)`.',
        ],
        solution: `counts = {}
last_t = 0.0

for line in open("drive.log"):
    t, can_id, data = parse_line(line)
    last_t = t
    # tally so far (0 if new) + 1
    n = counts.get(can_id, 0)
    counts[can_id] = n + 1

rates = {}
for can_id, n in counts.items():
    # the log starts at 0 s, so
    # last_t is its length
    rates[can_id] = round(n / last_t)

for can_id in sorted(counts):
    print(hex(can_id), counts[can_id],
          rates[can_id], "Hz")
`,
      } },
    { tag: 'key', title: 'What the rates tell you',
      body: [
        '**50 Hz IDs** (every 20 ms) are the dynamic ones: speed 0x415, pedal/rpm 0x204, steering 0x7E, yaw 0x91. That’s where to hunt for smooth signals.',
        '**5–10 Hz IDs** are status: lamps 0x3C3, body info 0x3B3, turn-switch data 0x83. Hunt there for bits and switches.',
        'Rate = 1 ÷ period: 20 ms → 50 Hz, 100 ms → 10 Hz, 200 ms → 5 Hz.',
        'IDs and names are from the community DBC (openpilot), not Ford; rates are simulated.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'A CAN message’s **period** gets shorter (sent more often). Its rate in **Hz**…', options: ['goes up', 'goes down', 'stays the same', 'drops to zero'], answer: 0,
      why: 'Rate = 1 ÷ period. A 20 ms period is 1 ÷ 0.020 = 50 Hz; halve the period and the rate doubles.' },
    { type: 'mc', q: 'Why do most car messages repeat on a timer even when the value hasn’t changed?',
      options: ['To fill unused bandwidth', 'So receivers can detect a dead or silent sender by timeout', 'Because CAN can’t send events', 'To make reverse engineering easier'], answer: 1,
      why: 'If a periodic frame stops arriving, the receiver knows something is wrong and can go to a safe state. A purely event-driven sender that dies looks exactly like “nothing changed”.' },
    { type: 'mc', q: 'In a capture, an ID shows up only three times, each when you pressed a button. It’s probably…',
      options: ['A periodic message at 0.1 Hz', 'An event-driven message', 'A broken module', 'A checksum'], answer: 1,
      why: 'No steady rate + appears exactly when something happens = event-driven. Diagnostic replies behave the same way: they only appear when asked.' },
  ],
  cards: [
    { id: 'periodic', front: 'Periodic vs event messages?', back: 'Periodic: sent on a timer regardless (most traffic). Event: sent only on a change or request.' },
    { id: 'why-periodic', front: 'Why are safety messages periodic?', back: 'Receivers detect a silent sender by timeout and fall back safely.' },
    { id: 'rate', front: 'Period → rate?', back: 'Rate = 1 ÷ period. 20 ms = 50 Hz, 100 ms = 10 Hz.' },
    { id: 'busload', front: 'Bus load formula?', back: 'Frames/s × bits per frame ÷ bit rate. A full 8-byte standard frame ≈ 111–135 bits.' },
    { id: 'hunt', front: 'Where to hunt for a smooth signal like speed?', back: 'In the fast IDs (≈50 Hz). Slow IDs hold status bits and switches.' },
  ],
};
