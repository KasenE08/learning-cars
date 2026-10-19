// Countersteering & lean
export default {
  steps: [
    { tag: 'metaphor', title: 'Balancing a broom on your hand',
      body: [
        'Balance a broom upright on your palm. To make it tip **right**, you flick your hand **left** for an instant, and the top falls right.',
        'A bike is the broom and the tires are your hand. To lean right, the front tire briefly steers **left**, moving the contact patches out from under the bike.',
        'That’s [[countersteering]]: the “press right, lean right, go right” you learned in the MSF course. Here’s the physics behind it.',
      ] },
    { tag: 'see', title: 'Watch the sequence', visualFirst: true,
      visual: { type: 'lean' },
      body: [
        'Hit **Countersteer**: push the right bar → front wheel steers left for a split second → the tires track left, the bike’s mass keeps going → it falls right → the wheel steers into the turn and holds the lean.',
        'Then play with speed and radius. Faster, or a tighter turn, needs more lean.',
      ] },
    { tag: 'why', title: 'Why a bike has to lean at all',
      body: [
        'Turning needs a sideways force toward the center of the turn. On a bike it can only come from the tires’ grip at the road.',
        'That force acts at ground level, but the bike’s mass sits high. Upright, it would flip the bike to the **outside** of the turn.',
        'Leaning puts gravity’s pull on the high mass against that tipping. At the right [[lean-angle]] the two balance and the bike carves a steady arc.',
      ] },
    { tag: 'math', title: 'Lean angle math',
      body: [
        '`tan θ = v² ÷ (g·r)`: v = speed (m/s), r = turn radius (m), g = 9.81 m/s².',
        'Example: 20 m/s (45 mph, 72 km/h) on a 50 m (164 ft) radius → 400 ÷ 490 = 0.82 → **θ ≈ 39°**.',
        'Notice the **v²**: double the speed on the same curve and the lean needed goes up a lot, not twice.',
        '`tan θ` is also the sideways g. 45° needs 1.0 g of grip, which is about the ceiling for good street tires on dry pavement.',
      ],
      note: 'Real tires have width: leaned over, the contact patch moves toward the inside, so the bike needs a little more lean than the ideal formula. Hanging off the inside lets the bike itself lean less for the same turn.' },
    { tag: 'how', title: 'Gyroscopic effects: helper, not the hero',
      body: [
        'A spinning wheel has a [[gyroscopic-effect]]: tilt it and it twists sideways. Lean a moving bike and the front wheel tends to steer **into** the lean, helping it stay up.',
        'When you countersteer, the same effect adds a little roll in the direction you want.',
        'But it’s not the main story. A 2011 study (Kooijman et al., *Science*) built a bicycle that was self-stable with gyroscopic effects cancelled out. Geometry and mass distribution matter as much.',
        'The big effect is still steering the contact patches out from under the bike.',
      ] },
    { tag: 'why', title: 'Why this matters on the road',
      body: [
        'At speed, a bike changes direction only as fast as it can change lean. A firmer, deliberate press on the bar gets you a quicker lean.',
        'Lean also costs grip: the more lean, the less grip is left for braking or throttle (the tire has one budget, shared).',
        'Exploring limits belongs at a track day or an advanced course with coaching, not on public roads.',
      ] },
  ],
  quiz: [
    { type: 'num', q: '14 m/s (≈31 mph) on a **20 m** radius turn. Ideal lean angle in degrees? (g = 9.81)', answer: 45, tol: 1, unit: '°',
      hint: 'tan θ = v² ÷ (g·r)', why: '14² = 196, and 9.81 × 20 = 196.2. tan θ ≈ 1.0, so **θ ≈ 45°**, which also means ~1 g sideways.' },
    { type: 'order', q: 'Put a right turn by countersteering in order.', items: ['Press the right handlebar forward', 'Front wheel briefly steers left', 'Contact patches move out from under the bike', 'Bike rolls into a right lean', 'Wheel steers right and the bike turns right'],
      why: 'Steering the tires away from the turn tips the bike toward it; once leaned, the front settles into steering the direction of the turn.' },
    { type: 'mc', q: 'Same curve, speed **doubles**. The value of tan θ…', options: ['Stays the same', 'Doubles', 'Quadruples', 'Halves'], answer: 2,
      why: 'tan θ = v² ÷ (g·r). Doubling v multiplies v² by 4. The angle itself rises less than 4×, but the grip needed quadruples.',
      wrong: { 1: 'Speed is squared in the formula.' } },
    { type: 'mc', q: 'What’s the **main** reason countersteering makes a bike lean?', options: ['Gyroscopic precession alone', 'Steering the contact patches out from under the bike’s center of mass', 'Rider weight shift', 'Aerodynamic drag'], answer: 1,
      why: 'Gyro effects help a little. The big effect is the tires moving sideways while the mass keeps going, so the bike falls toward the turn.' },
  ],
  cards: [
    { id: 'cs', front: 'Countersteering in one line?', back: 'Press the right bar → front wheel briefly steers left → bike leans right → turns right.' },
    { id: 'lean', front: 'Ideal lean angle formula?', back: 'tan θ = v² ÷ (g·r).' },
    { id: '45', front: 'What sideways g does a 45° lean mean?', back: 'About 1.0 g (tan 45° = 1), roughly the ceiling for good street tires on dry pavement.' },
    { id: 'gyro', front: 'Role of gyroscopic effects?', back: 'They help the front steer into a lean, but the main mechanism is steering the contact patches out from under the bike.' },
    { id: 'why', front: 'Why must a bike lean to turn?', back: 'Tire grip pushes at ground level; leaning lets gravity on the high mass balance that tipping force.' },
  ],
};
