// Risks: engines, warranty & the law
export default {
  steps: [
    { tag: 'metaphor', title: 'Spending the safety margin',
      body: [
        'An elevator rated for 10 people is built to hold far more. That gap is the **safety margin**: it covers the worn cable, the hot day, the person who jumps.',
        'A factory calibration leaves the same kind of margin for bad fuel, heat, altitude, towing and 150,000 miles of abuse.',
        'A tune spends some of it. The engineering question is **which** margin, and what it was protecting. The legal question is separate, and often decides things first.',
      ] },
    { tag: 'how', title: 'How engines get hurt',
      body: [
        '**[[knock]]**: more spark or boost than the fuel tolerates. Pressure spikes hammer pistons and ring lands; knock control can only pull so much, so fast.',
        '**[[lspi]]**: small turbo direct-injection engines can pre-ignite at **low rpm and high load**. Tunes that add big low-rpm torque push right into that zone.',
        '**Lean under boost**: if the fuel system (pump, injectors) can’t keep up with more air, the mixture leans out and temperatures soar. Often the fastest way to melt a piston.',
        '**Heat**: hotter exhaust and higher turbo speeds; more [[heat-soak]] on repeated pulls.',
      ] },
    { tag: 'bronco', title: 'The parts behind the engine', visualFirst: true,
      visual: { type: 'compare', title: 'Vivid Racing dyno, 2021 Badlands (wheel figures, tuner’s own test)',
        metrics: [{ key: 'whp', label: 'Wheel power', unit: 'whp' }, { key: 'tq', label: 'Wheel torque', unit: 'lb-ft' }],
        items: [{ name: 'Stock', values: { whp: 186, tq: 246 } }, { name: 'Vivid flash', values: { whp: 222, tq: 300 } }] },
      body: [
        'That’s **+54 lb-ft (+22%)** at the wheels flowing through the 8-speed, the [[ptu]], the driveshaft and the twin-clutch [[rdu]].',
        'Ford validated them for the rated **277 lb-ft (376 N·m)**. How much margin is left isn’t published.',
        'ECUs and transmission controllers commonly cap torque in low gears and during shifts to protect the driveline. Tunes often raise those caps, the very limit that was protecting the parts.',
      ],
      facts: ['bronco.tuneGains', 'bronco.output', 'bronco.rdu'] },
    { tag: 'law', title: 'Federal law: emissions',
      body: [
        'Clean Air Act: making, selling or installing anything that defeats emission controls on a road vehicle is illegal in **every** state: a [[defeat-device]]. “Off-road use only” doesn’t change what it does.',
        'EPA made aftermarket defeat devices a national enforcement priority (FY2020–23: 172 civil cases, $55.5 million in penalties).',
        'Sept 2024: EPA and DOJ settled with **COBB** for just over **$2.9 million**. COBB stopped selling defeat devices but kept selling tunes with CARB Executive Orders.',
      ],
      facts: ['law.epaEnforcement', 'law.cobbSettlement'] },
    { tag: 'law', title: 'California, Smog Check and readiness',
      body: [
        'In California a street tune needs a **[[carb-eo|CARB EO]]**. COBB lists EOs for its 2.0 Bronco Sport Accessport (e.g. D-660-196 for 2021–24).',
        'Since **July 2021** Smog Check reads the car’s software fingerprint ([[cal-id-cvn|CAL ID / CVN]]) and fails software that doesn’t match a stock or EO-approved configuration.',
        'Anywhere with OBD inspection: flashing usually clears codes, which resets the [[readiness-monitor|readiness monitors]]. A 2001+ car can have only **one** “not ready” and still pass, so a freshly flashed car may be turned away until it finishes its drive cycles.',
      ],
      facts: ['law.carbEo', 'bronco.cobbEo', 'law.smogSoftware', 'law.readinessRule'] },
    { tag: 'law', title: 'Warranty: what Magnuson-Moss really says',
      body: [
        'Your 2024’s factory coverage: **3 yr / 36,000 mi** bumper-to-bumper and (as found for the 2022–23 model years) **5 yr / 60,000 mi** powertrain.',
        '[[magnuson-moss|Magnuson-Moss]] (FTC): a tune can’t void the whole warranty. To deny a repair, Ford must show the modification **caused** that failure, and can deny only that repair.',
        'Reality: an engine, transmission or RDU failure on a tuned car is the easiest case for them to argue, and dealers can often detect a reflash after “return to stock”.',
      ],
      facts: ['bronco.warranty', 'law.magMoss'] },
    { tag: 'key', title: 'Questions to ask before any tune', visualFirst: true,
      visual: { type: 'checklist', title: 'Before a tune (concepts, not a to-do list)', groups: [
        { name: 'Law', items: [
          { check: 'Is it EPA-compliant, and CARB-EO’d if you’re in California?', why: 'Without that it’s a defeat device on a street car, whatever the label says.' },
          { check: 'Will it pass your state’s inspection?', why: 'Software checks and readiness monitors catch tunes and fresh flashes.' } ] },
        { name: 'Engine & driveline', items: [
          { check: 'Which octane does it assume, and can you always buy it?', why: 'A 93 tune on 87 leans on knock control to save the engine.' },
          { check: 'How much extra low-rpm torque?', why: 'That’s the LSPI zone and the driveline’s torque limits.' } ] },
        { name: 'Money', items: [
          { check: 'Is the car still under powertrain warranty?', why: 'A tuned car with a failed engine or transmission is a hard claim to win.' } ] },
      ] },
      body: [
        'Tap through. Every answer is about margin, law or money. None is about how to do it.',
        'For now the best tuning tool for your Bronco is a **read-only** one: log, decode, understand.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'A shop sells an “off-road only” tune that turns off an emissions monitor. Put on your street-driven Bronco Sport, it is…',
      options: ['Legal outside California', 'Legal if you return to stock before inspection', 'A defeat device under the federal Clean Air Act', 'Legal under Magnuson-Moss'], answer: 2,
      why: 'Federal law covers every state, and the label doesn’t change what the software does. Magnuson-Moss is warranty law and says nothing about emissions.',
      wrong: { 3: 'Magnuson-Moss only governs warranties. It doesn’t make anything emissions-legal.' } },
    { type: 'num', q: 'Under EPA guidance used by state OBD inspections, how many readiness monitors may be “not ready” on a **2024** car for it to pass?', answer: 1, tol: 0,
      why: 'Model year 2001 and newer: **one**. Since flashing usually clears codes and resets the monitors, a just-flashed car can be turned away until it’s driven enough.' },
    { type: 'mc', q: 'Your tuned Bronco’s infotainment screen dies under warranty. Under Magnuson-Moss, Ford…',
      options: ['Can refuse because the car is tuned', 'Must show the tune caused the screen failure to deny that repair', 'Must replace the engine too', 'Can void the whole warranty'], answer: 1,
      why: 'The warrantor has to show the modification caused the specific failure. A tune is a weak excuse for a screen; it’s a strong one for a melted piston.' },
    { type: 'mc', q: 'Why is big extra **low-rpm** torque especially risky on a small turbo DI engine?',
      options: ['Low rpm has no knock control', 'It’s the zone where low-speed pre-ignition (LSPI) happens, and it loads the driveline hardest', 'Turbos don’t work at low rpm', 'It isn’t risky'], answer: 1,
      why: 'LSPI shows up at low rpm and high load, and low gears multiply torque the most at the wheels. Both margins get spent at once.' },
    { type: 'mc', q: 'What does California’s Smog Check use to catch an unapproved tune?',
      options: ['Exhaust sound level', 'The software ID and fingerprint (CAL ID / CVN) the car reports over OBD', 'Horsepower on a dyno', 'The paint color'], answer: 1,
      why: 'Since July 2021 the inspection compares CAL ID / CVN against stock and CARB-EO-approved software and fails anything else as “Modified Software”.' },
  ],
  cards: [
    { id: 'engine', front: 'Three ways a tune hurts an engine?', back: 'Knock (too much spark/boost for the fuel), LSPI at low rpm/high load, lean mixture under boost.' },
    { id: 'driveline', front: 'What limit do tunes often raise that protects the driveline?', back: 'Torque caps in low gears and during shifts.' },
    { id: 'caa', front: 'Is an “off-road only” tune legal on a street car?', back: 'No. It’s a defeat device under the federal Clean Air Act, in every state.' },
    { id: 'ca', front: 'California tune rules in one line?', back: 'Needs a CARB EO; Smog Check checks CAL ID / CVN since July 2021.' },
    { id: 'mmwa', front: 'Magnuson-Moss in one line?', back: 'Ford must show the mod caused the failure to deny that repair; it can’t void the whole warranty.' },
    { id: 'monitors', front: 'Why can a fresh flash fail inspection?', back: 'Flashing clears codes and resets readiness monitors; 2001+ cars may have only one “not ready”.' },
  ],
};
