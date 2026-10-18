// Limited-slip differentials
export default {
  steps: [
    { tag: 'metaphor', title: 'Put some friction on the pulley',
      body: [
        'Back to the rope over a pulley. If one friend lets go, the rope races through and you can’t pull the other one.',
        'Now make the pulley **stiff to turn**. The rope can still slide when it has to (turns), but a let-go end can’t run away freely, so you still pull the other friend.',
        'That’s a [[lsd]]: an open diff with built-in resistance to the wheels turning at different speeds.',
      ] },
    { tag: 'see', title: 'Open vs LSD vs locked on ice', visualFirst: true,
      visual: { type: 'diffturn', diff: 'lsd', scene: 'slip', pick: true },
      body: [
        'Start on **LSD** with one wheel on ice, then tap **Open** to compare. The LSD keeps sending some torque to the grippy wheel.',
        'Switch the scene to a turn: the LSD still lets the wheels differ, just with a little resistance.',
      ] },
    { tag: 'math', title: 'Torque bias ratio',
      body: [
        '[[torque-bias-ratio|Torque bias ratio (TBR)]]: how much more torque the grippy wheel can get than the slipping wheel.',
        'Open diff = **1:1**. A **3:1** LSD lets the grippy wheel take up to 3× the slipping wheel’s torque.',
        'Example: the icy wheel can hold 50 lb-ft (68 N·m) before spinning. With 3:1, the other wheel can take up to **150 lb-ft (203 N·m)**.',
        'The catch: 3 × **zero** is still zero. A wheel in the air holds no torque, so a pure torque-biasing diff gives the other wheel nothing.',
      ] },
    { tag: 'how', title: 'Clutch-type LSD',
      body: [
        'Stacks of friction and steel plates between the side gears and the case, **preloaded** by springs so they always drag a little.',
        'Ramps can add clamping under power (and, on 1.5- and 2-way designs, when coasting too).',
        'Pros: works even with a wheel in the air (thanks to preload), very tunable: a race and drift favorite.',
        'Cons: plates **wear**, can chatter in tight turns, and often need special oil with a friction modifier.',
      ] },
    { tag: 'how', title: 'Torsen / helical-gear LSD',
      body: [
        '[[torsen|Torsen]] and similar helical-gear diffs (like Quaife) replace the spiders with worm or helical gears whose **friction resists** speed differences.',
        'It’s **torque-sensing**: the harder you push, the more it biases. Smooth, no wear parts, no special oil.',
        'Weakness: with a wheel in the air (zero torque), it acts like an open diff. Off-roaders sometimes drag the brakes lightly to fake a little resistance.',
      ] },
    { tag: 'how', title: 'Viscous LSD',
      body: [
        'A [[viscous-coupling]]: interleaved perforated plates in sealed **silicone fluid**. One set connects to each side.',
        'It’s **speed-sensing**: only a speed difference shears the fluid, which thickens and heats, coupling the sides.',
        'Cheap and gentle, but **slow** to react, and it can fade as the fluid ages. Common in older AWD center diffs.',
      ] },
    { tag: 'bronco', title: 'What your Bronco uses instead',
      body: [
        'No traditional LSD. **Front**: an open diff, helped by brake-based traction control.',
        '**Rear (Badlands)**: the twin-clutch [[rdu]] is like a clutch-type LSD that a computer squeezes, one clutch pack per wheel. It can do things an LSD can’t, like sending more torque to the **faster** outside wheel ([[torque-vectoring]]).',
      ],
      facts: ['bronco.rdu'] },
  ],
  quiz: [
    { type: 'num', q: 'One wheel can hold **50 lb-ft** before spinning. With a **3:1** torque bias ratio, what’s the most torque (lb-ft) the other wheel can get?', answer: 150, tol: 0, unit: 'lb-ft',
      why: 'TBR × slipping-wheel torque = 3 × 50 = **150 lb-ft**. An open diff (1:1) would give only 50.' },
    { type: 'mc', q: 'One rear wheel is **in the air**. Which diff still sends drive to the wheel on the ground?', options: ['Open diff', 'Torsen (helical gear) with no brake drag', 'Clutch-type LSD with preload', 'None of them'], answer: 2,
      why: 'Preloaded clutch plates drag even with zero torque on the lifted side, so the grounded wheel gets at least the preload torque. A Torsen multiplies zero by its TBR: still zero.',
      wrong: { 1: 'A Torsen’s bias is a multiple of the lifted wheel’s torque, and that’s zero.' } },
    { type: 'mc', q: 'A viscous LSD reacts to…', options: ['Torque input', 'A speed difference between the two sides', 'Steering angle', 'Driver button press'], answer: 1,
      why: 'Shearing the silicone fluid needs relative speed. No speed difference, no coupling. That’s why viscous units feel slow to react.' },
    { type: 'mc', q: 'What’s the main downside of a clutch-type LSD?', options: ['Can’t work with a wheel in the air', 'Plates wear and can chatter; often needs special oil', 'Only works in reverse', 'It’s speed-sensing, so it’s slow'], answer: 1,
      why: 'Friction plates slip every time you turn, so they wear and may chatter. The upside is strong, tunable locking.' },
  ],
  cards: [
    { id: 'lsd', front: 'What does an LSD do?', back: 'Resists the two wheels turning at different speeds, so the grippy wheel still gets torque.' },
    { id: 'tbr', front: 'Torque bias ratio?', back: 'Max torque to the grippy wheel ÷ torque the slipping wheel can hold. Open diff = 1:1.' },
    { id: 'clutch', front: 'Clutch-type LSD: pro and con?', back: 'Pro: preload works even with a wheel in the air. Con: plates wear, may chatter, special oil.' },
    { id: 'torsen', front: 'Torsen weakness?', back: 'Torque-sensing: a wheel in the air holds zero torque, so the other wheel gets ~zero too.' },
    { id: 'viscous', front: 'Viscous coupling: how does it lock?', back: 'Speed difference shears silicone fluid, which thickens and heats. Gentle but slow.' },
  ],
};
