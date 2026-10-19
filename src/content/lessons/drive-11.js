// The open differential
export default {
  steps: [
    { tag: 'metaphor', title: 'A rope over a pulley',
      body: [
        'Hang a rope over a pulley and have a friend hold each end. Pull the pulley up: **both ends get exactly the same tension**, but one end can slide more than the other.',
        'That’s an [[open-differential]]: the **pulley is the diff**, the **rope ends are the wheels**. Equal push on both, but each can turn at its own speed.',
        'Now one friend lets go. The rope just slides, and you can’t pull the other friend at all. Keep that picture: it’s the one-wheel-on-ice problem.',
      ] },
    { tag: 'see', title: 'Why wheels need different speeds', visualFirst: true,
      visual: { type: 'diffturn', diff: 'open', scene: 'turn' },
      body: [
        'Drag the steering slider. In a turn the **outer wheel travels a bigger circle**, so it has to spin faster than the inner one.',
        'Lock them together and one tire would have to skid. The diff lets them differ.',
        'Watch the spider gears: **still** going straight, **spinning** only in a turn.',
      ] },
    { tag: 'how', title: 'What’s inside', visualFirst: true,
      visual: { type: 'exploded', assembly: 'diff' },
      body: [
        '[[ring-and-pinion|Ring and pinion]]: the small pinion (from the driveshaft) drives the big ring gear. It turns drive **90°** and **reduces speed / multiplies torque**.',
        'The ring gear bolts to the **carrier**, which spins as one piece with it.',
        'Inside the carrier: [[spider-gears]] on a cross shaft, meshed with two **side gears**, one splined to each axle.',
      ] },
    { tag: 'math', title: 'Final drive and the averaging rule',
      body: [
        '[[final-drive|Final drive ratio]] = ring teeth ÷ pinion teeth. 41 ÷ 11 ≈ **3.73:1**: the pinion turns 3.73 times per wheel turn, and torque goes up by 3.73× (minus friction).',
        'Speed rule: **carrier speed = average of the two wheels**. Carrier at 300 rpm: both wheels 300, or 250 + 350, or **0 + 600**.',
        'Torque rule: the two side gears always get **equal torque**. That’s the part that bites.',
      ] },
    { tag: 'why', title: 'Why one spinning wheel stops you', visualFirst: true,
      visual: { type: 'diffturn', diff: 'open', scene: 'slip' },
      body: [
        'A wheel on ice can only push back with a tiny torque before it spins. The diff gives the **other wheel the same tiny torque**.',
        'So the grippy wheel sits still while the icy one spins at **twice carrier speed**. All that engine power goes into one useless spin.',
        'Fix #1: **brake the spinning wheel**. Brake torque on that side counts as “resistance,” so the diff now sends that much torque to the grippy wheel too.',
        'That’s what brake-based [[traction-control]] does, using the ABS wheel-speed sensors. Some carmakers call it an **“electronic LSD.”** Cost: brake heat and wasted power.',
      ] },
    { tag: 'bronco', title: 'Your Bronco’s diffs',
      body: [
        '**Front**: an open differential inside the [[transaxle|transmission]]. On a sideways engine the final drive is a pair of regular gears, not a ring and pinion, because nothing has to turn 90°.',
        'Your front final drive is **3.81:1**.',
        '**Rear (Badlands)**: no diff gears at all. The twin-clutch [[rdu]] uses one clutch pack per wheel instead. Other Bronco Sport trims use a single clutch feeding an **open rear diff**.',
      ],
      facts: ['bronco.finalDrive', 'bronco.rdu'] },
  ],
  quiz: [
    { type: 'mc', q: 'One drive wheel is on ice, the other on dry pavement. With an open diff, the dry wheel gets…', options: ['All the torque', 'Twice the torque of the icy wheel', 'The same tiny torque as the icy wheel', 'No torque because the diff locks'], answer: 2,
      why: 'An open diff always splits torque equally. The icy wheel can only hold a tiny torque, so that’s all the dry wheel gets too.',
      wrong: { 0: 'That’s what most people expect. An open diff does the opposite: it sends equal torque, limited by the weakest wheel.' } },
    { type: 'order', q: 'Order the power path through a rear differential.', items: ['Driveshaft', 'Pinion gear', 'Ring gear', 'Carrier', 'Spider gears', 'Side gears', 'Axle shafts'],
      why: 'The pinion drives the ring gear, which spins the carrier. The carrier carries the spiders around, and they drive the side gears splined to each axle.' },
    { type: 'mc', q: 'How does brake-based traction control help an open diff?', options: ['It locks the spider gears', 'Braking the spinning wheel lets the diff send more torque to the other one', 'It cuts the engine completely', 'It disconnects the spinning axle'], answer: 1,
      why: 'Brake torque on the slipping side acts like grip. The diff matches that torque on the grippy side, so the car moves.' },
  ],
  cards: [
    { id: 'why', front: 'Why does a car need a differential?', back: 'In a turn the outer wheel travels farther, so the two wheels must turn at different speeds.' },
    { id: 'torque', front: 'Open diff torque rule?', back: 'Always equal torque to both wheels, so the weakest-grip wheel sets the limit.' },
    { id: 'speed', front: 'Open diff speed rule?', back: 'Carrier speed = average of the two wheel speeds.' },
    { id: 'fd', front: 'Final drive ratio formula?', back: 'Ring gear teeth ÷ pinion teeth (e.g. 41 ÷ 11 ≈ 3.73:1).' },
    { id: 'brake', front: 'Brake-based “electronic LSD”?', back: 'Traction control brakes the spinning wheel, so the open diff sends matching torque to the wheel with grip.' },
  ],
};
