// Rods & the crankshaft
export default {
  steps: [
    { tag: 'metaphor', title: 'Shin and pedal',
      body: [
        'Back to the bike: your **shin** is the [[connecting-rod]], the **pedal** is the crankpin, the **pedal crank arm** is the [[crank-throw]].',
        'Your knee bends side to side as the pedal goes around. The rod swings the same way.',
      ] },
    { tag: 'see', title: 'Throw and stroke', visualFirst: true,
      visual: { type: 'cylinder', mode: 'geometry' },
      body: [
        'The orange line is the **throw**: crank center → crankpin.',
        'One full turn moves the piston from TDC to BDC and back. So **stroke = 2 × throw**.',
        'Notice the piston moves faster near the top than near the bottom. That’s the rod’s angle, and it matters for balance later.',
      ] },
    { tag: 'how', title: 'The connecting rod',
      body: [
        '**Small end**: wraps the wrist pin, often with a bronze bushing.',
        '**Beam**: I-beam or H-beam section. Light but stiff.',
        '**Big end**: splits in two (rod + cap) so it can bolt around the crankpin, with **rod bolts** and bearing shells.',
        'Rods get stretched on every exhaust stroke and squashed on every power stroke. Broken rods are how engines “throw a rod.”',
      ] },
    { tag: 'how', title: 'The crankshaft',
      body: [
        '**Main journals** spin in the block’s main bearings, on the crank’s centerline.',
        '**Rod journals** (crankpins) are offset by the throw. The rods bolt here.',
        '[[counterweight|Counterweights]] opposite each throw balance the spinning mass.',
        'Front **snout**: drives the timing chain/belt and accessory pulley. Back **flange**: bolts to the flywheel or flexplate.',
      ] },
    { tag: 'how', title: 'Bearings float on oil',
      body: [
        'Rod and main bearings are **plain bearings**: smooth shells, no balls or rollers.',
        'The oil pump forces oil into the gap. Once spinning, the journal rides on a **film of oil**: metal never touches metal.',
        'Lose oil pressure and the film collapses. Bearings wipe out in seconds: **spun bearing**, “rod knock.”',
      ] },
    { tag: 'see', title: 'Four throws, one crank', visualFirst: true,
      visual: { type: 'crank' },
      body: [
        'An inline-4 crank has throws for **1 and 4 together**, and **2 and 3 together**, 180° apart.',
        'Watch the dials: two pistons go up while two go down.',
      ] },
    { tag: 'bronco', title: 'Flexplate, not flywheel',
      body: [
        'Your Bronco has an **automatic**, so the crank bolts to a thin **flexplate** instead of a heavy [[flywheel]]. The torque converter bolts to it, and its own mass does the smoothing.',
        'Manual cars (and every bike) use a real flywheel, which the clutch grips.',
      ],
      facts: ['bronco.trans'] },
  ],
  quiz: [
    { type: 'mc', q: 'What keeps a running crank journal from touching its bearing?', options: ['Ball bearings', 'A pressurized film of oil', 'Magnetic repulsion', 'Teflon coating'], answer: 1,
      why: 'Plain bearings hydroplane on an oil film pumped into the gap. No oil pressure = metal contact = destroyed bearing.' },
    { type: 'mc', q: 'Why does the rod’s big end split into a rod and a cap?', options: ['To save weight', 'So it can be bolted around the crankpin', 'For cooling', 'To let oil drain'], answer: 1,
      why: 'The crankpin is part of a one-piece crank, so the rod has to clamp around it.' },
    { type: 'mc', q: 'On an inline-4 crank, which pistons move together?', options: ['1 & 2, and 3 & 4', '1 & 3, and 2 & 4', '1 & 4, and 2 & 3', 'All four move together'], answer: 2,
      why: 'Throws 1 and 4 share an angle, 2 and 3 are 180° away. The outer pair moves opposite the inner pair.' },
    { type: 'mc', q: 'An automatic car’s crank bolts to a…', options: ['Heavy flywheel', 'Flexplate', 'Clutch disc', 'Harmonic balancer'], answer: 1,
      why: 'A thin flexplate carries the torque converter, which supplies the smoothing mass. The harmonic balancer is on the front snout.' },
  ],
  cards: [
    { id: 'throw', front: 'Stroke vs crank throw?', back: 'Stroke = 2 × throw.' },
    { id: 'journals', front: 'Main journals vs rod journals?', back: 'Mains: on the crank centerline, in the block. Rod journals (crankpins): offset by the throw; the rods bolt here.' },
    { id: 'oilfilm', front: 'How do plain bearings survive?', back: 'The journal rides on a pressurized oil film. No metal-to-metal contact while running.' },
    { id: 'i4pairs', front: 'Inline-4 crank: which pistons move together?', back: '1 & 4 together; 2 & 3 together, 180° apart.' },
    { id: 'flexplate', front: 'Flywheel vs flexplate?', back: 'Manuals: heavy flywheel the clutch grips. Automatics: thin flexplate carrying the torque converter.' },
  ],
};
