// Off-road & overland
export default {
  steps: [
    { tag: 'metaphor', title: 'Sprinters, climbers and backpackers',
      body: [
        'Off-roaders are like outdoor athletes. **Rock crawlers** are boulderers: slow, precise, every move planned.',
        '**Desert racers** are trail runners: fast over rough ground, suspension doing the work.',
        '**Overlanders** are backpackers: the goal is the journey, and the gear on your back (or roof) is your home.',
      ] },
    { tag: 'how', title: 'What the scene values',
      body: [
        '**Capability**: clearance, articulation, traction aids, tires. Then **self-reliance**: being able to get yourself (and others) unstuck.',
        '[[rock-crawling]] values gearing, lockers and [[articulation]]. Desert running values long-travel suspension and cooling. [[overlanding]] values range, reliability and a camp you carry.',
        'Classic rigs: Jeep Wrangler, Toyota Land Cruiser and 4Runner, Land Rover Defender, and the Ford Bronco.',
        'Ethic: stay on legal trails and leave no trace. Trail closures usually follow damage.',
      ] },
    { tag: 'see', title: 'The Bronco story', visualFirst: true,
      visual: { type: 'timeline', title: 'The Bronco name', events: [
        { year: 1966, title: 'First Bronco', note: 'Compact 4x4 vs Jeep CJ-5 and Scout; on sale Aug 1965' },
        { year: 1978, title: 'Full-size Bronco', note: 'Based on the F-Series pickup' },
        { year: 1984, title: 'Bronco II', note: 'Smaller sibling, sold to 1990; led to the Explorer' },
        { year: 1996, title: 'Last original Bronco' },
        { year: 2020, title: 'Bronco family revealed', note: 'July 13, 2020: Bronco and Bronco Sport' },
        { year: 2021, title: 'Bronco and Bronco Sport on sale', note: 'First model year for both' },
        { year: 2025, title: 'Bronco Sport refresh' },
      ] },
      body: [
        'A **25-year gap**: the name went quiet after 1996 and came back as a whole family, a big retro play like the 2005 Mustang.',
        'Your 2024 is a first-generation, pre-refresh Bronco Sport, built in Hermosillo, Mexico.',
      ],
      facts: ['bronco.nameHistory', 'bronco.sportTimeline', 'bronco.plant'] },
    { tag: 'bronco', title: 'Bronco vs Bronco Sport: different animals',
      body: [
        'The full-size Bronco is [[body-on-frame]] with a real [[transfer-case]] and [[low-range]].',
        'Your Bronco Sport is a [[unibody]] built on the same platform family as the Escape. No transfer case, no low range.',
        'The Badlands earns its badge with hardware: twin-clutch rear drive unit, rear diff lock, 8.8 in clearance, and Mud/Ruts and Rock Crawl modes.',
      ],
      facts: ['bronco.mounting', 'bronco.noLowRange', 'bronco.4x4', 'bronco.clearance'] },
    { tag: 'see', title: 'How the Badlands crawls', visualFirst: true,
      visual: { type: 'awd', mode: 'rock', scene: 'turn' },
      body: [
        'Rock Crawl mode locks drive front-to-rear and clamps the rear clutches together, so a lifted wheel doesn’t steal all the torque.',
        'No low range means less [[crawl-ratio]] than a Wrangler or full-size Bronco: about 17.9:1 vs much higher. It crawls by **clutches and software**, not by gears.',
      ],
      facts: ['bronco.crawlRatio', 'bronco.goat'] },
    { tag: 'why', title: 'Honest takes',
      body: [
        '**“Crossovers can’t off-road.”** Too strong. A Badlands handles a lot of trails well; it’s just not built for the hardest rock lines a locked, low-range rig takes.',
        '**“Mall crawler.”** A [[mall-crawler]] is a rig that never leaves pavement. ~~Opinion: it’s fine to buy the look; just don’t fake the stories.~~',
        '**“Bigger tires and a lift always help.”** They add clearance, but also weight, worse braking and handling, and strain on CV joints. More in the Mods unit.',
        '**“Overlanding needs a $100k build.”** Plenty of people do it in stock trucks; planning and reliability matter more than gear.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'Biggest structural difference between a full-size **Bronco** and your **Bronco Sport**?', options: ['The Sport has a bigger engine', 'Bronco: body-on-frame with a transfer case and low range. Sport: unibody with no low range', 'The Sport is rear-wheel drive', 'There is none'], answer: 1,
      why: 'Same name, different engineering: the full-size Bronco is a traditional body-on-frame 4x4; the Sport is an AWD-based unibody crossover with clever clutch hardware.' },
    { type: 'order', q: 'Put the Bronco history in order.', items: ['First Bronco', 'Full-size Bronco', 'Bronco II', 'Last original Bronco', 'Bronco Sport on sale'],
      why: '1966, 1978, 1984, 1996, then the 2021 model year.' },
    { type: 'tap', q: 'Rock Crawl mode clamps the rear clutches together. Which unit on your Bronco holds them?', visual: { type: 'parts', drawing: 'car-top' }, answer: 'rdu',
      why: 'The twin-clutch rear drive unit (RDU) has one clutch pack per rear wheel; clamping both hard acts like a rear locker.',
      wrong: { ptu: 'The PTU turns drive toward the rear; the clutch packs are in the RDU.', transmission: 'The transmission picks gear ratios; it doesn’t split torque between rear wheels.' } },
  ],
  cards: [
    { id: 'styles', front: 'Three off-road styles?', back: 'Rock crawling (slow, precise), desert running (fast, long travel), overlanding (self-reliant travel).' },
    { id: 'overland', front: 'What is overlanding?', back: 'Long, self-reliant travel to remote places; the vehicle is also your camp.' },
    { id: 'bronco', front: 'Bronco name dates?', back: '1966–1996, then revived for 2021 (Bronco and Bronco Sport, revealed July 13, 2020).' },
    { id: 'sport', front: 'Bronco Sport Badlands: how does it crawl without low range?', back: 'Clutch-based 4x4 Lock, twin-clutch RDU with rear lock, and software modes.' },
  ],
};
