// The sequential gearbox
export default {
  steps: [
    { tag: 'metaphor', title: 'An elevator with only two buttons',
      body: [
        'A car’s H-pattern shifter is like a hallway with a door to every room: walk straight to the one you want.',
        'A bike gearbox is an elevator with just **up one** and **down one**: you move in order, a floor at a time. That’s a [[sequential-gearbox]].',
        'The trade: you can’t skip gears, but each shift is a short, fast click of your left foot.',
      ] },
    { tag: 'how', title: 'Two shafts, all gears meshed',
      body: [
        '**Input (main) shaft**: driven by the clutch hub. **Output shaft**: carries the front sprocket on its end.',
        'Every gear pair is always meshed ([[constant-mesh]]). On each pair, one gear spins **free** on its shaft until something locks it.',
        'The “something” is a **sliding gear** next to it: splined to the shaft, with chunky [[dog-teeth|dogs]] on its side that drop into slots in the free gear. Locked = that ratio carries the power.',
        'No synchros: the dogs just slam in. Light gears and quick shifts make that work.',
      ] },
    { tag: 'how', title: 'Foot to fork: the shift drum',
      body: [
        'Lever → **shift shaft** → a ratchet pawl turns the [[shift-drum]] **one step per click**, then springs back for the next.',
        'The drum has zig-zag grooves. Pins on the [[shift-fork|shift forks]] ride in them, so turning the drum slides the right gears sideways.',
        'A spring-loaded detent arm drops into a notched wheel on the drum to hold each position. A [[gear-position-sensor]] on the drum’s end tells the dash which gear you’re in.',
      ] },
    { tag: 'see', title: 'A car box, for contrast', visualFirst: true,
      visual: { type: 'exploded', assembly: 'gearbox' },
      body: [
        'This is a **car** manual: synchro sleeves on hubs, moved by shift rails from an H-pattern lever.',
        'A bike box swaps the **synchros for sliding dog gears** and the **rails for a drum**. Same constant-mesh idea, same “gear spins free until locked.”',
        'Your bikes’ boxes also live in the engine cases and share engine oil (no separate gear oil).',
      ] },
    { tag: 'how', title: '1-N-2-3-4-5-6',
      body: [
        '**One down, five up**: 1st at the bottom, then neutral **half a click** up, then 2nd through 6th.',
        'Nothing is below 1st, so a hard stomp down always lands in 1st. Neutral takes a deliberate light half-click, which is why it can be fiddly to find (an MSF-familiar moment).',
        'A lazy or short stroke can leave the dogs between gears: a [[false-neutral]]. The engine revs, nothing drives.',
        'The **clunk** into 1st from neutral at a stop is normal: clutch drag keeps the input shaft spinning, and dogs don’t synchronize anything.',
      ] },
    { tag: 'math', title: 'Close ratios at the top',
      body: [
        'rpm after an upshift = rpm × (next ratio ÷ current ratio).',
        'Ninja 500, 1st → 2nd at 10,000 rpm: 10,000 × 2.056 ÷ 2.929 ≈ **7,020 rpm**, a 30% drop.',
        '5th → 6th at 10,000 rpm: 10,000 × 1.037 ÷ 1.154 ≈ **8,990 rpm**, only a 10% drop. Gaps shrink as you go up, so the engine stays near its power band.',
      ] },
    { tag: 'bikes', title: 'Your two bikes',
      body: [
        '**Ninja 500**: 6-speed. 1st 2.929 · 2nd 2.056 · 3rd 1.619 · 4th 1.333 · 5th 1.154 · 6th 1.037 (Kawasaki’s figures).',
        '**RS 457**: 6-speed. One review says its gears run on **roller cages** instead of plain bushings, for less friction. I couldn’t find its gear ratios anywhere reliable.',
        'Both: 1-N-2-3-4-5-6 with a neutral lamp, chain drive off the output shaft.',
      ],
      facts: ['ninja.gearRatios', 'rs457.gearbox'] },
  ],
  quiz: [
    { type: 'order', q: 'Order what happens when you click up a gear.', items: ['Foot lifts the shift lever', 'Shift shaft ratchet turns the drum one step', 'Drum grooves move a shift fork', 'Fork slides a dog gear sideways', 'Dogs lock the next gear to its shaft'],
      why: 'Lever → shift shaft and pawl → drum rotates → its grooves move the fork pins → the sliding gear’s dogs engage the neighboring free gear.' },
    { type: 'mc', q: 'Where is neutral on your bikes?', options: ['Below 1st', 'Half a click between 1st and 2nd', 'Above 6th', 'Between 3rd and 4th'], answer: 1,
      why: 'Street bikes use 1-N-2-3-4-5-6: one down, five up, with neutral a half-step above 1st.' },
    { type: 'tap', q: 'Tap the part your left foot works to change gear.', visual: { type: 'parts', drawing: 'moto-side' }, answer: 'quickshifter',
      why: 'The shift lever at the left footpeg turns the shift shaft and drum. On a bike with a quickshifter, its sensor sits in this linkage too.',
      wrong: { gearbox: 'That’s where the gears and drum live. You reach them through the shift lever at the left peg.', 'rear-brake': 'The rear brake pedal is on the **right** side, worked by your right foot.' } },
    { type: 'mc', q: 'Why can a bike gearbox skip synchros?', options: ['Its gears are light and the shifts are quick, so dogs can engage directly', 'Bikes never shift while moving', 'The chain synchronizes the gears', 'The slipper clutch does the synchro’s job'], answer: 0,
      why: 'Small, light gears with small speed differences can be locked by dogs without matching speeds first. The price is a clunk, especially into 1st from neutral.' },
  ],
  cards: [
    { id: 'pattern', front: 'Bike shift pattern?', back: '1-N-2-3-4-5-6: one down, five up, neutral a half-click above 1st.' },
    { id: 'drum', front: 'What does the shift drum do?', back: 'Turns one step per click; its grooves move the shift forks that slide the dog gears.' },
    { id: 'lock', front: 'How is a gear locked in a bike box?', back: 'A sliding gear’s dogs drop into slots in the free-spinning gear next to it. No synchros.' },
    { id: 'fneutral', front: 'False neutral?', back: 'Dogs left between gears after a short or lazy shift: engine revs, nothing drives.' },
    { id: 'rpmdrop', front: 'rpm after an upshift?', back: 'rpm × (next ratio ÷ current ratio). Ninja 1→2 drops ~30%, 5→6 only ~10%.' },
  ],
};
