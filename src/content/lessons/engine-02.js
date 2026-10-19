// The 4-stroke cycle
export default {
  steps: [
    { tag: 'metaphor', title: 'Suck, squeeze, bang, blow',
      body: [
        'Think of one big breath: **inhale**, **hold and squeeze**, **shout**, **exhale**.',
        'An engine cylinder does exactly that, over and over: **intake, compression, power, exhaust**.',
        'Mechanics really do call it “suck, squeeze, bang, blow.”',
      ] },
    { tag: 'see', title: 'Watch one full cycle', visualFirst: true,
      visual: { type: 'cylinder', mode: 'cycle' },
      body: [
        'Press play, or drag the slider to scrub. Watch the valve lamps and the color of the gas.',
        'Blue = fresh air-fuel. Orange = burning. Brown = exhaust.',
      ] },
    { tag: 'how', title: '1 · Intake (0–180°)',
      body: [
        'Piston moves **down** from [[tdc]] to [[bdc]]. Intake valve **open**, exhaust closed.',
        'The falling piston drops the pressure in the cylinder, so outside air rushes in.',
        'Port-injected engines mix fuel into that air; direct-injected ones (like yours) spray fuel straight into the cylinder.',
      ] },
    { tag: 'how', title: '2 · Compression (180–360°)',
      body: [
        '**Both valves closed.** Piston moves **up**, squeezing the mixture to about a tenth of its volume.',
        'Squeezing makes the burn much stronger (more on that in Compression Ratio).',
        'The spark fires **before** [[tdc]] (here 15° early), because the flame needs time to spread. Peak pressure should land just after TDC.',
      ] },
    { tag: 'how', title: '3 · Power (360–540°)',
      body: [
        '**Both valves closed.** The burning mixture’s pressure spikes and slams the piston **down**.',
        'This is the **only stroke that makes power.** The other three are paid for by momentum (the flywheel) and the other cylinders.',
      ] },
    { tag: 'how', title: '4 · Exhaust (540–720°)',
      body: [
        'Exhaust valve **open**. Piston moves **up** and pushes the burnt gas out.',
        'Near TDC both valves are briefly open together: that’s [[valve-overlap]]. The outgoing exhaust helps pull the new charge in.',
        'Then it all repeats.',
      ] },
    { tag: 'math', title: 'Two turns per cycle',
      body: [
        '4 strokes = **2 crank revolutions = 720°**.',
        'So each cylinder fires **once every 2 revolutions**. The [[camshaft]] turns at **half** crank speed for the same reason: each valve opens once per cycle.',
        'Example: at 3,000 rpm one cylinder fires 1,500 times a minute = **25 per second**.',
        'A 4-cylinder spreads its 4 power strokes over 720°: one every **180°**.',
      ] },
  ],
  quiz: [
    { type: 'order', q: 'Put the four strokes in order.', items: ['Intake', 'Compression', 'Power', 'Exhaust'],
      why: 'Suck (intake), squeeze (compression), bang (power), blow (exhaust).' },
    { type: 'mc', q: 'During which strokes are **both** valves closed?', options: ['Intake and exhaust', 'Compression and power', 'Only power', 'Exhaust and intake overlap'], answer: 1,
      why: 'The cylinder has to be sealed to squeeze the mixture (compression) and to let the burning gas push the piston (power).',
      wrong: { 2: 'Power, yes, but compression also needs both valves shut or the mixture would escape.', 3: 'Overlap is the opposite: both valves slightly open at once.' } },
    { type: 'mc', q: 'Why does the spark fire before TDC instead of exactly at TDC?',
      options: ['To cool the piston', 'The flame takes time to spread, so peak pressure lands just after TDC', 'Because the exhaust valve is still open', 'It doesn’t. It always fires exactly at TDC'], answer: 1,
      why: 'Combustion isn’t instant. Firing early (spark advance) means the pressure peaks just after TDC, when it can push the piston down hardest.' },
    { type: 'mc', q: 'How many crank degrees does one full 4-stroke cycle take?', options: ['180°', '360°', '540°', '720°'], answer: 3,
      why: 'Four strokes of 180° each = 720°, which is two full crank revolutions.' },
  ],
  cards: [
    { id: 'order', front: 'The four strokes, in order?', back: 'Intake → compression → power → exhaust (“suck, squeeze, bang, blow”).' },
    { id: 'revs', front: 'Crank revolutions per 4-stroke cycle?', back: '**2** revolutions (720°). Each cylinder fires once per 2 revs.' },
    { id: 'valves', front: 'Which strokes have both valves closed?', back: 'Compression and power.' },
    { id: 'advance', front: 'Why does the spark fire before TDC?', back: 'The flame needs time to spread; firing early puts peak pressure just after TDC.' },
    { id: 'camspeed', front: 'Camshaft speed vs crank speed (4-stroke)?', back: 'Half. Each valve opens once per cycle = once per 2 crank revs.' },
  ],
};
