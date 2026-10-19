// Bike brakes
export default {
  steps: [
    { tag: 'metaphor', title: 'Stopping a wheelbarrow downhill',
      body: [
        'Push a loaded wheelbarrow and stop suddenly: the load lurches forward onto the front wheel and the handles go light.',
        'A bike does the same. Brake hard and weight piles onto the **front tire**, so the front can do most of the stopping while the rear goes light.',
        'That’s the physics behind the MSF rule that the front brake gives **70% or more** of your stopping power.',
      ] },
    { tag: 'math', title: 'Weight transfer in numbers',
      body: [
        'Load moved to the front = `m · a · h ÷ L`: mass × deceleration × center-of-gravity height ÷ [[wheelbase]].',
        'Illustrative bike + rider: CG 0.6 m (24 in) high, wheelbase 1.375 m (54 in), 50/50 static. At **0.8 g** about **35%** of the total weight moves forward → front carries ~**85%**.',
        'Bikes have a tall CG for a short wheelbase, so transfer is huge. Near ~1 g the rear has almost nothing left, which is why a locked rear just skids and why the limit can be lifting the rear (a stoppie) instead of tire grip.',
      ],
      note: 'Numbers are illustrative, not measured for either bike.' },
    { tag: 'see', title: 'The same hydraulics as a car', visualFirst: true,
      visual: { type: 'parts', drawing: 'brakes' },
      body: [
        'Lever (instead of pedal) → [[master-cylinder]] → [[brake-fluid|fluid]] lines → [[caliper]] → [[brake-pads|pads]] squeeze the [[brake-rotor|disc]]. No booster: your hand is the booster.',
        'Bikes keep front and rear separate: hand lever for the front, foot pedal for the rear. Some bikes add [[linked-brakes]].',
      ] },
    { tag: 'how', title: 'Where the force comes from',
      body: [
        '**Lever ratio**: pivot-to-hand distance ÷ pivot-to-piston distance. Your fingers sit far from the pivot and the piston close to it, so force multiplies several times.',
        '**Hydraulic ratio**: total caliper piston area ÷ master piston area ([[pascals-law]]). Small master + big calipers = more clamp, more lever travel.',
        'Total clamp = hand force × lever ratio × hydraulic ratio. Designers trade power for **feel**: a front brake that bites too hard is easy to grab.',
      ] },
    { tag: 'how', title: 'Calipers, discs and masters',
      body: [
        '[[axial-caliper|Axial mount]]: bolts run sideways. Simple and cheap. [[radial-caliper|Radial mount]]: bolts run front-to-back, so the caliper flexes less and feel is more consistent.',
        'More pistons (2 → 4) spread the force over a longer pad for more even pressure.',
        '[[floating-disc|Floating discs]]: the braking ring floats on buttons, so it can grow with heat without warping. Bigger discs = more leverage on the wheel.',
        'A [[radial-master-cylinder]] pushes its piston in line with the lever: more direct feel. Common on sport bikes above this class.',
      ] },
    { tag: 'bikes', title: 'Ninja 500 vs RS 457 brakes',
      body: [
        '**Ninja 500**: single 310 mm front disc, 2-piston Nissin caliper (not listed as radial); 220 mm rear disc, 2-piston.',
        '**RS 457**: single 320 mm front disc, **radial-mount 4-piston** caliper by ByBre (Brembo’s budget brand); 220 mm rear, single-piston.',
        'On paper the RS has more front brake. Testers praise both as plenty for the bike’s weight; a few found the RS’s ABS and modulation less polished at the limit (opinion).',
      ],
      facts: ['ninja.brakes', 'rs457.brakes'] },
  ],
  quiz: [
    { type: 'tap', q: 'Tap the brake that does most of the stopping in a hard stop.', visual: { type: 'parts', drawing: 'moto-side' }, answer: 'front-brake',
      why: 'Weight transfer loads the front tire, so the front brake can use far more grip. The rear goes light and locks easily.',
      wrong: { 'rear-brake': 'The rear helps, but it goes light in a hard stop and locks easily.' } },
    { type: 'order', q: 'Order the front brake’s force path.', items: ['Hand on lever', 'Lever pivot multiplies force', 'Master cylinder piston', 'Brake fluid', 'Caliper pistons', 'Pads clamp the disc'],
      why: 'Lever ratio first, then hydraulics multiply force again from the small master piston to the bigger caliper pistons.' },
    { type: 'mc', q: 'Main benefit of a **radial-mount** caliper?', options: ['More pistons', 'Stiffer mounting, so less flex and more consistent feel', 'It can’t lock the wheel', 'Cheaper'], answer: 1,
      why: 'Bolting along the radius loads the bolts in a stiffer direction. Piston count is a separate choice.' },
  ],
  cards: [
    { id: 'front', front: 'Why does the front brake do most of the stopping?', back: 'Weight transfer: hard braking piles load onto the front tire, so it can grip much harder.' },
    { id: 'wt', front: 'Weight transfer formula?', back: 'Load moved forward = m · a · h ÷ wheelbase.' },
    { id: 'force', front: 'Brake clamp force chain?', back: 'Hand force × lever ratio × hydraulic ratio (caliper piston area ÷ master piston area).' },
    { id: 'radial', front: 'Radial vs axial caliper mount?', back: 'Radial bolts run front-to-back: stiffer, better feel. Axial bolts run sideways: simpler, cheaper.' },
    { id: 'float', front: 'Why floating discs?', back: 'The braking ring can expand with heat on its buttons instead of warping.' },
  ],
};
