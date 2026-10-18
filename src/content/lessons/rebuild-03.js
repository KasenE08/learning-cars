// Reassembly & break-in
export default {
  steps: [
    { tag: 'metaphor', title: 'Surgery, then rehab',
      body: [
        'Reassembly is the surgery: sterile, careful, every stitch counted. Break-in is the rehab: the new parts learn to work together.',
        'Most rebuilt engines that fail early fail from **dirt, a missed measurement or a timing mistake**, not bad parts.',
      ] },
    { tag: 'how', title: 'Clean like it’s a lab',
      body: [
        'Machining leaves grit in oil passages. Blocks get washed, passages brushed out, and threads cleaned.',
        'One grain of honing grit in a bearing can score it on the first start.',
        'Every clearance from the last lesson is **checked again** with the new parts, before final assembly.',
      ] },
    { tag: 'how', title: 'Lube, rings and bolts',
      body: [
        '[[assembly-lube]] goes on bearings, cam lobes and other sliding parts: they have to survive the first seconds before oil pressure arrives.',
        'Ring gaps are **staggered** around the piston so the gaps don’t line up into a leak path.',
        '[[torque-to-yield]] bolts (often head, main or rod bolts) have stretched once. They’re **replaced**, not reused.',
      ] },
    { tag: 'how', title: 'Torque vs torque-angle',
      body: [
        'What actually holds parts together is **clamp force** from the bolt stretching, like a spring.',
        'A torque wrench reads twist, but much of the twist fights **friction** in the threads. Oily vs dry threads give different clamp at the same torque.',
        '[[torque-angle]]: snug the bolt to a low torque, then turn it a set number of **degrees**. Angle = stretch, so clamp is far more consistent.',
        'Heads are tightened in a **sequence** (typically from the middle outward, in stages) so the head pulls down evenly.',
      ] },
    { tag: 'see', title: 'Pistons, rings and pins', visualFirst: true,
      visual: { type: 'parts', drawing: 'piston' },
      body: [
        'Tap each ring. Each one goes in its own groove, the right way up (many are marked), with its gap staggered.',
        'The wrist pin, rod and piston must face the right way; many pistons have an arrow or dot toward the front.',
      ] },
    { tag: 'how', title: 'Timing and first start',
      body: [
        'Crank and cams are lined up at their timing marks (or locked with tools), then the chain or belt goes on.',
        'Turn the engine **by hand two full revolutions** and recheck the marks. On an [[interference-engine]] a timing mistake means valves hit pistons.',
        '[[oil-priming|Prime the oil system]]: build oil pressure **before** the first fire, so bearings aren’t running dry.',
        'First start: watch oil pressure, leaks, and coolant temperature.',
      ] },
    { tag: 'why', title: 'Break-in: honest about the debate',
      body: [
        '[[break-in]] is mostly the **rings bedding** into the hone crosshatch to seal. Most of it happens in the first miles.',
        '**Gentle camp** (most owner’s manuals): vary speed and load, avoid full throttle, constant cruise and lugging for the first several hundred miles.',
        '**Firm camp**: moderate-to-firm loads early push the rings hard against the walls so they seat before the crosshatch glazes.',
        'Both camps agree: don’t idle for ages, don’t lug, and change the oil early to remove wear metal. For your bikes, follow the owner’s manual’s break-in table (Kawasaki manuals typically cap rpm in stages).',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'Why is torque-angle tightening more consistent than torque alone?',
      options: ['It’s faster', 'Angle sets the bolt’s stretch directly, so clamp force doesn’t depend as much on thread friction', 'It uses less force', 'It lets you reuse bolts'], answer: 1,
      why: 'Clamp comes from stretch. A torque reading is distorted by friction (oily vs dry threads); turning a set angle sets the stretch.',
      wrong: { 3: 'Torque-angle bolts are often torque-to-yield, which makes reuse a bad idea.' } },
    { type: 'order', q: 'Put these final reassembly steps in order.',
      items: ['Clean block and oil passages', 'Recheck clearances with the new parts', 'Install crank, pistons and rods with assembly lube', 'Fit the head and set cam timing', 'Turn by hand two revolutions and recheck marks', 'Prime the oil system', 'First start'],
      why: 'Clean → measure → bottom end → top end and timing → verify by hand → oil pressure → fire. Skipping the hand-turn or the priming is how fresh engines die.' },
    { type: 'mc', q: 'Why are ring end gaps **staggered** around the piston?', options: ['To balance the piston', 'So the gaps don’t line up into a straight leak path', 'To make installation easier', 'It doesn’t matter'], answer: 1,
      why: 'Lined-up gaps give combustion gas an easy path past all the rings. Staggering them makes the path longer.' },
    { type: 'mc', q: 'What is break-in mainly doing?', options: ['Burning off paint', 'Letting the rings bed into the cylinder walls to seal', 'Stretching the timing chain', 'Charging the battery'], answer: 1,
      why: 'Rings and fresh honed walls wear into each other at first. A good seal = good compression and low oil consumption.' },
  ],
  cards: [
    { id: 'lube', front: 'Why use assembly lube?', back: 'Protects bearings and cam lobes for the first seconds, before oil pressure arrives.' },
    { id: 'tty', front: 'Torque-to-yield bolts on reassembly?', back: 'Replace them. They stretched permanently the first time.' },
    { id: 'angle', front: 'What does torque-angle control?', back: 'Bolt stretch (= clamp force), much less affected by thread friction.' },
    { id: 'hand', front: 'Why turn a rebuilt engine by hand first?', back: 'To confirm timing marks and that no valve hits a piston before it’s under power.' },
    { id: 'breakin', front: 'Break-in: what do both camps agree on?', back: 'Don’t lug or idle forever; vary load; change the oil early.' },
  ],
};
