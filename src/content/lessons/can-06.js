// Errors & fault confinement
export default {
  steps: [
    { tag: 'metaphor', title: 'Anyone can yell “stop!”',
      body: [
        'Picture a classroom where **anyone** who spots a mistake can yell “STOP, that was wrong!” and everyone throws the last sentence away.',
        'But a student who keeps causing trouble first **loses the right to yell**, and if it goes on, is **sent out of the room** so the class can keep working.',
        'That’s CAN error handling: errors are caught by everyone, and a faulty node removes itself.',
      ] },
    { tag: 'how', title: 'Five ways a frame can fail',
      body: [
        '**Bit error**: a sender reads back a different bit than it sent (outside arbitration and the ACK slot, where that’s normal).',
        '**Stuff error**: 6 identical bits in a row where [[bit-stuffing]] applies.',
        '**CRC error**: a receiver’s computed [[crc|CRC]] doesn’t match. **Form error**: a fixed bit (a delimiter or EOF) has the wrong value.',
        '**ACK error**: the sender sees no dominant bit in the [[ack-slot|ACK slot]]: nobody received it.',
      ] },
    { tag: 'how', title: 'The error frame',
      body: [
        'A node that detects an error sends an **active error flag**: **6 dominant bits**, right away ([[error-frame]]).',
        'Six equal bits break the stuffing rule on purpose, so **every** node sees an error too and throws the frame away. Either everyone accepts a frame or nobody does.',
        'Then 8 recessive bits (error delimiter), and the sender **retries** automatically.',
      ] },
    { tag: 'see', title: 'Counters and states', visualFirst: true,
      visual: { type: 'errors' },
      body: [
        'Each node keeps two counters, [[tec-rec|TEC and REC]]. A transmit error adds **8** to TEC; a receive error usually adds **1** to REC. Each good frame subtracts 1.',
        '**Error-active** (both ≤ 127): normal. [[error-passive|Error-passive]] (either > 127): may still talk, but flags errors with **recessive** bits that don’t disturb others, and waits an extra 8 bits before sending again.',
        '[[bus-off|Bus-off]] (TEC > 255): the node disconnects. It may come back only after seeing **128 × 11 recessive bits** (a quiet bus).',
        'Press the buttons: errors climb fast (+8), good frames bring it down slowly (−1).',
      ] },
    { tag: 'math', title: 'How fast does a broken sender fall?',
      body: [
        'Every attempt fails: TEC goes 8, 16, 24…',
        'Error-passive at **TEC > 127**: 128 ÷ 8 = after **16** failed attempts.',
        'Bus-off at **TEC > 255**: 256 ÷ 8 = after **32** failed attempts. At 500 kbit/s that takes only milliseconds.',
        'The +8 / −1 imbalance is deliberate: a node must succeed many times to earn back one failure.',
      ] },
    { tag: 'why', title: 'Why this matters in a real car',
      body: [
        'A module with a broken transceiver can’t jam the bus forever: it pushes itself into bus-off and the others carry on.',
        'Other modules notice its messages stopped and store “lost communication” [[dtc|trouble codes]] (U-codes, e.g. U0100: lost communication with ECM/PCM).',
        'The same rules can be abused: in 2016 Kyong-Tak Cho and Kang G. Shin (University of Michigan, ACM CCS) showed a compromised node could deliberately trigger errors to push a healthy ECU into bus-off. Defenses focus on detecting it.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'A sender sees **no dominant bit** in the ACK slot. Which error is that?', options: ['Bit error', 'Stuff error', 'CRC error', 'ACK error'], answer: 3,
      why: 'No receiver drove the ACK slot dominant, so nobody got a valid frame: an ACK error. A common cause is being the only node on the bus.' },
    { type: 'order', q: 'Order the error states from healthy to removed.', items: ['Error-active', 'Error-passive', 'Bus-off'],
      why: 'Counters ≤ 127: error-active. Either > 127: error-passive. TEC > 255: bus-off.' },
    { type: 'mc', q: 'Why is an active error flag **6 dominant bits**?', options: ['It spells “error” in binary', 'Six equal bits break the stuffing rule, so every node is guaranteed to see an error and discard the frame', 'It gives the sender time to cool down', 'It sets everyone’s TEC to 6'], answer: 1,
      why: 'Normal stuffed traffic never has 6 equal bits in a row, so the flag can’t be mistaken for data. That keeps every node consistent: nobody keeps a frame others threw away.' },
  ],
  cards: [
    { id: 'types', front: 'The 5 CAN error types?', back: 'Bit, stuff, CRC, form, ACK.' },
    { id: 'flag', front: 'What is an active error flag?', back: '6 dominant bits sent the moment an error is detected; breaks stuffing so all nodes discard the frame.' },
    { id: 'counts', front: 'How do TEC/REC change?', back: 'Transmit error +8 TEC; receive error usually +1 REC; each successful frame −1.' },
    { id: 'states', front: 'CAN error-state thresholds?', back: 'Error-passive: TEC or REC > 127. Bus-off: TEC > 255.' },
    { id: 'recover', front: 'How does a bus-off node recover?', back: 'After seeing 128 occurrences of 11 consecutive recessive bits, it returns as error-active.' },
  ],
};
