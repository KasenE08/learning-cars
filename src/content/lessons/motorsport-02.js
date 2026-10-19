// Rally
export default {
  steps: [
    { tag: 'metaphor', title: 'Racing a road you can’t see',
      body: [
        'Imagine sprinting down a forest trail at night while a friend reads the next turns out loud from a notebook. You trust the voice more than your eyes.',
        'That’s rally: one car at a time against the clock, on real roads (gravel, tarmac, snow), with a **co-driver** reading the future.',
      ] },
    { tag: 'how', title: 'How a rally works',
      body: [
        'A rally is a set of [[special-stage|special stages]]: closed roads timed one car at a time. Lowest **total time** wins.',
        'Between stages, cars drive **liaison** sections on open public roads and must obey traffic laws. Mechanics only get the car at the **service park**, on a tight clock.',
        'Before the event, crews drive each stage slowly (the recce) and write [[pace-notes]]: a code for every corner (“left 4, over crest, don’t cut”). At speed, the co-driver reads them a beat ahead.',
        'The [[wrc|World Rally Championship]] has run since **1973**.',
      ] },
    { tag: 'see', title: 'From quattro to today', visualFirst: true,
      visual: { type: 'timeline', title: 'Rally milestones',
        events: [
          { year: 1973, title: 'WRC begins' },
          { year: 1981, title: 'AWD wins', note: 'Audi quattro: Hannu Mikkola wins in Sweden, the first WRC win for the four-wheel-drive quattro. Michèle Mouton becomes the first woman to win a WRC round (San Remo).' },
          { year: 1982, title: 'Group B era begins', note: 'Sources differ: 1982 was a transition year, and Group B cars dominated from 1983.' },
          { year: 1986, title: 'Group B banned', note: 'After a spectator crash in Portugal and the deaths of Henri Toivonen and Sergio Cresto at the Tour de Corse.' },
          { year: 2022, title: 'Rally1 hybrid', note: 'New Rally1 cars: 1.6 L turbo plus a 100 kW hybrid unit.' },
          { year: 2025, title: 'Hybrid dropped', note: 'Restrictor 36 → 35 mm, minimum weight 1,260 → 1,180 kg.' },
        ] },
      body: [
        'Tap the years. The big shift: **AWD** proved itself in 1981, and soon every top rally car had it.',
        '[[group-b|Group B]] (roughly 1982–1986) had very few limits: turbos, AWD, very light bodies. Exact power figures are disputed, so we won’t quote one. One account of the official investigation says drivers simply couldn’t react fast enough for the cars.',
        'After the 1986 deaths, the sport’s governing body banned Group B for 1987. Rally cars have been restricted ever since.',
      ] },
    { tag: 'how', title: 'Today’s top car: Rally1',
      body: [
        '**1.6 L turbo four-cylinder**, AWD, sequential gearbox, a strong safety cage in a steel spaceframe. Body shapes: GR Yaris, i20 N, Puma.',
        'Power is capped with an [[air-restrictor]]: every breath of intake air passes through a **35 mm** hole (since 2025), which caps airflow and so caps power.',
        'For 2025 the hybrid was dropped; the FIA shrank the restrictor and cut the weight by 80 kg to keep the power-to-weight ratio about the same.',
      ] },
    { tag: 'see', title: 'Anti-lag: keeping the turbo awake', visualFirst: true,
      visual: { type: 'turbo' },
      body: [
        'Snap the throttle shut and watch the shaft speed drop. When you open it again, you wait for [[spool]]: that’s [[turbo-lag]].',
        'Rally drivers lift and brake constantly, so race cars use [[anti-lag]]: it burns fuel in the exhaust off-throttle to keep the turbine spinning. That’s the bang-bang-bang you hear.',
        'It’s brutal on turbos and exhaust parts, which is why road cars don’t use it.',
      ] },
    { tag: 'why', title: 'Rally’s road-car legacy',
      body: [
        '[[homologation|Homologation]] rules made makers sell road versions of rally cars. That’s how we got turbo AWD sedans and hatchbacks like the Subaru Impreza WRX STI, Mitsubishi Lancer Evolution and Toyota GR Yaris.',
        'AWD in performance cars went from oddity to normal after the quattro.',
        'Those road cars carried rally ideas like [[lsd|limited-slip]] and computer-controlled center differentials into showrooms. Modern performance [[awd]] systems work along the same lines.',
      ] },
    { tag: 'bronco', title: 'Your Bronco has rally DNA (sort of)',
      body: [
        'Turbo four + AWD is the rally recipe, and your Badlands has both. The twin-clutch rear drive unit can send torque to either rear wheel, a cousin of rally-style torque control.',
        'But Ford tuned it for traction, towing and comfort, not flat-out gravel stages. Same family, different job.',
      ],
      facts: ['bronco.engine', 'bronco.4x4', 'bronco.rdu'] },
  ],
  quiz: [
    { type: 'mc', q: 'What does an **air restrictor** do to a Rally1 engine?', options: ['Cools the intake air', 'Caps the airflow, and so the maximum power', 'Raises boost pressure', 'Reduces turbo lag'], answer: 1,
      why: 'All air must pass through one fixed-size hole. Once it’s flowing as fast as it can through that hole, more boost can’t add more air. It’s a simple, cheap power cap.' },
    { type: 'order', q: 'Put these in order.', items: ['WRC begins', 'Audi quattro’s first WRC win', 'Group B banned', 'Rally1 hybrid introduced', 'Rally1 hybrid dropped'],
      why: '1973 → 1981 → 1986 → 2022 → 2025.' },
    { type: 'mc', q: 'Why do rally cars use **anti-lag** but road cars don’t?', options: ['It’s illegal on roads but harmless', 'It keeps the turbo spinning off-throttle, but it’s loud and wears turbos and exhausts fast', 'It saves fuel', 'Road cars don’t have turbos'], answer: 1,
      why: 'Anti-lag trades parts life and fuel for instant boost. Worth it on a stage, terrible for a daily driver.' },
  ],
  cards: [
    { id: 'stage', front: 'How is a rally won?', back: 'Lowest total time over all special stages (closed roads, one car at a time), plus penalties.' },
    { id: 'notes', front: 'What are pace notes?', back: 'A coded description of every corner, written on the recce and read by the co-driver at speed.' },
    { id: 'groupb', front: 'Group B: when and why it ended?', back: '≈1982–1986. Banned for 1987 after a spectator crash and the deaths of Toivonen and Cresto.' },
    { id: 'rally1', front: 'Rally1 car basics?', back: '1.6 L turbo four, AWD, 35 mm restrictor (since 2025). Hybrid used 2022–2024.' },
    { id: 'antilag', front: 'Anti-lag?', back: 'Burns fuel in the exhaust off-throttle to keep the turbo spinning. Race-only: loud and hard on parts.' },
  ],
};
