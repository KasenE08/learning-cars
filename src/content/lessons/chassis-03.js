// Alignment: camber, caster, toe
export default {
  steps: [
    { tag: 'metaphor', title: 'Knees, shopping carts and pigeon toes',
      body: [
        '**Camber**: stand with your knees bent in or out. Viewed from the front, the wheel tilts the same way.',
        '**Caster**: a shopping-cart wheel trails behind its pivot, so it swings straight by itself. Front wheels copy that trick.',
        '**Toe**: stand pigeon-toed (toe-in) or duck-footed (toe-out). Viewed from above, the wheels point the same way.',
        'Tiny angles, often under a degree, but they decide how the car tracks and how fast tires wear.',
      ] },
    { tag: 'see', title: 'Play with the angles', visualFirst: true,
      visual: { type: 'suspension', view: 'align' },
      body: [
        'Slide each angle and watch the tire’s contact patch and the wear warning change.',
        'Three views: front (camber), side (caster), top (toe).',
      ] },
    { tag: 'how', title: 'Camber: tilt from the front',
      body: [
        '[[camber]] is how far the top of the tire leans in or out. **Negative** = top tilted **in** toward the car.',
        'In a hard corner the body rolls and the tire gets pushed over. A little negative camber means it ends up flatter on the road: **more grip**.',
        'Too much negative wears the **inner** edge; positive camber wears the **outer** edge.',
      ] },
    { tag: 'how', title: 'Caster: tilt of the steering axis',
      body: [
        '[[caster]] is the tilt of the steering pivot seen from the side. **Positive** = top of the axis tilted **back**.',
        'Positive caster makes the tire’s contact point trail behind the pivot, like the cart wheel: the wheels **self-center** and the car tracks straight.',
        'More caster = more stability and heavier steering. By itself it barely wears tires.',
        'Uneven caster left vs right makes the car **pull** to one side.',
      ] },
    { tag: 'how', title: 'Toe: pointing from above',
      body: [
        '[[toe]] is whether the fronts of the tires point toward each other (**toe-in**) or apart (**toe-out**).',
        'Toe-in: stable and calm on the highway. Toe-out: sharper turn-in, but twitchy.',
        'Toe is the **biggest alignment-related cause of tire wear**: a tire pointed even slightly off gets dragged sideways every mile, leaving feathered tread edges.',
        'Toe is set by the length of the tie rods (next lesson).',
      ] },
    { tag: 'key', title: 'Specs are a window',
      body: [
        'A [[wheel-alignment|factory alignment spec]] is a target with a ± range for each angle, front and rear.',
        'Potholes, worn bushings, lift kits and lowering springs all move the angles. Lifting a strut car usually changes its camber too.',
        'On many strut cars only toe is easy to adjust; camber and caster are mostly fixed by where the parts bolt on.',
      ] },
    { tag: 'bronco', title: 'Four wheels to align',
      body: [
        'Your Bronco’s rear is independent too, so the **rear** wheels have their own camber and toe. That needs a four-wheel alignment, not just the front.',
        'Ford’s exact alignment figures aren’t covered here; they’re in the service manual.',
      ],
      facts: ['bronco.suspension'] },
  ],
  quiz: [
    { type: 'mc', q: 'A car has **negative camber**. Which way do its tires lean?', options: ['Top tilted out, away from the car', 'Top tilted in, toward the car', 'Front of the tire pointed in', 'Steering axis tilted back'], answer: 1,
      why: 'Negative camber = top of the tire tilted inward. It helps the tire sit flat when the body rolls in a corner.',
      wrong: { 2: 'That’s toe-in, seen from above.', 3: 'That’s positive caster, seen from the side.' } },
    { type: 'mc', q: 'Which angle mainly makes the steering **self-center** after a turn?', options: ['Camber', 'Caster', 'Toe', 'Ride height'], answer: 1,
      why: 'Positive caster puts the contact point behind the steering pivot, like a shopping-cart wheel, so the wheels pull themselves straight.' },
    { type: 'mc', q: 'Which alignment error usually eats tires fastest?', options: ['A little positive caster', 'Wrong toe', 'Slight negative camber', 'Uneven tire pressure on the spare'], answer: 1,
      why: 'Wrong toe drags each tire sideways all the time, scrubbing the tread. Camber wear is slower; caster hardly wears tires.' },
    { type: 'mc', q: 'Tires are wearing on the **inner** edges. The most likely camber issue?', options: ['Too much negative camber', 'Too much positive camber', 'Too much caster', 'Camber can’t cause edge wear'], answer: 0,
      why: 'Negative camber loads the inner edge. Positive camber loads the outer edge. (Toe can also cause edge wear, so a real diagnosis checks both.)' },
  ],
  cards: [
    { id: 'camber', front: 'Camber?', back: 'Tire tilt seen from the front. Negative = top tilted in: more cornering grip, more inner-edge wear.' },
    { id: 'caster', front: 'Caster?', back: 'Steering axis tilt seen from the side. Positive = top back: self-centering and straight-line stability.' },
    { id: 'toe', front: 'Toe?', back: 'Tires pointing in (toe-in, stable) or out (toe-out, sharper turn-in) seen from above. Biggest alignment cause of tire wear.' },
    { id: 'pull', front: 'What can make a car pull to one side?', back: 'Uneven caster or camber left vs right (also uneven tire pressure).' },
  ],
};
