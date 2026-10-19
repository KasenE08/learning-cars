// Maps: fuel, timing, boost
export default {
  steps: [
    { tag: 'metaphor', title: 'A shipping-rate chart',
      body: [
        'A shipping chart: weight down the side, distance across the top, price in each box. Nobody computes a formula; you look it up.',
        'If your package is between two rows, you estimate a price **in between**.',
        'An ECU runs on hundreds of charts like that. Tuners call them **maps**: [[map-table|tables]] indexed by **rpm × load**, with [[interpolation]] between the boxes.',
      ] },
    { tag: 'see', title: 'A spark map', visualFirst: true,
      visual: { type: 'ecumap', map: 'ignition', editable: true },
      body: [
        'Rows and columns are the table’s **breakpoints** (rpm across, [[engine-load|load]] down). Each cell is degrees of [[spark-advance]].',
        'Watch the operating point move: the ECU blends the four surrounding cells. Try adding timing to a cell: torque rises, then the knock margin runs out.',
        '**Illustrative numbers**, not a real calibration.',
      ] },
    { tag: 'how', title: 'Why tables, and which ones',
      body: [
        'Combustion is too messy for one clean formula, so engineers **measure** on a dyno and store the results. Tables are fast to look up and easy to tune.',
        '**Load** means how full the cylinders are with air (air mass per cycle compared with the most they can hold), not throttle position. A turbo engine can exceed 100%.',
        'Typical maps: base **spark**, **knock-limited spark**, target **lambda** (fuel), **boost target**, cam timing, torque limits, and many corrections for coolant and intake temperature.',
        'Modern ECUs are **torque-based**: the pedal asks for torque, and the ECU picks throttle, boost and spark to deliver it.',
      ] },
    { tag: 'math', title: 'Interpolation: reading between cells',
      body: [
        'Spark at 2,000 rpm = **14°**, at 3,000 rpm = **20°**. At 2,500 rpm?',
        'Fraction of the way: `(2500 − 2000) ÷ (3000 − 2000) = 0.5`. Value: `14 + 0.5 × (20 − 14) = 17°`.',
        'Two axes ([[interpolation|bilinear]]): blend along rpm in the row above and the row below, then blend those two along load.',
        'Without it, spark would jump in steps every time you crossed a cell line. You’d feel it.',
      ] },
    { tag: 'code', title: 'Look up a map row',
      body: [
        'One row of an **illustrative** spark map. Write the lookup the ECU does thousands of times a second.',
      ],
      code: {
        id: 'tune-02-interp',
        prompt: 'Fill in the two blanks in `lookup(xs, ys, x)`: how far between the two breakpoints `x` is, then the blended value.',
        starter: `RPM = [1000, 2000, 3000, 4000, 5000]
SPARK = [10, 14, 20, 24, 26]  # deg

def lookup(xs, ys, x):
    # outside the table: hold the end
    if x <= xs[0]:
        return ys[0]
    if x >= xs[-1]:
        return ys[-1]
    # find the cell x is in
    i = 0
    while xs[i + 1] < x:
        i += 1
    x0, x1 = xs[i], xs[i + 1]
    y0, y1 = ys[i], ys[i + 1]
    # 0.0 at x0 ... 1.0 at x1
    frac = ___
    return ___

print(lookup(RPM, SPARK, 2500))
`,
        tests: [
          { name: '2,500 rpm sits halfway: 17°', code: 'v = lookup(RPM, SPARK, 2500)\nassert abs(v - 17) < 1e-9, f"got {v!r}"' },
          { name: 'Exactly on a breakpoint: 3,000 rpm → 20°', code: 'v = lookup(RPM, SPARK, 3000)\nassert abs(v - 20) < 1e-9, f"got {v!r}"' },
          { name: '3,250 rpm → 21°', code: 'v = lookup(RPM, SPARK, 3250)\nassert abs(v - 21) < 1e-9, f"got {v!r}"' },
          { name: 'Off the ends it holds 10° and 26°', code: 'a = lookup(RPM, SPARK, 600)\nb = lookup(RPM, SPARK, 7000)\nassert (a, b) == (10, 26), f"got {(a, b)!r}"' },
        ],
        hints: [
          'How far x is past x0, divided by the width of the cell.',
          '`frac = (x - x0) / (x1 - x0)`. Then start at y0 and add that fraction of the step to y1.',
          '`return y0 + frac * (y1 - y0)`',
        ],
        solution: `RPM = [1000, 2000, 3000, 4000, 5000]
SPARK = [10, 14, 20, 24, 26]  # deg

def lookup(xs, ys, x):
    # outside the table: hold the end
    if x <= xs[0]:
        return ys[0]
    if x >= xs[-1]:
        return ys[-1]
    # find the cell x is in
    i = 0
    while xs[i + 1] < x:
        i += 1
    x0, x1 = xs[i], xs[i + 1]
    y0, y1 = ys[i], ys[i + 1]
    # 0.0 at x0 ... 1.0 at x1
    frac = (x - x0) / (x1 - x0)
    return y0 + frac * (y1 - y0)

print(lookup(RPM, SPARK, 2500))
`,
      } },
    { tag: 'how', title: 'Feedback on top of the maps',
      body: [
        '**Fuel**: the map gives a target [[lambda]]; the upstream [[o2-sensor]] reports what really happened; [[fuel-trim|fuel trims]] correct the difference. That’s [[closed-loop]] fueling.',
        'At full throttle many ECUs run **richer than λ = 1** on purpose: extra fuel cools the chamber and the turbo. Less feedback, more table.',
        '**[[knock-control]]**: the knock sensor hears a ping → that cylinder’s spark is pulled back a few degrees → crept back up while it stays quiet. The ECU learns how much to keep pulling.',
        '**Boost**: a target table, a MAP sensor measuring actual boost, and the wastegate moved to close the gap.',
      ] },
    { tag: 'bronco', title: 'Your 2.0 EcoBoost’s maps', visualFirst: true,
      visual: { type: 'ecumap', map: 'boost' },
      body: [
        'Single **[[twin-scroll]]** turbo, direct injection, [[wastegate]] under PCM control: boost is a **software target**, which is why tunes gain so much (see [[ecu-tune|Tunes]]).',
        'Owner logs on the same engine show about **16 psi (1.1 bar)** peak; Ford doesn’t publish a figure.',
        'Ford’s manual (as quoted by owners): 87 octane minimum, premium recommended for best performance. On premium, knock control has to pull less spark, so the engine can run nearer its best timing.',
        'Ford’s real tables aren’t public; every map here is illustrative.',
      ],
      facts: ['bronco.turboType', 'bronco.wastegate', 'bronco.peakBoost', 'bronco.fuel'] },
  ],
  quiz: [
    { type: 'order', q: 'Put knock control in order.',
      items: ['Knock sensor picks up ringing after a cylinder fires', 'ECU flags knock on that cylinder', 'Spark on that cylinder is retarded a few degrees', 'Advance creeps back while it stays quiet', 'ECU learns a correction for next time'],
      why: 'Hear it, pin it to a cylinder, retard, recover slowly, learn. The retard is fast and the recovery slow, so the engine spends little time knocking.' },
    { type: 'mc', q: 'What does **load** mean on a map axis?',
      options: ['Throttle position', 'How full the cylinders are with air', 'Vehicle weight', 'Battery current'], answer: 1,
      why: 'Load is air mass per cycle relative to the cylinder’s capacity. Throttle position is only the driver’s request; boost can push load past 100%.' },
    { type: 'mc', q: 'Why do many ECUs leave strict λ = 1 control at wide-open throttle?',
      options: ['O2 sensors turn off', 'Richer mixtures cool the chamber and turbo, protecting parts', 'To save fuel', 'The cat needs extra oxygen'], answer: 1,
      why: 'Extra fuel absorbs heat as it evaporates, lowering combustion and exhaust temperatures. It costs efficiency and emissions, so it’s used only under heavy load.' },
  ],
  cards: [
    { id: 'map', front: 'What is an ECU “map”?', back: 'A table indexed by rpm × load (or other axes); the ECU looks up and interpolates.' },
    { id: 'interp', front: 'Linear interpolation formula?', back: 'frac = (x − x0) ÷ (x1 − x0); y = y0 + frac × (y1 − y0).' },
    { id: 'load', front: 'Engine load?', back: 'Cylinder air filling relative to capacity, not throttle position. Turbos exceed 100%.' },
    { id: 'closed', front: 'Closed-loop fueling?', back: 'Target lambda from a table, O2 sensor feedback, fuel trims correct the error.' },
    { id: 'knock', front: 'Knock control in one line?', back: 'Detect knock per cylinder, retard spark quickly, advance back slowly, learn.' },
  ],
};
