// The wet multi-plate clutch
export default {
  steps: [
    { tag: 'metaphor', title: 'Many small hands',
      body: [
        'One strong person can hold a heavy door shut. So can **eight people** each pushing a little, if there’s room for all their hands.',
        'A car [[clutch]] is the strong person: one big disc, two friction faces. A bike clutch is the crowd: a **stack of small plates**, two faces each, so it fits behind the engine’s right-side cover.',
        'And it lives in oil, which sounds like the last thing a friction part wants. That turns out to be a feature.',
      ] },
    { tag: 'see', title: 'Take one apart', visualFirst: true,
      visual: { type: 'exploded', assembly: 'wetclutch' },
      body: [
        '**[[clutch-basket|Basket]]** (outer): turned by the crank through the [[primary-drive]] gears. Holds the **friction plates** by their outer tabs.',
        '**Hub** (inner): splined to the gearbox input shaft. Holds the **steel plates** by their inner teeth ([[friction-plate|friction & steel plates]]).',
        '**Pressure plate + springs**: clamp the whole stack together, so basket and hub turn as one.',
      ] },
    { tag: 'how', title: 'From your fingers to the plates',
      body: [
        '**Lever released**: the springs clamp the stack. Engine and gearbox are locked together (same as a car: engaged by default).',
        '**Lever pulled**: a cable turns a release arm on the case; a pushrod (or rack) lifts the pressure plate against the springs. The plates spread and slip.',
        'The MSF **friction zone** is the [[bite-point]]: the plates are touching but slipping, and the slip heat goes straight into the oil.',
      ] },
    { tag: 'see', title: 'Feel the slip', visualFirst: true,
      visual: { type: 'clutchengage' },
      body: [
        'The physics is identical to a car’s: ease out the slider and engine rpm and gearbox rpm come together as slip drops to zero.',
        'Dump it at low rpm and it stalls. On a bike the lever is your **fine throttle for torque**: it’s how you make slow-speed moves smooth.',
      ] },
    { tag: 'math', title: 'Small plates, lots of faces',
      body: [
        '`T = μ × F × r × n`. A plate stack with **7 friction plates** has **14 faces** (each plate grips on both sides).',
        'Illustrative: μ 0.12 (oil lowers friction), 2,000 N (450 lbf) clamp, 0.05 m mean radius × 14 faces → 0.12 × 2,000 × 0.05 × 14 = **168 N·m**.',
        'The clutch sits **after** the primary reduction, so it sees crank torque × ~2: Ninja 500 ≈ 42.6 × 2.029 ≈ **86 N·m**, at half crank speed. Plenty of margin.',
      ] },
    { tag: 'how', title: 'Wet vs dry, cable vs hydraulic',
      body: [
        '**Wet** ([[wet-dry-clutch]]): oil carries the heat away, so it survives slipping and lasts. Costs: slight drag (cold oil can make neutral hard to find) and it needs [[jaso-ma]] oil.',
        '**Dry** clutches (famous on older Ducatis) run in air: lighter, no oil drag, but they rattle and wear faster.',
        '**Actuation** ([[cable-clutch]]): a cable is light and cheap but stretches and needs adjusting. **Hydraulic** (master + slave cylinder) self-adjusts and feels consistent; common on bigger bikes.',
      ] },
    { tag: 'bikes', title: 'Your two bikes',
      body: [
        '**Ninja 500**: wet multi-plate **assist & slipper** clutch, **cable**-actuated. Reviewers call the pull extremely light.',
        '**RS 457**: wet multi-plate with **slipper** function, **cable**-actuated. Reviewers also report a light pull.',
        'Same basic hardware; the ramps that make them “slipper” and “assist” get their own lesson next.',
      ],
      facts: ['ninja.clutch', 'ninja.clutchActuation', 'rs457.clutch'] },
  ],
  quiz: [
    { type: 'mc', q: 'Why does a bike clutch use many plates instead of one big disc?', options: ['Oil only works on small plates', 'Many friction faces give enough torque capacity in a small diameter', 'It makes the lever heavier on purpose', 'To add a gear ratio'], answer: 1,
      why: 'Torque capacity scales with the number of faces. Stacking plates multiplies capacity without a big disc that wouldn’t fit in a narrow engine.' },
    { type: 'order', q: 'Order what happens when you pull the clutch lever.', items: ['Lever pulls the cable', 'Release arm turns on the engine case', 'Pushrod moves the pressure plate against the springs', 'Clamp force on the stack drops', 'Plates slip, then turn freely'],
      why: 'Cable → release arm → pushrod → pressure plate moves against the springs → clamp force drops and the stack slips.' },
    { type: 'mc', q: 'Which plates turn with the **engine**?', options: ['Steel plates (splined to the hub)', 'Friction plates (tabbed to the basket)', 'Both, all the time', 'Neither: the pressure plate does'], answer: 1,
      why: 'The basket is driven by the crank through the primary gears, and the friction plates lock into it. The steel plates ride on the hub, which turns with the gearbox.' },
    { type: 'mc', q: 'Why can a wet clutch take more slipping than a dry one?', options: ['Oil makes the plates grippier', 'Oil carries the slip heat away from the plates', 'Wet clutches have no springs', 'It can’t'], answer: 1,
      why: 'Slip turns into heat. Oil flowing through the stack cools it, so the clutch survives the friction zone and lasts longer, at the cost of a little drag.' },
  ],
  cards: [
    { id: 'parts', front: 'Wet clutch: what turns with the engine, what with the gearbox?', back: 'Basket + friction plates with the engine; hub + steel plates with the gearbox.' },
    { id: 'faces', front: 'Friction faces in a 7-plate bike clutch?', back: '14 (two per friction plate).' },
    { id: 'after', front: 'Why does the clutch see about 2× crank torque?', back: 'It’s after the primary reduction (Ninja 500: 2.029:1), turning slower with more torque.' },
    { id: 'wet', front: 'Wet clutch pros and cons?', back: 'Pros: cooled by oil, durable, quiet. Cons: slight drag, needs JASO MA oil.' },
    { id: 'cable', front: 'Cable or hydraulic on your two bikes?', back: 'Both cable-actuated.' },
  ],
};
