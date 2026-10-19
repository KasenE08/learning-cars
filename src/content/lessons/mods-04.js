// Wheels, tires & brakes
export default {
  steps: [
    { tag: 'metaphor', title: 'Heavy boots vs a heavy backpack',
      body: [
        'Run with 2 lb in a backpack, then with 2 lb of boots. The boots wear you out far more: they have to be swung, sped up and stopped every stride.',
        'Wheels and tires are the car’s boots: [[unsprung-weight|unsprung]] and **spinning**. Weight there costs more than weight in the trunk.',
        'And the tires are the only thing touching the road, so they set the ceiling for grip, braking and cornering.',
      ] },
    { tag: 'how', title: 'Why wheel weight matters twice',
      body: [
        '**Bumps**: more unsprung mass = the spring and damper struggle to keep the tire pressed on the road over ripples. Ride and grip both suffer.',
        '**Acceleration and braking**: mass near the rim must be sped up in a straight line *and* spun up. For mass right at the tread, that roughly **doubles** its effective weight ([[rotational-inertia]]).',
        'So big, heavy wheels and tall off-road tires dull acceleration and braking more than their weight on a scale suggests.',
      ] },
    { tag: 'how', title: 'Offset and plus-sizing',
      body: [
        '[[wheel-offset|Offset]] (ET, in mm): lower offset pushes the wheel **out**. Wider stance, but more [[scrub-radius]], more steering kickback, more load on wheel bearings, and rubbing on fenders.',
        '[[plus-sizing]]: a bigger wheel with a lower-[[aspect-ratio]] tire, same overall diameter. Crisper steering, harsher ride, easier rim and sidewall damage on potholes.',
        'Always check the tire’s [[load-index]]: a fashionable size with too low a load rating is unsafe on a heavy SUV.',
      ] },
    { tag: 'see', title: 'Decode a bigger tire', visualFirst: true,
      visual: { type: 'tire', code: '235/70R17 108T' },
      body: [
        'Your stock tire is **225/65R17**: sidewall 225 × 0.65 = 146 mm, overall ≈ **28.5 in** (724 mm).',
        '235/70R17: sidewall ≈ 165 mm (6.5 in), overall ≈ **30.0 in** (761 mm). Try other sizes and compare diameters.',
        '~~Load index 108 is just an example here; match or exceed the rating on your door placard.~~',
      ],
      facts: ['bronco.tires'] },
    { tag: 'see', title: 'Taller tires change your gearing and speedometer', visualFirst: true,
      visual: { type: 'gearing', preset: 'bronco' },
      body: [
        'Slide **Tire dia.** from 28.5 to 30.0 in. Every gear gets about **5% taller**: fewer rpm at a given speed, less torque at the wheels.',
        'The speedometer still assumes the stock tire, so it reads **≈5% low**: indicated 65 mph is really ≈68 mph. The odometer under-counts the same way ([[speedo-error]]).',
        'Same idea as a numerically lower [[final-drive]], with extra weight and inertia on top.',
      ] },
    { tag: 'how', title: 'Big brakes vs short stops',
      body: [
        'In one hard stop, a healthy stock system can already lock the tires; [[abs]] then holds them at the grip limit. The **tire** sets the stopping distance.',
        'A [[big-brake-kit]] adds **heat capacity**: bigger rotors soak and shed heat, so they resist [[brake-fade]] on track laps or long mountain descents. It doesn’t shorten that first stop by itself.',
        'Cheaper wins first: better tires, fresh high-boiling [[brake-fluid]], and [[brake-pads|pads]] suited to the use.',
        'Bigger, heavier wheels and tires ask more of the stock brakes, the one case where upsizing brakes helps a street truck.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'What does a big brake kit mainly improve on a street car with good stock brakes?',
      options: ['Stopping distance in a single panic stop', 'Heat capacity and fade resistance over repeated hard stops', 'Tire grip', 'ABS speed'], answer: 1,
      why: 'If the stock brakes can already reach ABS, the tire limits a single stop. Bigger rotors and calipers help when heat builds up stop after stop.',
      wrong: { 0: 'Only if the stock brakes couldn’t reach the tire’s limit, which is rare on a healthy road car.' } },
    { type: 'mc', q: 'Lowering the wheel **offset** (say ET 45 → ET 20) does what?',
      options: ['Moves the wheel inward', 'Moves the wheel outward: more scrub radius and bearing load, more fender-rub risk', 'Makes the tire taller', 'Changes only the look, nothing else'], answer: 1,
      why: 'Offset is the mounting face’s distance from the wheel centerline. Less offset puts the wheel farther out from the hub.' },
    { type: 'mc', q: 'Why is a pound at the wheel rim worse than a pound in the cabin?',
      options: ['It isn’t; mass is mass', 'It is unsprung and must also be spun up, so it hurts ride and acts like extra mass in acceleration and braking', 'It raises the center of gravity', 'It reduces engine power'], answer: 1,
      why: 'Rim mass is unsprung (the suspension must control it) and rotating (it has to be spun up and slowed down as well as moved).' },
  ],
  cards: [
    { id: 'unsprung', front: 'Two reasons heavy wheels hurt?', back: 'More unsprung mass (worse bump control) and rotational inertia (up to ~2× effective mass at the rim).' },
    { id: 'offset', front: 'Lower wheel offset → ?', back: 'Wheel sits farther out: wider stance, more scrub radius, bearing load and rub risk.' },
    { id: 'plus', front: 'Plus-sizing?', back: 'Bigger wheel, shorter sidewall, same overall diameter. Sharper steering, harsher ride.' },
    { id: 'speedo', front: 'Taller tires: speedometer reads…?', back: 'Low. Actual = indicated × new ÷ old diameter (≈5% for 28.5 → 30 in).' },
    { id: 'bbk', front: 'What do big brake kits buy you?', back: 'Heat capacity / fade resistance. A single stop is limited by the tires.' },
  ],
};
