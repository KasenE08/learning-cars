// CAN FD
export default {
  steps: [
    { tag: 'metaphor', title: 'Slow through the toll plaza, fast on the highway',
      body: [
        'Classic CAN is a road where every truck must drive at **toll-booth speed the whole way**, and each truck carries only **8 boxes**.',
        'The toll booth (arbitration) really does need to be slow: every node must agree on each bit. But once a truck has won the booth, nobody else is competing.',
        '[[can-fd|CAN FD]] lets the winner **speed up after the booth** and carry up to **64 boxes**.',
      ] },
    { tag: 'how', title: 'Where it came from',
      body: [
        'Carmakers needed more bandwidth (more sensors, driver assist, faster software updates) without throwing away CAN.',
        'Bosch introduced CAN FD (“Flexible Data-rate”) at the 13th international CAN Conference in **2012** (specification 1.0 dated April 2012).',
        'ISO improved its error protection and standardized it in **ISO 11898-1:2015**. Early “non-ISO” FD controllers aren’t compatible with ISO ones.',
        'The 2024 edition adds [[can-xl|CAN XL]] (up to 2,048 bytes).',
      ] },
    { tag: 'see', title: 'Classic vs FD frame', visualFirst: true,
      visual: { type: 'canfd' },
      body: [
        'Compare the two frames: same arbitration at the start, then the FD frame switches to a faster bit rate for its data phase.',
        'Look at the payload-efficiency bars: 8 bytes vs 64 bytes per frame.',
      ] },
    { tag: 'how', title: 'What changed in the frame',
      body: [
        '**FDF** bit: marks the frame as FD (it sits where classic CAN has a reserved bit). **ESI**: the sender says whether it’s error-passive.',
        '[[brs|BRS]] (bit rate switch): if set, the data phase runs at a higher rate (often 2 Mbit/s or more), then switches back for the ACK.',
        '[[dlc|DLC]] codes 9–15 now mean **12, 16, 20, 24, 32, 48, 64** bytes. (0–8 still mean 0–8.)',
        'A stronger CRC: **CRC-17** for up to 16 bytes, **CRC-21** above. No remote frames in FD.',
      ] },
    { tag: 'math', title: 'Why the data phase speed matters',
      body: [
        '64 data bytes = 512 bits.',
        'At 500 kbit/s: 512 × 2 µs = **1,024 µs**. At 2 Mbit/s: 512 × 0.5 µs = **256 µs**: four times faster for the data.',
        'Classic CAN would need **8 frames** for the same 64 bytes, each with its own ~47 bits of overhead and its own arbitration.',
        'Arbitration and ACK stay at the slow rate, because every node must still agree on those bits.',
      ] },
    { tag: 'why', title: 'Mixing old and new',
      body: [
        'A classic-only controller sees an FD frame as broken and sends [[error-frame|error frames]]. So every node on a bus carrying FD traffic must at least tolerate FD.',
        'FD controllers still speak classic CAN, so an FD module can live on a classic bus by sending only classic frames.',
        'That’s why carmakers usually move a whole bus to FD at once, often with a new vehicle platform.',
      ] },
    { tag: 'bronco', title: 'Classic CAN or FD on your Bronco Sport?',
      body: [
        'In openpilot’s open-source Ford code, the **Bronco Sport 2021–24** is a **classic CAN** platform (Ford Q3 harness).',
        'Newer Fords like the 2023–24 Escape, 2021–23 F-150, Mach-E and 2024 Ranger are listed as **CAN FD** platforms (Q4 harness).',
        'That describes the bus openpilot taps at the windshield camera, from community code, not a Ford spec. Other buses in your car weren’t confirmed.',
      ],
      facts: ['ford.openpilotCanFd'] },
  ],
  quiz: [
    { type: 'mc', q: 'What does the **BRS** bit do in a CAN FD frame?', options: ['Marks the frame as extended-ID', 'Switches the data phase to a faster bit rate', 'Requests a remote frame', 'Resets the error counters'], answer: 1,
      why: 'Bit Rate Switch: after arbitration, the data phase (and CRC) runs at the faster data bit rate, then it switches back for ACK and EOF.' },
    { type: 'mc', q: 'A CAN FD frame has **DLC = 15**. How many data bytes?', options: ['15', '8', '48', '64'], answer: 3,
      why: 'In CAN FD, DLC 9–15 map to 12, 16, 20, 24, 32, 48, 64. 15 → **64**.',
      wrong: { 1: 'That’s what DLC 9–15 mean in *classic* CAN. In FD they map to longer lengths.' } },
    { type: 'mc', q: 'Why does arbitration stay at the slower nominal bit rate in CAN FD?', options: ['To save power', 'Every node must see every arbitration bit within one bit time; only after one winner is left can the bit rate go up', 'Because the CRC is computed there', 'It doesn’t: arbitration is the fast part'], answer: 1,
      why: 'Arbitration needs all nodes to agree bit by bit, which limits speed by bus length. The data phase has just one sender, so it can be faster.' },
  ],
  cards: [
    { id: 'what', front: 'CAN FD in one line?', back: 'Up to 64 data bytes per frame and an optional faster data-phase bit rate. Bosch 2012; ISO 11898-1:2015.' },
    { id: 'brs', front: 'What does BRS mean?', back: 'Bit Rate Switch: the data phase runs at the higher data bit rate.' },
    { id: 'dlc', front: 'CAN FD lengths for DLC 9–15?', back: '12, 16, 20, 24, 32, 48, 64 bytes.' },
    { id: 'crc', front: 'CAN FD CRC sizes?', back: 'CRC-17 up to 16 bytes, CRC-21 above 16 bytes.' },
    { id: 'mix', front: 'Can a classic-only node share a bus with FD traffic?', back: 'Not normally: it sees FD frames as errors and sends error frames.' },
  ],
};
