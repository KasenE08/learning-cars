// Valves, cams & the valvetrain
export default {
  steps: [
    { tag: 'metaphor', title: 'A music box',
      body: [
        'A music box has a spinning drum with bumps. Each bump flicks a metal tooth at the exact right moment.',
        'A [[camshaft]] is that drum. Its bumps ([[cam-lobe|lobes]]) push the valves open at the exact right crank angle, thousands of times a minute.',
      ] },
    { tag: 'see', title: 'Lobe → bucket → valve', visualFirst: true,
      visual: { type: 'valvetrain' },
      body: [
        'On the **base circle** (round part) the valve is shut. The **ramp** starts opening it, the **nose** is full lift.',
        'Switch to the aggressive cam: more lift, open longer.',
      ] },
    { tag: 'how', title: 'Lift, duration, timing',
      body: [
        '**Lift**: how far the valve opens (lobe height).',
        '**Duration**: how long it stays open, in **crank degrees** (lobe width).',
        '**Timing**: *when* it opens relative to the piston.',
        'A “big cam” (more lift and duration) breathes better at high rpm but idles lumpy and loses low-end torque. Stock cams favor smooth, broad torque.',
      ] },
    { tag: 'how', title: 'The valve itself',
      body: [
        '**Head** with a precisely ground **face** that seals on the **seat**. **Stem** slides in a **guide**.',
        'The [[valve-spring]] closes it. A **retainer** and two tiny **keepers** (collets) lock the spring to the stem.',
        '**Valve stem seals** stop oil running down the guide into the chamber.',
        'If the spring can’t keep up at very high rpm, the valve stops following the lobe: **valve float**.',
      ] },
    { tag: 'how', title: 'Three layouts',
      body: [
        '[[ohv]]: one cam down in the block; pushrods and rocker arms carry the motion up. Compact. Classic V8s.',
        '[[sohc]]: one cam per bank in the head.',
        '[[dohc]]: two cams per bank, one for intake, one for exhaust. Best for 4 valves and high rpm.',
        'Followers: **direct buckets** (cam presses straight on a cup), **roller finger followers**, or **rocker arms**.',
      ] },
    { tag: 'how', title: 'Valve clearance (lash)',
      body: [
        'Metal grows when hot. A tiny **gap** between cam and follower when cold makes sure the valve can still fully close when hot.',
        '**Hydraulic** lifters fill that gap with oil automatically: no adjustment.',
        '**Mechanical** buckets use shims and need periodic checks. Too tight = valve doesn’t seal = burnt valve. Too loose = ticking and less lift.',
      ] },
    { tag: 'bronco', title: 'Your Bronco and the bikes',
      body: [
        'Bronco 2.0: **DOHC, 16 valves**. One Ford dealer overview lists **direct-acting mechanical buckets**. Not confirmed yet, so treat that as likely, not certain.',
        'Ninja 500: **DOHC, 8 valves** (parallel twin, 4 per cylinder). Bikes almost all use shim-under-bucket and need valve checks at set intervals.',
      ],
      facts: ['bronco.valvetrain', 'bronco.followers', 'ninja.engine'] },
  ],
  quiz: [
    { type: 'mc', q: 'Cam **duration** describes…', options: ['How far the valve opens', 'How long the valve stays open, in crank degrees', 'When the cam was installed', 'How fast the cam spins'], answer: 1,
      why: 'Duration = how long it’s open (lobe width). Lift = how far (lobe height).', wrong: { 0: 'That’s lift.' } },
    { type: 'mc', q: 'Why do valves need clearance (lash) when cold?', options: ['To make them quieter', 'So they still close fully once parts expand with heat', 'To increase lift', 'To let oil reach the cam'], answer: 1,
      why: 'Hot parts grow. Without a cold gap, the valve could be held slightly open when hot: no seal, burnt valve.' },
    { type: 'mc', q: 'DOHC means…', options: ['Two cams per cylinder bank in the head', 'Dual oil-cooled heads', 'One cam in the block with pushrods', 'Two valves per cylinder'], answer: 0,
      why: 'Double overhead cam: separate intake and exhaust cams in the head, per bank. A V engine with DOHC has four cams.' },
    { type: 'mc', q: 'A “bigger” cam (more lift + duration) usually gives…', options: ['Smoother idle and more low-end torque', 'More high-rpm power, lumpier idle, weaker low end', 'Better fuel economy everywhere', 'No change without a turbo'], answer: 1,
      why: 'Holding valves open longer helps at high rpm, when air has momentum. At low rpm it lets charge escape: lumpy idle, soft bottom end.' },
    { type: 'order', q: 'Order the parts from the cam down to the combustion chamber.', items: ['Cam lobe', 'Bucket', 'Valve stem', 'Valve face'],
      why: 'Lobe pushes the bucket, the bucket pushes the stem tip, and the stem carries the valve face off its seat into the chamber.' },
  ],
  cards: [
    { id: 'lift-dur', front: 'Cam lift vs duration?', back: 'Lift = how far the valve opens (lobe height). Duration = how long, in crank degrees (lobe width).' },
    { id: 'lash', front: 'Why valve lash?', back: 'A cold gap so the valve still fully closes when parts expand hot.' },
    { id: 'layouts', front: 'OHV vs SOHC vs DOHC?', back: 'OHV: cam in block + pushrods. SOHC: 1 cam/bank in head. DOHC: 2 cams/bank (intake + exhaust).' },
    { id: 'float', front: 'Valve float?', back: 'At very high rpm the spring can’t close the valve fast enough, so it stops following the lobe.' },
    { id: 'bigcam', front: 'Effect of an aggressive cam?', back: 'More top-end power; lumpy idle, less low-end torque.' },
  ],
};
