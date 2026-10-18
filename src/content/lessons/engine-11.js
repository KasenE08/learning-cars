// Firing order & balance
export default {
  steps: [
    { tag: 'metaphor', title: 'A rowing crew',
      body: [
        'Four rowers who all pull at once make the boat lurch. Spread the pulls out evenly and it glides.',
        'An engine spaces its power strokes the same way: evenly in time, and spread along the crank so it doesn’t get hammered in one spot.',
      ] },
    { tag: 'see', title: 'Inline-4: 1-3-4-2', visualFirst: true,
      visual: { type: 'crank', orders: true },
      body: [
        'The highlighted number is the cylinder on its power stroke.',
        'A power stroke every **180°**: four per 720° cycle, back to back with no gaps.',
        'Try the other order. 1-2-4-3 also works on the same crank; 1-3-4-2 is the most common.',
      ] },
    { tag: 'how', title: 'Why that order?',
      body: [
        '1 and 4 reach TDC together, as do 2 and 3. On each TDC, one of the pair is firing, the other is starting intake.',
        'The order avoids firing two **neighbors** back to back, which spreads twisting load along the crank and evens out how the cylinders breathe.',
        '[[firing-order]] is set by the crank and cam design. You can’t change it by moving plug wires.',
      ] },
    { tag: 'see', title: 'Shaking forces', visualFirst: true,
      visual: { type: 'crank', shake: true },
      body: [
        '**Primary** forces (blue): pistons 1 & 4 go up while 2 & 3 go down, so the big up/down forces **cancel**.',
        '**Secondary** forces (orange): pistons move **faster in the top half** of their stroke than the bottom (rod angle, from the Rods lesson). That doesn’t cancel in an inline-4: a buzz at **twice crank speed**.',
      ] },
    { tag: 'how', title: 'Balance shafts and other layouts',
      body: [
        'To kill that 2× buzz, many inline-4s around 2.0 L and up add **balance shafts**: two weighted shafts spinning at **2× crank speed** in opposite directions.',
        'An **inline-6** cancels both primary and secondary forces. That’s why straight-sixes are famously smooth.',
        'Layouts (V8, boxer, bike twins) each have their own balance story. That’s the next unit.',
      ] },
    { tag: 'bronco', title: 'Your Bronco',
      body: [
        'Firing order **1-3-4-2**, cylinder 1 at the timing-chain end.',
        'Whether the 2.0 EcoBoost uses balance shafts isn’t confirmed in the sources checked, so it isn’t claimed here.',
      ],
      facts: ['bronco.firingOrder'] },
  ],
  quiz: [
    { type: 'order', q: 'Put your Bronco’s firing order in sequence, starting from cylinder 1.', items: ['Cylinder 1', 'Cylinder 3', 'Cylinder 4', 'Cylinder 2'],
      why: '1-3-4-2, the most common inline-4 firing order.' },
    { type: 'num', q: 'In an inline-4, how many crank degrees between power strokes?', answer: 180, tol: 0, unit: '°',
      why: '720° per cycle ÷ 4 cylinders = **180°**.' },
    { type: 'mc', q: 'What causes an inline-4’s secondary vibration?', options: ['Uneven firing', 'Pistons moving faster in the top half of the stroke than the bottom', 'A heavy flywheel', 'The timing chain'], answer: 1,
      why: 'Rod angle makes piston speed uneven between the top and bottom halves of the stroke. In an I4 these effects add up instead of cancelling.' },
    { type: 'mc', q: 'Balance shafts in an inline-4 spin at…', options: ['Half crank speed', 'Crank speed', 'Twice crank speed', 'Cam speed'], answer: 2,
      why: 'The secondary shake happens twice per revolution, so the counter-shake must too: 2× crank speed.' },
    { type: 'mc', q: 'Which layout cancels both primary and secondary forces?', options: ['Inline-4', 'Inline-6', 'Single cylinder', 'Parallel twin'], answer: 1,
      why: 'The inline-6’s three crank pairs cancel primary and secondary forces. Hence its famous smoothness.' },
  ],
  cards: [
    { id: 'order', front: 'Common inline-4 firing order (and your Bronco’s)?', back: '1-3-4-2.' },
    { id: 'spacing', front: 'Inline-4 power stroke spacing?', back: 'Every 180° (720° ÷ 4).' },
    { id: 'secondary', front: 'Inline-4 secondary vibration: cause and frequency?', back: 'Uneven piston speed (rod angle); shakes at 2× crank speed.' },
    { id: 'balshaft', front: 'What do balance shafts do?', back: 'Spin at 2× crank speed, in opposite directions, to cancel an inline-4’s secondary shake.' },
    { id: 'i6', front: 'Why is an inline-6 so smooth?', back: 'It naturally cancels primary and secondary forces.' },
  ],
};
