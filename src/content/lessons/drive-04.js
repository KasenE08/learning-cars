// Synchros & shifting
export default {
  steps: [
    { tag: 'metaphor', title: 'Jumping onto a merry-go-round',
      body: [
        'Jump onto a spinning merry-go-round and you’ll stumble. Run alongside until you **match its speed** and you step on smoothly.',
        'A [[synchronizer]] is the “running alongside” part. It brings a gear up or down to the shaft’s speed **before** the teeth lock together.',
      ] },
    { tag: 'how', title: 'The four parts',
      body: [
        '**Hub**: splined to the shaft, always turns with it.',
        '**Sleeve**: slides on the hub’s outer splines; the shift fork moves it.',
        '**[[blocker-ring|Blocker ring]]** (baulk ring): brass or carbon-lined ring with a cone inside and teeth outside.',
        '**Gear side**: a friction **cone** plus a ring of [[dog-teeth]] the sleeve finally locks onto.',
      ] },
    { tag: 'see', title: 'Watch the sleeve move', visualFirst: true,
      visual: { type: 'gearshift' },
      body: [
        'Shift 2 → 3 and watch the sleeve leave one gear, cross neutral and slide onto the next.',
        'In a real box the sleeve pauses for a split second against the blocker ring. That pause is the synchro doing its job.',
      ] },
    { tag: 'how', title: 'One shift, step by step',
      body: [
        '1. The fork pushes the sleeve, which presses the blocker ring’s cone onto the gear’s cone.',
        '2. Cone friction **drags the gear to the shaft’s speed** (that’s why the clutch must be in: the gear only has to spin up the disc and input shaft, not the engine).',
        '3. While speeds differ, friction twists the ring so its teeth **block** the sleeve.',
        '4. Speeds match → the ring stops being pulled, the sleeve slides through and locks onto the dog teeth. Shift done.',
        'Low gears have the biggest speed jumps, so they often get **double or triple cones** for more friction area.',
      ] },
    { tag: 'why', title: 'Grinds and double-clutching',
      body: [
        '**Grinding** = the sleeve hitting dog teeth that aren’t at the same speed. Worn blocker rings, a dragging clutch or a rushed shift.',
        '[[double-clutching|Double-clutching]] predates synchros: clutch in, neutral, clutch **out**, blip the throttle to spin the input shaft up, clutch in, select the lower gear.',
        'Today it can still ease wear in an old box. **Rev-matching** a downshift is related but different: it matches **engine** speed to the wheels so the car doesn’t lurch when the clutch comes up.',
      ] },
    { tag: 'bikes', title: 'Bikes skip the synchros',
      body: [
        'Motorcycle gearboxes are **dog boxes**: no synchros, just big chunky dogs on sliding gears, stepped one gear at a time by a shift drum.',
        'Light parts + small speed differences = fast, crisp shifts. A quickshifter can even upshift with no clutch.',
        'That’s why bike shifts “clunk.” Full story in Track 2: The sequential gearbox.',
      ] },
  ],
  quiz: [
    { type: 'order', q: 'Order what happens during a synchronized shift.', items: ['Fork pushes the sleeve', 'Blocker ring cone presses on the gear cone', 'Friction matches the gear’s speed to the shaft', 'Blocker ring stops blocking', 'Sleeve slides onto the dog teeth'],
      why: 'Push → friction cones touch → speeds equalize (the ring blocks until then) → the ring lets the sleeve through → the sleeve locks the gear.' },
    { type: 'mc', q: 'What does the **blocker ring** prevent?', options: ['Oil leaking from the gearbox', 'The sleeve locking on before the speeds match', 'Shifting into reverse at speed', 'The clutch from slipping'], answer: 1,
      why: 'While there’s a speed difference, cone friction twists the ring so its teeth sit in the sleeve’s way. No match, no lock.' },
    { type: 'mc', q: 'Why must the clutch be pressed for a synchro to work well?', options: ['It cools the synchro', 'The synchro only has to change the speed of the light disc and input shaft, not the whole engine', 'It unlocks the shift forks', 'It doesn’t matter'], answer: 1,
      why: 'Synchro cones are small. With the clutch engaged they’d have to drag the engine’s rotating mass too, so they’d grind and wear fast.' },
    { type: 'mc', q: 'Motorcycle gearboxes usually use…', options: ['Triple-cone synchros', 'Dog engagement with no synchros', 'Planetary gearsets', 'A torque converter'], answer: 1,
      why: 'Bike boxes are sequential dog boxes. Small, light gears don’t need synchros, and the shifts are faster for it.' },
  ],
  cards: [
    { id: 'synchro', front: 'What does a synchro do?', back: 'Uses cone friction to match a gear’s speed to its shaft before the sleeve locks it.' },
    { id: 'parts', front: 'Synchro parts?', back: 'Hub, sleeve, blocker (baulk) ring, gear cone + dog teeth.' },
    { id: 'grind', front: 'What is a gear grind?', back: 'The sleeve hitting dog teeth at a different speed: worn blocker ring, dragging clutch or rushed shift.' },
    { id: 'double', front: 'Double-clutching?', back: 'Clutch in, neutral, clutch out + blip to spin the input shaft up, clutch in, select gear. Pre-synchro technique.' },
    { id: 'dogbox', front: 'Why don’t bikes need synchros?', back: 'Light gears and small speed differences: a dog box shifts fast without them.' },
  ],
};
