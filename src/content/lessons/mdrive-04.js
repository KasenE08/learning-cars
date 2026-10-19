// Quickshifters
export default {
  steps: [
    { tag: 'metaphor', title: 'Stop leaning on the door',
      body: [
        'Try to slide a bolt open while a friend leans on the door: it jams. Ask them to stop leaning for **a split second** and it slides right out.',
        'Under power, the gearbox [[dog-teeth|dogs]] are jammed together by torque. Normally the clutch takes the load off. A [[quickshifter]] does it by cutting the engine’s push for a blink.',
      ] },
    { tag: 'how', title: 'An upshift with no clutch',
      body: [
        'A sensor in the shift linkage feels your foot start the shift: a [[strain-gauge]] (load cell) in the shift rod, or a simple switch.',
        'The ECU **cuts ignition and/or fuel** for a few **tens of milliseconds**. Drive torque drops to near zero and the dogs unload.',
        'Your foot’s preload turns the drum, the next gear’s dogs drop in, and power comes back. **The throttle stays pinned** the whole time.',
        'The [[gear-position-sensor]] lets the ECU use a different cut time for each gear.',
      ] },
    { tag: 'see', title: 'Watch the timeline', visualFirst: true,
      visual: { type: 'quickshift' },
      body: [
        'Compare a clutch upshift (close throttle, clutch in, shift, clutch out, open throttle) with the quickshifter’s single short cut.',
        'Then run the **auto-blip downshift**: the bi-directional version.',
      ] },
    { tag: 'how', title: 'Downshifts: the auto-blipper',
      body: [
        'Going **down** needs the opposite: the engine must speed up to match the lower gear.',
        'An [[auto-blipper]] briefly **opens the throttle** while you’re off the gas, so rpm rises and the dogs unload. No clutch, no hand blip.',
        'The ECU has to be able to open the throttle on its own, which **ride-by-wire** makes straightforward. A “bi-directional” or “up/down” quickshifter does both.',
      ] },
    { tag: 'math', title: 'How long is a cut?',
      body: [
        'At **10,000 rpm** the crank turns 10,000 ÷ 60 ≈ **167 times per second**.',
        'A **60 ms** cut (an illustrative value) lasts 167 × 0.06 ≈ **10 crank revolutions**: about 10 skipped power strokes for the twin.',
        'Short enough that you feel a tiny hiccup, not a lurch. Too short and the dogs don’t release; too long and the shift feels soft.',
      ] },
    { tag: 'bikes', title: 'Your two bikes',
      body: [
        '**RS 457**: optional **up/down** quickshifter (dealer accessory, enabled with Aprilia’s diagnostic software). It has ride-by-wire, so auto-blip downshifts work.',
        '**Ninja 500**: no Kawasaki quickshifter option I could find. Aftermarket kits exist (some need an ECU flash).',
        'Quickshifters work best under load above low rpm. You still use the clutch from a stop. Racetrack-style full-throttle shifting belongs on a track day.',
      ],
      facts: ['rs457.quickshifter', 'rs457.qsUpDown', 'rs457.electronics', 'ninja.quickshifter'] },
  ],
  quiz: [
    { type: 'order', q: 'Order a quickshifter upshift.', items: ['Rider preloads the shift lever', 'Sensor tells the ECU a shift is starting', 'ECU cuts ignition/fuel for tens of ms', 'Dogs unload and the drum turns', 'Next gear engages and power returns'],
      why: 'The cut only works because the dogs are torque-locked: remove the torque for an instant and the preloaded lever finishes the shift.' },
    { type: 'mc', q: 'What does a quickshifter do on an **upshift**?', options: ['Pulls the clutch for you', 'Briefly cuts ignition and/or fuel so the dogs unload', 'Opens the throttle wider', 'Changes the final drive'], answer: 1,
      why: 'No clutch is touched. A short cut drops drive torque to near zero, so the dogs slide out and the next gear drops in.',
      wrong: { 2: 'Opening the throttle is the **downshift** (auto-blip) half, and only when you’re off the gas.' } },
    { type: 'mc', q: 'Why does an auto-blip downshift rely on ride-by-wire?', options: ['It needs a heavier clutch', 'The ECU must open the throttle by itself', 'Cables can’t carry a quickshifter signal', 'It doesn’t; any bike can blip'], answer: 1,
      why: 'To blip, the ECU has to open the throttle while your hand has it closed. With ride-by-wire, the throttle is an ECU-driven motor, so that’s simple.' },
  ],
  cards: [
    { id: 'up', front: 'Quickshifter upshift: what happens?', back: 'Lever sensor → ECU cuts ignition/fuel for tens of ms → dogs unload → next gear engages. Throttle stays open.' },
    { id: 'down', front: 'What is an auto-blipper?', back: 'The downshift half: the ECU blips the throttle so rpm rises and the dogs unload, no clutch.' },
    { id: 'sensor', front: 'Quickshifter sensor types?', back: 'Strain gauge (load cell) in the shift rod, or a switch.' },
    { id: 'bikes', front: 'Quickshifter on your two bikes?', back: 'RS 457: optional up/down accessory. Ninja 500: none from Kawasaki found; aftermarket only.' },
  ],
};
