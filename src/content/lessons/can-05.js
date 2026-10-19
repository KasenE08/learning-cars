// Bit timing & bus speeds
export default {
  steps: [
    { tag: 'metaphor', title: 'A rowing crew with no coach',
      body: [
        'Eight rowers, no one calling the beat. Each keeps time in their head, and **re-syncs every time they hear a splash**.',
        'They don’t judge a stroke the instant the oar touches water (too messy); they look a moment later, when it’s settled.',
        'CAN works the same way: no clock wire, each node counts time itself, re-syncs on **edges**, and reads each bit **late**, at the [[sample-point]].',
      ] },
    { tag: 'see', title: 'Inside one bit', visualFirst: true,
      visual: { type: 'bittiming', bitrate: 500000 },
      body: [
        'Each bit is split into [[time-quantum|time quanta]] (tq). Pick a bit rate and watch the bit time and segments change.',
        'Classic CAN allows **8–25 tq** per bit; 16 is a common choice.',
      ] },
    { tag: 'how', title: 'Four segments',
      body: [
        '**Sync** (always 1 tq): where an edge is expected to land.',
        '**Propagation**: covers the time for a signal to cross the bus and back through the transceivers. Needed because during arbitration every node must see the *same* bit.',
        '**Phase 1** and **Phase 2**: buffers on either side of the sample point that can stretch or shrink to correct drift.',
        'Sync on the [[sof|SOF]] edge (hard sync), then **resynchronize** on later edges by stretching Phase 1 or shortening Phase 2, by at most the sync jump width (SJW). [[bit-stuffing|Stuffing]] guarantees those edges keep coming.',
      ] },
    { tag: 'math', title: 'Doing the numbers at 500 kbit/s',
      body: [
        'Bit time = 1 ÷ bit rate = 1 ÷ 500,000 = **2 µs**.',
        'With 16 tq per bit: 1 tq = 2 µs ÷ 16 = **125 ns**.',
        'Sync 1 + Prop 7 + Phase 1 6 = 14 tq before the sample; Phase 2 = 2 tq after. Sample point = 14 ÷ 16 = **87.5%**, i.e. 1.75 µs into the bit.',
        'At 125 kbit/s the same split gives an 8 µs bit and 500 ns quanta.',
      ] },
    { tag: 'how', title: 'Speed vs bus length',
      body: [
        'Common classic CAN rates: **125, 250, 500 kbit/s and 1 Mbit/s**. In cars, the main high-speed buses usually run at **500 kbit/s**; OBD over CAN uses 250 or 500 ([[iso-15765]]).',
        'The faster the bit, the less time a signal has to cross the wire and come back before the sample point. So **faster = shorter bus**.',
        'CiA’s table: 1 Mbit/s ≈ 25 m, 500 kbit/s ≈ 100 m, 250 kbit/s ≈ 250 m, 125 kbit/s ≈ 500 m. Some sources give 30–40 m for 1 Mbit/s (sources disagree). A car is a few meters, so 500 kbit/s is comfortable.',
        'Sample point: CiA recommends **87.5%**; automotive specs (SAE J2284) are reported to use about 75–85%. Every node on a bus must agree on the bit rate, or every frame turns into errors.',
      ] },
    { tag: 'math', title: 'How busy is the bus?', visualFirst: true,
      visual: { type: 'candump', scenario: 'idle' },
      body: [
        'Toggle the per-ID table. In this **simulated** capture (made-up rates): five IDs every 20 ms (50/s), two every 50 ms, two every 100 ms, one every 200 ms = **315 frames/s**.',
        '315 × 111 bits ≈ 35,000 bit/s; with worst-case stuffing (135 bits) ≈ 42,500 bit/s. Out of 500,000: about **7–8.5%** [[bus-load]].',
        'A real car carries many more IDs, so real loads are higher. Designers keep a big margin so low-priority frames still get through.',
      ] },
  ],
  quiz: [
    { type: 'num', q: 'How long is one bit at **250 kbit/s**?', answer: 4, tol: 0, unit: 'µs',
      hint: '1 ÷ 250,000 seconds', why: '1 ÷ 250,000 = 0.000004 s = **4 µs**. Halve the bit rate, double the bit time.' },
    { type: 'num', q: 'At **500 kbit/s** with **16** time quanta per bit, how long is one quantum?', answer: 125, tol: 0, unit: 'ns',
      why: 'Bit time 2 µs = 2,000 ns; 2,000 ÷ 16 = **125 ns**.' },
    { type: 'order', q: 'Put the parts of one CAN bit in order.', items: ['Sync segment', 'Propagation segment', 'Phase segment 1', 'Sample point', 'Phase segment 2'],
      why: 'Sync (edge expected) → propagation delay → phase 1 → the sample → phase 2, then the next bit’s sync.' },
    { type: 'mc', q: 'Why must a 1 Mbit/s bus be much shorter than a 125 kbit/s bus?', options: ['Faster signals lose voltage', 'Every node must see each bit (including arbitration) before the sample point, and a shorter bit leaves less time for the signal to cross the wire', 'Terminators only work on short buses', 'It doesn’t: length doesn’t matter'], answer: 1,
      why: 'Arbitration needs everyone to agree on each bit within one bit time. Signal travel time is fixed per meter, so a shorter bit forces a shorter bus.' },
    { type: 'mc', q: 'Why sample late in the bit (e.g. 87.5%) instead of right at the start?', options: ['To save power', 'The signal needs time to settle after an edge, and delays along the bus need covering', 'To make the bus faster', 'So the CRC works'], answer: 1,
      why: 'Right after an edge the wires may still be ringing, and far-away nodes’ bits arrive late. Sampling late reads a settled value.' },
  ],
  cards: [
    { id: 'bittime', front: 'Bit time at 500 kbit/s?', back: '2 µs (1 ÷ 500,000).' },
    { id: 'segments', front: 'The four segments of a CAN bit?', back: 'Sync (1 tq), propagation, phase 1, phase 2. The sample point sits between phase 1 and phase 2.' },
    { id: 'sp', front: 'Typical CAN sample point?', back: '≈75–87.5% of the bit. CiA recommends 87.5%.' },
    { id: 'rates', front: 'Common CAN bit rates, and the usual one in cars?', back: '125k, 250k, 500k, 1M bit/s. High-speed car buses usually run 500 kbit/s.' },
    { id: 'length', front: 'Why does a faster CAN bus have to be shorter?', back: 'All nodes must see each bit before the sample point; signal travel time limits length.' },
  ],
};
