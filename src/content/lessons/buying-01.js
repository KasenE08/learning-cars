// Buying used: what to check
export default {
  steps: [
    { tag: 'metaphor', title: 'Be a detective, not a fan',
      body: [
        'A used car is a witness with a story. The seller tells you one version; the car tells you another through rust, leaks, smoke and noises.',
        'Your job: collect clues **before** you fall in love with the color. Falling in love comes after the inspection.',
        'This is theory: what to look at and **why**. A pro inspection is still the final word.',
      ] },
    { tag: 'how', title: 'Body, rust and tires',
      body: [
        'Look in daylight. **Panel gaps** that don’t match, paint that’s a slightly different shade, or overspray on rubber trim → body repair. Ask about it.',
        '**Rust**: rocker panels, wheel arches, subframes, brake lines, and the underside in salt-belt states. Surface rust is cosmetic; rust you can poke through is structural.',
        '**Tires**: uneven wear (one edge, cupping) hints at [[wheel-alignment|alignment]] or suspension problems. Check the [[dot-date-code|DOT date]]; old tires cost money even with deep tread.',
        'Off-roaders: scrapes and dents underneath show how hard it was used.',
      ] },
    { tag: 'how', title: 'Leaks and fluids',
      body: [
        'Look under the car and under the hood. Rough color guide: engine oil = amber to black; coolant = green, orange or pink (sweet smell); automatic fluid = red; brake fluid = clear to amber.',
        '**Milky, tan oil** on the dipstick or cap can mean coolant mixing with oil, a classic [[head-gasket]] sign. Get it checked before buying.',
        'A spotless, freshly washed engine bay on an old car isn’t proof of anything, but it can hide leaks. Look for wet spots after the drive.',
      ] },
    { tag: 'how', title: 'Cold start and warning lights',
      body: [
        'Ask the seller **not** to start the car before you arrive. A [[cold-start]] shows rattles, smoke and hard starting that a warm engine hides.',
        'Smoke: **blue** = burning oil; **white and sweet-smelling that keeps going** = coolant; **black** = running rich. (A little white vapor on a cold day is normal condensation.)',
        'At key-on, the warning lights should **all light up, then go out** after starting. A [[check-engine-light]] that never lights at all may have been disabled.',
        'Teaser for Track 4: an [[obd-ii]] scan tool reads stored codes and **readiness monitors**. Codes cleared just before a sale leave monitors “not ready.”',
      ] },
    { tag: 'how', title: 'Deeper engine checks (concepts)',
      body: [
        'For a high-mileage or suspicious engine, a mechanic can run a [[compression-test]]: cylinders should read close to each other.',
        'A [[leak-down-test]] pinpoints where pressure escapes: rings, valves or head gasket.',
        '[[oil-analysis]] needs a used-oil sample and shows trends, so it’s more useful for an owner than for a one-time buyer.',
      ] },
    { tag: 'how', title: 'Test-drive signals',
      body: [
        'Drive it cold **and** warm: city, highway, bumps, a tight parking-lot turn.',
        '**Transmission**: slipping (rpm rises, car doesn’t speed up), harsh or late shifts, flares between gears.',
        '**Brakes**: pulling to one side, a pulsing pedal, grinding. **Steering**: vibration, wandering, clunks over bumps (worn bushings or links).',
        '**Noises**: humming that changes with speed (wheel bearing), binding or hopping in tight turns on an AWD car. Watch the temperature gauge stay steady.',
      ] },
    { tag: 'see', title: 'Your inspection checklist', visualFirst: true,
      visual: { type: 'checklist', title: 'Used car inspection',
        groups: [
          { name: 'Paperwork', items: [
            { check: 'VIN on dash, door jamb and title all match', why: 'A mismatch can mean a swapped part, a clerical error or a stolen car. Stop until it’s explained.' },
            { check: 'Seller’s ID matches the name on the title', why: 'Otherwise you may be buying from someone who can’t legally sell it.' },
            { check: 'Service records and open recalls', why: 'Records show care; recalls by VIN are free to fix (next lesson).' },
          ] },
          { name: 'Outside', items: [
            { check: 'Panel gaps, paint shade, overspray', why: 'Signs of body repair after a crash.' },
            { check: 'Rust on rockers, arches, subframe, brake lines', why: 'Structural rust is expensive or unfixable.' },
            { check: 'Tire wear pattern and DOT date', why: 'Uneven wear = alignment or suspension issues; old tires need replacing.' },
          ] },
          { name: 'Engine', items: [
            { check: 'Cold start: noises, smoke, how it idles', why: 'Cold engines reveal wear that warm ones hide.' },
            { check: 'Warning lights on at key-on, then off', why: 'A light that never comes on may have been disabled.' },
            { check: 'Oil and coolant look and level; leaks underneath', why: 'Milky oil or coolant loss can mean a head gasket problem.' },
          ] },
          { name: 'Drive', items: [
            { check: 'Shifts, brakes, steering, noises', why: 'Drivetrain and suspension problems show up on the road.' },
            { check: 'Temperature gauge stays steady', why: 'Overheating ruins engines.' },
          ] },
          { name: 'Before paying', items: [
            { check: 'Pre-purchase inspection by your own mechanic', why: 'Usually a small cost next to a surprise repair, and it gives you leverage to negotiate.' },
          ] },
        ] },
      body: [
        'Tap items as you go. A seller who won’t allow a [[pre-purchase-inspection]] is giving you an answer.',
        'You can always walk away. There will be another car.',
      ] },
    { tag: 'bronco', title: 'If you ever shop for another Bronco Sport',
      body: [
        'Check open recalls by VIN: for example, 2021–24 Bronco Sports had **battery-related recalls** (24V-267 software, 25V-019 battery replacement).',
        'Ask about **rear drive unit and PTU fluid**: owners report dark RDU fluid by about 18,000 mi. That’s owner reports, not Ford’s schedule, but service records here are a good sign.',
        'In a tight, slow turn, an AWD car shouldn’t shudder or bind.',
      ],
      facts: ['bronco.batteryRecall', 'bronco.rduFluid'] },
  ],
  quiz: [
    { type: 'mc', q: 'On a cold start you see **blue-gray smoke** that clears after a minute. Most likely?', options: ['Coolant burning', 'Oil getting past valve seals or rings', 'Running rich', 'Normal condensation'], answer: 1,
      why: 'Blue = oil. Smoke at startup that clears often points to valve stem seals letting oil seep in while parked; constant smoke points to rings.',
      wrong: { 0: 'Coolant smoke is white and sweet-smelling, and it keeps going.' } },
    { type: 'mc', q: 'Why ask the seller **not** to warm up the car before you arrive?', options: ['To save their fuel', 'A cold start reveals noises, smoke and hard starting a warm engine hides', 'Cold engines make more power', 'It’s required by law'], answer: 1,
      why: 'Oil has drained down and parts haven’t expanded, so wear shows. A pre-warmed engine may be hiding something (or not; ask).' },
    { type: 'tap', q: 'On an AWD Bronco Sport, tap the part whose fluid owners say goes dark early, so it’s worth asking about service records.', visual: { type: 'parts', drawing: 'car-top' }, answer: 'rdu',
      why: 'Owners report very dark rear drive unit (RDU) fluid by about 18,000 mi. That’s owner reports, not Ford’s schedule, but records showing it was changed are a good sign.',
      wrong: { ptu: 'Close: the PTU fluid matters too, but the owner reports are about the RDU.', transmission: 'The transmission matters, but this one is about the rear drive unit.' } },
    { type: 'order', q: 'A sensible order for checking a used car.', items: ['Paperwork and VIN match', 'Walk-around in daylight', 'Cold start', 'Test drive', 'Pre-purchase inspection', 'Negotiate and pay'],
      why: 'Paperwork first (no point inspecting a car you can’t legally buy), then outside, cold start, drive, pro inspection, and only then money.' },
  ],
  cards: [
    { id: 'smoke', front: 'Smoke colors?', back: 'Blue = oil. White, sweet, persistent = coolant. Black = rich. A little white vapor when cold = normal.' },
    { id: 'milky', front: 'Milky oil on the dipstick?', back: 'Coolant mixing with oil: possible head gasket or crack. Get it checked.' },
    { id: 'keyon', front: 'Why watch the dash at key-on?', back: 'All warning lights should light, then go out. A CEL that never lights may be disabled.' },
    { id: 'monitors', front: 'Codes cleared before a sale: how can you tell?', back: 'An OBD-II scan shows readiness monitors “not ready.”' },
    { id: 'ppi', front: 'Pre-purchase inspection?', back: 'An independent mechanic you choose checks the car before you pay. Refusal is a red flag.' },
  ],
};
