// Weight & power-to-weight
export default {
  steps: [
    { tag: 'metaphor', title: 'Same legs, lighter backpack',
      body: [
        'Sprint with an empty backpack, then with one full of textbooks. Your legs (the engine) didn’t change; what they’re pushing did.',
        'Acceleration is about **power per pound**, not power alone. That’s [[power-to-weight]].',
      ] },
    { tag: 'math', title: 'Two ways to write it',
      body: [
        '**Power-to-weight**: hp per ton (or kW per kg). Higher = quicker.',
        '**Weight-to-power**: lb per hp. Lower = quicker. Americans usually quote this one.',
        'Bronco: 3,710 lb [[curb-weight]] ÷ 250 hp = **≈14.8 lb/hp** (≈148 hp per metric ton).',
        'Ninja 500: 171 kg (377 lb) ÷ ≈45 hp = **≈8.4 lb/hp**. RS 457: 175 kg (386 lb) ÷ ≈47 hp = **≈8.2 lb/hp**.',
      ],
      facts: ['bronco.curbWeight', 'ninja.weight', 'rs457.weight'] },
    { tag: 'bikes', title: 'Add the rider',
      body: [
        'A bike’s rider is a huge share of the total. Add a 170 lb (77 kg) rider: Ninja ≈ **12.2 lb/hp**, RS 457 ≈ **11.9 lb/hp**.',
        'Bronco plus the same driver ≈ **15.5 lb/hp**. The bikes still win, but by less than the bare numbers suggest.',
        'On paper the two bikes are nearly tied. Weight figures aren’t measured the same way (curb vs kerb, fuel level), so a 1–2% gap is noise.',
      ] },
    { tag: 'see', title: 'Where weight hurts most', visualFirst: true,
      visual: { type: 'parts', drawing: 'car-top' },
      body: [
        '[[unsprung-weight]]: wheels, tires, brakes and knuckles, everything the springs don’t carry. Less of it lets the tire follow bumps and keep grip.',
        '[[rotational-inertia]]: spinning parts must be **spun up** as well as moved. A pound at the tire’s outer edge counts close to **double** for acceleration.',
        'So lighter wheels and tires help more than the same weight saved in the cabin.',
      ] },
    { tag: 'key', title: 'Weight touches everything',
      body: [
        'Heavier = slower acceleration, longer braking, more tire load in corners, worse mpg.',
        'Racers say “add lightness”: it helps every part of performance at once.',
        'Your Bronco’s 4x4 hardware (PTU, driveshaft, twin-clutch rear drive unit) and all-terrain tires add weight on purpose, for capability.',
      ] },
  ],
  quiz: [
    { type: 'num', q: 'A 3,000 lb car makes 200 hp. What is its weight-to-power ratio?', answer: 15, tol: 0, unit: 'lb/hp',
      why: '3,000 ÷ 200 = **15 lb/hp**. Almost the same as your Bronco.' },
    { type: 'mc', q: 'Which change helps acceleration the most for the same pounds saved?',
      options: ['Lighter back seat', 'Lighter wheels and tires', 'Lighter roof rack', 'They’re all identical'], answer: 1,
      why: 'Wheels and tires are unsprung and rotating, so they have to be spun up as well as moved. Weight there counts nearly double.' },
    { type: 'tap', q: 'Tap the heaviest **rotating, unsprung** assembly on the car.', visual: { type: 'parts', drawing: 'car-top' }, answer: 'wheels',
      why: 'Wheel + tire is the big one: unsprung (below the springs) and spinning at the outside edge.',
      wrong: { brakes: 'Brake rotors are rotating and unsprung too, but the wheel-and-tire assembly is heavier and spins at a bigger radius.', driveshaft: 'The driveshaft spins but is carried by the body (sprung).' } },
    { type: 'mc', q: 'Ninja 500 ≈ 8.4 lb/hp, RS 457 ≈ 8.2 lb/hp. Fair conclusion?',
      options: ['The RS 457 is far quicker', 'They’re essentially tied on paper; measurement differences can swamp the gap', 'The Ninja is quicker', 'You can’t compare bikes this way'], answer: 1,
      why: 'A ~2% gap is within the slop of how makers define curb weight and the rider’s own weight. Gearing and the rider matter more.' },
  ],
  cards: [
    { id: 'p2w', front: 'Power-to-weight vs weight-to-power?', back: 'hp per ton (higher = quicker) vs lb per hp (lower = quicker). Same idea, flipped.' },
    { id: 'numbers', front: 'Bronco vs bikes, lb per hp?', back: 'Bronco ≈ 14.8. Ninja 500 ≈ 8.4. RS 457 ≈ 8.2 (bare, no rider).' },
    { id: 'unsprung', front: 'What is unsprung weight?', back: 'Mass not carried by the springs: wheels, tires, brakes, knuckles. Less = better grip and ride.' },
    { id: 'rot', front: 'Why does wheel weight count extra?', back: 'It has to be spun up as well as moved: rotational inertia. At the rim, close to double.' },
  ],
};
