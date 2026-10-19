// Ride-by-wire & ride modes
export default {
  steps: [
    { tag: 'metaphor', title: 'A translator between your wrist and the engine',
      body: [
        'With a cable throttle, your wrist **is** the throttle: twist 20% and the throttle plates open 20%, always.',
        'With [[drive-by-wire|ride-by-wire]], your wrist talks to a translator (the ECU), which decides how far to open them.',
        'A good translator can be gentle in the rain and sharp on a dry day, from the same twist of the grip.',
      ] },
    { tag: 'how', title: 'How ride-by-wire works',
      body: [
        'A **twist-grip sensor** (like a car’s [[app-sensor]], with two independent signals) reports how far you’ve rolled on.',
        'The [[ecu]] reads it, plus rpm, gear and speed, and commands an electric motor on the [[throttle-body|throttle bodies]].',
        'A [[tps|throttle position sensor]] reports the actual plate angle back so the ECU can cross-check. Signals disagree → it drops into a reduced-power [[limp-mode]].',
        'Spring return still closes the throttle if power is lost, just like a cable.',
      ] },
    { tag: 'see', title: 'Where it lives', visualFirst: true,
      visual: { type: 'parts', drawing: 'moto-side' },
      body: [
        'Tap **throttle** and **ecu**. On a ride-by-wire bike the only link between them and the twist grip is wiring.',
        'Tap **quickshifter** too: it’s another sensor feeding the same ECU.',
      ] },
    { tag: 'how', title: 'Maps and modes',
      body: [
        'A [[throttle-map]] is a table: grip position (and rpm) in → throttle opening or torque request out.',
        'A soft map opens less for the same twist at low grip openings. That smooths the on/off snap when you crack the throttle mid-corner.',
        '[[ride-modes|Ride modes]] bundle a map with other settings: power limit, traction control level, sometimes ABS mode and engine braking.',
        'Rain mode doesn’t add grip. It makes it harder to ask the tire for more than it has.',
      ] },
    { tag: 'why', title: 'What else ride-by-wire enables',
      body: [
        '[[traction-control]] can close the throttle smoothly instead of only cutting spark or fuel.',
        '**Cruise control**: the ECU can hold the throttle itself.',
        '**Auto-blip downshifts**: a bi-directional [[quickshifter]] has to open the throttle by itself on a downshift, which needs an electronic throttle. A basic upshift-only quickshifter can work with a cable, since it just cuts ignition.',
      ] },
    { tag: 'bikes', title: 'Your two bikes',
      body: [
        '**RS 457**: ride-by-wire with three modes, **Rain, Eco and Sport**, each pairing throttle response with a traction control setting.',
        'Reviewers disagree on whether the modes also cap peak power: some say only throttle feel and TC change, one found Rain heavily cut low-rpm power.',
        '**Ninja 500**: no ride modes. Its throttle appears to be cable-operated (aftermarket cable throttle kits are sold for it; Kawasaki doesn’t list ride-by-wire). Not confirmed by Kawasaki.',
        'The RS’s accessory quickshifter is up/down with auto-blip, which its ride-by-wire makes possible.',
      ],
      facts: ['rs457.modes', 'rs457.electronics', 'rs457.qsUpDown', 'ninja.electronics', 'ninja.throttle'] },
  ],
  quiz: [
    { type: 'order', q: 'Order the ride-by-wire signal chain.', items: ['Rider twists grip', 'Grip sensor sends two signals', 'ECU applies the throttle map', 'Throttle motor moves the plates', 'Throttle position sensor confirms'],
      why: 'Request → sensing → decision → actuation → feedback. The double signals and feedback catch faults.' },
    { type: 'tap', q: 'Tap the computer that runs the ride modes.', visual: { type: 'parts', drawing: 'moto-side' }, answer: 'ecu',
      why: 'The ECU holds the maps and applies them to the throttle, spark and fuel.',
      wrong: { throttle: 'The throttle bodies are what the ECU moves; the decision is made in the ECU.' } },
    { type: 'mc', q: 'Which feature **needs** an electronic throttle?', options: ['Upshift-only quickshifter', 'Auto-blip downshifts', 'Slipper clutch', 'ABS'], answer: 1,
      why: 'Auto-blip has to open the throttle without the rider. An upshift quickshifter only cuts ignition; ABS and slipper clutches don’t use the throttle.',
      wrong: { 0: 'Upshift quickshifters just cut ignition for a moment, which works with a cable throttle.' } },
  ],
  cards: [
    { id: 'rbw', front: 'Ride-by-wire in one line?', back: 'Grip sensor → ECU → motor-driven throttle; no cable.' },
    { id: 'map', front: 'What is a throttle map?', back: 'A table turning grip position (and rpm) into throttle opening or torque request.' },
    { id: 'modes', front: 'What do ride modes bundle?', back: 'Throttle map, power limit, traction control level, sometimes ABS and engine braking.' },
    { id: 'rs', front: 'RS 457 ride modes?', back: 'Rain, Eco and Sport, via ride-by-wire.' },
    { id: 'ninja', front: 'Does the Ninja 500 have ride modes?', back: 'No; no modes or traction control, and its throttle appears to be cable-operated.' },
  ],
};
