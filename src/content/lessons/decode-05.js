// Counters & checksums
const HELPERS = `def motorola(data, start, length):
    """Raw value of a Motorola (big-endian)
    DBC signal: start bit = MSB."""
    value = int.from_bytes(data, "big")
    msb = (start // 8) * 8 + (7 - start % 8)
    shift = len(data) * 8 - msb - length
    return (value >> shift) & ((1 << length) - 1)

def read_frames(path):
    """Data bytes of every line in a log."""
    frames = []
    for line in open(path):
        frame = line.split()[2]
        id_hex, data_hex = frame.split("#")
        frames.append(bytes.fromhex(data_hex))
    return frames
`;

export default {
  steps: [
    { tag: 'metaphor', title: 'A deli ticket and a jar seal',
      body: [
        'A [[rolling-counter]] is a **deli ticket number**: each new message takes the next one. A repeated number means the sender is stuck; a skipped one means messages got lost.',
        'A [[checksum]] is a **tamper-evident seal** on a jar: it’s computed from the contents, so if a byte changes, the seal no longer matches.',
        'Together they let a module ask: “is this **fresh**, and is it **intact**?” before it trusts a brake or steering value.',
      ] },
    { tag: 'how', title: 'The counter and the quality flag in 0x415',
      body: [
        '`VehVActlBrk_No_Cnt` (`21|4@0+`): 4 bits, counts 0 … 15 then wraps to 0, one step per frame.',
        'The DBC lists a **20 ms** cycle time for `0x415` (the simulator uses 20 ms too), so the counter wraps every 16 × 20 = 320 ms.',
        '`VehVActlBrk_D_Qf` is a [[quality-flag]]: 3 = OK, 2 = Not_Within_Specifications, 1 = No_Data_Exists, 0 = Faulty. It tells receivers whether to trust the speed at all.',
        'Source: the community DBC in the open-source openpilot project (reverse-engineered, not from Ford).',
      ] },
    { tag: 'see', title: 'Where they sit', visualFirst: true,
      visual: { type: 'bitfield', signal: 'VehVActlBrk_No_Cnt' },
      body: [
        'Byte 2: quality flag on top (bits 7–6), counter below it (bits 5–2). Byte 3 is the 8-bit checksum `VehVActlBrk_No_Cs`.',
        'That’s why bytes 2 and 3 change in every frame of the log even when the speed doesn’t.',
      ] },
    { tag: 'how', title: 'CAN already has a CRC. Why another check?',
      body: [
        'CAN’s built-in **CRC** only protects the bits **on the wire** of one bus, from the sending CAN controller to the receiving ones. The controller hardware checks it; software never sees it.',
        'A counter + checksum inside the data travels **end to end**: through gateways and software, from the sender’s code to the receiver’s code. AUTOSAR’s “E2E protection” standardizes the same idea for safety-critical data.',
        'It is **not security**. There’s no secret: anyone who knows the formula can compute a valid checksum. Real authentication needs a secret key (security unit).',
      ] },
    { tag: 'math', title: 'The Ford checksum (as openpilot documents it)',
      body: [
        'openpilot’s `ford_checksum` (in opendbc) covers three signals of `0x415`: speed, counter and quality flag.',
        'For each: `total += raw + (raw >> 8)`. Then `checksum = ~total & 0xFF` (flip every bit, keep the low byte; same as `255 − (total & 0xFF)`).',
        'Frame `0FA0C04D…`: speed raw 4,000 → 4,000 + 15 = 4,015; counter 0 → 0; flag 3 → 3. Total **4,018** = `0x0FB2`.',
        '`~0x0FB2 & 0xFF` = `0x4D`, which matches byte 3. ✔',
      ] },
    { tag: 'see', title: 'Tamper with a frame',
      visual: { type: 'checksum', mode: 'ford' },
      body: [
        'Change one byte and the receiver recomputes the checksum, gets a different answer and throws the frame away. Repeat a counter and it’s rejected as stale.',
      ] },
    { tag: 'code', title: 'Verify every checksum in a log',
      body: [
        '`brk.log` is a **simulated** drive (made-up values) containing only ID `0x415`.',
        'Already loaded for you: `motorola(data, start, length)` returns a signal’s raw value, and `read_frames(path)` returns each line’s data bytes.',
        '`for start, length in FIELDS:` unpacks each pair into two variables.',
      ],
      code: {
        id: 'decode-05-checksum',
        prompt: 'Finish `checksum_ok(data)` so it recomputes the Ford checksum and compares it with byte 3.',
        setup: HELPERS,
        files: { 'brk.log': 'sim:drive?ids=415' },
        starter: `# (start bit, length) from the DBC
FIELDS = [
    (7, 16),  # Veh_V_ActlBrk
    (21, 4),  # VehVActlBrk_No_Cnt
    (23, 2),  # VehVActlBrk_D_Qf
]

def checksum_ok(data):
    total = 0
    for start, length in FIELDS:
        raw = motorola(data, start, length)
        # add raw plus its upper byte
        total = total + raw + ___
    # flip the bits, keep the low byte
    expected = ~total & ___
    # byte 3 = VehVActlBrk_No_Cs
    return expected == data[3]

ok = 0
frames = read_frames("brk.log")
for f in frames:
    if checksum_ok(f):
        ok = ok + 1
print(ok, "of", len(frames), "OK")
`,
        tests: [
          { name: 'The worked example 0FA0C04D… passes', code: 'f = bytes.fromhex("0FA0C04D00000000")\nassert checksum_ok(f) is True, f"got {checksum_ok(f)!r}"' },
          { name: 'Every simulated frame in brk.log passes', code: 'fr = read_frames("brk.log")\nbad = [x.hex() for x in fr if not checksum_ok(x)]\nassert not bad, f"{len(bad)} of {len(fr)} failed, first: {bad[0] if bad else None}"' },
          { name: 'A tampered speed byte is caught', code: 'f = bytes.fromhex("0FA1C04D00000000")\nassert checksum_ok(f) is False, "a changed speed byte still passed"' },
          { name: 'A changed counter with the old checksum is caught', code: 'f = bytes.fromhex("0FA0C44D00000000")\nassert checksum_ok(f) is False, "a changed counter still passed"' },
        ],
        hints: [
          '“Its upper byte” is the raw value shifted right by 8.',
          'Keeping the low byte means AND with eight ones: `0xFF`.',
          '`total = total + raw + (raw >> 8)` and `expected = ~total & 0xFF`',
        ],
        solution: `# (start bit, length) from the DBC
FIELDS = [
    (7, 16),  # Veh_V_ActlBrk
    (21, 4),  # VehVActlBrk_No_Cnt
    (23, 2),  # VehVActlBrk_D_Qf
]

def checksum_ok(data):
    total = 0
    for start, length in FIELDS:
        raw = motorola(data, start, length)
        total = total + raw + (raw >> 8)
    # invert, keep the low 8 bits
    expected = ~total & 0xFF
    return expected == data[3]

ok = 0
frames = read_frames("brk.log")
for f in frames:
    if checksum_ok(f):
        ok = ok + 1
print(ok, "of", len(frames), "OK")  # 1500
`,
      } },
  ],
  quiz: [
    { type: 'mc', q: 'A receiver sees the same counter value in two frames in a row. What does that suggest?', options: ['The frame is fine', 'The sender is stuck or the frame was repeated', 'The bus is too fast', 'The checksum is wrong'], answer: 1,
      why: 'A healthy sender bumps the counter every frame. A repeat means stale data, whether from a fault or a replay.' },
    { type: 'mc', q: 'Does the Ford checksum stop an attacker from faking a `0x415` frame?', options: ['Yes, it’s encrypted', 'No: there’s no secret, anyone can compute it', 'Yes, only Ford knows the formula', 'Only if the counter is used too'], answer: 1,
      why: 'It catches accidental corruption. The formula is public (openpilot documents it), so it gives no protection against a deliberate forgery; that needs a secret key (a MAC).' },
    { type: 'order', q: 'Order the steps of the Ford checksum check.',
      items: ['Extract speed, counter and quality raw values', 'Add up raw + (raw >> 8) for each', 'Invert and keep the low byte', 'Compare with byte 3'],
      why: 'Recompute the checksum from the covered fields exactly as the sender did, then compare it with the checksum the sender put in the frame.' },
  ],
  cards: [
    { id: 'counter', front: 'What is a rolling counter for?', back: 'Proves each frame is fresh: +1 per frame, wraps (0–15 for 4 bits). Repeats = stuck/replayed; gaps = lost frames.' },
    { id: 'fordcs', front: 'Ford checksum for 0x415 (per openpilot)?', back: 'Sum `raw + (raw >> 8)` over speed, counter, quality flag; then `~sum & 0xFF`. Stored in byte 3.' },
    { id: 'crc', front: 'Why a checksum when CAN has a CRC?', back: 'CAN’s CRC covers one wire hop; the in-data checksum + counter cover sender code to receiver code (end to end).' },
    { id: 'qf', front: 'What does `VehVActlBrk_D_Qf` = 3 mean?', back: 'Quality flag OK: the speed value can be trusted. (0 Faulty, 1 No data, 2 Not within specs.)' },
    { id: 'notsec', front: 'Is a checksum a security feature?', back: 'No. No secret key, so anyone can compute it. Authentication needs a MAC with a key.' },
  ],
};
