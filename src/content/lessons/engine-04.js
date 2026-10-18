// Displacement: the math
export default {
  steps: [
    { tag: 'metaphor', title: 'Lung capacity',
      body: [
        '[[displacement]] is the engine’s lung size: the total volume all pistons sweep in one stroke.',
        'Bigger lungs move more air per breath. More air per revolution → room for more fuel → more torque.',
      ] },
    { tag: 'math', title: 'The formula',
      body: [
        'One cylinder = area of the bore circle × stroke: `π/4 × bore² × stroke`.',
        'Engine = that × number of cylinders.',
        'Work in **centimeters** and the answer comes out in **cc**. 1,000 cc = 1 liter (L). 1 cubic inch (ci) ≈ 16.39 cc.',
      ] },
    { tag: 'math', title: 'Do it for your Bronco',
      body: [
        'Bore 8.75 cm, stroke 8.31 cm.',
        '`π/4 × 8.75² × 8.31` = **499.7 cc** per cylinder.',
        '× 4 cylinders = **1,999 cc ≈ 2.0 L ≈ 122 ci**.',
        'That’s how “2.0 L” is born. Car makers round up: the badge isn’t exact.',
      ],
      facts: ['bronco.displacement'] },
    { tag: 'see', title: 'Try it', visualFirst: true,
      visual: { type: 'displacement', cylinders: true },
      body: [
        'Double the **stroke** → displacement doubles.',
        'Double the **bore** → displacement **quadruples** (bore is squared).',
      ] },
    { tag: 'why', title: '“No replacement for displacement”?',
      body: [
        'The old saying: more liters = more torque. True if everything else stays equal.',
        'Turbos break the rule: they force **more air** into the same volume. Your 2.0 L makes torque that would take a much bigger engine without boost.',
      ] },
    { tag: 'bikes', title: 'The bikes: names round up too',
      body: [
        'Ninja 500: 2 × π/4 × 7.0² × 5.86 = **451 cc**. The “500” is marketing.',
        'RS 457: 2 × π/4 × 6.9² × 6.11 = **457 cc**. Six cc bigger than the Ninja.',
      ],
      facts: ['ninja.engine', 'rs457.engine'] },
  ],
  quiz: [
    { type: 'num', q: 'A 4-cylinder has an **8.0 cm** bore and **9.0 cm** stroke. Displacement in cc?', answer: 1809.6, tol: 6, unit: 'cc',
      hint: 'π/4 × bore² × stroke × cylinders.', why: 'π/4 × 8.0² × 9.0 = 452.4 cc per cylinder × 4 = **1,810 cc** (≈1.8 L).' },
    { type: 'mc', q: 'You **double the bore** and keep the stroke. Displacement becomes…', options: ['The same', '2× bigger', '4× bigger', '8× bigger'], answer: 2,
      why: 'Bore is squared in the formula (it’s a circle’s area). 2² = 4.', wrong: { 1: 'That’s what doubling the stroke does. Bore is squared.' } },
    { type: 'num', q: 'Convert **2.0 L** to cubic inches (1 ci = 16.39 cc).', answer: 122, tol: 1, unit: 'ci', why: '2,000 cc ÷ 16.39 = **122 ci**.' },
    { type: 'mc', q: 'What’s the Ninja 500’s actual displacement?', options: ['500 cc', '451 cc', '457 cc', '399 cc'], answer: 1,
      why: '70.0 × 58.6 mm twin = 451 cc. 457 is the RS 457; 399 was the older Ninja 400.' },
  ],
  cards: [
    { id: 'formula', front: 'Displacement formula?', back: 'π/4 × bore² × stroke × cylinders (cm in → cc out).' },
    { id: 'units', front: '1 L = ? cc · 1 ci = ? cc', back: '1 L = 1,000 cc · 1 ci ≈ 16.39 cc.' },
    { id: 'bore2', front: 'Double the bore → displacement ×?', back: '×4 (bore is squared). Double the stroke → ×2.' },
    { id: 'bikes', front: 'Ninja 500 vs RS 457 displacement?', back: 'Ninja 500: 451 cc. RS 457: 457 cc.' },
  ],
};
