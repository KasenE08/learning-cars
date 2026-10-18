// Suspension types
export default {
  steps: [
    { tag: 'metaphor', title: 'Two knees or one skateboard',
      body: [
        'Walk over a rock: one **knee** bends, the other leg doesn’t care. That’s [[independent-suspension]].',
        'Now ride a skateboard over it: the whole axle tilts, so a bump on one wheel moves the other too. That’s a **dependent** (solid axle) setup.',
        'Every design below is a different way to guide the wheel up and down while keeping the tire flat on the road.',
      ] },
    { tag: 'see', title: 'Four designs side by side', visualFirst: true,
      visual: { type: 'suspension', view: 'types' },
      body: [
        'Bump each one. Watch how the wheel tilts (camber) as it moves up.',
        'Notice how much room each one takes up: that’s a big part of why carmakers pick one.',
      ] },
    { tag: 'how', title: 'MacPherson strut',
      body: [
        'A [[macpherson-strut]] is a damper and coil spring in one tall unit that **also locates the wheel**. The top bolts to the body; the bottom bolts to the knuckle.',
        'Just one [[control-arm|lower control arm]] below. At the front, the whole strut turns with the steering on a bearing at the top.',
        'Cheap, light, compact. Leaves room for a sideways engine and front axles, so it’s the most common front suspension.',
        'Downside: camber changes less ideally as it compresses, so the tire doesn’t stay as flat in hard corners.',
      ] },
    { tag: 'how', title: 'Double wishbone & multi-link',
      body: [
        '[[double-wishbone]]: two A-shaped arms, one upper, one lower. By choosing their lengths and angles, engineers control how the tire tilts as it moves. Great grip, but bulky and costlier.',
        '[[multi-link]]: three to five separate links per wheel, each controlling one direction. Very tunable, common at the rear of modern cars.',
        '[[torsion-beam]]: a cross beam joining the two rear wheels that twists when one side moves. Semi-independent, cheap and compact; common on small front-drive cars.',
      ] },
    { tag: 'how', title: 'Solid axles',
      body: [
        'A [[solid-axle]] is one rigid beam with a wheel at each end. Tough and simple, with great [[articulation]] on rocks.',
        'Ground clearance under the differential stays the same as the suspension moves.',
        'Costs: the axle and diff are **unsprung mass**, so ride and handling suffer, and one wheel’s bump tilts the other.',
        'Jeep Wrangler: solid axles front and rear. Full-size Bronco: independent front, solid rear.',
      ] },
    { tag: 'how', title: 'Unibody and subframes',
      body: [
        'Most cars and crossovers are [[unibody]]: the body shell **is** the frame. There’s no separate ladder frame underneath.',
        'The suspension bolts to steel [[subframe|subframes]] (cradles), which bolt to the body through rubber bushings. That filters out noise and vibration.',
        'Body-on-frame trucks (like the full-size Bronco) bolt the suspension to a separate steel frame instead.',
      ] },
    { tag: 'bronco', title: 'Your Bronco Sport',
      body: [
        'Unibody, on Ford’s C2 platform (shared with the Escape). Fully independent: **MacPherson struts up front**, independent rear.',
        'Sources describe the rear differently (“double lateral link with semi-trailing arms” vs “short and long arm”). Either way it’s a multi-link-style independent rear, not a solid axle.',
        'That’s why it rides like a car on the road, with less articulation than a solid-axle Wrangler on rocks.',
      ],
      facts: ['bronco.suspension', 'bronco.mounting'] },
  ],
  quiz: [
    { type: 'tap', q: 'Tap the part of your Bronco that uses **MacPherson struts**.', visual: { type: 'parts', drawing: 'car-top' }, answer: 'susp-front',
      why: 'The front suspension uses MacPherson struts. The rear is a separate independent multi-link-style setup.',
      wrong: { 'susp-rear': 'The rear is independent too, but it’s a link-type design, not struts.' } },
    { type: 'mc', q: 'Why is the MacPherson strut so common at the front of front-drive cars?', options: ['It gives the best camber control', 'It’s compact and cheap, leaving room for a sideways engine and axles', 'It has no moving parts', 'It needs no damper'], answer: 1,
      why: 'One strut plus one lower arm takes up little space and costs little. Double wishbones control camber better but need more room.' },
    { type: 'mc', q: 'Which design is **dependent** (one wheel’s bump moves the other)?', options: ['MacPherson strut', 'Double wishbone', 'Multi-link', 'Solid axle'], answer: 3,
      why: 'Both wheels hang on one rigid beam, so lifting one tilts the other. A torsion beam is in between (semi-independent).' },
    { type: 'mc', q: 'In a unibody car, what does the suspension bolt to?', options: ['A separate ladder frame', 'Subframes that bolt to the body through bushings', 'The engine block', 'The fuel tank'], answer: 1,
      why: 'Unibody cars have no separate frame. Subframes (cradles) carry the suspension and isolate the body from noise.' },
  ],
  cards: [
    { id: 'indep', front: 'Independent vs dependent suspension?', back: 'Independent: each wheel moves on its own. Dependent (solid axle): both wheels share a rigid beam.' },
    { id: 'strut', front: 'What makes a MacPherson strut special?', back: 'The damper/spring unit also locates the wheel. Only a lower arm below. Compact and cheap.' },
    { id: 'wishbone', front: 'Double wishbone vs MacPherson?', back: 'Two A-arms give better camber control and grip, but take more space and cost more.' },
    { id: 'beam', front: 'Torsion beam?', back: 'A twisting cross beam joining the rear wheels. Semi-independent, cheap, common on small FWD cars.' },
    { id: 'bs-susp', front: 'Bronco Sport suspension layout?', back: 'Unibody; MacPherson struts front, independent multi-link-style rear.' },
  ],
};
