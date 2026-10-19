// Rake, trail & wheelbase
export default {
  steps: [
    { tag: 'metaphor', title: 'The shopping-cart caster',
      body: [
        'A shopping-cart wheel sits **behind** its swivel pin. Push the cart and the wheel drags into line behind the pin, all by itself.',
        'A bike’s front wheel does the same thing. The tire touches the road **behind** the point where the steering axis would hit the ground.',
        'That gap is [[trail]]. It’s the main reason a bike goes straight with no hands and the bars want to center themselves.',
      ] },
    { tag: 'how', title: 'Three numbers that set the front end',
      body: [
        '[[rake]]: how far the steering axis leans back from vertical. Sport bikes sit around 23–25°.',
        '[[fork-offset|Offset]]: how far the [[triple-clamp|triple clamps]] hold the fork legs in front of the steering axis. More offset = less trail.',
        '**Wheel radius**: a taller front tire puts the contact patch farther back, adding trail.',
        'Same idea as [[caster]] on a car, just with much bigger numbers because the bike has to balance on it.',
      ] },
    { tag: 'see', title: 'Play with the front end', visualFirst: true,
      visual: { type: 'raketrail', preset: 'ninja' },
      body: [
        'Start from the Ninja’s 24.5° and 92 mm. Add rake: trail grows. Add offset: trail shrinks.',
        'Designers pick rake for feel and packaging, then use offset to land on the trail they want.',
        'The offset shown in the preset is back-calculated, not a Kawasaki number.',
      ] },
    { tag: 'math', title: 'The trail formula',
      body: [
        '`trail = (R·sin rake − offset) ÷ cos rake`, with R = front wheel radius (rolling radius).',
        'Example: R = 300 mm, rake 24°, offset 30 mm → (300 × 0.407 − 30) ÷ 0.914 ≈ **101 mm (4.0 in)**.',
        'Ballpark for road sport bikes: roughly 90–105 mm. Small changes matter: a few mm of trail is something riders can feel.',
      ],
      note: 'Under braking the fork dives: rake gets steeper and trail shrinks, so steering gets lighter just when you turn in.' },
    { tag: 'why', title: 'Stability vs agility',
      body: [
        '**More rake + more trail**: strong self-centering, calm at speed, but heavier and slower steering. Cruisers live here.',
        '**Less rake + less trail**: quick, light turn-in, but nervous at speed and more prone to **headshake** (the bars flapping side to side) over bumps.',
        '[[wheelbase]]: longer = steadier and harder to wheelie; shorter = flicks into turns with less effort.',
        'Nothing is free: every bike is a balance of these, plus weight distribution and tire shape.',
      ] },
    { tag: 'bikes', title: 'Ninja 500 vs RS 457 geometry',
      body: [
        '**Ninja 500**: 24.5° rake, 92 mm (3.6 in) trail, 1,375 mm (54.1 in) wheelbase. Kawasaki USA says 24.7°; regional sheets say 24.5°.',
        '**RS 457**: 24.1° rake, about 102 mm (4.0 in) trail, about 1,350 mm (53.1 in) wheelbase.',
        'So the RS has a slightly steeper head and a shorter wheelbase (both quicker) but **more** trail (steadier). On paper they land closer than the spec sheets look.',
        'Geometry numbers don’t tell you how a bike feels on their own: suspension, weight and tires all change it.',
      ],
      facts: ['ninja.geometry', 'rs457.geometry'] },
  ],
  quiz: [
    { type: 'num', q: 'Front wheel radius **300 mm**, rake **24°**, fork offset **30 mm**. Trail in mm? (sin 24° ≈ 0.407, cos 24° ≈ 0.914)', answer: 101, tol: 2, unit: 'mm',
      hint: 'trail = (R·sin rake − offset) ÷ cos rake', why: '(300 × 0.407 − 30) ÷ 0.914 = (122.1 − 30) ÷ 0.914 ≈ **101 mm**.' },
    { type: 'mc', q: 'A builder adds more **fork offset** and changes nothing else. Trail…', options: ['Increases', 'Decreases', 'Stays the same', 'Becomes negative right away'], answer: 1,
      why: 'Offset moves the contact patch forward toward where the steering axis hits the ground, so trail shrinks and steering gets lighter.' },
    { type: 'mc', q: 'Why does the steering get lighter when the fork dives under braking?', options: ['The tire gets narrower', 'Dive makes rake steeper, which cuts trail', 'Brakes push the bars', 'Wheelbase gets longer'], answer: 1,
      why: 'The front end sinks, the steering axis tilts closer to vertical, and trail drops.' },
    { type: 'order', q: 'Order from **most stable / slowest steering** to **quickest / least stable** (typical setups).', items: ['Long, raked-out cruiser', 'Sport-touring bike', 'Road sport bike', 'Race bike with steep rake and short wheelbase'],
      why: 'Rake, trail and wheelbase all shrink along the list, trading straight-line calm for quick turn-in.' },
  ],
  cards: [
    { id: 'trail', front: 'What is trail?', back: 'Ground distance from where the steering axis meets the road to the front contact patch, which sits behind it.' },
    { id: 'formula', front: 'Trail formula?', back: 'trail = (R·sin rake − offset) ÷ cos rake.' },
    { id: 'more', front: 'More trail feels like…?', back: 'More self-centering and stability, heavier and slower steering.' },
    { id: 'wb', front: 'Longer wheelbase does what?', back: 'Steadier at speed and resists wheelies, but needs more effort to turn.' },
    { id: 'bikes', front: 'Ninja 500 vs RS 457 trail?', back: 'Ninja ≈92 mm (3.6 in); RS 457 ≈102 mm (4.0 in), with a steeper 24.1° rake and shorter wheelbase.' },
  ],
};
