// The block: cylinders, bore & stroke
export default {
  steps: [
    { tag: 'metaphor', title: 'The building’s frame',
      body: [
        'The [[cylinder-block]] is the engine’s concrete-and-steel frame. Everything else bolts to it.',
        'The cylinders are elevator shafts; the pistons are the elevators.',
        'The crankshaft lives in the basement, held by heavy brackets called main bearing caps.',
      ] },
    { tag: 'how', title: 'What the block holds', visualFirst: true,
      visual: { type: 'parts', drawing: 'engine-section' },
      body: [
        '**Cylinders**: precise bores the pistons slide in.',
        '**Main bearing saddles**: where the crankshaft sits.',
        '**Water jackets** for coolant and **oil galleries** that feed the bearings.',
        'Mechanics split an engine into the **top end** (head, valvetrain) and the **bottom end** (block, crank, rods, pistons). You’ll hear “bottom-end rebuild” a lot.',
      ] },
    { tag: 'how', title: 'Iron or aluminum',
      body: [
        '**Cast iron**: strong, cheap, heavy. Classic trucks and race blocks that need strength.',
        '**Aluminum**: much lighter and sheds heat well, but softer. It needs **iron liners** (sleeves) or a hard **coating** sprayed on the bore so the rings have a tough surface to rub on.',
        'Most modern car and motorcycle engines are aluminum.',
      ] },
    { tag: 'see', title: 'Bore and stroke', visualFirst: true,
      visual: { type: 'displacement', cylinders: false },
      body: [
        '[[bore]] = cylinder **diameter**. [[stroke]] = how far the piston **travels**, TDC to BDC.',
        'Drag the sliders, or tap the presets for your Bronco and the two bikes.',
      ] },
    { tag: 'why', title: 'Oversquare vs undersquare',
      body: [
        '[[oversquare]]: bore **bigger** than stroke. Short stroke → piston travels less per rev → engine can **rev higher**. Big bore → room for **bigger valves**.',
        'Undersquare: stroke bigger than bore. Longer lever on the crank, strong **low-rpm torque**, lower rev limit.',
        '**Mean piston speed** = 2 × stroke × rpm ÷ 60. It caps how fast an engine can safely spin; around 20–25 m/s is the realm of race engines.',
      ] },
    { tag: 'bronco', title: 'Your Bronco vs the bikes',
      body: [
        'Bronco 2.0: **87.5 × 83.1 mm**. Bore ÷ stroke ≈ 1.05: barely oversquare, a road-car compromise.',
        'Ninja 500: **70.0 × 58.6 mm** (1.19). RS 457: **69.0 × 61.1 mm** (1.13). Both much more oversquare: small pistons, short strokes, built to rev.',
      ],
      facts: ['bronco.boreStroke', 'ninja.boreStroke', 'rs457.boreStroke'] },
  ],
  quiz: [
    { type: 'mc', q: 'What is the **stroke**?', options: ['The cylinder’s diameter', 'How far the piston travels from TDC to BDC', 'The length of the connecting rod', 'One full crank revolution'], answer: 1,
      why: 'Stroke is piston travel. Bore is the diameter. Stroke = 2 × the crank throw.',
      wrong: { 0: 'That’s the bore.', 2: 'Rod length affects geometry, but stroke comes from the crank throw.' } },
    { type: 'mc', q: 'Which engine is the most **oversquare**?', options: ['Bore 87.5 mm, stroke 83.1 mm', 'Bore 70.0 mm, stroke 58.6 mm', 'Bore 86 mm, stroke 86 mm', 'Bore 82 mm, stroke 94 mm'], answer: 1,
      why: '70.0 ÷ 58.6 ≈ 1.19 is the biggest bore-to-stroke ratio here. That’s the Ninja 500. 86 × 86 is square; 82 × 94 is undersquare.' },
    { type: 'num', q: 'Mean piston speed of your Bronco (83.1 mm stroke) at **5,500 rpm**, in m/s? (2 × stroke × rpm ÷ 60)', answer: 15.2, tol: 0.3, unit: 'm/s',
      hint: '83.1 mm = 0.0831 m.', why: '2 × 0.0831 m × 5,500 ÷ 60 = **15.2 m/s**. The piston averages about 34 mph while stopping and reversing twice every revolution.' },
    { type: 'tap', q: 'Tap the **water jacket**.', visual: { type: 'parts', drawing: 'engine-section' }, answer: 'jacket',
      why: 'The water jackets are the coolant passages cast into the block around the cylinders.' },
    { type: 'mc', q: 'Why do aluminum blocks usually have liners or a coated bore?', options: ['To make them lighter', 'Aluminum is too soft for rings to rub on all day', 'For better fuel economy', 'Because aluminum can’t be cast'], answer: 1,
      why: 'The piston rings would wear bare aluminum quickly. An iron sleeve or a hard sprayed coating gives them a tough surface.' },
  ],
  cards: [
    { id: 'bore-stroke', front: 'Bore vs stroke?', back: 'Bore = cylinder diameter. Stroke = piston travel TDC→BDC (= 2 × crank throw).' },
    { id: 'square', front: 'Oversquare means…? And what does it favor?', back: 'Bore > stroke. Favors high rpm (short stroke) and big valves.' },
    { id: 'ends', front: 'Top end vs bottom end?', back: 'Top end = head + valvetrain. Bottom end = block, crank, rods, pistons.' },
    { id: 'piston-speed', front: 'Mean piston speed formula?', back: '2 × stroke × rpm ÷ 60 (stroke in meters → m/s).' },
    { id: 'bronco-bs', front: 'Bronco 2.0 bore × stroke?', back: '87.5 × 83.1 mm. Slightly oversquare (≈1.05).' },
  ],
};
