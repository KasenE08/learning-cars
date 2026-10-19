// Text, hex & bytes
export default {
  steps: [
    { tag: 'metaphor', title: 'Hex is shorthand for switches',
      body: [
        'A [[byte]] is a row of 8 on/off switches ([[bit|bits]]). Writing all 8 as 1s and 0s is tiring.',
        '[[hex]] is shorthand: **one hex digit = exactly 4 switches**, so **two hex digits = one byte**. `A0` means `1010 0000`.',
        'That’s why every CAN tool prints data in hex: each pair of characters is one byte, no math needed to see where bytes start.',
      ] },
    { tag: 'how', title: 'Hex in Python',
      body: [
        'Hex digits run `0–9` then `A–F` (10–15). `0x` marks a hex number in code: `0x415` is the same int as `1045`.',
        'Text → number: `int("0FA0", 16)` → `4000` (the `16` says “read this as base 16”).',
        'Number → text: `hex(4000)` → `"0xfa0"`; for CAN-style output use `f"{4000:04X}"` → `"0FA0"`.',
        '`int("0FA0")` without the 16 is a **ValueError**: `F` and `A` aren’t decimal digits.',
      ] },
    { tag: 'see', title: 'Bytes changing in a log', visualFirst: true,
      visual: { type: 'candump', scenario: 'drive', ids: [0x415], highlight: true },
      body: [
        '**Simulated** frames of ID `0x415` (made-up values, real layout from the community Ford DBC in the open-source openpilot project, not from Ford).',
        'The first two bytes climb and fall with speed; the third and fourth change every frame (a counter and a check value; Decoding Signals explains both).',
      ] },
    { tag: 'code', title: 'Hex text to a number',
      body: [
        'The first two bytes of the frame above, `0FA0`, are the raw speed. Turn that text into a number.',
      ],
      code: {
        id: 'python-03-hex',
        prompt: 'Finish `hex_to_int(text)` so `hex_to_int("0FA0")` returns `4000`.',
        starter: `def hex_to_int(text):
    # read the text as base 16
    return int(text, ___)

raw = hex_to_int("0FA0")
print(raw)
`,
        tests: [
          { name: '"0FA0" becomes 4000', code: 'v = hex_to_int("0FA0")\nassert v == 4000, f"got {v!r}"' },
          { name: '"FF" becomes 255 (the biggest byte)', code: 'v = hex_to_int("FF")\nassert v == 255, f"got {v!r}"' },
          { name: 'The ID "415" becomes 1045', code: 'v = hex_to_int("415")\nassert v == 1045, f"got {v!r}"' },
        ],
        hints: [
          '`int()` takes a second value: the base.',
          'Hex is base 16.',
          '`return int(text, 16)`',
        ],
        solution: `def hex_to_int(text):
    # base 16 = hex
    return int(text, 16)

raw = hex_to_int("0FA0")
print(raw)  # 4000
`,
      } },
    { tag: 'how', title: 'Splitting text & the bytes type',
      body: [
        '`line.split()` cuts text at spaces → a list: `"(0.02) can0 415#0FA0".split()` → `["(0.02)", "can0", "415#0FA0"]`.',
        '`"415#0FA0".split("#")` cuts at `#` → `["415", "0FA0"]`. `a, b = ...` unpacks the two pieces into two variables.',
        '`bytes.fromhex("0FA0C04D")` → a **bytes** object of 4 bytes. `data[0]` is an **int** (`15`); `len(data)` is 4.',
        'Gotcha: Python prints bytes that happen to be letters as letters. `0x4D` shows as `M` in `b\'\\x0f\\xa0\\xc0M\'`, but it’s still the number 77. `list(data)` shows the plain numbers.',
      ] },
    { tag: 'code', title: 'Parse a candump line',
      body: [
        'The format: `(time) interface ID#DATA`, all IDs and data in hex. This frame says 40.00 km/h (24.9 mph).',
        'Return two things at once with `return a, b` (a **tuple**).',
      ],
      code: {
        id: 'python-03-parse',
        prompt: 'Finish `parse_line(line)` so it returns `(can_id, data)`: the ID as an int and the data as bytes.',
        starter: `LINE = "(0.020000) can0 415#0FA0C04D00000000"

def parse_line(line):
    # → ['(0.020000)', 'can0', '415#0F…']
    parts = line.split()
    frame = parts[2]
    # '415#0FA0…' → '415' and '0FA0…'
    id_text, data_text = frame.split("#")
    # hex text → int
    can_id = ___
    # hex text → bytes
    data = ___
    return can_id, data

print(parse_line(LINE))
`,
        tests: [
          { name: 'Reads the ID 415 as the number 0x415 (1045)', code: 'cid, d = parse_line(LINE)\nassert cid == 0x415, f"got {cid!r}"' },
          { name: 'Data comes back as bytes, not text', code: 'cid, d = parse_line(LINE)\nassert isinstance(d, bytes), f"data is {type(d).__name__}; try bytes.fromhex()"' },
          { name: 'All 8 data bytes, starting 0x0F 0xA0', code: 'cid, d = parse_line(LINE)\nassert len(d) == 8 and d[0] == 0x0F and d[1] == 0xA0, f"got {list(d)!r}"' },
          { name: 'Works on another line (steering ID 07E)', code: 'cid, d = parse_line("(1.000000) can0 07E#00003E803E0C0000")\nassert cid == 0x7E and d[2] == 0x3E, f"got {cid!r}, {list(d)!r}"' },
        ],
        hints: [
          'You already wrote the ID part last exercise: hex text → int needs base 16.',
          'For the data: `bytes.fromhex(...)` turns hex text into bytes.',
          '`can_id = int(id_text, 16)` and `data = bytes.fromhex(data_text)`',
        ],
        solution: `LINE = "(0.020000) can0 415#0FA0C04D00000000"

def parse_line(line):
    parts = line.split()
    frame = parts[2]
    id_text, data_text = frame.split("#")
    can_id = int(id_text, 16)
    data = bytes.fromhex(data_text)
    return can_id, data

print(parse_line(LINE))
`,
      } },
    { tag: 'key', title: 'Two conversions to remember',
      body: [
        '**ID:** `int(id_text, 16)` → one number you can compare: `if can_id == 0x415:`.',
        '**Data:** `bytes.fromhex(data_text)` → 8 small ints (0–255) you can index: `data[0]`, `data[1]`…',
        'Next: signals don’t always fill whole bytes, so you need to reach inside a byte for single bits.',
      ] },
  ],
  quiz: [
    { type: 'num', q: 'What is `int("FF", 16)`?', answer: 255, tol: 0,
      why: 'F = 15, so FF = 15 × 16 + 15 = **255**, the largest value one byte can hold.' },
    { type: 'mc', q: 'With `data = bytes.fromhex("0FA0")`, what is `data[1]`?', options: ['`"A0"`', '`160`', '`15`', '`b"\\xa0"`'], answer: 1,
      why: 'Indexing bytes gives a plain int. Byte 1 is `0xA0` = 10 × 16 = **160**.',
      wrong: { 0: 'That’s the text before conversion. After `bytes.fromhex` each byte is a number.', 2: '15 (`0x0F`) is `data[0]`, the first byte.', 3: 'A single index gives an int; slicing (`data[1:2]`) would give bytes.' } },
    { type: 'order', q: 'Order the steps to get ID and data from `(0.02) can0 415#0FA0…`.',
      items: ['Split the line at spaces', 'Take the third piece (`415#0FA0…`)', 'Split that at `#`', 'Convert the ID with `int(…, 16)`', 'Convert the data with `bytes.fromhex(…)`'],
      why: 'Cut the line apart first, then convert each piece of hex text into the type you need.' },
    { type: 'num', q: 'How many bytes are in the data `0FA0C04D00000000`?', answer: 8, tol: 0,
      why: '16 hex characters ÷ 2 characters per byte = **8 bytes**, the maximum for a classic CAN frame.' },
    { type: 'mc', q: 'Why does `print(bytes.fromhex("4D"))` show `b\'M\'`?', options: ['The data is corrupted', '0x4D happens to be the code for the letter M; it’s still the number 77', 'bytes.fromhex reads text, not hex', 'M is hex for 77'], answer: 1,
      why: 'Python displays printable byte values as ASCII characters. `list(...)` or `data[0]` shows the number.' },
  ],
  cards: [
    { id: 'hexdigit', front: 'How many bits is one hex digit? A byte?', back: '1 hex digit = 4 bits. 2 hex digits = 1 byte (8 bits).' },
    { id: 'int16', front: 'Hex text → int in Python?', back: '`int("0FA0", 16)` → 4000.' },
    { id: 'fromhex', front: 'Hex text → bytes?', back: '`bytes.fromhex("0FA0C04D")`. Indexing it (`data[0]`) gives ints 0–255.' },
    { id: 'split', front: 'What does `"415#0FA0".split("#")` return?', back: '`["415", "0FA0"]`: a list of the pieces.' },
    { id: 'format', front: 'Print 4000 as 4-digit uppercase hex?', back: '`f"{4000:04X}"` → `"0FA0"`.' },
  ],
};
