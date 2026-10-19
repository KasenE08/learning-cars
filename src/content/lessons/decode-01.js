// Scaling & offsets
export default {
  steps: [
    { tag: 'metaphor', title: 'Counting ticks on a ruler',
      body: [
        'Imagine a ruler with no numbers, only tiny ticks. A module just says “**4,000 ticks**.”',
        'The DBC is the label printed on the ruler: **each tick is 0.01 km/h, and zero is here**.',
        'The number on the wire is the [[raw-value]]. Ticks × tick size + where zero sits = the real, **physical** value.',
      ] },
    { tag: 'how', title: 'Why CAN sends integers',
      body: [
        'A classic CAN frame carries at most 8 bytes, so every [[signal]] is squeezed into a few bits as a plain unsigned integer.',
        'The DBC gives each signal a [[scaling-factor]] and an [[offset]]: `physical = raw × scale + offset`.',
        '**Resolution** = the scale (the smallest step). **Range** = `offset` up to `offset + (2^bits − 1) × scale`.',
        'Going the other way (encoding): `raw = (physical − offset) ÷ scale`, rounded to a whole number.',
      ] },
    { tag: 'see', title: 'Speed: scale only', visualFirst: true,
      visual: { type: 'scaling', scale: 0.01, offset: 0, unit: 'km/h', bits: 16 },
      body: [
        '`Veh_V_ActlBrk` (vehicle speed in ID `0x415`): **16 bits, scale 0.01 km/h, offset 0**.',
        'Raw 4,000 → 40.00 km/h (24.9 mph). Resolution 0.01 km/h; top of the range 65,535 × 0.01 = **655.35 km/h**.',
        'From the community DBC in the open-source openpilot project: reverse-engineered by volunteers, **not from Ford**.',
      ] },
    { tag: 'math', title: 'Steering angle: scale and offset',
      visual: { type: 'scaling', scale: 0.1, offset: -1600, unit: '°', bits: 15 },
      body: [
        '`StePinComp_An_Est` (steering pinion angle, ID `0x7E`): **15 bits, scale 0.1°, offset −1600°**.',
        'Raw 16,000 → 16,000 × 0.1 − 1600 = **0°** (straight). Raw 14,200 → **−180°**. Raw 17,800 → **+180°**.',
        'The offset lets an **unsigned** number go negative: everything below raw 16,000 is one direction. Range: −1600° to +1676.7°.',
        'Which direction is negative isn’t stated in the DBC; the app’s simulator treats left as negative.',
      ] },
    { tag: 'code', title: 'Raw to physical',
      body: [
        'One formula decodes every scaled signal. Write it once, reuse it everywhere.',
      ],
      code: {
        id: 'decode-01-physical',
        prompt: 'Finish `to_physical(raw, scale, offset)` using `physical = raw × scale + offset`.',
        starter: `def to_physical(raw, scale, offset):
    # physical = raw × scale + offset
    return ___

# Veh_V_ActlBrk: (0.01, 0)
print(to_physical(4000, 0.01, 0))
# StePinComp_An_Est: (0.1, -1600)
print(to_physical(14200, 0.1, -1600))
`,
        tests: [
          { name: 'Speed raw 4000 → 40.0 km/h', code: 'v = to_physical(4000, 0.01, 0)\nassert abs(v - 40.0) < 1e-6, f"got {v!r}"' },
          { name: 'Steering raw 16000 → 0° (straight ahead)', code: 'v = to_physical(16000, 0.1, -1600)\nassert abs(v) < 1e-6, f"got {v!r}; multiply first, then add the offset"' },
          { name: 'Steering raw 14200 → −180°', code: 'v = to_physical(14200, 0.1, -1600)\nassert abs(v + 180) < 1e-6, f"got {v!r}"' },
        ],
        hints: [
          'Python uses `*` for multiply.',
          'Multiply first, then add the offset (the offset here is already negative).',
          '`return raw * scale + offset`',
        ],
        solution: `def to_physical(raw, scale, offset):
    # scale first, then shift zero
    return raw * scale + offset

print(to_physical(4000, 0.01, 0))
print(to_physical(14200, 0.1, -1600))
`,
      } },
    { tag: 'bronco', title: 'Your truck’s numbers',
      body: [
        'openpilot lists the **Bronco Sport 2021–24** as supported (with the Co-Pilot360 Assist+ package) and reads these signals with this DBC.',
        'openpilot taps the bus at the windshield camera. At your **OBD port**, a [[gateway]] module sits in between, so this normal traffic may not be visible there.',
        'Python floats can show tiny rounding: `32767 * 0.1 - 1600` prints `1676.7000000000003`. Round for display: `f"{v:.1f}"`.',
      ],
      facts: ['bronco.openpilotListing'] },
  ],
  quiz: [
    { type: 'num', q: '`Veh_V_ActlBrk` raw value is **6,426**. What speed is that in km/h? (scale 0.01, offset 0)', answer: 64.26, tol: 0.01, unit: 'km/h',
      why: '6,426 × 0.01 + 0 = **64.26 km/h** (about 39.9 mph), the top cruise speed in the simulated drive.' },
    { type: 'num', q: '`StePinComp_An_Est` raw value is **17,800**. What angle? (scale 0.1, offset −1600)', answer: 180, tol: 0.1, unit: '°',
      why: '17,800 × 0.1 = 1,780; 1,780 − 1,600 = **+180°**.' },
    { type: 'mc', q: 'What is the **resolution** of `Veh_V_ActlBrk`?', options: ['1 km/h', '0.1 km/h', '0.01 km/h', '655.35 km/h'], answer: 2,
      why: 'Resolution is the size of one raw step, which is the scale: 0.01 km/h.',
      wrong: { 3: 'That’s the top of the range (65,535 × 0.01).' } },
    { type: 'mc', q: 'Why does the steering angle have an offset of −1600°?', options: ['To hide the real angle', 'So an unsigned raw number can stand for negative angles', 'Because the wheel turns 1600° lock to lock', 'To make it fit in 8 bits'], answer: 1,
      why: 'Raw values are never negative. Shifting zero to raw 16,000 makes everything below it the other direction.' },
  ],
  cards: [
    { id: 'formula', front: 'Raw → physical formula?', back: '`physical = raw × scale + offset` (scale and offset come from the DBC).' },
    { id: 'resolution', front: 'What sets a signal’s resolution?', back: 'Its scale: one raw step. `Veh_V_ActlBrk` = 0.01 km/h.' },
    { id: 'range', front: 'Range of an n-bit unsigned signal?', back: '`offset` to `offset + (2ⁿ − 1) × scale`.' },
    { id: 'steer', front: '`StePinComp_An_Est` scale and offset?', back: '0.1° and −1600° (raw 16,000 = 0°). Community DBC from openpilot, not Ford.' },
    { id: 'encode', front: 'Physical → raw?', back: '`raw = (physical − offset) ÷ scale`, rounded.' },
  ],
};
