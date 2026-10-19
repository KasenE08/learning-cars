// Endianness
export default {
  steps: [
    { tag: 'metaphor', title: '10/19 or 19/10?',
      body: [
        'Americans write the date month first; most of the world writes day first. Same pieces, different order. Read in the wrong order and you get nonsense, or worse, a wrong answer that *looks* fine.',
        'Multi-byte numbers have the same problem: is the first byte the **big end** or the **little end**? That’s [[endianness]].',
        '~~The names come from Gulliver’s Travels (a war over which end to crack an egg), borrowed by Danny Cohen in a 1980 networking paper.~~',
      ] },
    { tag: 'how', title: 'Intel vs Motorola',
      body: [
        '[[intel-byte-order|Intel / little-endian]] (`@1` in a DBC): **least** significant byte first. Start bit = the signal’s **LSB**.',
        '[[motorola-byte-order|Motorola / big-endian]] (`@0`): **most** significant byte first, like we write numbers. Start bit = the signal’s **MSB**.',
        'The names come from the CPU families: Intel x86 chips store little-endian; Motorola’s 68000 family was big-endian.',
        'Bytes `0F A0`: big-endian = `0x0FA0` = **4,000**. Little-endian = `0xA00F` = **40,975**.',
      ] },
    { tag: 'see', title: 'The Motorola sawtooth', visualFirst: true,
      visual: { type: 'bitfield', signal: 'Veh_V_ActlBrk', editable: true },
      body: [
        '`Veh_V_ActlBrk` is `7|16@0+`: Motorola, start bit **7** (byte 0’s top bit), 16 bits long.',
        'It runs 7, 6 … 0, then **jumps to 15** (byte 1’s top bit) and runs down to 8. That zig-zag through the bit numbers is the DBC **sawtooth**.',
        'Result: byte 0 is the high byte, byte 1 the low byte. Flip the toggle to Intel and watch the same bits mean something else.',
        'Every signal in the community Ford DBC (from the open-source openpilot project, not Ford) is Motorola.',
      ] },
    { tag: 'how', title: 'Reading a Motorola signal',
      body: [
        'For a signal that fills whole bytes, it’s easy: `raw = (data[0] << 8) | data[1]`. High byte shifted up, low byte ORed in.',
        'For odd positions, a general trick: `int.from_bytes(data, "big")` makes byte 0 the **top**. Convert the sawtooth start bit to a shift from the right, then mask. The checksum and DBC exercises give you a helper that does this.',
        'Getting it wrong rarely crashes. It just gives plausible-looking garbage, so sanity-check: speed at a standstill should be 0.',
      ] },
    { tag: 'see', title: 'Right bits vs wrong bits',
      visual: { type: 'sigplot', scenario: 'drive', id: 0x415, start: 7, length: 16, endian: 'big', editable: true },
      body: [
        '**Simulated** drive (made-up values): with `7|16` big-endian you get a smooth speed curve.',
        'Switch to little-endian: the same 16 bits in the wrong order become jagged noise. That’s how reverse engineers spot a wrong guess.',
      ] },
    { tag: 'code', title: 'Decode the speed',
      body: [
        'Turn a `0x415` frame into km/h and mph. `KM_PER_MILE` is the constant from “Python in five minutes”.',
      ],
      code: {
        id: 'decode-03-speed',
        prompt: 'Finish `speed_kph(data)` for `Veh_V_ActlBrk : 7|16@0+ (0.01,0)`. `speed_mph` then works by itself.',
        starter: `KM_PER_MILE = 1.609344

def speed_kph(data):
    # 7|16@0+ : byte 0 high, byte 1 low
    raw = (data[0] << ___) | data[1]
    # scale 0.01, offset 0
    return raw * ___

def speed_mph(data):
    return speed_kph(data) / KM_PER_MILE

f = bytes.fromhex("0FA0C04D00000000")
print(speed_kph(f), speed_mph(f))
`,
        tests: [
          { name: '0FA0… → 40.0 km/h', code: 'f = bytes.fromhex("0FA0C04D00000000")\nv = speed_kph(f)\nassert abs(v - 40.0) < 1e-6, f"got {v!r}"' },
          { name: '0FA0… → about 24.85 mph', code: 'f = bytes.fromhex("0FA0C04D00000000")\nv = speed_mph(f)\nassert abs(v - 24.855) < 0.01, f"got {v!r}"' },
          { name: 'A simulated frame at 10 s: 1271… → 47.21 km/h', code: 'f = bytes.fromhex("1271D07500000000")\nv = speed_kph(f)\nassert abs(v - 47.21) < 1e-6, f"got {v!r}"' },
          { name: 'Standing still: 0000… → 0 km/h', code: 'v = speed_kph(bytes(8))\nassert v == 0, f"got {v!r}"' },
        ],
        hints: [
          'Byte 0 is the high byte, so it moves up by one whole byte.',
          'One byte is 8 bits: `<< 8`. The DBC scale is 0.01.',
          '`raw = (data[0] << 8) | data[1]` and `return raw * 0.01`',
        ],
        solution: `KM_PER_MILE = 1.609344

def speed_kph(data):
    # big-endian: byte 0 is high
    raw = (data[0] << 8) | data[1]
    return raw * 0.01

def speed_mph(data):
    return speed_kph(data) / KM_PER_MILE

f = bytes.fromhex("0FA0C04D00000000")
print(speed_kph(f), speed_mph(f))
`,
      } },
    { tag: 'bronco', title: 'On your Bronco Sport',
      body: [
        'openpilot lists the Bronco Sport 2021–24 as supported, and its Ford code uses `Veh_V_ActlBrk` as the car’s speed, read from the bus at the windshield camera.',
        'The DBC says ID `0x415` is sent by `ABS_ESC`, the ABS/stability module, which knows speed from the [[wheel-speed-sensor|wheel-speed sensors]].',
        'Whether your OBD port shows this frame is a separate question: a [[gateway]] sits between the port and these buses.',
      ],
      facts: ['bronco.openpilotListing'] },
  ],
  quiz: [
    { type: 'tap', q: 'In the community DBC, `0x415` BrakeSysFeatures (with `Veh_V_ActlBrk`) is sent by `ABS_ESC`. Tap that module.', visual: { type: 'parts', drawing: 'brakes' }, answer: 'abs',
      why: 'ABS_ESC is the ABS / stability control unit. It reads every wheel-speed sensor, so it’s a natural source for vehicle speed.',
      wrong: { 'wheel-sensor': 'Close: the sensors feed it, but the ABS unit is the computer that sends the CAN message.' } },
    { type: 'mc', q: 'In a DBC, a Motorola (`@0`) signal’s start bit is its…', options: ['LSB', 'MSB', 'First byte', 'Checksum'], answer: 1,
      why: 'Motorola/big-endian start bit = MSB, then the sawtooth. Intel start bit = LSB. (Some DBC editors *display* the LSB instead, which confuses people.)' },
    { type: 'mc', q: '`Veh_V_ActlBrk` is `7|16@0+`. After bit 0, which bit comes next?', options: ['Bit 8', 'Bit 15', 'Bit 1', 'Bit 63'], answer: 1,
      why: 'Motorola walks down each byte (7 → 0), then jumps to the top of the next byte: bit **15**. That’s the sawtooth.',
      wrong: { 0: 'Bit 8 is byte 1’s lowest bit; a Motorola signal reaches it last.' } },
  ],
  cards: [
    { id: 'endian', front: 'Big-endian vs little-endian?', back: 'Big: most significant byte first (Motorola, `@0`). Little: least significant byte first (Intel, `@1`).' },
    { id: 'startbits', front: 'Start bit for Intel vs Motorola signals in a DBC?', back: 'Intel: the LSB. Motorola: the MSB (sawtooth numbering).' },
    { id: 'sawtooth', front: 'Motorola sawtooth order from bit 7?', back: '7, 6 … 0, then 15, 14 … 8, then 23 …' },
    { id: 'speed', front: 'Decode `Veh_V_ActlBrk` (7|16@0+, 0.01)?', back: '`((data[0] << 8) | data[1]) * 0.01` km/h.' },
    { id: 'ford', front: 'Byte order of the Ford signals in the community DBC?', back: 'All Motorola (big-endian). Source: openpilot’s opendbc, not Ford.' },
  ],
};
