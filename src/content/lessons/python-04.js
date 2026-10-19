// Bits: shifts & masks
export default {
  steps: [
    { tag: 'metaphor', title: 'Switches, a stencil and a slide',
      body: [
        'A byte is a row of **8 light switches**. Car modules pack several tiny facts into one byte: a door bit here, a 4-bit counter there.',
        'A [[bitmask]] is a **cardboard stencil** with holes: lay it over the row and you only see the switches under the holes.',
        'A [[bit-shift]] **slides** the whole row left or right, so the switches you want land at the end where they’re easy to read.',
      ] },
    { tag: 'how', title: 'Binary and bit numbers',
      body: [
        'Bits are numbered **from the right**, starting at 0. Bit 0 is worth 1, bit 1 is 2, bit 2 is 4 … bit 7 is 128.',
        '`0b11000100` is binary in code: 128 + 64 + 4 = **196** (`0xC4`). `bin(196)` → `"0b11000100"`; `f"{196:08b}"` → `"11000100"`.',
        'The highest bit is the [[msb-lsb|MSB]] (most significant), bit 0 the **LSB** (least significant).',
        'One hex digit = 4 bits (a [[nibble]]): `0xC4` → `1100` `0100`.',
      ] },
    { tag: 'how', title: 'Shifts: >> and <<',
      body: [
        '`x >> n` slides every bit **right** by n; the bottom n bits fall off. `0b11000100 >> 2` → `0b110001` (49). Same as `x // 2**n`.',
        '`x << n` slides **left**, filling with zeros: `1 << 5` → `0b100000` (32). Same as `x * 2**n`.',
        '`(data[0] << 8) | data[1]` glues two bytes into one 16-bit number. You’ll use that for speed.',
      ] },
    { tag: 'how', title: 'Masks: & and |',
      body: [
        '`a & b` (AND) keeps a 1 only where **both** have a 1. That’s the stencil: `x & 0b1111` keeps just the low 4 bits.',
        '`a | b` (OR) gives a 1 where **either** has one: it combines bits.',
        'A mask of n ones is `(1 << n) - 1`: `(1 << 4) - 1` = 16 − 1 = **15** = `0b1111` = `0xF`.',
        'The recipe for any field inside a byte: **shift right by its lowest bit, then AND with a mask of its length**.',
      ] },
    { tag: 'see', title: 'A 4-bit counter inside a byte', visualFirst: true,
      visual: { type: 'bitfield', signal: 'VehVActlBrk_No_Cnt' },
      body: [
        'In ID `0x415`, byte 2 holds a 2-bit quality flag (bits 7–6), a **4-bit counter** (bits 5–2) and 2 more bits (1–0).',
        'Layout from the community-reverse-engineered DBC in the open-source openpilot project, not from Ford.',
        'To read the counter: `(data[2] >> 2) & 0b1111`. Slide past bits 1–0, then stencil off everything above bit 3.',
      ] },
    { tag: 'code', title: 'Read one bit',
      body: [
        'In the same community DBC, the driver-door signal `DrStatDrv_B_Actl` (ID `0x3B3`) is a single bit: **byte 7, bit 5**. 1 = ajar.',
        'Write a helper that reads bit n of any byte.',
      ],
      code: {
        id: 'python-04-bit',
        prompt: 'Finish `bit(byte, n)` so it returns bit n of `byte` (0 or 1).',
        starter: `def bit(byte, n):
    # slide bit n down to position 0,
    # then keep only that one bit
    return (byte >> ___) & ___

# simulated 0x3B3: driver door open
data = bytes.fromhex("4000000000000020")
print(bit(data[7], 5))
`,
        tests: [
          { name: 'Bit 5 of 0b00100000 is 1', code: 'v = bit(0b00100000, 5)\nassert v == 1, f"got {v!r}"' },
          { name: 'Bit 5 of 0b11011111 is 0 (all the others are 1)', code: 'v = bit(0b11011111, 5)\nassert v == 0, f"got {v!r}"' },
          { name: 'Returns exactly 0 or 1 (bit 7 of 0xFF is 1, not 255)', code: 'v = bit(0xFF, 7)\nassert v == 1, f"got {v!r}"' },
          { name: 'Driver door reads ajar; passenger frame reads closed', code: 'drv = bytes.fromhex("4000000000000020")\npsg = bytes.fromhex("4000000000000010")\nassert bit(drv[7], 5) == 1 and bit(psg[7], 5) == 0, f"got {bit(drv[7], 5)!r} and {bit(psg[7], 5)!r}"' },
        ],
        hints: [
          'Shift right by n so the bit you want becomes bit 0.',
          'A mask with just one 1 at the bottom is `1`.',
          '`return (byte >> n) & 1`',
        ],
        solution: `def bit(byte, n):
    # bit n → position 0, then keep it
    return (byte >> n) & 1

# simulated 0x3B3: driver door open
data = bytes.fromhex("4000000000000020")
print(bit(data[7], 5))  # 1
`,
      } },
    { tag: 'code', title: 'Pull out the 4-bit counter',
      body: [
        'Now a field that’s several bits wide: the counter in byte 2 of `0x415` (bits 5–2). It goes 0, 1, 2 … 15, then wraps to 0.',
      ],
      code: {
        id: 'python-04-counter',
        prompt: 'Finish `counter(byte2)` so it returns the 4-bit counter stored in bits 5–2.',
        starter: `def counter(byte2):
    # bits 5..2 → slide past bits 1..0
    shifted = byte2 >> ___
    # 4 ones: 0b1111
    mask = (1 << ___) - 1
    return shifted & mask

# byte 2 of 3 simulated 0x415 frames
for b in [0xC0, 0xC4, 0xC8]:
    print(counter(b))
`,
        tests: [
          { name: '0xC0 → counter 0 (only the quality bits are set)', code: 'v = counter(0xC0)\nassert v == 0, f"got {v!r}"' },
          { name: '0xC4 → 1 and 0xC8 → 2', code: 'a, b = counter(0xC4), counter(0xC8)\nassert (a, b) == (1, 2), f"got {a!r}, {b!r}"' },
          { name: '0xDC → 7 (from a simulated frame at 10.06 s)', code: 'v = counter(0xDC)\nassert v == 7, f"got {v!r}"' },
          { name: '0xFC → 15, the top before it wraps', code: 'v = counter(0xFC)\nassert v == 15, f"got {v!r}; check the mask is 4 bits"' },
        ],
        hints: [
          'The lowest counter bit is bit 2, so shift right by 2.',
          'The counter is 4 bits long, so the mask is `(1 << 4) - 1`.',
          '`shifted = byte2 >> 2` and `mask = (1 << 4) - 1`',
        ],
        solution: `def counter(byte2):
    # lowest counter bit is bit 2
    shifted = byte2 >> 2
    # 4-bit mask = 0b1111 = 15
    mask = (1 << 4) - 1
    return shifted & mask

for b in [0xC0, 0xC4, 0xC8]:
    print(counter(b))  # 0, 1, 2
`,
      } },
    { tag: 'key', title: 'Shift, then mask',
      body: [
        '**One bit:** `(byte >> n) & 1`. **A field:** `(byte >> lowest_bit) & ((1 << length) - 1)`.',
        'Every signal decoder, including openpilot’s and cantools’, boils down to these shifts and masks.',
      ] },
  ],
  quiz: [
    { type: 'num', q: 'What is `0b1010` in decimal?', answer: 10, tol: 0,
      why: 'Bits 3 and 1 are set: 8 + 2 = **10**.' },
    { type: 'num', q: 'What is `(1 << 4) - 1`?', answer: 15, tol: 0,
      why: '`1 << 4` is 16 (`0b10000`); minus 1 is **15** (`0b1111`): a mask of four ones.' },
    { type: 'mc', q: 'What is `0xC4 >> 2`?', options: ['`0x31` (49)', '`0x310` (784)', '`0x04` (4)', '`0xC4` (196)'], answer: 0,
      why: '`0xC4` = `11000100`; shifting right 2 drops the two low bits → `110001` = **49** (`0x31`).',
      wrong: { 1: 'That would be a left shift (`<< 2`).', 2: 'That’s `0xC4 & 0x0F` (the low nibble).' } },
    { type: 'mc', q: 'What does `x & 0x0F` do?', options: ['Sets the low 4 bits to 1', 'Keeps only the low 4 bits', 'Shifts x right by 4', 'Flips every bit'], answer: 1,
      why: 'AND keeps a bit only where the mask has a 1. `0x0F` = `00001111`, so only the low nibble survives.',
      wrong: { 0: 'Setting bits is OR: `x | 0x0F`.' } },
    { type: 'order', q: 'Order the steps to read a 4-bit counter in bits 5–2.',
      items: ['Pick the byte (`data[2]`)', 'Shift right by 2', 'AND with `0b1111`'],
      why: 'Get the byte, slide the field down to bit 0, then mask off everything above its 4 bits.' },
  ],
  cards: [
    { id: 'onebit', front: 'Read bit n of a byte?', back: '`(byte >> n) & 1`' },
    { id: 'mask', front: 'Mask of n ones?', back: '`(1 << n) - 1`. For n = 4: 15 = `0b1111` = `0xF`.' },
    { id: 'shift', front: 'What do `>>` and `<<` do?', back: 'Slide bits right (÷ 2ⁿ, low bits fall off) or left (× 2ⁿ, zeros fill in).' },
    { id: 'andor', front: '`&` vs `|`?', back: '`&` keeps bits set in both (masking). `|` sets bits set in either (combining).' },
    { id: 'field', front: 'Recipe for a field inside a byte?', back: 'Shift right by its lowest bit, then AND with a mask of its length.' },
  ],
};
