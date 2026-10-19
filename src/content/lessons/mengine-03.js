// High revs & specific output
export default {
  steps: [
    { tag: 'metaphor', title: 'Short, quick steps',
      body: [
        'A tall walker covers ground with **long, slow strides**. A sprinter takes **short, fast** ones and still goes faster.',
        'An engine’s stride is its [[stroke]]. Bike engines take short strides, and lots of them: peak power near **9,000+ rpm**, vs 5,500 in your Bronco.',
        'Revving is the bike’s substitute for size and boost.',
      ] },
    { tag: 'how', title: 'Why small engines must rev',
      body: [
        'Power = torque × rpm (`hp = lb-ft × rpm ÷ 5252`). If you can’t raise one, raise the other.',
        'A [[naturally-aspirated]] engine can only fill its cylinders about once per cycle, so its **torque per liter is nearly fixed**: Ninja 500 ≈ 94 N·m/L, RS 457 ≈ 95 N·m/L.',
        'The Bronco’s turbo crams in extra air: 376 N·m from 2.0 L ≈ **188 N·m/L**. No boost on the bikes, so the only lever left is **rpm**.',
      ] },
    { tag: 'see', title: 'Two bike dynos', visualFirst: true,
      visual: { type: 'dyno', engine: 'compare' },
      body: [
        'Drag the rpm cursor. Torque peaks mid-range (6,000 / 6,700 rpm), then fades, but power keeps climbing because rpm is still rising faster than torque falls.',
        'Curve shapes are illustrative; the peaks are the makers’ claims.',
      ] },
    { tag: 'how', title: 'What lets an engine rev',
      body: [
        '**Short stroke**: less distance per revolution, so lower [[mean-piston-speed]] at the same rpm. Both bikes are [[oversquare]] (bore bigger than stroke).',
        '**Small, light pistons**: the force to stop and restart the [[reciprocating-mass]] grows with **rpm²**. Double the rpm = 4× the load on rods and bearings.',
        '**Light valvetrain**: [[dohc]], 4 small valves per cylinder, light buckets or [[finger-follower|finger followers]]. Light parts let the [[valve-spring]] keep the valve on the cam without [[valve-float]].',
        'The ECU’s [[redline|rev limiter]] sits just below where those loads, or the breathing, run out.',
      ] },
    { tag: 'math', title: 'Piston speed: bike vs Bronco',
      body: [
        'Mean piston speed = `2 × stroke × rpm ÷ 60`.',
        '**Ninja 500** at 9,000 rpm: 2 × 0.0586 m × 9,000 ÷ 60 ≈ **17.6 m/s**. **Bronco** at 5,500 rpm: 2 × 0.0831 × 5,500 ÷ 60 ≈ **15.2 m/s**.',
        'Near their limits: Ninja at ~11,000 rpm ≈ 21.5 m/s; Bronco at ~6,500 rpm ≈ 18.0 m/s. The short stroke lets the bike spin ~70% faster for a modestly higher piston speed.',
      ] },
    { tag: 'math', title: 'Specific output (hp per liter)',
      body: [
        '[[specific-output]] = power ÷ liters. **Ninja 500**: 45 hp ÷ 0.451 L ≈ **99 hp/L**. **RS 457**: 47 hp ÷ 0.457 L ≈ **103 hp/L**.',
        '**Bronco Sport**: 250 ÷ 2.0 ≈ **125 hp/L**, thanks to boost. So per liter, your truck actually beats your bikes.',
        'Liter-class superbikes claim around **200 hp from 1,000 cc**: same tricks, pushed to 13,000+ rpm with no A2 cap. The bikes win on **power-to-weight**, not per liter.',
      ] },
    { tag: 'bikes', title: 'Redlines and the Ninja 400 lesson',
      body: [
        '**Redlines** (no maker publishes one; reviews disagree): Ninja 500 ≈ **11,000–11,700 rpm**, RS 457 ≈ **10,500–10,700 rpm**.',
        'The Ninja 500 is a stretched **Ninja 400**: same 70.0 mm bore, stroke 51.8 → 58.6 mm. Peak power stayed 45 PS but moved **down** from 10,000 to 9,000 rpm, and torque rose from 37.0 to 42.6 N·m.',
        'Longer stroke = more torque, a lower rev ceiling. Kawasaki traded top-end rpm for midrange, which is easier to use on the street.',
      ],
      facts: ['ninja.redline', 'rs457.redline', 'ninja.vs400', 'ninja.boreStroke', 'rs457.boreStroke'] },
  ],
  quiz: [
    { type: 'mc', q: 'Why does a small naturally aspirated engine need high rpm to make big power?', options: ['High rpm burns more octane', 'Torque per liter is nearly fixed without boost, so power has to come from rpm', 'Bikes have no flywheel', 'Chains only work at high rpm'], answer: 1,
      why: 'Without forced induction an engine can’t fill its cylinders much more than once per cycle. Power = torque × rpm, so rpm is the lever left.' },
    { type: 'order', q: 'Order by specific output, **lowest** hp per liter first.', items: ['Ninja 500 (≈99 hp/L)', 'RS 457 (≈103 hp/L)', 'Bronco Sport 2.0 turbo (≈125 hp/L)', 'Liter superbike (≈200 hp/L)'],
      why: 'The bikes are around 100 hp/L, boost lifts the Bronco to ~125, and superbikes reach ~200 by revving far higher with no license cap.' },
    { type: 'tap', q: 'Tap the part that must close the valve fast enough to prevent valve float at high rpm.', visual: { type: 'parts', drawing: 'head' }, answer: 'spring',
      why: 'The valve spring snaps the valve shut. Lighter valves and followers make its job easier, which is why rev-happy engines obsess over valvetrain weight.',
      wrong: { bucket: 'The bucket transfers the cam’s push. Its weight matters, but the spring does the closing.' } },
    { type: 'mc', q: 'The Ninja 500 kept the Ninja 400’s bore but lengthened the stroke. What happened?', options: ['More peak power at higher rpm', 'Same peak power at lower rpm, with more torque', 'Less torque, higher redline', 'Nothing measurable'], answer: 1,
      why: 'Both claim 45 PS, but the 500 makes it at 9,000 rpm instead of 10,000 and torque rises from 37.0 to 42.6 N·m. Longer stroke trades revs for midrange.' },
  ],
  cards: [
    { id: 'why', front: 'Why do bike engines rev so high?', back: 'No boost → torque per liter is capped → power must come from rpm. Short stroke and light parts make it survivable.' },
    { id: 'rpm2', front: 'How do piston inertia loads scale with rpm?', back: 'With rpm²: double the rpm, 4× the force.' },
    { id: 'mps', front: 'Mean piston speed formula?', back: '2 × stroke × rpm ÷ 60 (stroke in meters → m/s).' },
    { id: 'hpl', front: 'Specific output: Ninja 500, RS 457, Bronco?', back: '≈99, ≈103 and ≈125 hp/L (the Bronco has a turbo).' },
    { id: 'redlines', front: 'Approximate redlines of your two bikes?', back: 'Ninja 500 ≈11,000–11,700 rpm; RS 457 ≈10,500–10,700 rpm (sources disagree).' },
  ],
};
