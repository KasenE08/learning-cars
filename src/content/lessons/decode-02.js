// Bit packing
export default {
  steps: [
    { tag: 'metaphor', title: 'Tetris in 64 bits',
      body: [
        'A classic CAN frame is 8 bytes = **64 bits**, and engineers pack it like Tetris: every bit used, pieces of any width.',
        'A 2-bit flag, a 4-bit counter and a 12-bit value can sit side by side, **ignoring byte boundaries**.',
        'So a [[signal]] is described by **where it starts** and **how many bits long** it is, not by which byte it’s in.',
      ] },
    { tag: 'how', title: 'Numbering every bit',
      body: [
        'DBC files number the frame’s bits 0–63: **bit = byte × 8 + bit-in-byte**. Byte 0 holds bits 0–7, byte 1 holds 8–15, and so on.',
        'Inside a byte, bit 0 is the 1s place (the [[msb-lsb|LSB]]), bit 7 the 128s place.',
        'A signal = [[start-bit]] + length (+ byte order, next lesson). The simplest kind is **Intel / little-endian**: the start bit is the signal’s LSB, and it counts **upward**.',
      ] },
    { tag: 'see', title: 'Slide a signal around', visualFirst: true,
      visual: { type: 'bitfield', custom: { start: 12, length: 12, endian: 'little' }, data: '00A53C0000000000', editable: true },
      body: [
        'A made-up Intel signal: start bit 12, length 12, so bits **12–23**. It takes the **top half of byte 1** and **all of byte 2**.',
        'Drag start and length: watch the highlighted bits spill across a byte boundary and the raw number change.',
      ] },
    { tag: 'how', title: 'Crossing a byte boundary by hand',
      body: [
        'Bits 12–15 are the top 4 bits of byte 1: `data[1] >> 4`. Bits 16–23 are all of byte 2, and they’re the **higher** part.',
        'Glue them: `raw = (data[2] << 4) | (data[1] >> 4)`. With `data[1] = 0xA5`, `data[2] = 0x3C` → `0x3CA` = **970**.',
        'This works, but every signal needs its own custom line. There’s a general trick.',
      ] },
    { tag: 'how', title: 'The general trick: one big number',
      body: [
        '`int.from_bytes(data, "little")` glues all 8 bytes into **one 64-bit integer**, with byte 0 as the lowest part.',
        'Now Intel bit numbers line up exactly with the integer’s bits: DBC bit 12 *is* bit 12 of the number.',
        'So any Intel signal is: `(value >> start) & ((1 << length) - 1)`. Shift and mask, the same move as in “Bits: shifts & masks”, just on 64 bits.',
      ] },
    { tag: 'code', title: 'Extract an Intel signal',
      body: [
        'Write one function that pulls **any** little-endian signal out of a frame.',
      ],
      code: {
        id: 'decode-02-intel',
        prompt: 'Finish `extract_le(data, start, length)` so it returns the raw value of an Intel (little-endian) signal.',
        starter: `def extract_le(data, start, length):
    # glue 8 bytes into one number;
    # byte 0 ends up lowest
    value = int.from_bytes(data, "little")
    # slide the signal down to bit 0
    value = value >> ___
    # keep only \`length\` bits
    mask = (1 << ___) - 1
    return value & mask

frame = bytes.fromhex("00A53C0000000000")
print(extract_le(frame, 12, 12))
`,
        tests: [
          { name: 'Start 12, length 12 → 970 (0x3CA), across bytes 1–2', code: 'f = bytes.fromhex("00A53C0000000000")\nv = extract_le(f, 12, 12)\nassert v == 970, f"got {v!r}"' },
          { name: 'Start 8, length 16 → 0x3CA5 (bytes 1–2, byte 2 high)', code: 'f = bytes.fromhex("00A53C0000000000")\nv = extract_le(f, 8, 16)\nassert v == 0x3CA5, f"got {v!r} ({hex(v)})"' },
          { name: 'Start 4, length 8 on another frame → 0x41', code: 'f = bytes.fromhex("123456789ABCDEF0")\nv = extract_le(f, 4, 8)\nassert v == 0x41, f"got {v!r} ({hex(v)})"' },
          { name: 'A 1-bit signal: bit 63 of a frame ending in 0x80', code: 'f = bytes.fromhex("0000000000000080")\nv = extract_le(f, 63, 1)\nassert v == 1, f"got {v!r}"' },
        ],
        hints: [
          'Shift right by the signal’s start bit (its LSB).',
          'The mask needs as many ones as the signal is long.',
          '`value = value >> start` and `mask = (1 << length) - 1`',
        ],
        solution: `def extract_le(data, start, length):
    # byte 0 = lowest part of the number
    value = int.from_bytes(data, "little")
    # Intel start bit = the signal's LSB
    value = value >> start
    mask = (1 << length) - 1
    return value & mask

frame = bytes.fromhex("00A53C0000000000")
print(extract_le(frame, 12, 12))  # 970
`,
      } },
    { tag: 'key', title: 'Packing in a real Ford frame',
      body: [
        'In ID `0x415`, the community DBC (openpilot project, not Ford) packs speed (16 bits), a quality flag (2), a counter (4) and a checksum (8) into the first 4 bytes; the full DBC lists more signals in the rest.',
        'But **every Ford signal in that DBC is Motorola (big-endian)**, so `extract_le` would read them wrong. Next lesson fixes that.',
      ] },
  ],
  quiz: [
    { type: 'num', q: 'An Intel signal starts at bit **12** and is **12** bits long. What is its highest bit number?', answer: 23, tol: 0,
      why: 'It covers bits 12, 13 … 12 + 12 − 1 = **23**.' },
    { type: 'num', q: 'In DBC numbering, which bit number is **byte 3, bit 5**?', answer: 29, tol: 0,
      why: 'byte × 8 + bit = 3 × 8 + 5 = **29**.' },
    { type: 'mc', q: 'For an Intel signal, what does the DBC start bit point to?', options: ['The signal’s most significant bit', 'The signal’s least significant bit', 'Always bit 0 of a byte', 'The first byte only'], answer: 1,
      why: 'Intel (little-endian) start bit = LSB; the signal grows upward from there. Motorola is different (next lesson).' },
    { type: 'order', q: 'Order the steps to decode an Intel signal to a physical value.',
      items: ['`int.from_bytes(data, "little")`', 'Shift right by the start bit', 'AND with `(1 << length) - 1`', 'Multiply by scale, add offset'],
      why: 'Glue the bytes, slide the signal to bit 0, mask off the rest, then apply the DBC scaling.' },
  ],
  cards: [
    { id: 'bitnum', front: 'DBC bit number of byte b, bit i?', back: '`b × 8 + i` (0–63 in an 8-byte frame).' },
    { id: 'intel', front: 'Extract an Intel (little-endian) signal?', back: '`(int.from_bytes(data, "little") >> start) & ((1 << length) - 1)`' },
    { id: 'startbit', front: 'Intel start bit = ?', back: 'The signal’s LSB; the signal counts upward from it.' },
    { id: 'cross', front: 'Bits 12–23 by hand?', back: '`(data[2] << 4) | (data[1] >> 4)`: byte 2 is the high part.' },
  ],
};
