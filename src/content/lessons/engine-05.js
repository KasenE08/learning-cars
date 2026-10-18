// Pistons & rings
export default {
  steps: [
    { tag: 'metaphor', title: 'A syringe plunger',
      body: [
        'A [[piston]] is a syringe plunger. The [[piston-rings]] are the seal around it. Except they’re springy metal, and they work at hundreds of degrees.',
        'The bottom ring is a **squeegee**: it wipes oil off the wall so it doesn’t get burned.',
      ] },
    { tag: 'see', title: 'Anatomy of a piston', visualFirst: true,
      visual: { type: 'parts', drawing: 'piston' },
      body: ['Tap each part: crown, rings, lands, skirt, pin, pin bosses, rod.'] },
    { tag: 'how', title: 'Three rings, three jobs',
      body: [
        '**Top compression ring**: seals the combustion pressure.',
        '**Second ring**: backup seal, and scrapes oil downward.',
        '**Oil control ring**: two thin rails + a wavy expander. Scrapes oil off and drains it through holes back into the crankcase.',
        'Each ring has a small **end gap** so it can grow with heat without jamming.',
      ] },
    { tag: 'how', title: 'Blow-by',
      body: [
        'No ring seals perfectly. A little combustion gas sneaks past into the crankcase: **blow-by**.',
        'The **PCV** (positive crankcase ventilation) system sucks those gases back into the intake to be burned.',
        'Worn rings = more blow-by, lost compression and burning oil (blue smoke).',
      ] },
    { tag: 'how', title: 'Crown, skirt and pin',
      body: [
        'The **crown** takes the full heat and pressure. Direct-injection pistons often have a shaped bowl in it to guide the fuel spray.',
        'The **skirt** keeps the piston square in the bore. Too loose and it rocks: **piston slap**.',
        'The [[wrist-pin]] lets the rod pivot while the piston moves straight. Clips at each end keep it in.',
        '**Cast** pistons are cheaper. **Forged** ones are denser and stronger; tuners use them for big boost.',
      ] },
    { tag: 'math', title: 'How hard pistons work',
      body: [
        'A piston stops and reverses **twice per revolution**.',
        'At 6,000 rpm that’s 6,000 ÷ 60 × 2 = **200 stops and reversals per second**.',
        'That’s why pistons are light aluminum, and why stronger rods and pistons are the first upgrade for big power.',
      ] },
  ],
  quiz: [
    { type: 'tap', q: 'Tap the **oil control ring**.', visual: { type: 'parts', drawing: 'piston' }, answer: 'oil-ring',
      why: 'It’s the bottom ring, with the wavy expander. It scrapes oil off the cylinder wall.',
      wrong: { 'top-ring': 'That’s the top compression ring. It seals combustion pressure.', 'second-ring': 'That’s the second (backup) ring.' } },
    { type: 'tap', q: 'Tap the **wrist pin**.', visual: { type: 'parts', drawing: 'piston' }, answer: 'wrist-pin',
      why: 'The wrist pin runs crosswise through the piston and the rod’s small end.' },
    { type: 'mc', q: 'What is **blow-by**?', options: ['Exhaust leaking at the manifold', 'Combustion gas slipping past the rings into the crankcase', 'Air leaking past the throttle', 'Oil leaking from the valve cover'], answer: 1,
      why: 'Some combustion gas always gets past the rings. PCV routes it back to the intake to be burned.' },
    { type: 'mc', q: 'Why do piston rings have an **end gap**?', options: ['So oil can drain through it', 'Room to expand with heat without jamming against each other', 'To lower compression on purpose', 'To make installation optional'], answer: 1,
      why: 'Rings get very hot and expand. Without a gap the ends would butt together and the ring could scuff or break.' },
    { type: 'num', q: 'At **4,500 rpm**, how many times per second does a piston change direction?', answer: 150, tol: 0, unit: 'per second',
      why: '4,500 ÷ 60 = 75 revolutions per second × 2 reversals = **150**.' },
  ],
  cards: [
    { id: 'rings', front: 'Jobs of the three piston rings?', back: 'Top: seal compression. Second: backup seal + scrape oil. Oil ring: scrape oil off the wall.' },
    { id: 'blowby', front: 'Blow-by, and what handles it?', back: 'Combustion gas leaking past the rings into the crankcase. PCV routes it back into the intake.' },
    { id: 'skirt', front: 'Job of the piston skirt?', back: 'Keeps the piston square in the bore (prevents rocking / piston slap).' },
    { id: 'forged', front: 'Cast vs forged pistons?', back: 'Forged = denser, stronger, pricier (for high boost/power). Cast = cheaper, fine for stock.' },
  ],
};
