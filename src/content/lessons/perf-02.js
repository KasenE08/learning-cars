// Power bands & dyno charts
export default {
  steps: [
    { tag: 'metaphor', title: 'A hill, not a spike',
      body: [
        'A dyno chart is a **map of the engine’s strength at every rpm**. The peak number is just the top of the hill.',
        'What you actually drive on is the **whole hill**: how wide it is and how much of it sits near the top. That usable stretch is the [[power-band]].',
      ] },
    { tag: 'see', title: 'Read the two curves', visualFirst: true,
      visual: { type: 'dyno', engine: 'compare' },
      body: [
        'X axis = rpm. One curve is torque, the other is power, calculated from it (`hp = lb-ft × rpm ÷ 5252`).',
        'Compare the turbo Bronco’s early, flat torque with the bikes’ high-rpm peaks.',
        'Shapes are illustrative, anchored to each maker’s published peaks.',
      ] },
    { tag: 'how', title: 'Peak vs area under the curve',
      body: [
        'Two engines with the **same peak hp** can feel totally different. The one with more power **across the rpm you actually use** is quicker.',
        'Between shifts the engine sweeps a range (say 4,000 → 6,000 rpm). The average power in that range, roughly the **area under the curve**, decides acceleration.',
        'A narrow, peaky curve needs more gears and more shifting to stay on the hill.',
      ] },
    { tag: 'how', title: 'Turbo plateaus, high-revving bikes',
      body: [
        'Turbo engines often hold near-peak torque over a wide **plateau**: once boost is up, the computer holds torque roughly flat, so power rises almost in a straight line with rpm.',
        'Naturally aspirated bike engines breathe best high up. Torque peaks mid-range and power keeps climbing to 9,000+ rpm.',
        'Ford publishes only the Bronco’s peak-torque rpm (3,000), not the width of its plateau. Rely on a measured dyno run for that.',
      ],
      facts: ['bronco.output', 'ninja.output', 'rs457.output'] },
    { tag: 'how', title: 'Crank hp vs wheel hp',
      body: [
        'Makers rate power **at the crank**, on an engine dyno. A [[dyno|chassis dyno]] measures at the **wheels**, after the gearbox, shafts and differentials.',
        'The gap is [[drivetrain-loss]]: friction, gear mesh, pumping fluid. Rules of thumb say ~10–15% for 2WD and more for AWD automatics. It isn’t really a fixed percentage.',
        'Bronco: one tuner measured roughly **200–210 [[wheel-hp]]** stock on an AWD dyno vs 250 hp rated. Single source, so treat it as a ballpark.',
      ],
      facts: ['bronco.wheelHp'] },
    { tag: 'key', title: 'Dynos disagree with each other',
      body: [
        '**Inertia dynos** (heavy drum): power is computed from how fast you accelerate a known mass. Tend to read higher.',
        '**Load-bearing / eddy-current dynos**: a brake loads the car to hold rpm or ramp slowly. Often read lower and can simulate real load.',
        '**Hub dynos** bolt to the wheel hubs (no tires), removing tire slip.',
        'Results get a **correction factor** for air temperature and pressure (SAE or other). Compare runs only on the **same dyno, same day, same correction**.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'Engine A and B both peak at 200 hp. A makes 180+ hp from 4,000–6,500 rpm; B makes 180+ only from 6,000–6,500. Which accelerates harder through the gears?',
      options: ['B, it revs higher', 'A, more area under the curve', 'They’re the same: same peak', 'Can’t tell without torque'], answer: 1,
      why: 'Between shifts the engine sweeps a range of rpm. A makes near-peak power across far more of it, so the average power (area under the curve) is higher.',
      wrong: { 2: 'Peak is one point. You spend most of your time elsewhere on the curve.' } },
    { type: 'order', q: 'On a chassis dyno, put the path of the Bronco’s rear-wheel power in order, engine first.',
      items: ['Crankshaft', '8-speed transmission', 'PTU', 'Driveshaft', 'Rear drive unit', 'Rear tires on the roller'],
      why: 'Every stage of gears, bearings and fluid takes a small bite. That’s why wheel hp is lower than the crank rating, and why AWD usually loses more than 2WD.' },
    { type: 'mc', q: 'Why does a turbo engine’s power curve often rise in a near-straight line through the mid-range?',
      options: ['The turbo lowers rpm', 'Torque is held roughly flat once boost is up, and power = torque × rpm', 'Fuel injection shuts off', 'The dyno corrects it'], answer: 1,
      why: 'Flat torque × rising rpm = power climbing steadily. When torque finally falls off, the power curve flattens and peaks.' },
  ],
  cards: [
    { id: 'band', front: 'What is a power band?', back: 'The rpm range where the engine makes most of its power: the usable stretch of the curve.' },
    { id: 'area', front: 'Peak hp vs area under the curve?', back: 'Peak is one point. Average power across the rpm you actually use decides acceleration.' },
    { id: 'whp', front: 'Crank hp vs wheel hp?', back: 'Crank = maker’s rating at the engine. Wheel = what a chassis dyno sees, after drivetrain losses.' },
    { id: 'dynotypes', front: 'Three kinds of chassis dyno?', back: 'Inertia (drum), load-bearing/eddy-current (brake), hub (bolts to the hubs).' },
    { id: 'compare', front: 'Rule for comparing dyno numbers?', back: 'Same dyno, same day, same correction factor. Otherwise it’s apples to oranges.' },
  ],
};
