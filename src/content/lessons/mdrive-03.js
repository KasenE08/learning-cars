// Slipper & assist clutches
export default {
  steps: [
    { tag: 'metaphor', title: 'A wrench that clicks backward',
      body: [
        'A ratchet wrench **drives** when you turn it one way and **clicks free** the other way.',
        'A [[slipper-clutch]] is a soft version of that: full grip when the engine drives the wheel, **controlled slip** when the wheel tries to drive the engine too hard.',
        'Flip the same ramps around and you get an [[assist-clutch]]: drive torque squeezes the plates **tighter**, so the lever can be lighter.',
      ] },
    { tag: 'why', title: 'The problem: downshift torque spikes',
      body: [
        'Downshift and release the clutch: the rear tire must suddenly spin the engine **faster**. That’s a surge of [[engine-braking]] through the chain.',
        'You’re usually braking at the same time, so weight has moved forward and the rear tire has **less grip** than normal.',
        'Too much backward torque → the rear tire **hops, chatters or skids**. The rider’s fix is a smooth clutch release (and, with practice, a throttle blip); a slipper adds a mechanical safety net.',
      ] },
    { tag: 'see', title: 'With and without', visualFirst: true,
      visual: { type: 'slipper' },
      body: [
        'Run the downshift with the slipper **off**: the engine-braking spike goes straight to the rear wheel and it hops.',
        'Turn it **on**: the ramps lift the pressure plate, the clutch slips just enough, and the rear stays planted.',
      ] },
    { tag: 'how', title: 'How the ramps work',
      body: [
        'The clutch hub is split, with **angled ramps** (cams) between its parts and the pressure plate.',
        '**Back-torque** (wheel driving engine): the ramps climb each other and push the pressure plate **out**, cutting clamp force. The clutch slips until the torque drops.',
        'It doesn’t remove engine braking; it **caps** it. Normal deceleration still works.',
      ] },
    { tag: 'how', title: 'The assist side: a lighter lever',
      body: [
        '**Drive torque** (engine driving wheel): the ramps’ other faces pull the pressure plate **in**, adding clamp force on top of the springs.',
        'So the springs can be **softer** for the same torque capacity, and softer springs mean an easier lever pull.',
        'Reviewers call this a “self-servo” effect. It’s why a modern assist clutch feels so light, even through a cable.',
      ] },
    { tag: 'math', title: 'How big is the rpm jump?',
      body: [
        'Ninja 500 at **50 mph** (from its published ratios, 150/60R17 rear tire): **3rd ≈ 7,040 rpm**, **2nd ≈ 8,950 rpm**.',
        'Downshift 3 → 2 and release the clutch quickly: the rear tire has to spin the engine up **≈1,900 rpm** in a fraction of a second.',
        'That energy comes from the tire’s grip. A slipper limits how hard it can pull; a blip of throttle (or an auto-blipper) makes the engine do it instead.',
      ] },
    { tag: 'bikes', title: 'Your two bikes',
      body: [
        '**Ninja 500**: **assist & slipper** clutch, standard. Kawasaki claims a lighter lever and less rear hop on hard downshifts.',
        '**RS 457**: Aprilia lists a **slipper** clutch. Reviews call it light (“slip & assist”), but Aprilia doesn’t mention assist ramps, so that part is **not confirmed**.',
        'Neither makes downshifting at the limit safe on the street. Track days and training are where you learn that.',
      ],
      facts: ['ninja.clutch', 'rs457.clutch'] },
  ],
  quiz: [
    { type: 'order', q: 'Order a hard downshift on a bike **without** a slipper.', items: ['Downshift and release the clutch quickly', 'Rear tire must spin the engine faster', 'Engine-braking torque spikes through the chain', 'Rear tire exceeds its grip', 'Rear hops or skids'],
      why: 'The lower gear demands higher engine rpm at the same road speed. The only thing that can supply it is the rear tire, and if the torque exceeds grip, it lets go.' },
    { type: 'mc', q: 'Under back-torque, a slipper clutch’s ramps…', options: ['Clamp the plates tighter', 'Push the pressure plate out so the clutch slips', 'Shift the gearbox up a gear', 'Cut the ignition'], answer: 1,
      why: 'Back-torque makes the ramps climb and lift the pressure plate, reducing clamp force so the clutch slips instead of passing the spike to the tire.',
      wrong: { 0: 'That’s the **assist** side, and it happens under drive torque, not back-torque.', 3: 'Ignition cuts are a quickshifter thing. A slipper is purely mechanical.' } },
    { type: 'mc', q: 'Why does an assist clutch have a lighter lever?', options: ['The cable is thinner', 'Drive torque adds clamp force through the ramps, so softer springs are enough', 'It uses hydraulics', 'It has fewer plates'], answer: 1,
      why: 'Ramps turn some of the drive torque into extra clamp force. The springs no longer have to provide it all, so they can be softer, and the lever pull drops.' },
  ],
  cards: [
    { id: 'slipper', front: 'What does a slipper clutch do?', back: 'Ramps lift the pressure plate under back-torque, so the clutch slips instead of hopping the rear tire.' },
    { id: 'assist', front: 'What does an assist clutch do?', back: 'Ramps add clamp force under drive torque, allowing softer springs → lighter lever.' },
    { id: 'cap', front: 'Does a slipper remove engine braking?', back: 'No. It caps the spike; normal engine braking remains.' },
    { id: 'bikes', front: 'Slipper/assist on your two bikes?', back: 'Ninja 500: assist & slipper. RS 457: slipper (assist not confirmed by Aprilia).' },
  ],
};
