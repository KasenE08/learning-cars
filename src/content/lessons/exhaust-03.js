// Mufflers & resonators
export default {
  steps: [
    { tag: 'metaphor', title: 'Headphones and a pillow',
      body: [
        'There are two ways to quiet a noise. **Noise-cancelling headphones** play a matching wave that cancels it. A **pillow** soaks it up.',
        'Exhausts use both. [[chambered-muffler|Chambered mufflers]] and [[resonator|resonators]] cancel sound with reflected waves; [[absorptive-muffler|absorptive mufflers]] soak it up in packing.',
      ] },
    { tag: 'see', title: 'Where they sit', visualFirst: true,
      visual: { type: 'parts', drawing: 'exhaust' },
      body: [
        'Tap the **resonator** and the **muffler**, both downstream of the cat.',
        'Everything after the cat is the [[cat-back]] section: the usual target of aftermarket exhausts, because it doesn’t touch emissions parts.',
      ] },
    { tag: 'how', title: 'Three kinds of muffler',
      body: [
        '**Chambered**: internal walls (baffles) bounce sound waves into each other so they cancel. Compact; often a deep, aggressive tone.',
        '**Turbo-style**: gas zig-zags through perforated tubes in an S-path. Quiet with mild restriction. ~~The name comes from its look, not from turbochargers.~~',
        '**Straight-through / absorptive**: one perforated pipe wrapped in packing (fiberglass or steel wool). Absorbs high frequencies, least restrictive, loudest. Packing slowly burns out, so it gets louder with age.',
      ] },
    { tag: 'how', title: 'Resonators and drone',
      body: [
        'A [[resonator]] is tuned to cancel a **narrow band** of frequencies, usually the one that causes [[drone]].',
        'Drone: a steady **boom** inside the cabin at highway cruise rpm, when the exhaust’s pulse frequency lines up with a resonance of the pipes or the cabin.',
        'Removing a resonator rarely adds noticeable power, but often adds drone. Some cars instead use exhaust **valves** or play cancelling sound through the speakers.',
      ] },
    { tag: 'math', title: 'What frequency is the drone?',
      body: [
        'The main exhaust note is the [[firing-frequency]]: `Hz = rpm ÷ 60 × cylinders ÷ 2` (a 4-stroke fires each cylinder once per 2 revs).',
        'Your Bronco’s inline-4 cruising at 2,000 rpm: 2,000 ÷ 60 × 4 ÷ 2 ≈ **67 Hz**. That’s a low hum you feel as much as hear.',
        'A resonator for drone is tuned near the frequency at the rpm where the car spends most of its highway time.',
      ] },
  ],
  quiz: [
    { type: 'tap', q: 'Tap the part tuned to cancel one narrow band of frequencies (usually drone).', visual: { type: 'parts', drawing: 'exhaust' }, answer: 'resonator',
      why: 'A resonator is tuned to a narrow frequency band. The muffler handles broad-band noise.',
      wrong: { muffler: 'The muffler quiets a broad range of frequencies, not one targeted band.', cat: 'The cat cleans up emissions. Any quieting it does is a side effect.' } },
    { type: 'mc', q: 'Which muffler uses a perforated pipe wrapped in packing?', options: ['Chambered', 'Turbo-style', 'Straight-through / absorptive', 'Resonator'], answer: 2,
      why: 'Absorptive mufflers soak up sound in fiberglass or steel-wool packing around a straight perforated pipe. Least restriction, most noise.' },
    { type: 'num', q: 'Inline-4 at **2,400 rpm**: firing frequency in Hz?', answer: 80, tol: 0, unit: 'Hz',
      hint: 'Hz = rpm ÷ 60 × cylinders ÷ 2', why: '2,400 ÷ 60 = 40 rev/s × 4 ÷ 2 = **80 Hz**.' },
    { type: 'mc', q: 'What is exhaust **drone**?', options: ['A whistle from the turbo', 'A steady cabin boom at cruise rpm when the pulse frequency hits a resonance', 'Pops on deceleration', 'A rattle from a loose heat shield'], answer: 1,
      why: 'Drone is resonance: at one steady rpm, the firing frequency matches the pipes or the cabin and the sound builds up.' },
  ],
  cards: [
    { id: 'types', front: 'Three muffler types?', back: 'Chambered (reflect & cancel), turbo-style (S-path through perforated tubes), straight-through/absorptive (packing).' },
    { id: 'resonator', front: 'What does a resonator do?', back: 'Cancels a narrow band of frequencies, usually the drone at cruise.' },
    { id: 'drone', front: 'Drone?', back: 'Cabin boom at steady cruise rpm, when exhaust pulse frequency matches a resonance.' },
    { id: 'freq', front: 'Firing frequency formula (4-stroke)?', back: 'Hz = rpm ÷ 60 × cylinders ÷ 2.' },
  ],
};
