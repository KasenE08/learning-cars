// Endurance & GT racing
export default {
  steps: [
    { tag: 'metaphor', title: 'A marathon run as a relay',
      body: [
        'Imagine a 24-hour relay race where the runners swap, but the **shoes** never come off. The shoes have to survive everything.',
        'Endurance racing: drivers take turns, but the car runs all day and all night. Speed matters, but so do **reliability, fuel use and not crashing in traffic**.',
      ] },
    { tag: 'how', title: 'Le Mans and the WEC',
      body: [
        'The [[le-mans|24 Hours of Le Mans]] in France was first run in **1923**. It’s the crown jewel of the FIA World Endurance Championship (WEC).',
        'Several classes race **at the same time**. 2026 at Le Mans: **Hypercar** (18 cars), **LMP2** prototypes (19) and **LMGT3** (25).',
        'Faster cars lap slower ones constantly, so passing traffic safely is a core skill.',
      ] },
    { tag: 'how', title: 'Rules for people: stints and swaps',
      body: [
        'Each car has **two or three drivers** who swap at pit stops. One driver’s spell is a [[stint]].',
        'At Le Mans, each driver must drive at least **6 hours** total, no more than **14 hours** total, and no more than **4 hours in any 6-hour window**.',
        'Pit stops add fuel and, as needed, tires and a driver change. Night, rain and fatigue are all part of it.',
      ] },
    { tag: 'how', title: 'Balancing very different cars',
      body: [
        '[[hypercar|Hypercars]] come two ways: **LMH** cars are built from scratch (Ferrari, Toyota, Peugeot, Aston Martin); **LMDh** cars use a spec chassis base with the maker’s own engine and body (BMW, Cadillac, Alpine, Genesis).',
        '[[gt3|GT3]] cars are based on road sports cars, like a 911 or a Corvette.',
        '[[balance-of-performance|Balance of Performance]] adjusts weight, power and energy per stint so they can race closely. ~~Opinion: every team thinks BoP hurts them most.~~',
      ] },
    { tag: 'see', title: 'Le Mans milestones', visualFirst: true,
      visual: { type: 'timeline', title: 'Le Mans moments',
        events: [
          { year: 1923, title: 'First 24 Hours of Le Mans' },
          { year: 1953, title: 'Disc brakes win', note: 'Jaguar C-Type: the first disc-braked car to win Le Mans (Dunlop discs), and the first winning average over 100 mph.' },
          { year: 1966, title: 'Ford GT40 1-2-3' },
          { year: 1985, title: 'Dual-clutch races', note: 'Porsche’s PDK dual-clutch gearbox first raced in the 962 C (tested in the 956 from about 1983).' },
          { year: 2021, title: 'Hypercar class begins' },
          { year: 2026, title: 'Toyota wins by 10.9 s', note: 'The #7 Toyota beats the #20 BMW by 10.913 s, ending Ferrari’s three-year winning streak.' },
        ] },
      body: [
        'Tap the years. Two of these became normal road-car tech: **disc brakes** and **dual-clutch gearboxes**.',
      ] },
    { tag: 'why', title: 'From the track to your driveway', visualFirst: true,
      visual: { type: 'parts', drawing: 'brakes' },
      body: [
        '**Disc brakes**: drums faded at the end of the long Mulsanne Straight; Jaguar’s [[brake-rotor|discs]] stopped harder, lap after lap. Tap the rotor and caliper.',
        '**Dual-clutch gearboxes**: Porsche raced PDK in the 1980s; the first mainstream road [[dct]] came in the 2003 VW Golf R32 (DSG), and Porsche put PDK in the 911 in 2008.',
        'Endurance is the perfect test lab: 24 hours is like years of hard road use squeezed into a weekend.',
      ] },
    { tag: 'bronco', title: 'Your Bronco’s 1953 tech',
      body: [
        'Your Badlands has **4-wheel disc brakes with ABS**: the direct descendant of the C-Type’s Le Mans win.',
        'Its 8-speed is a planetary automatic with a torque converter, not a dual-clutch: Ford chose smoothness and towing over lightning shifts.',
      ],
      facts: ['bronco.brakes', 'bronco.trans'] },
  ],
  quiz: [
    { type: 'num', q: 'A Le Mans crew has three drivers. A drives **10 h**, B drives **8 h**. How many hours does C drive in the 24-hour race?', answer: 6, tol: 0, unit: 'h',
      why: '24 − 10 − 8 = **6 h**, exactly the minimum each driver must do. All three are under the 14-hour maximum.' },
    { type: 'tap', q: 'Tap the part Jaguar’s 1953 winner used instead of a **brake drum**.', visual: { type: 'parts', drawing: 'brakes' }, answer: 'rotor',
      why: 'The disc (rotor) replaced the drum. Open to the air, it sheds heat better, so it fades less lap after lap.',
      wrong: { caliper: 'The caliper squeezes the disc. The big change was the disc itself replacing the drum.', pads: 'Pads press on the disc; the key change was the disc replacing the drum.' } },
    { type: 'mc', q: 'Why does endurance racing use **Balance of Performance**?', options: ['To make the slowest car win', 'So very different designs (LMH, LMDh, different GT3 road cars) can race closely', 'To save fuel', 'Because all cars are identical'], answer: 1,
      why: 'BoP adjusts weight, power and energy so no single design route dominates. It’s always argued about.' },
    { type: 'order', q: 'Put these in order.', items: ['First Le Mans', 'First disc-braked Le Mans winner', 'Ford GT40 1-2-3', 'Hypercar class begins'],
      why: '1923 → 1953 → 1966 → 2021.' },
  ],
  cards: [
    { id: 'drivetime', front: 'Le Mans driver time limits?', back: 'At least 6 h, at most 14 h total, max 4 h in any 6-hour window.' },
    { id: 'classes', front: 'Le Mans 2026 classes?', back: 'Hypercar (LMH + LMDh), LMP2 and LMGT3, all racing at once.' },
    { id: 'lmhdh', front: 'LMH vs LMDh?', back: 'LMH: built from scratch. LMDh: spec chassis base + maker’s engine and body. Both race as Hypercars, balanced by BoP.' },
    { id: 'disc', front: 'Le Mans 1953 lesson?', back: 'Jaguar C-Type: first disc-braked winner. Discs fade less than drums.' },
    { id: 'pdk', front: 'Dual-clutch from racing to road?', back: 'Porsche PDK raced in the 962 (1985) → VW Golf R32 DSG (2003) → 911 PDK (2008).' },
  ],
};
