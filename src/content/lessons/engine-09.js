// Timing: belts, chains & sync
export default {
  steps: [
    { tag: 'metaphor', title: 'Two drummers, one beat',
      body: [
        'The crank and the cams are two drummers. If they drift even slightly off beat, the song falls apart.',
        'The **timing chain or belt** is the link that keeps them locked together. Not “roughly,” but tooth for tooth, forever.',
      ] },
    { tag: 'see', title: 'Crank twice, cams once', visualFirst: true,
      visual: { type: 'timing', view: 'chain' },
      body: [
        'The cam sprockets have **twice the teeth** of the crank sprocket, so they turn at **half speed**.',
        'Watch the orange marks: they only line up again after **two** crank turns. Mechanics use marks like these to set timing.',
      ] },
    { tag: 'how', title: 'Belt, chain or gears',
      body: [
        '**Belt**: rubber with teeth. Quiet and cheap, but must be **replaced** on a schedule (often 60k–100k miles).',
        '**Chain**: steel, oiled by the engine. Usually meant to last the engine’s life, but it can **stretch** and its **tensioner** and **guides** wear.',
        '**Gears**: direct gear drive. Tough and precise; used in some race engines, diesels and bikes.',
      ] },
    { tag: 'why', title: 'Interference engines',
      body: [
        'In an [[interference-engine]], valves and pistons use the same space at different times.',
        'If the belt snaps or the chain jumps a tooth, the cams stop while the crank keeps spinning: **pistons hit open valves**. Bent valves, sometimes a destroyed engine.',
        'That’s why belt replacement intervals matter so much on interference engines.',
      ] },
    { tag: 'see', title: 'Valve timing and VVT', visualFirst: true,
      visual: { type: 'timing', view: 'circle' },
      body: [
        'Each valve event is a crank angle: **IVO/IVC** (intake opens/closes), **EVO/EVC** (exhaust opens/closes).',
        '[[vvt]] uses oil-pressure **cam phasers**, controlled by the ECU, to rotate each cam relative to its sprocket while driving.',
        '**Advance** the intake cam → it closes earlier → better low-rpm cylinder filling. **Retard** it → later close → better high-rpm breathing.',
      ] },
    { tag: 'bronco', title: 'Your Bronco',
      body: [
        '2.0 EcoBoost: **timing chain**. The 1.5 L 3-cylinder in other Bronco Sports uses a **belt** instead.',
        'One dealer overview calls it **Ti-VCT**: twin independent variable cam timing, meaning both intake and exhaust cams get their own phaser. Likely, not yet confirmed.',
        'Cylinder 1 is at the timing-chain end.',
      ],
      facts: ['bronco.timingDrive', 'bronco.vvt', 'bronco.firingOrder'] },
  ],
  quiz: [
    { type: 'num', q: 'A crank sprocket has **22 teeth**. How many teeth must each cam sprocket have?', answer: 44, tol: 0, unit: 'teeth',
      why: 'Cams turn at half crank speed on a four-stroke, so the cam sprocket needs twice the teeth: **44**.' },
    { type: 'mc', q: 'On an **interference** engine, a snapped timing belt usually means…', options: ['The engine just stalls, no damage', 'Pistons hit open valves → bent valves or worse', 'The car switches to a backup belt', 'Only the alternator stops'], answer: 1,
      why: 'The cams stop with some valves open while the crank keeps turning. Pistons rise into those valves.' },
    { type: 'mc', q: 'How does variable valve timing (VVT) usually shift the cam?', options: ['By changing the cam lobes’ shape', 'Oil-pressure phasers rotate the cam relative to its sprocket', 'By adding a second timing belt', 'By slipping the chain'], answer: 1,
      why: 'A phaser is a hub between sprocket and cam. ECU-controlled oil pressure turns the cam a few degrees ahead or behind.' },
    { type: 'order', q: 'Starting at the beginning of the **compression** stroke, order these events.', items: ['Intake valve closes', 'Spark', 'Exhaust valve opens', 'Intake valve opens', 'Exhaust valve closes'],
      why: 'IVC happens just after BDC (early compression), spark before TDC, EVO before BDC on the power stroke, then near the next TDC the intake opens **before** the exhaust closes: that’s overlap.' },
    { type: 'mc', q: 'Your Bronco 2.0 uses a…', options: ['Timing belt', 'Timing chain', 'Gear drive', 'No timing drive (camless)'], answer: 1,
      why: 'Sources agree: the 2.0 EcoBoost is chain-driven. The 1.5 L three-cylinder uses a belt.' },
  ],
  cards: [
    { id: 'ratio', front: 'Crank : cam speed ratio on a four-stroke?', back: '2 : 1. The cam sprocket has twice the crank sprocket’s teeth.' },
    { id: 'interf', front: 'Interference engine?', back: 'Valves and pistons share space at different times. Timing failure → pistons hit valves.' },
    { id: 'beltchain', front: 'Belt vs chain?', back: 'Belt: quiet, cheap, scheduled replacement. Chain: oiled, long life, but can stretch; tensioner/guides wear.' },
    { id: 'vvt', front: 'How does VVT work?', back: 'ECU-controlled oil-pressure cam phasers rotate each cam relative to its sprocket.' },
    { id: 'advance', front: 'Advancing the intake cam does what?', back: 'Intake closes earlier → better low-rpm filling and torque (retard helps high rpm).' },
  ],
};
