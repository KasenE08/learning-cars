// Traction control
export default {
  steps: [
    { tag: 'metaphor', title: 'A referee watching two wheels',
      body: [
        'Picture a referee watching both wheels. As long as the rear turns at about the same speed as the front, everything’s fair.',
        'The moment the rear spins noticeably faster, it’s slipping instead of pushing. The referee blows the whistle and the ECU trims power until it hooks up.',
        'That’s bike [[traction-control]]. It backs up the throttle control you learned at MSF; it doesn’t replace it.',
      ] },
    { tag: 'how', title: 'Reading slip from wheel speeds',
      body: [
        'Each wheel has a [[wheel-speed-sensor]] (the same ones ABS uses). The front isn’t driven, so it’s a good reference for road speed.',
        '[[slip-ratio|Slip]] ≈ (rear speed − front speed) ÷ front speed.',
        'A little slip is normal and is actually where a tire makes its best drive grip. Too much, and the rear steps out.',
        'Fixes, from gentle to hard: retard spark → cut spark to some cylinders → cut fuel → close the throttle (needs [[drive-by-wire|ride-by-wire]]).',
      ] },
    { tag: 'math', title: 'Slip in numbers',
      body: [
        'Front reads **100 km/h**, rear reads **110 km/h**: (110 − 100) ÷ 100 = **10% slip**.',
        'Higher TC levels step in at less slip (safer, slower). Lower levels allow more slip for experienced riders on grippy surfaces.',
      ],
      note: 'Real systems also correct for tire wear and size. Fitting a different tire size can confuse the comparison.' },
    { tag: 'see', title: 'Throttle, grip and lean', visualFirst: true,
      visual: { type: 'traction' },
      body: [
        'Roll on in the dry, then switch to wet or gravel: the same throttle makes far more slip.',
        'Now add lean. The allowed slip drops, because a leaned tire is already spending grip on cornering.',
      ] },
    { tag: 'why', title: 'Why lean makes it hard',
      body: [
        'Leaned over, each tire rolls on a smaller radius near its shoulder. The fatter rear changes more than the front, so wheel speeds differ even with **no** slip.',
        'And a leaned tire has less grip left for drive, so the safe slip limit is lower.',
        '[[lean-sensitive-tc|Lean-sensitive TC]] uses an [[imu]] to know the lean angle, correct the speed comparison and cut in earlier at lean. Without an IMU, a system has to estimate or simply be more conservative.',
      ] },
    { tag: 'how', title: 'Cousins: wheelie, launch, quickshift',
      body: [
        '[[wheelie-control]]: the front slows while the rear doesn’t, or the IMU sees nose-up pitch → trim torque.',
        '[[launch-control]]: hold a set rpm off the line, then manage spin and wheelies. Mostly on big, powerful bikes.',
        'A [[quickshifter]] uses the same toolkit: a brief ignition cut so the gears can swap without the clutch.',
      ] },
    { tag: 'bikes', title: 'Your two bikes',
      body: [
        '**RS 457**: traction control with **3 levels + off**, linked to the ride modes. Most sources say it has no IMU, so it isn’t lean-sensitive (one review said otherwise; not confirmed).',
        '**Ninja 500**: no traction control. Smooth delivery from ~45 hp makes that less of a gap than on a big bike, but in the wet, throttle control is all yours.',
        'Either way, TC is a safety net for a mistake, not a reason to explore limits on the street.',
      ],
      facts: ['rs457.modes', 'rs457.abs', 'ninja.electronics'] },
  ],
  quiz: [
    { type: 'mc', q: 'Why does lean angle complicate bike traction control?', options: ['Wheel sensors stop working when leaned', 'Leaned tires roll on smaller radii (the rear more), and have less grip left for drive', 'The engine makes more power leaned over', 'The chain gets loose'], answer: 1,
      why: 'Speed comparison gets skewed by the changing rolling radius, and the safe slip limit drops. An IMU solves both by measuring lean.' },
    { type: 'order', q: 'Order TC interventions from **gentlest** to **strongest** (typical).', items: ['Retard ignition timing', 'Cut spark to some cylinders', 'Cut fuel', 'Close the throttle hard'],
      why: 'Retarding spark trims torque a little and fast; cutting spark or fuel removes power strokes; closing the throttle (ride-by-wire) cuts the most.' },
    { type: 'mc', q: 'Which signal can wheelie control use besides wheel speeds?', options: ['Coolant temperature', 'IMU pitch angle', 'Fuel level', 'Oil pressure'], answer: 1,
      why: 'Nose-up pitch is a direct sign of a wheelie. Without an IMU, the front slowing while the rear keeps spinning is the hint.' },
    { type: 'tap', q: 'Tap the part whose spark and fuel TC actually trims.', visual: { type: 'parts', drawing: 'moto-side' }, answer: 'engine',
      why: 'TC reduces engine torque. The ECU decides, but the torque cut happens in the engine.',
      wrong: { ecu: 'The ECU decides; the torque is trimmed in the engine.', 'rear-brake': 'Bike TC cuts engine torque; it doesn’t brake the rear wheel.' } },
  ],
  cards: [
    { id: 'slip', front: 'How does bike TC detect wheelspin?', back: 'Compares rear wheel speed with the undriven front: slip ≈ (rear − front) ÷ front.' },
    { id: 'cuts', front: 'Ways TC cuts torque?', back: 'Retard spark, cut spark, cut fuel, close the throttle (ride-by-wire).' },
    { id: 'lean', front: 'Why does lean-sensitive TC need an IMU?', back: 'To know lean angle: leaned tires roll on smaller radii and have less grip left, so the allowed slip must drop.' },
    { id: 'wheelie', front: 'How does wheelie control sense a wheelie?', back: 'Front slowing vs rear, or IMU pitch angle.' },
    { id: 'bikes', front: 'TC on the Ninja 500 vs RS 457?', back: 'Ninja: none. RS 457: 3 levels + off, tied to ride modes, no IMU reported.' },
  ],
};
