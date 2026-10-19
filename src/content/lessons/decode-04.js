// Signed values
export default {
  steps: [
    { tag: 'metaphor', title: 'The odometer that rolls backward',
      body: [
        'Picture an old mechanical odometer at `000`. Roll it **back one** and it shows `999`.',
        'Computers do the same with bits: in 8 bits, 0 minus 1 rolls over to `11111111` (255). So agree that **255 means −1**, 254 means −2, and so on.',
        'That agreement is [[two-s-complement]], the way almost every CPU stores negative whole numbers.',
      ] },
    { tag: 'how', title: 'Two’s complement in one rule',
      body: [
        'In n bits, the top bit (MSB) is the **sign**: 0 = positive, 1 = negative. 8 bits hold −128 … +127.',
        'Rule: **if `raw ≥ 2^(n−1)`, subtract `2^n`**. 8 bits: 200 ≥ 128, so 200 − 256 = **−56**.',
        'A DBC marks this with the sign character: `@1-` or `@0-` = signed (two’s complement), `+` = unsigned.',
        'Order matters: extract the raw bits, **then** fix the sign, **then** scale and offset.',
      ] },
    { tag: 'see', title: 'Same bits, two meanings', visualFirst: true,
      visual: { type: 'twos', bits: 8 },
      body: [
        'Spin the wheel: the bottom half reads the same either way; past `0x7F` the signed reading jumps to −128 and climbs back toward −1.',
        'Read a signed signal as unsigned and −1 becomes 255. Read an unsigned one as signed and 200 becomes −56. Both look like real numbers.',
      ] },
    { tag: 'how', title: 'Ford’s way: an offset instead',
      visual: { type: 'scaling', scale: 0.0002, offset: -6.5, unit: 'rad/s', bits: 16 },
      body: [
        '`VehYaw_W_Actl` (yaw rate, ID `0x91`) is `23|16@0+ (0.0002,-6.5) rad/s`: **unsigned**, with a −6.5 rad/s [[offset]].',
        'Raw 0 → −6.5; raw **32,500 → 0.0**; raw 65,533 → +6.6066 rad/s. Zero sits in the middle, so negatives need no sign bit.',
        'Raw 65,534 and 65,535 are reserved: the DBC names them **NoDataExists** and **Faulty**. A decoder should check for them before scaling.',
        'Every signal in the community Ford DBC (openpilot project, not Ford) is unsigned; the ones that go negative use an offset like this.',
      ] },
    { tag: 'code', title: 'Apply two’s complement',
      body: [
        'Plenty of other cars and tools *do* use signed signals, so you need this helper.',
      ],
      code: {
        id: 'decode-04-signed',
        prompt: 'Finish `to_signed(raw, bits)` so it turns an unsigned raw value into its two’s complement signed value.',
        starter: `def to_signed(raw, bits):
    # 8 bits → half is 128
    half = 1 << (bits - 1)
    # top bit set → negative
    if raw >= ___:
        # roll back by 2**bits
        raw = raw - (1 << ___)
    return raw

print(to_signed(0xFF, 8))   # -1
print(to_signed(0x7F, 8))   # 127
`,
        tests: [
          { name: '8 bits: 0x7F stays 127', code: 'v = to_signed(0x7F, 8)\nassert v == 127, f"got {v!r}"' },
          { name: '8 bits: 0x80 is −128 and 0xFF is −1', code: 'a, b = to_signed(0x80, 8), to_signed(0xFF, 8)\nassert (a, b) == (-128, -1), f"got {a!r}, {b!r}"' },
          { name: '4 bits: 12 is −4, 5 stays 5', code: 'a, b = to_signed(12, 4), to_signed(5, 4)\nassert (a, b) == (-4, 5), f"got {a!r}, {b!r}"' },
          { name: '16 bits: 0xFFFE is −2', code: 'v = to_signed(0xFFFE, 16)\nassert v == -2, f"got {v!r}"' },
        ],
        hints: [
          'A value is negative when its top bit is set, i.e. when it’s at least `half`.',
          'To roll back, subtract `2**bits`, which is `1 << bits`.',
          '`if raw >= half:` and `raw = raw - (1 << bits)`',
        ],
        solution: `def to_signed(raw, bits):
    half = 1 << (bits - 1)
    # top bit set → negative
    if raw >= half:
        raw = raw - (1 << bits)
    return raw

print(to_signed(0xFF, 8))   # -1
print(to_signed(0x7F, 8))   # 127
`,
      } },
    { tag: 'bronco', title: 'Yaw rate on your truck',
      body: [
        '[[yaw-rate]] is how fast the truck rotates left or right. The stability system ([[esc]]) compares it with where the steering points.',
        'openpilot’s Ford code reads `VehYaw_W_Actl` as the yaw rate. 0.2 rad/s ≈ **11.5°/s**: a gentle turn.',
        'Same caveat as before: openpilot lists the Bronco Sport 2021–24 as supported, but this frame may not be visible at your OBD port (gateway).',
      ],
      facts: ['bronco.openpilotListing'] },
  ],
  quiz: [
    { type: 'mc', q: 'In `SG_ X : 0|8@1- (1,0)`, what does the `-` mean?', options: ['Negative scale', 'Signed (two’s complement)', 'Motorola byte order', 'The signal is unused'], answer: 1,
      why: 'After the byte-order digit, `+` means unsigned and `-` means signed. `@1` is Intel; `@0` would be Motorola.' },
    { type: 'order', q: 'Order the steps to decode a **signed** signal.',
      items: ['Extract the raw bits', 'Apply two’s complement', 'Multiply by the scale', 'Add the offset'],
      why: 'The sign belongs to the raw integer, so fix it before scaling; then `raw × scale + offset`.' },
    { type: 'mc', q: 'Why can `VehYaw_W_Actl` be negative even though it’s unsigned?', options: ['It uses a hidden sign bit', 'The −6.5 offset moves zero to raw 32,500', 'Ford sends a separate “negative” flag', 'It can’t; yaw rate is always positive'], answer: 1,
      why: 'Raw values below 32,500 land below zero after `× 0.0002 − 6.5`. That’s an offset encoding, not two’s complement.' },
  ],
  cards: [
    { id: 'rule', front: 'Two’s complement rule for n bits?', back: 'If `raw ≥ 2^(n−1)`, subtract `2^n`.' },
    { id: 'range8', front: 'Range of 8-bit signed vs unsigned?', back: 'Signed −128 … +127; unsigned 0 … 255.' },
    { id: 'dbcsign', front: 'How does a DBC mark a signed signal?', back: '`-` after the byte order (`@1-`, `@0-`); `+` = unsigned.' },
    { id: 'yaw', front: '`VehYaw_W_Actl` encoding?', back: 'Unsigned 16 bits, × 0.0002 − 6.5 rad/s (raw 32,500 = 0). 65,534/65,535 = no data/faulty.' },
    { id: 'offsetvs', front: 'Two ways to send negative numbers on CAN?', back: 'Two’s complement (signed `-`), or unsigned with a negative offset (Ford’s usual way).' },
  ],
};
