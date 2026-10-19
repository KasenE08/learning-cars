// IDs & arbitration
export default {
  steps: [
    { tag: 'metaphor', title: 'Everyone reads their number out loud',
      body: [
        'A room of people who all want to speak start at the **same instant**, each reading out their ticket number in binary, one digit at a time.',
        'A “zero” is a shout, a “one” is a whisper. Anyone who whispers but hears a shout knows a lower number is in the room, so they **stop and wait**.',
        'Nobody gets garbled: the person with the **lowest number** just keeps talking, as if nothing happened.',
      ] },
    { tag: 'how', title: 'How the bus picks a winner',
      body: [
        'Any node may start when the bus is idle. If several start in the same bit, they all send their IDs **most significant bit first**, and every node reads the bus while it sends.',
        'Dominant 0 overwrites recessive 1. A node that sent **1** but reads **0** has lost: it stops sending and becomes a receiver for the rest of that frame.',
        'The winner never notices: its frame is **untouched** (non-destructive). The losers retry automatically once the bus is free.',
        'Names for it vary: CSMA/CR, CSMA/CD+AMP, or simply [[arbitration|bitwise arbitration]]. Unlike classic Ethernet, a collision destroys nothing.',
      ] },
    { tag: 'see', title: 'Watch three IDs fight', visualFirst: true,
      visual: { type: 'arbitration', ids: [0x07e, 0x3b3, 0x415] },
      body: [
        'Step through bit by bit. Each node drops out on the first bit where it sends 1 and the bus shows 0.',
        'Change the IDs and predict the winner before you press play.',
      ] },
    { tag: 'math', title: 'The bit-by-bit race',
      body: [
        '`0x07E` = `000 0111 1110` · `0x3B3` = `011 1011 0011` · `0x415` = `100 0001 0101`',
        'Bit 10 (first): 0, 0, **1** → the bus is 0, so **0x415** drops out.',
        'Bit 9: **0** vs **1** → **0x3B3** drops out. **0x07E** wins after just 2 bits and sends its whole frame.',
        'Rule of thumb: **lower ID = higher priority**. ID 0x000 beats everything.',
      ] },
    { tag: 'how', title: 'An ID names the message, not the sender',
      body: [
        'There’s no “from” field. A node is just *assigned* certain IDs by the car’s designers; the [[dbc-file|DBC]] records which module usually sends which.',
        'Two nodes must **never** send the same ID with different data: arbitration can’t separate them, and the first differing bit becomes an error.',
        'Receivers pick the IDs they care about with **acceptance filters** in hardware and ignore the rest.',
        'Tie-breakers: a data frame beats a remote frame with the same ID (RTR 0 is dominant), and an 11-bit ID beats a 29-bit one with the same first 11 bits (IDE 0 is dominant).',
      ] },
    { tag: 'bronco', title: 'Ford IDs on one bus',
      body: [
        'From openpilot’s community Ford DBC (reverse-engineered, **not from Ford**): **0x07E** `SteeringPinion_Data` (from `PSCM`), **0x204** `EngVehicleSpThrottle` (the DBC labels its sender `PCM_HEV`), **0x3B3** `BodyInfo_3_FD1` (from `GWM`), **0x415** `BrakeSysFeatures` (from `ABS_ESC`).',
        'So whenever they collide, steering angle beats throttle, which beats body info (doors, turn lamps), which beats brake-module speed.',
        'Why Ford numbered them this way isn’t public. Don’t assume “low ID = most safety-critical” for a given car without a source.',
        'Note `0x3B3` comes from the gateway: the ID tells you *what* it is (body status), not which module first measured it.',
      ] },
    { tag: 'why', title: 'What priority does (and doesn’t) buy',
      body: [
        'The highest-priority frame normally waits at most for the frame already on the wire (≈ 270 µs at 500 kbit/s), then wins. Its delay is predictable.',
        'A low-priority frame can be delayed again and again on a busy bus. Designers keep bus load well below 100% so everyone gets through.',
        'A misbehaving node flooding ID 0x000 would win every arbitration and starve the bus. That’s a known weakness of plain CAN (more in the security unit).',
      ] },
  ],
  quiz: [
    { type: 'mc', q: '**0x204** and **0x415** start in the same bit. Which wins?', options: ['0x204', '0x415', 'Neither: both frames are destroyed', 'Whichever module is closer'], answer: 0,
      why: 'Lower ID = higher priority. 0x204 = `010…`, 0x415 = `100…`: on the very first bit 0x204 sends dominant 0 and 0x415 sends recessive 1, so 0x415 drops out.',
      wrong: { 2: 'That’s Ethernet-style collision. CAN arbitration is non-destructive: the winner’s frame is untouched.' } },
    { type: 'order', q: 'Rank these IDs from highest to lowest **priority**.', items: ['0x07E', '0x204', '0x3B3', '0x415'],
      why: 'Lower ID wins arbitration: 0x07E < 0x204 < 0x3B3 < 0x415.' },
    { type: 'mc', q: 'A node sends a recessive bit during the ID but reads dominant. What does it do?', options: ['Sends an error frame', 'Stops sending, keeps receiving, and retries when the bus is free', 'Sends louder', 'Goes bus-off'], answer: 1,
      why: 'Losing arbitration is normal, not an error. The node becomes a receiver for that frame and tries again once the bus is idle.',
      wrong: { 0: 'Only outside the ID field (and ACK slot) would a mismatch count as a bit error.' } },
  ],
  cards: [
    { id: 'rule', front: 'Which ID wins CAN arbitration?', back: 'The lowest. Dominant 0 overwrites recessive 1, bit by bit, MSB first.' },
    { id: 'nondestructive', front: 'What happens to the winning frame in a CAN collision?', back: 'Nothing. Arbitration is non-destructive; losers stop and retry later.' },
    { id: 'naming', front: 'Does a CAN ID identify the sender?', back: 'No. It names the message. A DBC just records which module usually sends it.' },
    { id: 'unique', front: 'Why can’t two nodes share one ID?', back: 'Arbitration can’t separate them; their first differing data bit becomes an error.' },
    { id: 'ford', front: 'Community Ford DBC: 0x07E vs 0x415?', back: '0x07E = SteeringPinion_Data (PSCM), 0x415 = BrakeSysFeatures (ABS_ESC). 0x07E has higher priority.' },
  ],
};
