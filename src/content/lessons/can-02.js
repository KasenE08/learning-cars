// The physical layer
export default {
  steps: [
    { tag: 'metaphor', title: 'Two kids on a trampoline',
      body: [
        'Two kids stand on a trampoline holding a rope. To send a **0**, they pull apart: one high, one low. For a **1**, they relax and stand side by side.',
        'Someone jumps on the trampoline (electrical noise): **both** kids bounce up together. The gap between them doesn’t change.',
        'A receiver that only measures the **gap** never notices the bounce. That’s [[differential-signaling]].',
      ] },
    { tag: 'see', title: 'CAN_H and CAN_L', visualFirst: true,
      visual: { type: 'busvolts' },
      body: [
        '**Recessive** ([[recessive-bit|logic 1]]): both wires rest near **2.5 V**. Difference ≈ 0 V.',
        '**Dominant** ([[dominant-bit|logic 0]]): CAN_H goes to about **3.5 V**, CAN_L to about **1.5 V**. Difference ≈ 2 V.',
        'High-speed CAN (ISO 11898-2) receivers read a difference **above 0.9 V** as dominant and **below 0.5 V** as recessive; the band in between is undefined.',
        'Try “add noise”: both wires move together and the difference survives. Then “remove a terminator” and watch the edges ring.',
      ] },
    { tag: 'how', title: 'Why “dominant” and “recessive”',
      body: [
        'Dominant means a node is **actively driving** the wires apart. Recessive means **nobody is driving**; resistors let the wires drift back together.',
        'So if any one node sends dominant while others send recessive, the bus reads **dominant**. Dominant always wins.',
        'Engineers call this a **wired-AND**: the bus is 1 only if *everyone* sends 1.',
        'This one property makes both [[arbitration]] and the [[ack-slot|ACK bit]] possible (next lessons).',
      ] },
    { tag: 'how', title: '120 Ω at each end',
      body: [
        'A fast edge travels down the wire like a wave. At an open end it **reflects** back and smears the next bits (ringing).',
        'A [[termination-resistor|120 Ω terminator]] at **each of the two ends** of the bus soaks up the wave. 120 Ω matches the cable’s characteristic impedance, which is nominally 120 Ω.',
        'Two 120 Ω resistors in parallel = **60 Ω** between CAN_H and CAN_L. That’s why a reading of about 60 Ω (power off) means both terminators are present, and 120 Ω means one is missing.',
        'Terminators also pull the wires back together quickly after a dominant bit, so recessive bits look clean.',
      ] },
    { tag: 'how', title: 'Twisted wires, and a chip in every module',
      body: [
        'The two wires are a [[twisted-pair]]: twisting keeps them side by side, so they pick up the **same** noise (which cancels) and radiate less themselves.',
        'Receivers must cope with both wires shifted together by roughly −2 V to +7 V (the common-mode range) and still read the difference.',
        'Inside each module, the [[can-controller]] (usually part of the main chip) handles bits and frames. A separate [[can-transceiver]] chip converts those logic bits to bus voltages and back.',
      ] },
    { tag: 'see', title: 'Find the transceiver', visualFirst: true,
      visual: { type: 'parts', drawing: 'ecu' },
      body: [
        'Tap `can-xcvr`: the small chip between the connector pins and the microcontroller.',
        'It also protects the module from shorts and voltage spikes on the bus wires.',
      ] },
    { tag: 'bronco', title: 'On your OBD port',
      body: [
        'Your 2024 Bronco Sport speaks OBD-II over CAN on **pins 6 (CAN_H) and 14 (CAN_L)** of the port.',
        'Classic Ford layouts also had a slower **[[ms-can|MS-CAN]]** pair on pins 3 and 11; newer Fords put a [[gateway]] in between. Details in “How Ford organizes its networks”.',
      ],
      facts: ['bronco.obdProtocol', 'ford.hsMsCan'] },
  ],
  quiz: [
    { type: 'tap', q: 'Tap the **CAN transceiver**: the chip that turns logic bits into CAN_H/CAN_L voltages.', visual: { type: 'parts', drawing: 'ecu' }, answer: 'can-xcvr',
      why: 'The transceiver sits between the bus wires (via the connector) and the microcontroller’s CAN controller.',
      wrong: { mcu: 'That’s the microcontroller. Its built-in CAN controller makes the bits, but it can’t drive the bus wires directly.', connector: 'The connector carries the wires in; the transceiver is the chip right behind it.' } },
    { type: 'mc', q: 'A noise spike lifts **both** CAN_H and CAN_L by 1 V during a dominant bit. What does the receiver read?', options: ['Recessive, because CAN_L went up', 'Dominant, because the difference is still ≈2 V', 'An undefined value', 'Nothing: the bus shuts down'], answer: 1,
      why: 'The receiver only looks at CAN_H − CAN_L. Noise that hits both wires equally cancels out, which is the whole idea of differential signaling.' },
    { type: 'mc', q: 'Node A sends **recessive** and node B sends **dominant** in the same bit. The bus reads…', options: ['Recessive', 'Dominant', 'Half way', 'An error, always'], answer: 1,
      why: 'Recessive = nobody driving; dominant = someone driving. Any driver pulls the wires apart, so dominant wins. That’s what arbitration relies on.' },
  ],
  cards: [
    { id: 'levels', front: 'CAN_H / CAN_L voltages for dominant and recessive?', back: 'Dominant: ≈3.5 V / 1.5 V (≈2 V difference) = 0. Recessive: both ≈2.5 V (≈0 V) = 1.' },
    { id: 'diff', front: 'Why does CAN use a differential pair?', back: 'Noise shifts both wires together; the receiver reads only the difference, so the noise cancels.' },
    { id: 'term', front: 'CAN termination: how many, what value, what do you measure?', back: 'Two 120 Ω resistors, one at each end; together they read 60 Ω.' },
    { id: 'wins', front: 'Dominant vs recessive: which wins and why?', back: 'Dominant. It’s actively driven; recessive is just “nobody driving”.' },
    { id: 'xcvr', front: 'CAN controller vs CAN transceiver?', back: 'Controller: builds/checks frames (logic). Transceiver: converts logic bits to bus voltages and back.' },
  ],
};
