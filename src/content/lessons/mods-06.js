// Off-road mods
export default {
  steps: [
    { tag: 'metaphor', title: 'Boots, not a bigger backpack',
      body: [
        'For a tough hike, the upgrades that matter are **boots** (grip), **gaiters** (protection), a **phone and a friend** (a way out) and **experience**. A bigger backpack mostly adds weight.',
        'Off-road mods rank the same way: tires, protection, recovery, then skill. Lifts, lights and looks come last.',
      ] },
    { tag: 'see', title: 'Your traction hardware is already in there', visualFirst: true,
      visual: { type: 'awd', mode: 'rock', scene: 'launch' },
      body: [
        'Rock Crawl mode: 4x4 lock, [[rear-diff-lock]] (both [[rdu]] clutches clamped), and damped throttle.',
        'The Badlands already has the parts most crossovers would “mod” for. What it can’t change is how much the **tires** grip.',
      ],
      facts: ['bronco.goat', 'bronco.rearLock'] },
    { tag: 'how', title: 'Tires: the mod that matters, and its limits',
      body: [
        'A tougher [[all-terrain-tire|all-terrain]] with a stronger sidewall resists punctures, the most common trail failure. Load rating still has to match the placard.',
        'Going taller raises the **whole truck**, axles and diffs included: real clearance, unlike a body lift. But it adds weight, [[rotational-inertia]], [[speedo-error]] and load on the PTU and RDU, and costs mpg.',
        'Owners report **235/70R17 (≈30.0 in)** and **245/65R17 (≈29.5 in)** fit a stock Badlands, sometimes brushing the liners at full lock. 255/70R17 (≈31 in) doesn’t clear. Forum reports, not a Ford spec.',
        'Ford’s own upsize (2025+ Sasquatch) stopped at **29 in**. A lift or leveling kit buys room for more, with the CV trade-offs from the suspension lesson.',
      ],
      facts: ['bronco.tires', 'bronco.maxTire', 'bronco.sasquatch'] },
    { tag: 'how', title: 'Protection and getting unstuck',
      body: [
        '[[skid-plate|Skid plates]] let rocks slide past the oil pan, transmission and fuel tank. Rock rails protect the rockers when the truck high-centers.',
        'A [[recovery-point]] must be rated and bolted to the frame or crash structure. Shipping tie-down loops and hitch balls are not recovery points: they can snap off and become projectiles.',
        'A [[kinetic-rope]] stretches and stores energy, so it needs rated points and soft shackles. Traction boards are the cheap, low-energy way out of sand and mud.',
      ],
      facts: ['bronco.recovery'] },
    { tag: 'key', title: 'What not to bother with (opinion, with reasons)',
      body: [
        '**Big spacer lifts** on a unibody crossover: more height than your CV joints like and more roll on the road. Add taller tires and the gearing gets taller too, with no [[low-range]] to make up for it.',
        '**Light bars**: look tough; many states require off-road lights to be off or covered on public roads. Check your state.',
        '**Fake bead-locks, decals, snorkels for looks**: weight or nothing. The trail doesn’t care.',
        'Better spend: a tire with a stronger sidewall, a tire-pressure gauge, recovery gear, and a trip with experienced people.',
      ] },
    { tag: 'bronco', title: 'Your priority list',
      visual: { type: 'checklist', title: 'Badlands off-road mod priority',
        groups: [
          { name: '1 · Traction', items: [
            { check: 'Tire with a strong sidewall and correct load rating', why: 'Punctures and torn sidewalls end more trips than lack of power.' },
            { check: 'Upsize only to what fits (≈29.5–30 in on stock height)', why: 'Bigger rubs at full lock and adds speedometer error and drivetrain load.' },
          ] },
          { name: '2 · Protection', items: [
            { check: 'Know what the factory skid plates already cover', why: 'Badlands has them standard; add only where they don’t reach.' },
            { check: 'Rock rails if you’ll do rocks', why: 'Rockers are what a high-centered crossover lands on.' },
          ] },
          { name: '3 · Recovery', items: [
            { check: 'Use the front tow hooks and the rear frame-mounted point', why: 'Rated points are already there; tie-down loops aren’t recovery points.' },
            { check: 'Traction boards, soft shackles, a rated kinetic rope', why: 'Cheap, light, and they solve most stuck situations.' },
          ] },
          { name: '4 · Last', items: [
            { check: 'Leveling kit or lift', why: 'Only if you need tire room; accept CV wear and on-road roll.' },
          ] },
        ] },
      body: [
        'Your factory numbers: **8.8 in** clearance, 30.4° approach, 20.4° breakover, 33.1° departure.',
        'Each inch of tire diameter adds about **half an inch** of clearance under the axles: radius, not diameter.',
      ],
      facts: ['bronco.clearance'] },
  ],
  quiz: [
    { type: 'num', q: 'How tall is a **245/65R17** tire, in inches? (1 in = 25.4 mm)', answer: 29.5, tol: 0.1, unit: 'in',
      hint: 'Diameter = rim + 2 × (width × aspect ÷ 25.4).', why: 'Sidewall = 245 × 0.65 = 159 mm = 6.27 in. 17 + 2 × 6.27 ≈ **29.5 in**, about an inch taller than your stock 28.5 in.' },
    { type: 'tap', q: 'Rock Crawl mode clamps the clutches in which unit to send drive to both rear wheels? Tap it.', visual: { type: 'parts', drawing: 'car-top' }, answer: 'rdu',
      why: 'The twin-clutch rear drive unit clamps both clutch packs hard for the rear diff lock. That’s factory traction you’d otherwise have to add.',
      wrong: { ptu: 'The PTU turns drive toward the rear driveshaft; it doesn’t split torque between the rear wheels.' } },
    { type: 'mc', q: 'Which is the best **first** off-road mod for a stock Badlands?',
      options: ['A 2 in spacer lift', 'An LED light bar', 'Tougher all-terrain tires in a size that fits', 'A hood scoop'], answer: 2,
      why: 'Tires are the only contact with the trail; a stronger sidewall prevents the most common failure. The truck already has a clutch-based rear lock and skid plates.' },
    { type: 'mc', q: 'Why does a kinetic recovery rope need rated recovery points?',
      options: ['It’s heavier than a chain', 'It stores energy as it stretches; a weak point can break and fly', 'It only fits tow hooks', 'It is required by Ford’s warranty'], answer: 1,
      why: 'A stretched kinetic rope is a loaded spring. If a weak point (tie-down loop, hitch ball) fails, the rope and hardware become projectiles.' },
  ],
  cards: [
    { id: 'priority', front: 'Off-road mod priority?', back: 'Tires → protection → recovery gear → (maybe) lift. Skill throughout.' },
    { id: 'tire-fit', front: 'Largest commonly fitting tire on a stock Badlands?', back: 'Owners: 235/70R17 (≈30 in) or 245/65R17 (≈29.5 in), may brush at full lock. Forum reports.' },
    { id: 'clearance', front: 'Taller tire vs suspension lift for clearance?', back: 'Taller tires raise everything incl. diffs (½ the diameter gain); lifts raise the body on the same tires.' },
    { id: 'recovery', front: 'Is a tie-down loop a recovery point?', back: 'No. Use rated, frame-mounted points (Badlands: front hooks + one rear point).' },
  ],
};
