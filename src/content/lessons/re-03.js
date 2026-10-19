// Change one thing at a time
const SETUP = `def parse_line(line):
    """(t, can_id, data) from one
    candump line."""
    ts, iface, frame = line.split()
    id_hex, data_hex = frame.split("#")
    t = float(ts.strip("()"))
    cid = int(id_hex, 16)
    return t, cid, bytes.fromhex(data_hex)

frames = [parse_line(l)
          for l in open("blinker.log")]

def window(frames, t0, t1):
    """Frames with t0 <= t < t1."""
    return [f for f in frames
            if t0 <= f[0] < t1]

def byte_values(frames):
    """{(can_id, byte_index): set of
    values that byte took}"""
    vals = {}
    for t, cid, data in frames:
        for i, b in enumerate(data):
            vals.setdefault((cid, i), set())
            vals[(cid, i)].add(b)
    return vals
`;

export default {
  steps: [
    { tag: 'metaphor', title: 'New house, unlabeled switches',
      body: [
        'You move into a house with a panel of unlabeled light switches. Flip them all at once and you learn nothing.',
        'Flip **one**, look around, flip it back. Then the next. Boring, and it works every time.',
        'On a CAN bus, the “switches” are things you can do on purpose: signal left, open a door, press the brake. **One at a time, at a time you write down.**',
      ] },
    { tag: 'how', title: 'Quiet window, action window',
      body: [
        'Record a few seconds where **nothing** changes (the quiet window), then do one action (the action window).',
        'Lots of bytes change all the time anyway: [[rolling-counter|counters]], [[checksum|checksums]], noisy sensors. They’re the background chatter.',
        'The rule that cuts through it: a byte is a **suspect** if it was **constant in the quiet window** and **took a different value during the action**.',
        'Then repeat the action (left, then right; three presses) to confirm the suspect follows *you*, not the clock.',
      ] },
    { tag: 'see', title: 'Watch the turn signal', visualFirst: true,
      visual: { type: 'candump', scenario: 'blinker', highlight: true },
      body: [
        '**Simulated** capture, parked: left signal at 2–6 s, right signal at 8–11 s.',
        'Filter to 083 and 3B3 and watch which bytes flash. One holds steady while the lever is on; one blinks.',
      ] },
    { tag: 'code', title: 'Find the suspect bytes',
      body: [
        'Helpers are ready: `frames` (the whole capture), `window(frames, t0, t1)` and `byte_values(frames)`, which gives every byte’s set of values.',
        'You write the rule, then name what you found.',
      ],
      code: {
        id: 're-03-suspects',
        prompt: 'Finish `suspects(quiet, action)`, then set `SWITCH_ID` and `LAMP_ID` from what it prints.',
        setup: SETUP,
        files: { 'blinker.log': 'sim:blinker' },
        starter: `def suspects(quiet, action):
    q = byte_values(quiet)
    a = byte_values(action)
    found = []
    for key in a:
        # constant while quiet
        # (exactly one value)...
        steady = ___
        # ...and the action showed
        # a different set of values
        moved = ___
        if steady and moved:
            found.append(key)
    return sorted(found)

quiet = window(frames, 0, 2)
left = window(frames, 2, 6)
right = window(frames, 8, 11)
for cid, i in suspects(quiet, left):
    vals = byte_values(left)[(cid, i)]
    print(hex(cid), "byte", i,
          [hex(v) for v in vals])

# One ID holds a steady value while
# the lever is on: the switch.
# One flips on and off: the lamp.
SWITCH_ID = ___
LAMP_ID = ___
`,
        tests: [
          { name: 'Left signal: finds 0x83 byte 0 and 0x3B3 byte 6, nothing else', code: 'got = suspects(quiet, left)\nassert got == [(0x83, 0), (0x3B3, 6)], f"got {[(hex(c), i) for c, i in got]}"' },
          { name: 'Right signal: 0x83 byte 0 and 0x3B3 byte 4', code: 'got = suspects(quiet, right)\nassert got == [(0x83, 0), (0x3B3, 4)], f"got {[(hex(c), i) for c, i in got]}"' },
          { name: 'Ignores counters and checksums', code: 'got = suspects(quiet, left)\nassert (0x415, 3) not in got and (0x204, 0) not in got, f"got {[(hex(c), i) for c, i in got]}"' },
          { name: 'Names the switch and the lamp', code: 'assert SWITCH_ID == 0x83, f"SWITCH_ID is {SWITCH_ID!r}"\nassert LAMP_ID == 0x3B3, f"LAMP_ID is {LAMP_ID!r}"' },
        ],
        hints: [
          '`q[key]` is a set of values. “Constant” means that set has exactly one item: `len(q[key]) == 1`.',
          '“Different during the action” can be as simple as `a[key] != q[key]`.',
          'Look at the printout: 0x83 byte 0 shows one value (it’s held), 0x3B3 byte 6 shows two (0x0 and 0x40: on, off). So the switch is `0x83` and the lamp `0x3B3`.',
        ],
        solution: `def suspects(quiet, action):
    q = byte_values(quiet)
    a = byte_values(action)
    found = []
    for key in a:
        # one value the whole time
        steady = len(q[key]) == 1
        # and something new happened
        moved = a[key] != q[key]
        if steady and moved:
            found.append(key)
    return sorted(found)

quiet = window(frames, 0, 2)
left = window(frames, 2, 6)
right = window(frames, 8, 11)
for cid, i in suspects(quiet, left):
    vals = byte_values(left)[(cid, i)]
    print(hex(cid), "byte", i,
          [hex(v) for v in vals])

# 0x83 holds 0x10 while the lever
# is on; 0x3B3 blinks 0x00/0x40
SWITCH_ID = 0x83
LAMP_ID = 0x3B3
`,
      } },
    { tag: 'how', title: 'Switch vs lamp: two messages, two meanings', visualFirst: true,
      visual: { type: 'bitfield', signal: 'TurnLghtSwtch_D_Stat', data: '1000000000000000' },
      body: [
        '**0x83 byte 0** (`TurnLghtSwtch_D_Stat`, bits 5–4): the **lever position**. 1 = left (0x10), 2 = right (0x20). Steady while you hold it.',
        '**0x3B3** (`TurnLghtLeftOn_B_Stat` byte 6 bit 6, `TurnLghtRightOn_B_Stat` byte 4 bit 3): the **lamp** actually lit, flipping on and off about 1.5 times a second.',
        'That’s a real design pattern: one module reports what the driver **asked for**, another what the car **is doing**. A body module flashes the lamps, so their state is a separate signal.',
        'Names and bit positions: community DBC (openpilot), not Ford. The capture is simulated.',
      ] },
    { tag: 'key', title: 'Habits that save hours',
      body: [
        '**Log the timeline** as you go (“2 s: left on”). A suspect must move when you did.',
        '**Repeat with a twist**: left and right should touch the same switch byte with different values. That’s how you learn 1 = left, 2 = right.',
        '**Hold actions for a few seconds** so slow (5–10 Hz) messages catch them.',
        '**One action at a time.** Brake + blinker together, and you can’t tell whose byte is whose.',
      ] },
  ],
  quiz: [
    { type: 'order', q: 'Put the “one thing at a time” method in order.',
      items: ['Record a quiet window', 'Do one action and note the time', 'Flag bytes constant before but different during', 'Repeat the action with a variation', 'Name the signal and its values'],
      why: 'The quiet window defines “normal”, the action makes a difference, the rule filters background chatter, and the repeat proves the byte follows you.' },
    { type: 'mc', q: 'Why does the rule “constant in the quiet window” drop counters and checksums?',
      options: ['They’re in a different ID', 'They change every frame, so they’re never constant', 'They’re always zero', 'Python can’t read them'], answer: 1,
      why: 'A rolling counter ticks every frame and a checksum changes with it, so their byte sets have many values even when nothing is happening. They fail the “steady” test.' },
    { type: 'mc', q: 'During the left signal, 0x83 byte 0 stays **0x10** while 0x3B3 byte 6 flips **0x00 ↔ 0x40**. Which is the lamp?',
      options: ['0x83: it changed first', '0x3B3: it blinks like the lamp does', 'Both are the lever', 'Neither; lamps aren’t on CAN'], answer: 1,
      why: 'The lever is held steadily; the lamp flashes. A byte that copies the flashing pattern is the lamp state; the steady one is the switch position.' },
    { type: 'num', q: 'In the simulation the lamp is on for 333 ms, then off for 333 ms. How many flashes per second is that?', answer: 1.5, tol: 0.05, unit: 'per second',
      why: 'One on/off cycle = 666 ms. 1 ÷ 0.666 s ≈ **1.5 flashes per second** (about 90 a minute).' },
  ],
  cards: [
    { id: 'rule', front: 'The suspect-byte rule?', back: 'Constant during the quiet window, different during the action.' },
    { id: 'noise', front: 'What background chatter changes even when nothing happens?', back: 'Rolling counters, checksums and noisy sensor values.' },
    { id: 'switch', front: 'Turn signal on the Ford bus (community DBC)?', back: '0x83 byte 0 = lever position (1 left, 2 right); 0x3B3 bits = lamp actually lit (flashing).' },
    { id: 'askdo', front: 'Why two different turn-signal messages?', back: 'One reports what the driver asked for (switch), another what the car is doing (lamp).' },
    { id: 'hold', front: 'Why hold an action for a few seconds?', back: 'Slow 5–10 Hz messages need time to show it, and you get several frames to confirm.' },
  ],
};
