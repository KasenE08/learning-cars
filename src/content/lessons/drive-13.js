// Locking differentials
export default {
  steps: [
    { tag: 'metaphor', title: 'Handcuff the wheels together',
      body: [
        'An open diff lets the two wheels go their own way. An LSD makes them reluctant to. A [[locker]] **handcuffs them**: both wheels turn at exactly the same speed, no matter what.',
        'Like a toy car with one solid axle: whichever wheel has grip gets pushed, even if the other is spinning in the air.',
      ] },
    { tag: 'see', title: 'Locked, with one wheel on ice', visualFirst: true,
      visual: { type: 'diffturn', diff: 'locked', scene: 'slip', pick: true },
      body: [
        'Locked: the icy wheel can’t spin faster than the other, so **the grippy wheel gets nearly all the torque**.',
        'Now switch to the **turn** scene. The outer wheel needs to go faster but can’t, so one tire has to **scrub** (skid) across the ground.',
      ] },
    { tag: 'how', title: 'Selectable lockers',
      body: [
        'Acts like an **open diff** until you press a button, then locks solid.',
        '**Air lockers**: a small compressor pushes a piston that slides a locking collar into the side gear.',
        '**Electric lockers**: an electromagnet pulls the locking ring in. No air lines to run.',
        'Best of both: normal manners on the road, full lock when you need it.',
      ] },
    { tag: 'how', title: 'Automatic lockers and spools',
      body: [
        '**Automatic (ratcheting) lockers** (Detroit Locker style): locked under power, but let the faster wheel **ratchet ahead** in a turn. Tough and simple, but they clunk, bang and can make the car feel twitchy on slippery roads.',
        '**Spool**: a solid piece in place of the diff. Permanently locked. Drag cars use them; so do some drift cars with a cheap “welded diff.”',
      ] },
    { tag: 'why', title: 'When to lock, and why not on pavement',
      body: [
        'Lock at **low speed** on **loose or uneven** ground: rocks, deep ruts, mud, a wheel lifting off the ground.',
        'Lock **before** the obstacle, while you’re still moving. Once a wheel is spinning in a hole, you’ve already dug in.',
        'On pavement the tires can’t slip to make up the speed difference in turns. Result: tire scrub, hard steering, the car **pushes straight** (understeer), and big stress on axles and joints.',
        'Unlock as soon as you’re back on grippy ground.',
      ] },
    { tag: 'bronco', title: 'Your “locker” is two clutches',
      body: [
        'Badlands has a **Rear Differential Lock** button, but there’s no diff to lock: it clamps **both** clutch packs in the twin-clutch [[rdu]] so both rear wheels get drive.',
        '**Sources disagree** on how locked it is. Ford calls it “similar to a traditional mechanical locker.” Torque News says nothing is mechanically locked and the clutches can still slip in tight turns.',
        'It only works in a set **speed range** and Ford says it’s not for dry pavement. One manual excerpt gives **below 30 mph (48 km/h)** in Rock Crawl, but that number isn’t confirmed for 2024.',
      ],
      facts: ['bronco.rearLock', 'bronco.lockSpeed'] },
  ],
  quiz: [
    { type: 'num', q: 'Rear axle locked. The right wheel is **in the air**. The diff receives **400 lb-ft**. About how much goes to the **left** wheel?', answer: 400, tol: 0, unit: 'lb-ft',
      why: 'A locked axle forces both wheels to turn together. The airborne wheel can’t take any torque, so the grounded one gets **all 400 lb-ft**. An open diff would give it almost nothing.' },
    { type: 'mc', q: 'When should you engage a selectable locker?', options: ['On the highway for stability', 'Before a low-speed obstacle on loose or uneven ground', 'Only after you’re stuck', 'In every tight parking-lot turn'], answer: 1,
      why: 'Lock early, at low speed, on loose ground where tires can slip a little in turns. Waiting until a wheel is spinning in a hole often means you’ve already dug in.' },
    { type: 'mc', q: 'Why is a locked axle bad on dry pavement?', options: ['It uses more fuel than AWD', 'The wheels can’t turn at different speeds, so tires scrub and the car pushes straight', 'It disables the brakes', 'It makes the engine overheat'], answer: 1,
      why: 'In a turn the outer wheel must travel farther. Locked, one tire has to skid, which fights the steering and loads the axles.' },
    { type: 'order', q: 'Order the steps of an air locker engaging.', items: ['Driver presses the switch', 'Solenoid valve opens', 'Compressed air reaches the diff', 'Piston pushes the locking collar', 'Carrier and side gear lock together'],
      why: 'The switch opens a valve, air pressure moves a piston inside the diff, and the collar locks a side gear to the carrier so the spiders can’t turn.' },
    { type: 'mc', q: 'What does the Badlands’ Rear Differential Lock actually do?', options: ['Slides a steel locking collar', 'Clamps both rear clutch packs hard', 'Welds the spiders', 'Brakes both rear wheels'], answer: 1,
      why: 'The RDU has no spider gears. The “lock” is both clutch packs clamped hard. Ford compares it to a mechanical locker; other sources say it still slips a bit.' },
  ],
  cards: [
    { id: 'locker', front: 'What does a locker do?', back: 'Forces both wheels on an axle to turn at the same speed, so the one with grip gets the torque.' },
    { id: 'selectable', front: 'Selectable vs automatic locker?', back: 'Selectable: open until you push a button (air/electric). Automatic: locked under power, ratchets in turns.' },
    { id: 'spool', front: 'What is a spool?', back: 'A solid part replacing the diff: permanently locked (drag racing, welded drift diffs).' },
    { id: 'pavement', front: 'Why not lock on pavement?', back: 'Wheels can’t differ in turns: scrub, understeer, axle stress.' },
    { id: 'bronco', front: 'Bronco Sport rear diff lock: mechanical?', back: 'No. Both RDU clutches clamp hard. Ford says “similar to” a mechanical locker; others say it still slips a bit.' },
  ],
};
