// Record, export, import
export default {
  steps: [
    { tag: 'metaphor', title: 'The dashcam for your bus',
      body: [
        'A dashcam doesn’t stop a crash. It just means that **afterward** you can rewind and see exactly what happened.',
        'Recording a capture is the same: you can’t study the bus in real time, 600 frames a second scrolling past. So you **record**, then rewind and study it slowly.',
        'Record a quiet moment, record one action, and now you have two files you can compare, plot, or hand to Python.',
      ] },
    { tag: 'how', title: 'Why you capture',
      body: [
        'A [[capture]] freezes the bus so you can look at it over and over: scrub back and forth, filter to one ID, recompute a [[checksum]], plot a byte.',
        'It makes your work **repeatable**: the same capture gives the same answer, so you (or someone else) can check it.',
        'And it’s **comparable**: a baseline and an action capture side by side is the whole reverse-engineering trick (next lesson).',
        'On the bench, press **Record**, do your one thing, **Stop**, and name it. Each capture is saved so you can replay, export or diff it.',
      ] },
    { tag: 'see', title: 'The log you’ll record', visualFirst: true,
      visual: { type: 'candump', scenario: 'blinker', ids: [0x83, 0x3b3], highlight: true },
      body: [
        '**Simulated** candump log, filtered to the two turn-signal IDs. Each line is one frame.',
        '`(2.000000) can0 083#1000000000000000`: timestamp in **seconds**, interface, hex ID, `#`, data bytes.',
        'The real [[candump]] `-l` option (can-utils) writes exactly this format, to a file named `candump-YYYY-MM-DD_HHMMSS.log`, and quietly turns on listen-only so you don’t ACK the bus.',
      ] },
    { tag: 'how', title: 'Two file formats',
      body: [
        '**candump `-l`** (what the bench exports as `.log`): `(1700000000.123456) can0 415#0FA0C04D00000000`. Timestamp is **seconds.microseconds**; on a real capture it’s the Unix clock, so a big number like 1.7 billion.',
        '**[[savvycan|SavvyCAN]] native CSV** (`.csv`): a header row `Time Stamp,ID,Extended,Dir,Bus,LEN,D1,D2,D3,D4,D5,D6,D7,D8`, then rows like `2000,00000415,false,Rx,0,8,0F,A0,C0,4D,00,00,00,00,`.',
        'Watch the timestamp units: SavvyCAN’s `Time Stamp` is **microseconds** (2000 µs = 0.002 s), candump’s is **seconds**. Mixing them up makes every rate wrong by a million.',
        'The ID in CSV is padded to **8 hex digits** with a separate `Extended` flag; a normal 11-bit ID like `0x415` still prints as `00000415`.',
      ] },
    { tag: 'math', title: 'How big do captures get?',
      body: [
        'Full mode sends **16 IDs**. Add up `1000 ÷ cycle-time` for each: ≈ **617 frames per second** with the key in Run.',
        'A candump line is about **37 bytes**. So one minute ≈ 617 × 60 × 37 ≈ **1.4 MB**. SavvyCAN CSV lines are longer (≈ 55 bytes) → ≈ **2 MB per minute**.',
        'A real car has far more than 16 IDs, so a real 10-minute drive is easily hundreds of MB. That’s why you record **short, aimed** captures, not hours of everything.',
        '~~The bench caps imports at 8 MB and keeps the 10 most recent captures.~~',
      ] },
    { tag: 'code', title: 'Parse a SavvyCAN line',
      body: [
        'Decoding a capture starts with turning one text line into usable pieces. This is the SavvyCAN CSV row, not candump.',
        'Remember: the timestamp is in **microseconds**, so divide by 1,000,000 to get seconds.',
      ],
      code: {
        id: 'canlab-02-csv',
        prompt: 'Finish `parse_csv(line)` so it returns `(t_seconds, can_id, data)`.',
        starter: `LINE = "2000,00000415,false,Rx,0,8,0F,A0,C0,4D,00,00,00,00,"

def parse_csv(line):
    # split the row at commas → a list
    c = line.split(",")
    # c[0] is microseconds as text
    t = int(c[0]) / ___
    # c[1] is the ID in hex
    can_id = int(c[1], ___)
    # c[5] is LEN; data is the next LEN
    n = int(c[5])
    hexes = c[6:6 + n]
    # join "0F","A0",... → "0FA0..."
    data = bytes.fromhex("".join(hexes))
    return t, can_id, data

print(parse_csv(LINE))
`,
        tests: [
          { name: '2000 µs becomes 0.002 seconds', code: 't, cid, d = parse_csv(LINE)\nassert abs(t - 0.002) < 1e-9, f"got {t!r} seconds"' },
          { name: 'ID 00000415 reads as the number 0x415', code: 't, cid, d = parse_csv(LINE)\nassert cid == 0x415, f"got {cid!r}"' },
          { name: 'Keeps exactly LEN bytes, starting 0x0F 0xA0', code: 't, cid, d = parse_csv(LINE)\nassert isinstance(d, bytes) and len(d) == 8 and d[0] == 0x0F and d[1] == 0xA0, f"got {list(d)!r}"' },
          { name: 'Works on a 3-byte frame too', code: 't, cid, d = parse_csv("500,00000083,false,Rx,0,3,10,00,40,00,00,00,00,00,")\nassert len(d) == 3 and d[2] == 0x40, f"got {list(d)!r}"' },
        ],
        hints: [
          'A million is 1_000_000 (underscores are fine in Python numbers).',
          'Hex is base 16: `int(c[1], 16)`.',
          '`t = int(c[0]) / 1_000_000` and `can_id = int(c[1], 16)`.',
        ],
        solution: `LINE = "2000,00000415,false,Rx,0,8,0F,A0,C0,4D,00,00,00,00,"

def parse_csv(line):
    c = line.split(",")
    # microseconds → seconds
    t = int(c[0]) / 1_000_000
    # ID is hex (base 16)
    can_id = int(c[1], 16)
    n = int(c[5])
    hexes = c[6:6 + n]
    data = bytes.fromhex("".join(hexes))
    return t, can_id, data

print(parse_csv(LINE))
`,
      } },
    { tag: 'key', title: 'Where captures live, and Python',
      body: [
        'Captures stay **on this device only** (in the browser’s storage). They can be big, so they are **not** part of the progress backup file: export the ones you want to keep.',
        'Export a capture as `.log` or SavvyCAN `.csv` to open it in real tools, or just leave it saved.',
        'Saved captures also show up in the **Python bench** ([Lab → Python](#/lab/python)) as files you can `open("blinker-test.log")`, so your decoder runs on your own recordings, not just the lesson samples.',
      ] },
  ],
  quiz: [
    { type: 'num', q: 'A SavvyCAN row starts `250000,...`. What time is that in **seconds**?', answer: 0.25, tol: 0.001, unit: 's',
      hint: 'The Time Stamp column is microseconds. 1 s = 1,000,000 µs.', why: '250,000 µs ÷ 1,000,000 = **0.25 s**. Treating it as seconds would be off by a million.' },
    { type: 'mc', q: 'In candump format, what is the `1700000000.123456` in `(1700000000.123456) can0 415#…`?',
      options: ['Microseconds since boot', 'The ID', 'Seconds.microseconds (a Unix timestamp)', 'The checksum'], answer: 2,
      why: 'candump’s absolute timestamp is seconds and microseconds of the real clock; ~1.7 billion seconds is a date in the 2020s.',
      wrong: { 0: 'That number is far too big for microseconds since boot; it’s the wall clock in seconds.', 1: 'The ID is `415`, after the interface name.' } },
    { type: 'num', q: 'At ≈ 617 frames/s and ≈ 37 bytes per candump line, about how many **MB** is one minute? (to the nearest 0.1)', answer: 1.4, tol: 0.2, unit: 'MB',
      why: '617 × 60 × 37 ≈ 1.37 million bytes ≈ **1.4 MB**. Real cars with many more IDs are far larger, so keep captures short and aimed.' },
    { type: 'mc', q: 'Why aren’t captures included in the progress backup file?',
      options: ['They’re secret', 'They’re large and kept on the device only; export the ones you want to keep', 'They’re stored on a server', 'They can’t be exported'], answer: 1,
      why: 'Captures can be megabytes each, so they live in the browser on this device and stay out of the small backup. Export to `.log` / CSV to save or move them.' },
  ],
  cards: [
    { id: 'why', front: 'Why record a capture instead of watching live?', back: 'To study the bus slowly and repeatably, and to compare a baseline against an action.' },
    { id: 'candump', front: 'candump `-l` line format?', back: '`(seconds.micros) can0 ID#DATA`, hex ID and data; real logs use the Unix clock.' },
    { id: 'savvy', front: 'SavvyCAN CSV columns and timestamp unit?', back: '`Time Stamp,ID,Extended,Dir,Bus,LEN,D1..D8`; Time Stamp is in microseconds.' },
    { id: 'size', front: 'Rough size of a full-mode capture?', back: '≈ 617 frames/s × ~37 B ≈ 1.4 MB/min (candump); ~2 MB/min as CSV.' },
    { id: 'where', front: 'Where are captures stored?', back: 'On this device only (browser storage); not in the backup. Export `.log`/CSV to keep them.' },
  ],
};
