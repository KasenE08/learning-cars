// Write your own DBC line
export default {
  steps: [
    { tag: 'metaphor', title: 'Write the dictionary entry',
      body: [
        'You’ve been eavesdropping and you finally know a word: where it sits, what it means, how to read it.',
        'A DBC line is you **adding that word to the dictionary** so anyone (or any tool) can read it next time.',
        'Reverse engineering that never gets written down is just a magic trick. The `SG_` line is the real output.',
      ] },
    { tag: 'how', title: 'From a finding to an `SG_` line',
      body: [
        'Say you confirmed: ID `0x415`, speed lives in the first two bytes, 16 bits, reads km/h at 0.01 per step.',
        'The DBC signal line: `SG_ Veh_V_ActlBrk : 7|16@0+ (0.01,0) [0|655.35] "kph" GWM`.',
        '`7|16` = **start bit | length** · `@0` = [[motorola-byte-order|Motorola]] · `+` = unsigned · `(0.01,0)` = (scale, offset) · `[0|655.35]` = [min|max] physical · `"kph"` = unit · then the receivers.',
        'Physical value = raw × scale + offset. Min/max are just the smallest and largest that formula can produce (here 0 and 65535 × 0.01).',
      ] },
    { tag: 'see', title: 'The start bit is the MSB', visualFirst: true,
      visual: { type: 'bitfield', signal: 'Veh_V_ActlBrk' },
      body: [
        'In Motorola (`@0`) the **start bit is the signal’s most-significant bit**, and bits run in the “sawtooth” order: 7…0 in byte 0, then 15…8 in byte 1, and so on.',
        'So start bit **7** = byte 0, bit 7: the very first bit on the wire. The signal grows **downward** from there through the next 15 bits.',
        'Get this wrong and your value is scrambled. The grid shows exactly which cells a given start/length cover.',
      ] },
    { tag: 'how', title: '`BO_`, `SG_` and `VAL_`',
      body: [
        '`BO_` names the message: `BO_ 1045 BrakeSysFeatures: 8 ABS_ESC` → ID **in decimal** (1045 = `0x415`), name, 8 bytes, sender.',
        '`SG_` lines (indented under it) are its signals, one per value you found.',
        '`VAL_` gives names to a field’s numbers: `VAL_ 1045 VehVActlBrk_D_Qf 3 "OK" 2 "Not_Within_Specifications" 1 "No_Data_Exists" 0 "Faulty";`. Perfect for switches and states (gear, ignition, door).',
        'A send rate goes in an attribute: `BA_ "GenMsgCycleTime" BO_ 1045 20;` (every 20 ms).',
      ] },
    { tag: 'code', title: 'Format an `SG_` line',
      body: [
        'Turn a finding (a Python dict) into a DBC line. All Ford signals in this file are Motorola + unsigned, so hard-code `@0+`.',
        'An f-string drops each value into place. The unit needs real quote characters around it in the output.',
      ],
      code: {
        id: 'canlab-04-sgline',
        prompt: 'Finish `sg_line(sig)` so it returns the DBC `SG_` text for the signal dict.',
        starter: `SPEED = {
    "name": "Veh_V_ActlBrk",
    "start": 7, "length": 16,
    "scale": 0.01, "offset": 0,
    "lo": 0, "hi": 655.35,
    "unit": "kph", "rx": "GWM",
}

def sg_line(sig):
    """One DBC SG_ line (Motorola,
    unsigned)."""
    name = sig["name"]
    # "start|length"
    pos = f'{sig["start"]}|{___}'
    # "(scale,offset)"
    fac = f'({sig["scale"]},{sig["offset"]})'
    # "[lo|hi]"
    rng = f'[{sig["lo"]}|{sig["hi"]}]'
    unit = sig["unit"]
    return (
        f'SG_ {name} : {pos}@0+ '
        f'{fac} {rng} "{___}" '
        f'{sig["rx"]}'
    )

print(sg_line(SPEED))
`,
        tests: [
          { name: 'Formats the speed signal exactly', code: 'got = sg_line(SPEED)\nexp = \'SG_ Veh_V_ActlBrk : 7|16@0+ (0.01,0) [0|655.35] "kph" GWM\'\nassert got == exp, f"got {got!r}"' },
          { name: 'Uses start|length with @0+ (Motorola, unsigned)', code: 'assert "7|16@0+" in sg_line(SPEED), f"got {sg_line(SPEED)!r}"' },
          { name: 'Wraps the unit in real quotes', code: 'assert \'"kph"\' in sg_line(SPEED), f"got {sg_line(SPEED)!r}"' },
          { name: 'Works for another signal (steering degrees, offset)', code: 'wheel = {"name": "StePinComp_An_Est", "start": 22, "length": 15, "scale": 0.1, "offset": -1600, "lo": -1600, "hi": 1676.7, "unit": "degrees", "rx": "IPMA_ADAS"}\ngot = sg_line(wheel)\nexp = \'SG_ StePinComp_An_Est : 22|15@0+ (0.1,-1600) [-1600|1676.7] "degrees" IPMA_ADAS\'\nassert got == exp, f"got {got!r}"' },
        ],
        hints: [
          'Length is `sig["length"]`; it fills the blank after `start|`.',
          'The unit goes in the last blank: `sig["unit"]`.',
          '`pos = f\'{sig["start"]}|{sig["length"]}\'` and the unit blank is `{sig["unit"]}`.',
        ],
        solution: `SPEED = {
    "name": "Veh_V_ActlBrk",
    "start": 7, "length": 16,
    "scale": 0.01, "offset": 0,
    "lo": 0, "hi": 655.35,
    "unit": "kph", "rx": "GWM",
}

def sg_line(sig):
    """One DBC SG_ line (Motorola,
    unsigned)."""
    name = sig["name"]
    pos = f'{sig["start"]}|{sig["length"]}'
    fac = f'({sig["scale"]},{sig["offset"]})'
    rng = f'[{sig["lo"]}|{sig["hi"]}]'
    unit = sig["unit"]
    return (
        f'SG_ {name} : {pos}@0+ '
        f'{fac} {rng} "{unit}" '
        f'{sig["rx"]}'
    )

print(sg_line(SPEED))
`,
      } },
    { tag: 'why', title: 'Community DBCs can be wrong',
      body: [
        'Compare your line with the community file. It’s often right, but it is **reverse-engineered, not from Ford**, so treat it as a strong hypothesis.',
        '**Incomplete:** it labels only what someone decoded. Plenty of bytes in these frames have no `SG_` at all.',
        '**Mislabeled:** one base DBC covers many models. Ford engine messages here say sender `PCM_HEV` though the Bronco Sport is gas-only, and the DBC’s comment calls `PSCM` a “climate seat module” while it sends steering angle.',
        '**Model-specific:** a signal that’s real on a hybrid or diesel may simply not be transmitted on your truck. If your frames disagree with the DBC, trust the frames you confirmed.',
      ] },
    { tag: 'bronco', title: 'Your file, your truck',
      body: [
        'The app’s Ford data is generated from opendbc’s `ford_lincoln_base_pt.dbc` (openpilot, MIT). It lists the Bronco Sport 2021–24 as supported.',
        'Writing your own lines is how you’d extend or correct that file for your specific truck, the same way the community built it: confirm, then document.',
        'Real tools then read your DBC: **cantools** decodes logs with it, SavvyCAN and [[cabana]] graph and edit it.',
      ],
      facts: ['bronco.openpilotListing'] },
  ],
  quiz: [
    { type: 'mc', q: 'In `SG_ … : 7|16@0+ …`, what does the start bit **7** mean in Motorola order?',
      options: ['The 7th byte', 'Byte 0, bit 7: the signal’s MSB, the first bit on the wire', 'The signal is 7 bits long', 'Bit 7 counting from the end'], answer: 1,
      why: 'Motorola (`@0`) counts the start bit as the MSB. Bit 7 is byte 0’s top bit; the signal grows downward through the sawtooth from there.',
      wrong: { 0: 'Length comes after the `|`; 7 is a bit position.', 2: 'Length is the 16 after the `|`.' } },
    { type: 'order', q: 'Order the fields of `SG_ Veh_V_ActlBrk : 7|16@0+ (0.01,0) [0|655.35] "kph" GWM`.',
      items: ['name', 'start|length', '@byteorder+sign', '(scale,offset)', '[min|max]', '"unit"', 'receivers'],
      why: 'That’s the exact left-to-right order of a DBC signal line.' },
    { type: 'num', q: 'A 16-bit unsigned signal with scale 0.01 and offset 0 has what **maximum** physical value? (to 2 decimals)', answer: 655.35, tol: 0.01, unit: 'kph',
      hint: 'Biggest raw for 16 bits is 2¹⁶ − 1 = 65535.', why: '65535 × 0.01 + 0 = **655.35**. That’s the `[0|655.35]` range in the line.' },
    { type: 'mc', q: 'Your confirmed frames disagree with the community DBC’s label. What’s the right call?',
      options: ['The DBC is official, so trust it', 'Trust the frames you confirmed; the DBC is community-made and can be wrong, incomplete or for another model', 'Delete your finding', 'Assume your car is broken'], answer: 1,
      why: 'opendbc is reverse-engineered and shared across models. A signal can be mislabeled or simply not sent on your truck. Confirmed frames win.' },
  ],
  cards: [
    { id: 'sg', front: 'Read `SG_ X : 7|16@0+ (0.01,0) [0|655.35] "kph"`.', back: 'Start bit 7, 16 bits, Motorola, unsigned, ×0.01 +0, range 0–655.35 km/h.' },
    { id: 'bo', front: 'What does a `BO_` line hold?', back: 'Message ID (in decimal), name, length in bytes, and the sending module.' },
    { id: 'val', front: 'What is a `VAL_` table for?', back: 'Naming a field’s numbers, e.g. gear 3 = "Drive". Great for switches and states.' },
    { id: 'startbit', front: 'Motorola start bit = ?', back: 'The signal’s MSB, in sawtooth numbering (7…0, then 15…8). Bits grow downward.' },
    { id: 'trust', front: 'Why can community DBCs be wrong?', back: 'Reverse-engineered, incomplete, and shared across models; confirmed frames beat the label.' },
  ],
};
