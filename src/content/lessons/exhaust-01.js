// Manifolds & headers
export default {
  steps: [
    { tag: 'metaphor', title: 'Doors bursting open into a hallway',
      body: [
        'Each time an exhaust valve opens, hot gas bursts out like a crowd shoving through a door: a **pressure pulse**.',
        'The pipes right after the valves are the hallways where those crowds merge.',
        'Design the hallways well and each rush **helps pull** the next room empty. Design them badly and the crowds collide.',
      ] },
    { tag: 'see', title: 'The exhaust path', visualFirst: true,
      visual: { type: 'parts', drawing: 'exhaust' },
      body: [
        'Tap each part. This lesson is about the first one: the [[exhaust-manifold]], which collects gas from every exhaust port.',
        'On a turbo engine like your Bronco’s, the manifold feeds the **turbine** first. Everything after it comes in the next lessons.',
      ] },
    { tag: 'how', title: 'Manifold vs header',
      body: [
        '**Cast manifold**: thick cast iron (or cast into the head). Compact, durable, cheap, and warms up fast, so the catalytic converter starts working sooner.',
        '**[[header|Headers]]**: separate steel tubes, one per cylinder, that merge in a [[collector]]. Smoother flow, lighter, more expensive.',
        '**4-1** headers: all four tubes meet at once (best at high rpm). **4-2-1**: pairs first, then one. On a 1-3-4-2 engine the pairs are 1 & 4 and 2 & 3, cylinders that fire 360° apart (strong midrange).',
      ] },
    { tag: 'how', title: 'Scavenging and equal length',
      body: [
        'Each pulse is a high-pressure blast followed by a **low-pressure** dip. Time that dip to reach the next cylinder’s port during [[valve-overlap]] and it **sucks** leftover exhaust out: [[scavenging]].',
        'Pressure waves travel at the speed of sound and bounce back at the collector, so **tube length tunes the rpm** where this helps. It works in a band, not everywhere.',
        '[[header|Equal-length headers]] give every cylinder the same help and spread pulses evenly at the collector. Unequal lengths make an off-beat rhythm (the old Subaru rumble).',
      ] },
    { tag: 'why', title: 'The back-pressure myth',
      body: [
        '“Engines need [[back-pressure]]” is wrong. Back-pressure is resistance the pistons have to push against; less of it is never a problem by itself.',
        'What *is* true: pipes that are too big slow the gas down and weaken scavenging, so low-rpm torque can drop. People blamed that on missing back-pressure.',
        'Turbo twist: pressure **before** the turbine is what spins the turbo (the engine pays for it). Restriction **after** the turbine just hurts.',
      ] },
    { tag: 'bronco', title: 'Your Bronco: manifold in the head',
      body: [
        'Ford’s 2.0 EcoBoost is reported to have its exhaust manifold **cast into the cylinder head**, bolted straight to the turbo. Not confirmed for your exact engine.',
        'Why do that: the coolant in the head pulls heat from the manifold, so exhaust reaching the turbo runs cooler, the engine warms up faster, and there’s a short path for pulses to hit the turbine.',
        'If so, there’s no separate manifold to swap for “headers”: the first bolt-on part is the turbo itself.',
      ],
      facts: ['bronco.engine', 'bronco.exhaustManifold'] },
  ],
  quiz: [
    { type: 'tap', q: 'Tap the part that collects exhaust from every cylinder.', visual: { type: 'parts', drawing: 'exhaust' }, answer: 'manifold',
      why: 'The exhaust manifold (or header) bolts to the head and gathers every exhaust port into one pipe.',
      wrong: { turbine: 'The turbine comes right after the manifold on a turbo engine; it doesn’t collect from the ports.', muffler: 'The muffler is near the back. It quiets the sound.' } },
    { type: 'num', q: 'An inline-4 at **3,000 rpm**: how many exhaust pulses per **second** leave the engine in total?', answer: 100, tol: 0, unit: 'per second',
      hint: 'An I4 fires twice per crank revolution.', why: '3,000 ÷ 60 = 50 rev/s × 2 pulses per rev = **100 pulses per second**.' },
    { type: 'mc', q: 'What is scavenging?', options: ['Cleaning carbon out of the exhaust', 'A low-pressure wave helping pull exhaust out of a cylinder during valve overlap', 'Adding back-pressure for torque', 'Recycling exhaust into the intake'], answer: 1,
      why: 'A pulse’s low-pressure dip, timed to arrive during overlap, helps empty the next cylinder and draw in fresh charge.',
      wrong: { 3: 'That’s EGR (exhaust gas recirculation), a different system.' } },
    { type: 'mc', q: 'An engine lost low-rpm torque after getting a much bigger exhaust. The most accurate explanation?', options: ['It needed back-pressure', 'Slower gas speed weakened scavenging at low rpm', 'The cat stopped working', 'The muffler was too quiet'], answer: 1,
      why: 'Back-pressure itself never helps. Oversized pipes slow the gas, so the pulse timing that helped at low rpm is lost.',
      wrong: { 0: 'That’s the myth. Back-pressure is resistance; the loss came from weaker gas speed and scavenging.' } },
    { type: 'order', q: 'Put the path of exhaust gas in order on a header-equipped engine.', items: ['Exhaust valve', 'Exhaust port (in the head)', 'Header tube', 'Collector', 'Rest of the exhaust'],
      why: 'Valve → port in the head → its own header tube → tubes merge in the collector → the rest of the system.' },
  ],
  cards: [
    { id: 'manifold', front: 'Cast manifold vs header?', back: 'Manifold: compact, durable, warms fast. Header: separate tubes into a collector, better flow.' },
    { id: 'scavenge', front: 'Scavenging?', back: 'A pulse’s low-pressure dip helps pull exhaust from the next cylinder during overlap.' },
    { id: 'equal', front: 'Why equal-length headers?', back: 'Every cylinder gets the same scavenging; pulses arrive evenly at the collector.' },
    { id: 'myth', front: 'Do engines need back-pressure?', back: 'No. Too-big pipes lose gas speed and scavenging, which is what really costs low-end torque.' },
    { id: 'pairs', front: '4-2-1 header pairs on a 1-3-4-2 engine?', back: '1 & 4 and 2 & 3: cylinders that fire 360° apart.' },
  ],
};
