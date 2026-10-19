// Frames
export default {
  steps: [
    { tag: 'metaphor', title: 'A skeleton that has to bend just right',
      body: [
        'A bike frame is a skeleton with three jobs: hold the **steering head**, the **engine** and the **swingarm pivot** in exact alignment, mile after mile.',
        'Think of a diving board: too floppy and you can’t aim, too rigid and it buzzes your feet. A frame has to be stiff where it matters and a little springy where it helps.',
        'A car has four wheels and a unibody to spread loads. A bike has two tiny contact patches and a skinny frame between them, so every flex shows up in the steering.',
      ] },
    { tag: 'see', title: 'Where the frame lives', visualFirst: true,
      visual: { type: 'parts', drawing: 'moto-side' },
      body: [
        'Tap **frame**, **fork**, **swingarm** and **shock**. Those four form the chassis loop: front wheel → fork → steering head → frame → swingarm pivot → swingarm → rear wheel.',
        'The [[steering-head]] is the top of the front end. The swingarm pivot sits just behind the gearbox, close to the front sprocket.',
      ] },
    { tag: 'how', title: 'Four frame families',
      body: [
        '[[trellis-frame|Trellis]]: lots of short straight tubes welded in triangles. Triangles don’t bend, they only stretch or squash, so it’s stiff for its weight. Easy to tune by changing tube sizes.',
        '[[twin-spar-frame|Twin-spar / perimeter]]: two big beams, usually aluminum, wrapping around the engine from steering head to swingarm pivot. The straightest stiff path between the two points that matter.',
        '[[backbone-frame|Backbone]]: one spine over the top, engine hanging underneath. Simple, narrow, cheap.',
        '**Cradle**: tubes loop under the engine too (single or double). The classic old-school layout, still common on cruisers and simple bikes.',
      ] },
    { tag: 'how', title: 'The engine as part of the frame',
      body: [
        'A [[stressed-member]] engine is bolted in so it **carries frame loads**, like a beam in a bridge. The frame can then skip the tubes under the engine.',
        'Win: less weight and a narrower bike. Cost: engine mounts and cases must be designed for those loads, and engine vibration has a more direct path to the rider.',
        'Extreme example: some superbikes have barely any frame at all, just a small front section bolted to the cylinder heads.',
      ] },
    { tag: 'why', title: 'Stiff, but not too stiff',
      body: [
        'Front-to-back and twisting stiffness keeps the wheels lined up under braking and power. Too little, and the bike weaves at speed.',
        'Leaned over, bumps push **sideways** on the bike, where the suspension can’t move. A bit of **lateral flex** in the frame and swingarm acts like a tiny extra suspension there.',
        'So racing frames are tuned for a balance, not maximum stiffness. Very stiff frames can feel harsh and give little warning at the limit.',
      ] },
    { tag: 'how', title: 'The swingarm',
      body: [
        'The [[swingarm]] holds the rear wheel and pivots on the frame. The rear shock controls how it swings.',
        'The **chain pulls on it** too: under power, chain tension tries to pull the swingarm down, which resists the rear squatting. Pivot height and sprocket sizes change that effect.',
        'A swingarm has to resist twisting, or the rear wheel steers itself slightly when you lean and pull hard.',
      ] },
    { tag: 'bikes', title: 'Your two frames',
      body: [
        '**Ninja 500**: steel trellis frame.',
        '**RS 457**: aluminum twin-beam frame with the engine as a stressed member, a small-bike version of the layout on Aprilia’s bigger sport bikes.',
        'Aluminum isn’t automatically better: steel tubes are cheap, strong and easy to repair; aluminum beams can be light and very stiff. How it’s designed matters more than the material.',
      ],
      facts: ['ninja.chassis', 'rs457.chassis'] },
  ],
  quiz: [
    { type: 'tap', q: 'Tap the part that holds the rear wheel and pivots on the frame.', visual: { type: 'parts', drawing: 'moto-side' }, answer: 'swingarm',
      why: 'The swingarm runs from its pivot behind the gearbox to the rear axle. The shock controls it; it isn’t the shock itself.',
      wrong: { shock: 'The shock controls the swingarm’s motion, but the wheel is held by the swingarm.', frame: 'The frame carries the swingarm pivot, not the wheel.' } },
    { type: 'mc', q: 'Why does a trellis frame use triangles?', options: ['They look sporty', 'A triangle can only change shape by stretching or squashing a tube, so it’s stiff for its weight', 'Triangles let the frame flex more', 'Triangles are cheaper to paint'], answer: 1,
      why: 'Like a bridge truss: loads go along the tubes as tension or compression, which tubes handle well. Bending is what tubes are bad at.' },
    { type: 'mc', q: 'What does “engine as a stressed member” mean?', options: ['The engine is tuned for high stress', 'The engine carries frame loads, so the frame can be smaller', 'The engine floats on rubber mounts', 'The frame is welded to the cylinder head'], answer: 1,
      why: 'The engine becomes a structural part of the chassis. That saves weight and width but loads the mounts and cases.' },
    { type: 'mc', q: 'Why don’t race frames aim for maximum stiffness?', options: ['Stiff frames are too heavy to build', 'Leaned over, some sideways flex acts like extra suspension the forks and shock can’t provide', 'Riders prefer a wobbly feel', 'Rules ban stiff frames'], answer: 1,
      why: 'At big lean angles bumps hit partly sideways. The suspension only moves along its own axis, so controlled lateral flex helps the tire keep contact.' },
    { type: 'order', q: 'Order the chassis loop from front tire to rear tire.', items: ['Front tire', 'Fork', 'Steering head', 'Frame', 'Swingarm pivot', 'Swingarm', 'Rear tire'],
      why: 'Front wheel loads go up the fork into the steering head, through the frame to the swingarm pivot, and back down the swingarm to the rear wheel.' },
  ],
  cards: [
    { id: 'jobs', front: 'Three points a bike frame must keep aligned?', back: 'Steering head, engine mounts and swingarm pivot.' },
    { id: 'trellis', front: 'Trellis vs twin-spar frame?', back: 'Trellis: many short tubes in triangles (Ninja 500, steel). Twin-spar: two big beams around the engine (RS 457, aluminum).' },
    { id: 'stressed', front: 'Engine as a stressed member?', back: 'The engine carries frame loads, so the frame can be smaller and lighter.' },
    { id: 'flex', front: 'Why is some lateral flex useful?', back: 'Leaned over, sideways bumps can’t be absorbed by the suspension; controlled frame flex helps the tire stay in contact.' },
    { id: 'swingarm', front: 'What does the swingarm do?', back: 'Holds the rear wheel and pivots on the frame; the shock controls it and the chain pulls on it under power.' },
  ],
};
