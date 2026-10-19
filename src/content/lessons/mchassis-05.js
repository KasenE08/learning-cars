// Bike tires & contact patch
export default {
  steps: [
    { tag: 'metaphor', title: 'Rolling on the edge of a coin',
      body: [
        'A car tire is a flat-bottomed drum. Tilt it and it rides up on one edge and loses grip.',
        'A bike tire is more like a **donut**: round in cross-section, so as the bike leans the tire just rolls onto a new part of its shoulder.',
        'The whole bike’s grip passes through two [[contact-patch|contact patches]], each roughly the size of your palm or smaller.',
      ] },
    { tag: 'how', title: 'Why bike tires are round',
      body: [
        'The round [[tire-profile]] keeps a similar-sized patch on the road from upright to full lean.',
        'Leaned over, the patch sits on a smaller radius of the tire, so it acts like a cone rolling in a circle. That “camber thrust” helps the bike turn.',
        'A wider rear moves the patch farther from the bike’s centerline at lean, so it needs a little more lean for the same turn.',
        'Bike sizes read like car sizes: **150/60R17** = 150 mm wide, sidewall 60% of that, radial, 17 in rim.',
      ] },
    { tag: 'see', title: 'Decode your rear tire', visualFirst: true,
      visual: { type: 'tire', code: '150/60R17 66H' },
      body: [
        'Both bikes run **110/70R17** front and **150/60R17** rear. The Ninja’s stock Dunlops are listed as 54H front and 66H rear.',
        'Load index 66 is bike-scale: 300 kg (661 lb) per tire, versus an index near 100 (800 kg, 1,764 lb) on a typical car tire.',
      ],
      facts: ['ninja.tires', 'rs457.tires'] },
    { tag: 'math', title: 'How big is the patch?',
      body: [
        'Rough rule: `patch area ≈ load ÷ pressure`. 270 lb on the rear at 36 psi → about **7.5 in² (48 cm²)**.',
        'It ignores the carcass’s own stiffness, so treat it as a ballpark only. The point: more pressure = smaller patch, more load = bigger patch.',
        'Under hard braking the front patch grows as weight piles on and the rear shrinks. Grip follows load.',
      ],
      note: 'Illustrative numbers. The correct pressures for your bike are on its sticker or in the owner’s manual.' },
    { tag: 'how', title: 'Compounds and warm-up',
      body: [
        'Rubber grips best in a temperature window. Cold tires have noticeably less grip, which is why the first miles on a cold day call for extra care.',
        '[[tire-compound|Softer compounds]] grip more and warm faster but wear quickly. Track tires need much more heat than street tires to work, and can be worse than street tires when cold.',
        '[[dual-compound|Dual-compound]] tires use harder rubber in the center (commuting miles) and softer on the shoulders (grip at lean).',
        'Commuting wears a flat strip in the center, which makes the bike feel like it “falls” into lean once it reaches the edge of the flat.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'Why are bike tires round in cross-section?', options: ['Less rolling resistance', 'So the tire keeps a usable patch on the road as the bike leans', 'To look sporty', 'So they wear evenly'], answer: 1,
      why: 'A flat tread would ride up on its edge when leaned. A round profile rolls onto the shoulder and keeps grip.' },
    { type: 'mc', q: 'What does a dual-compound tire put in the **center**?', options: ['Softer rubber for grip', 'Harder rubber for wear', 'Steel cords only', 'Nothing; it’s hollow'], answer: 1,
      why: 'The center sees most of the miles (straight-line riding), so harder rubber there lasts longer. Shoulders get softer rubber for lean grip.' },
    { type: 'mc', q: 'Hard braking: what happens to the contact patches?', options: ['Both shrink', 'Front grows, rear shrinks', 'Rear grows, front shrinks', 'Nothing changes'], answer: 1,
      why: 'Weight transfers forward, so the front tire is pressed harder (bigger patch, more grip) and the rear goes light.' },
  ],
  cards: [
    { id: 'round', front: 'Why are bike tires round?', back: 'So they roll onto the shoulder and keep a usable contact patch as the bike leans.' },
    { id: 'patch', front: 'Rough contact patch rule?', back: 'Area ≈ load ÷ pressure (ballpark only).' },
    { id: 'dual', front: 'Dual-compound tire?', back: 'Harder center for wear, softer shoulders for grip at lean.' },
    { id: 'sizes', front: 'Ninja 500 and RS 457 tire sizes?', back: '110/70R17 front, 150/60R17 rear on both.' },
    { id: 'cold', front: 'Cold tires?', back: 'Less grip until they reach their temperature window; track tires need the most heat.' },
  ],
};
