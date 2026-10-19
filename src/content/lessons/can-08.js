// Multiple buses in one car
export default {
  steps: [
    { tag: 'metaphor', title: 'A city’s road network',
      body: [
        'A city doesn’t build every road as a highway. It has **highways** for urgent traffic, **local streets**, **cul-de-sacs** with a few houses, a **train** that runs on a strict timetable, and a **fiber trunk** for huge data.',
        'Where they meet, there are **interchanges**.',
        'A car is the same: several networks, each sized for its job, joined by [[gateway|gateways]].',
      ] },
    { tag: 'see', title: 'A typical layout', visualFirst: true,
      visual: { type: 'network', preset: 'generic' },
      body: [
        'Tap each module and bus. Powertrain and chassis share fast CAN; body modules sit on slower buses; infotainment is separate.',
        'Real cars differ in names, speeds and who sits where.',
      ] },
    { tag: 'how', title: 'Three speeds of CAN',
      body: [
        '[[hs-can|High-speed CAN]] (ISO 11898-2): up to 1 Mbit/s, usually 500 kbit/s in cars. Engine, transmission, ABS, steering, driver assist.',
        '**Medium-speed CAN** (Ford’s [[ms-can|MS-CAN]], up to 125 kbit/s): body and comfort (locks, climate, seats) where speed matters less.',
        '**Low-speed fault-tolerant CAN** (ISO 11898-3, up to 125 kbit/s): keeps working even if one of the two wires breaks or shorts.',
        'Plus [[can-fd|CAN FD]] on newer platforms for more bandwidth.',
      ] },
    { tag: 'how', title: 'LIN: the cul-de-sac',
      body: [
        '[[lin-bus|LIN]]: **one wire**, up to **20 kbit/s**, 1–8 data bytes per frame. Standardized as ISO 17987.',
        'One **master** (often a body module) asks each simple device in turn: “switch, what’s your state?” Devices only answer; no arbitration needed.',
        'Very cheap chips, so it’s used for window switches, mirror motors, rain/light sensors, seat controls.',
        'The master is usually also on CAN, acting as the bridge.',
      ] },
    { tag: 'how', title: 'FlexRay and automotive Ethernet',
      body: [
        '[[flexray|FlexRay]]: up to **10 Mbit/s** on each of **two** channels (redundancy), up to 254 data bytes. **Time-triggered**: every node owns fixed time slots, so timing is guaranteed. BMW first used it in production in the E70 X5. Now ISO 17458.',
        '[[automotive-ethernet|Automotive Ethernet]]: **100BASE-T1** (IEEE 802.3bw, born as Broadcom’s BroadR-Reach) runs 100 Mbit/s over **one unshielded twisted pair**; 1000BASE-T1 runs 1 Gbit/s.',
        'Ethernet carries cameras, infotainment, driver-assist data and fast software updates, and links big domain or zone computers. Diagnostics can run over IP too (DoIP, ISO 13400).',
      ] },
    { tag: 'see', title: 'Side by side', visualFirst: true,
      visual: { type: 'compare', title: 'In-vehicle networks (typical maximums)', metrics: [
        { key: 'speed', label: 'Bit rate', unit: 'kbit/s' },
        { key: 'payload', label: 'Data per frame', unit: 'bytes' },
      ], items: [
        { name: 'LIN', note: 'one wire, master polls', values: { speed: 20, payload: 8 } },
        { name: 'MS-CAN', note: 'Ford body bus', values: { speed: 125, payload: 8 } },
        { name: 'HS-CAN', note: 'typical car rate', values: { speed: 500, payload: 8 } },
        { name: 'CAN FD', note: 'data phase, common setting', values: { speed: 2000, payload: 64 } },
        { name: 'FlexRay', note: 'per channel', values: { speed: 10000, payload: 254 } },
        { name: '100BASE-T1', note: 'one twisted pair', values: { speed: 100000, payload: 1500 } },
      ] },
      body: [
        'The Ethernet bar dwarfs the rest: 200× a 500 kbit/s CAN bus. (1,500 bytes is a standard Ethernet frame’s payload.)',
        'Speed isn’t everything: CAN is cheap, robust and simple, which is why it isn’t going away.',
      ] },
    { tag: 'key', title: 'Why not one big network?',
      body: [
        '**Cost:** a LIN switch chip is far cheaper than an Ethernet port.',
        '**Bandwidth:** cameras need Ethernet; door locks don’t.',
        '**Containment:** a fault (or flood of traffic) on one bus doesn’t take down the others.',
        '**Security:** the [[gateway]] decides what crosses between buses, so the infotainment side can’t talk straight to the brakes.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'Which network fits a **power-window switch** best?', options: ['FlexRay', '100BASE-T1 Ethernet', 'LIN', 'High-speed CAN FD'], answer: 2,
      why: 'A switch sends a few bits now and then. LIN is cheap, single-wire and plenty fast for it.' },
    { type: 'mc', q: 'Which bus is **time-triggered**, giving every node fixed time slots?', options: ['CAN', 'LIN', 'FlexRay', 'MS-CAN'], answer: 2,
      why: 'FlexRay’s static segment gives each node fixed slots, so timing is guaranteed. CAN is event-driven with arbitration; LIN is polled by a master.',
      wrong: { 1: 'LIN is polled by one master on a schedule, which is close, but FlexRay is the one built around fixed time slots on fast redundant channels.' } },
    { type: 'order', q: 'Order these from **slowest to fastest** typical bit rate.', items: ['LIN', 'MS-CAN', 'HS-CAN', 'FlexRay', '100BASE-T1'],
      why: '20 kbit/s → 125 kbit/s → 500 kbit/s → 10 Mbit/s → 100 Mbit/s.' },
  ],
  cards: [
    { id: 'lin', front: 'LIN in one line?', back: 'Single wire, up to 20 kbit/s, one master polls simple devices (switches, motors, sensors).' },
    { id: 'flexray', front: 'FlexRay in one line?', back: 'Time-triggered, up to 10 Mbit/s on two redundant channels; fixed time slots.' },
    { id: 'eth', front: '100BASE-T1?', back: 'Automotive Ethernet: 100 Mbit/s over one unshielded twisted pair (IEEE 802.3bw, ex-BroadR-Reach).' },
    { id: 'ft', front: 'What’s special about low-speed fault-tolerant CAN?', back: 'ISO 11898-3, up to 125 kbit/s; keeps working if one wire breaks or shorts.' },
    { id: 'why', front: 'Why do cars have several networks?', back: 'Cost, bandwidth, fault containment and security; gateways connect them.' },
  ],
};
