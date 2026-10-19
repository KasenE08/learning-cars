// Cars vs bikes: what changes
export default {
  steps: [
    { tag: 'metaphor', title: 'Pack mule vs sprinter',
      body: [
        'Your Bronco’s engine is a **pack mule with big lungs**: 2 liters, a turbo, lots of torque low down, hauling about 3,700 lb.',
        'A bike engine is a **sprinter**: under half a liter, no turbo, spins almost twice as fast, and pushes a machine that weighs less than 400 lb.',
        'Same four strokes, same physics. Everything else (size, revs, how power reaches the ground) gets rearranged around that difference.',
      ] },
    { tag: 'see', title: 'Three engines side by side', visualFirst: true,
      visual: { type: 'compare', title: 'Bronco Sport vs your two bikes', metrics: [
        { key: 'cc', label: 'Displacement', unit: 'cc' },
        { key: 'hp', label: 'Peak power', unit: 'hp' },
        { key: 'rpm', label: 'Peak-power rpm', unit: 'rpm' },
        { key: 'lb', label: 'Curb weight', unit: 'lb' },
      ], items: [
        { name: 'Bronco Sport Badlands', note: '2.0 L turbo I-4', values: { cc: 1999, hp: 250, rpm: 5500, lb: 3710 } },
        { name: 'Ninja 500', note: '180° twin', values: { cc: 451, hp: 45, rpm: 9000, lb: 377 } },
        { name: 'RS 457', note: '270° twin, kerb weight', values: { cc: 457, hp: 47, rpm: 9400, lb: 386 } },
      ] },
      body: [
        'Each bike has about **¼ of the Bronco’s displacement** and under ⅕ of its power, but only about **1/10 of the weight**.',
        'Peak power arrives at **9,000–9,400 rpm** on the bikes vs **5,500 rpm** on the Bronco. Revs are how a small engine makes useful power.',
        '~~Bike hp here is converted from the claimed kW: 33.4 kW ≈ 45 hp, 35 kW ≈ 47 hp.~~',
      ] },
    { tag: 'how', title: 'Everything lives in one case',
      body: [
        'Car: engine → bellhousing → separate transmission with its **own fluid**. Bike: crank, clutch and gearbox share **one set of cases** ([[unit-construction]]).',
        'On your two bikes the gearbox and the [[wet-dry-clutch|wet clutch]] bathe in the **same engine oil**. One oil does three jobs.',
        'A [[primary-drive]] gear pair links the crank to the clutch and slows it down (Ninja 500: about 2:1).',
        'The engine can also be part of the frame: the RS 457’s aluminum frame uses it as a [[stressed-member]].',
      ] },
    { tag: 'see', title: 'Find the drivetrain', visualFirst: true,
      visual: { type: 'parts', drawing: 'moto-side' },
      body: [
        'Tap **engine**, **clutch**, **gearbox** and **chain**. That’s the whole power path, packed into the middle of the bike.',
        'The radiator sits behind the front wheel and the airbox under the tank: same jobs as on the Bronco, squeezed into a fraction of the space.',
      ] },
    { tag: 'how', title: 'What the drivetrain drops',
      body: [
        '**Clutch on a hand lever**, not a pedal. **Shifting with your left foot**, one gear at a time (a [[sequential-gearbox]]).',
        '**No differential**: one driven wheel, so nothing has to split torque between two tires. **No reverse** on bikes this size.',
        '**Chain final drive** instead of a driveshaft, [[ring-and-pinion]] and axles. Cheap, light, efficient, and the ratio is easy to change.',
      ] },
    { tag: 'math', title: 'Pounds per horsepower',
      body: [
        '[[power-to-weight]] as lb per hp (lower = quicker): **Bronco** 3,710 ÷ 250 ≈ **14.8 lb/hp**.',
        '**Ninja 500** 377 ÷ 45 ≈ **8.4 lb/hp**. **RS 457** 386 ÷ 47 ≈ **8.2 lb/hp**.',
        'Add a 170 lb (77 kg) rider: Ninja ≈ 12.2 lb/hp, Bronco ≈ 15.5. On a bike the rider is a **big** share of the mass; in the truck you barely count.',
      ] },
    { tag: 'bikes', title: 'Your two bikes, by the numbers',
      body: [
        '**Ninja 500**: 451 cc liquid-cooled DOHC twin, 70.0 × 58.6 mm, claimed 45 PS @ 9,000 rpm, 171 kg (377 lb) curb.',
        '**RS 457**: 457 cc liquid-cooled twin, 69.0 × 61.1 mm, claimed 47.6 PS @ 9,400 rpm, 175 kg (386 lb) kerb.',
        'Both sit at or just under **35 kW**, the European A2 license cap. Makers build this class around that rule.',
      ],
      facts: ['ninja.engine', 'ninja.output', 'ninja.weight', 'rs457.engine', 'rs457.output', 'rs457.weight', 'rs457.chassis'] },
  ],
  quiz: [
    { type: 'order', q: 'Order the power path on your bikes, from crank to tire.', items: ['Crankshaft', 'Primary gears', 'Wet clutch', 'Gearbox', 'Front sprocket', 'Chain', 'Rear sprocket and wheel'],
      why: 'The crank drives the clutch basket through the primary gears, the clutch feeds the gearbox input, and the gearbox output carries the front sprocket that pulls the chain.' },
    { type: 'mc', q: 'Why doesn’t a motorcycle need a differential?', options: ['Chains are flexible enough to absorb it', 'Only one wheel is driven, so there’s nothing to split', 'The slipper clutch does the job', 'Bikes never turn sharply enough'], answer: 1,
      why: 'A differential lets two driven wheels on one axle turn at different speeds in a corner. A bike drives a single rear wheel.',
      wrong: { 2: 'A slipper clutch only slips under engine-braking torque. It has nothing to do with cornering speed differences.' } },
    { type: 'tap', q: 'Tap the part that holds the 6-speed gears.', visual: { type: 'parts', drawing: 'moto-side' }, answer: 'gearbox',
      why: 'The gearbox sits behind the crank inside the same engine cases (unit construction). Its output shaft carries the front sprocket.',
      wrong: { clutch: 'Close: the clutch is right next to it, under the round cover on the right, and feeds the gearbox input shaft.', engine: 'The cylinders and crank. The gearbox lives in the same cases, just behind the crank.' } },
    { type: 'mc', q: 'What does the engine oil do on the Ninja 500 that it doesn’t do in the Bronco?', options: ['Cool the turbo', 'Also lubricate the gearbox and bathe the clutch', 'Run the variable cam timing', 'Nothing; it’s the same job'], answer: 1,
      why: 'Unit construction with a wet clutch means one oil serves engine, gearbox and clutch. The Bronco’s 8-speed automatic has its own fluid.' },
  ],
  cards: [
    { id: 'unit', front: 'Unit construction?', back: 'Engine, clutch and gearbox in one set of cases, usually sharing one oil.' },
    { id: 'path', front: 'Bike power path, crank to wheel?', back: 'Crank → primary gears → wet clutch → gearbox → front sprocket → chain → rear sprocket.' },
    { id: 'nodiff', front: 'What bike drivetrains skip?', back: 'Differential, driveshaft, axles and reverse. One driven wheel, chain final drive.' },
    { id: 'lbhp', front: 'Lb per hp: Bronco vs Ninja 500?', back: '≈14.8 vs ≈8.4 (without rider).' },
    { id: 'a2', front: 'Why do both bikes make about 35 kW?', back: 'It’s the European A2 license power cap; both sit at or just under it (Ninja 33.4 kW, RS 457 35 kW).' },
  ],
};
