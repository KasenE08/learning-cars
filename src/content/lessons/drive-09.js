// CVTs
export default {
  steps: [
    { tag: 'metaphor', title: 'A ramp instead of stairs',
      body: [
        'A normal gearbox is a **staircase**: 1st, 2nd, 3rd… each step is a fixed ratio, and you jump between them.',
        'A [[cvt]] is a **ramp**: no steps at all, just a smooth slide from “low gear” to “overdrive” and every ratio in between.',
        'Think of a dimmer switch versus a three-way lamp.',
      ] },
    { tag: 'how', title: 'Two pulleys that change size',
      body: [
        'Two [[variator|variable pulleys]], each made of **two cone-shaped halves (sheaves)** facing each other, joined by a **steel belt or chain**.',
        'Squeeze a pulley’s cones together and the belt is forced to ride **higher**: bigger effective diameter. Spread them and it drops **lower**.',
        'Hydraulic pressure moves the cones. When one pulley grows, the other shrinks, so the belt stays tight.',
        'Ratio = **driven pulley diameter ÷ drive pulley diameter**. Small drive + big driven = “low gear.” Big drive + small driven = overdrive.',
      ] },
    { tag: 'see', title: 'Slide the ratio instead of stepping it', visualFirst: true,
      visual: { type: 'gearing', preset: 'generic' },
      body: [
        'This shows a stepped gearbox. Now imagine dragging 1st gear’s ratio **smoothly** toward top gear’s, with no gaps: that’s what a CVT does.',
        'Watch how rpm at a given speed changes with the ratio. A CVT can pick **any** point on that line.',
      ] },
    { tag: 'how', title: 'How it feels, and its limits',
      body: [
        'Floor it and a CVT can **park the engine at its peak-power rpm** while the car speeds up. Efficient, but it sounds like a droning “rubber band.”',
        'Many CVTs fake **shift points** under hard throttle so they feel like a normal automatic.',
        'The belt drives by **friction against the cones**, so it needs huge clamping force. That limits how much torque it can take and makes heat.',
        'There’s still a launch device up front (often a torque converter) and a small gearset plus clutches for **reverse**.',
      ] },
    { tag: 'bronco', title: 'Why your Bronco has no CVT',
      body: [
        'Your Bronco Sport uses an **8-speed geared automatic**, not a CVT. Lots of compact crossovers (Subaru, Nissan, Honda) do use CVTs.',
        'Ford hasn’t said why. The general tradeoff: geared automatics handle **high torque, towing and long off-road slogs** with less heat worry than a friction belt.',
        'More steps get part of the CVT’s benefit: with 8 gears instead of 5 or 6, the engine can stay closer to its best rpm.',
      ],
      note: 'Bikes: scooters use rubber-belt CVTs. Sport bikes like the Ninja 500 and RS 457 use sequential gearboxes.',
      facts: ['bronco.trans', 'bronco.transModel'] },
  ],
  quiz: [
    { type: 'mc', q: 'What changes a CVT’s ratio?', options: ['Sliding gears into mesh', 'Pulley halves moving closer or farther apart', 'A torque converter locking up', 'Swapping belts'], answer: 1,
      why: 'Squeezing a pulley’s cones together pushes the belt to a bigger diameter; spreading them lets it sink. One pulley grows while the other shrinks.' },
    { type: 'num', q: 'The belt rides at **60 mm** radius on the drive pulley and **150 mm** on the driven pulley. What’s the ratio (x:1)?', answer: 2.5, tol: 0.01, unit: ':1',
      hint: 'Ratio = driven ÷ drive.', why: '150 ÷ 60 = **2.5:1**. A small drive pulley and a big driven pulley is “low gear.”' },
    { type: 'mc', q: 'Why does a CVT “drone” when you floor it?', options: ['The belt is slipping', 'It holds the engine at one high rpm while speed rises', 'It’s stuck in first gear', 'The torque converter is broken'], answer: 1,
      why: 'Instead of rpm rising and falling through gears, the CVT parks the engine near peak power and just changes ratio. Efficient, but the steady high note sounds odd.' },
    { type: 'order', q: 'Order the power path in a typical CVT car.', items: ['Engine', 'Torque converter (launch device)', 'Drive pulley', 'Steel belt or chain', 'Driven pulley', 'Final drive and wheels'],
      why: 'The launch device lets the car idle at a stop, the drive pulley pushes the belt, the driven pulley turns the output, then the final drive reduces speed again for the wheels.' },
    { type: 'mc', q: 'What transmission does your Bronco Sport have?', options: ['CVT', '6-speed manual', '8-speed automatic', 'Dual-clutch'], answer: 2,
      why: 'An 8-speed geared automatic with a torque converter. No CVT is offered on it.' },
  ],
  cards: [
    { id: 'what', front: 'What is a CVT?', back: 'A transmission with no fixed gears: two variable pulleys and a belt/chain give any ratio in a range.' },
    { id: 'pulley', front: 'How does a CVT pulley change size?', back: 'Its two cone halves move together (belt rides higher, bigger) or apart (belt sinks, smaller).' },
    { id: 'ratio', front: 'CVT ratio formula?', back: 'Driven pulley diameter ÷ drive pulley diameter.' },
    { id: 'limit', front: 'Main weakness of a CVT?', back: 'The belt drives by friction, so torque capacity and heat are limited.' },
    { id: 'bronco', front: 'Does the Bronco Sport use a CVT?', back: 'No: an 8-speed geared automatic (8F35).' },
  ],
};
