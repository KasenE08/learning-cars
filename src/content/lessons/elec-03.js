// The starter
export default {
  steps: [
    { tag: 'metaphor', title: 'A friend who gives you a push',
      body: [
        'An engine can’t start itself: it needs to be spinning to suck in air and make compression. Think of a friend pushing your bike until you can pedal.',
        'The [[starter-motor]] is that friend: it shoves hard for a second or two, then **has to let go instantly** or the engine drags it along.',
      ] },
    { tag: 'see', title: 'Battery → starter', visualFirst: true,
      visual: { type: 'parts', drawing: 'charging' },
      body: [
        'Tap the **starter** and the **battery**. Notice the starter gets its own thick cable straight from the battery, not through the fuse box.',
        'It’s the biggest single load in the car, by far.',
      ] },
    { tag: 'how', title: 'Motor, pinion, ring gear',
      body: [
        'A compact, high-speed DC motor (usually with internal gear reduction) drives a small **pinion** gear.',
        'The pinion meshes with the big [[starter-ring-gear|ring gear]] on the flywheel or flexplate. Ratio roughly **10–20 : 1**, so the motor spins fast and the crank turns slowly with lots of torque.',
        'Cranking speed is only about **150–250 rpm**, enough to draw air, build compression and let the PCM read the crank sensor.',
      ] },
    { tag: 'how', title: 'The solenoid’s two jobs',
      body: [
        'The [[starter-solenoid]] is a heavy electromagnet on top of the starter.',
        '**Job 1:** its plunger pushes the pinion forward into the ring gear.',
        '**Job 2:** at the end of its travel it closes big copper contacts, connecting the battery cable to the motor.',
        'A few amps through the solenoid (switched by a relay the PCM controls) switch **well over 100 A** to the motor. Small current, big current again.',
      ] },
    { tag: 'how', title: 'Letting go: the one-way clutch',
      body: [
        'Once the engine fires, the ring gear would spin the pinion 10–20× faster than the engine: at 2,000 rpm that’s 20,000–40,000 rpm, enough to wreck the motor.',
        'An [[starter-drive|overrunning (one-way) clutch]] (often called the **Bendix** drive) on the pinion drives one way and freewheels the other.',
        'When you let go (or the PCM ends the crank), a spring pulls the pinion back out.',
      ] },
    { tag: 'bronco', title: 'Your starter works overtime',
      body: [
        'Your Bronco has an automatic, so the ring gear is on the **flexplate**.',
        'With [[start-stop]], the starter may crank the engine many times per drive instead of once. Start-stop cars generally get starters and batteries built for far more cycles. ~~Ford doesn’t publish the Bronco Sport’s starter specs.~~',
      ],
      facts: ['bronco.trans', 'bronco.startStop'] },
  ],
  quiz: [
    { type: 'order', q: 'Put a start in order.',
      items: ['Button pressed; PCM energizes the start relay', 'Solenoid pushes the pinion into the ring gear', 'Solenoid contacts close; motor gets battery current', 'Motor cranks the engine', 'Engine fires; one-way clutch freewheels', 'Pinion pulls back out'],
      why: 'The solenoid engages the gear **first**, then powers the motor, so the pinion isn’t spinning when it meets the ring gear.' },
    { type: 'tap', q: 'Tap the **starter**.', visual: { type: 'parts', drawing: 'charging' }, answer: 'starter',
      why: 'The starter sits by the flywheel/flexplate end of the engine, fed by a thick cable straight from the battery.',
      wrong: { alternator: 'That’s the alternator. It makes power; the starter uses it.' } },
    { type: 'num', q: 'A ring gear has **135 teeth** and the pinion **9**. The crank turns at **200 rpm** while cranking. How fast is the pinion spinning (rpm)?',
      answer: 3000, tol: 0, unit: 'rpm', hint: 'Ratio = ring teeth ÷ pinion teeth',
      why: '135 ÷ 9 = **15 : 1**, so 200 × 15 = **3,000 rpm**.' },
    { type: 'mc', q: 'Why does the starter pinion need a **one-way (overrunning) clutch**?',
      options: ['To make it quieter', 'So the running engine can’t spin the starter motor to destructive speed', 'To charge the battery', 'To change gears'], answer: 1,
      why: 'Once the engine runs, it would drive the pinion 10–20× faster than the crank. The clutch freewheels instead.' },
  ],
  cards: [
    { id: 'solenoid', front: 'The starter solenoid’s two jobs?', back: '1) Push the pinion into the ring gear. 2) Close heavy contacts to power the motor.' },
    { id: 'ratio', front: 'Starter pinion : ring gear ratio and cranking speed?', back: 'Roughly 10–20 : 1; the crank turns ~150–250 rpm.' },
    { id: 'bendix', front: 'What does the Bendix / overrunning clutch do?', back: 'Drives the ring gear one way, freewheels when the engine starts, so it can’t over-spin the motor.' },
    { id: 'current', front: 'Why does the starter have its own thick cable?', back: 'It draws well over 100 A. Thin wire would drop too much voltage and overheat.' },
  ],
};
