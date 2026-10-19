// Readiness monitors
export default {
  steps: [
    { tag: 'metaphor', title: 'A report card with blank boxes',
      body: [
        'Imagine a report card where some subjects are graded every day and others only after a specific exam that runs on certain days.',
        'Until that exam happens, the box says **“not tested yet”**: not pass, not fail, just blank.',
        '[[readiness-monitor|Readiness monitors]] are those boxes. The PCM reports which emissions self-tests have finished since codes were last cleared.',
      ] },
    { tag: 'see', title: 'The monitors on a gasoline car', visualFirst: true,
      visual: { type: 'checklist', title: 'OBD-II readiness monitors (gasoline)', groups: [
        { name: 'Continuous (always running)', items: [
          { check: 'Misfire', why: 'Watches crankshaft speed for the tiny dip a misfiring cylinder causes.' },
          { check: 'Fuel system', why: 'Watches fuel trims: how hard the PCM is correcting the mixture.' },
          { check: 'Comprehensive components', why: 'Checks sensors and outputs for open, shorted or out-of-range circuits.' },
        ] },
        { name: 'Non-continuous (need the right conditions)', items: [
          { check: 'Catalyst', why: 'Compares the O2 sensors before and after the cat to grade its oxygen storage.' },
          { check: 'EVAP', why: 'Seals the fuel-vapor system and checks it holds pressure or vacuum (leak test).' },
          { check: 'O2 sensor and O2 heater', why: 'Checks the sensors switch fast enough and their heaters work.' },
          { check: 'EGR / VVT, secondary air, heated cat', why: 'Only on engines that have these; otherwise reported “not supported”.' },
        ] },
      ] },
      body: [
        'Tap each to see what it tests. [[continuous-monitor|Continuous vs non-continuous]] is the key split.',
      ] },
    { tag: 'how', title: 'Why some monitors take a while',
      body: [
        'Each non-continuous monitor has **enable conditions**: e.g. fully warm engine, steady cruise for a while, a cold start after hours parked, fuel tank between certain levels for EVAP.',
        'They run at most once per [[drive-cycle]], only if those conditions happen. Short trips may never set some of them.',
        '**“Ready” means the test ran, not that it passed.** A failure shows up as a code instead.',
        'The status lives in Mode 01 **PID 01** (bytes B–D), next to the MIL bit and code count.',
      ] },
    { tag: 'why', title: 'What resets them, and why inspectors care',
      body: [
        'Clearing codes (Mode 04), a dead or disconnected battery, or reprogramming the PCM sets every non-continuous monitor back to **not ready**.',
        'That’s why clearing codes right before an inspection fails: the station reads readiness. EPA guidance: 1996–2000 cars may have **2** not ready; **2001+** only **1**.',
        '[[permanent-dtc|Permanent codes]] close the other loophole: the code stays visible until the car itself re-runs the test and passes.',
        'The honest path after a repair: drive normally until the monitors complete, then test.',
      ],
      facts: ['law.readinessRule', 'law.permanentDtc'] },
    { tag: 'bronco', title: 'Your Bronco Sport at an inspection',
      body: [
        'In states with OBD inspections, the station plugs into your port and reads the MIL, codes and readiness through Ford’s gateway.',
        'Ford’s 22N15 program reprogrammed the gateway (GWM) on certain 2021–23 Bronco Sports because it **“may not properly communicate with Inspection and Maintenance (I/M) emissions equipment.”** Proof that the gateway sits between the tester and the PCM.',
        'Not listed for 2024 in that bulletin. Monitor enable conditions for your engine are Ford-specific and not public.',
      ],
      facts: ['bronco.obdGateway'] },
  ],
  quiz: [
    { type: 'tap', q: 'Tap the sensor the **catalyst monitor** relies on to grade the cat.', visual: { type: 'parts', drawing: 'exhaust' }, answer: 'o2-down',
      why: 'A healthy cat smooths out oxygen swings, so the downstream O2 signal stays steady. If it starts copying the upstream sensor, the cat is failing (P0420).',
      wrong: { 'o2-up': 'The upstream sensor is half of the comparison and runs fuel control, but the downstream one shows what the cat did.', cat: 'That’s the cat itself. It has no sensor of its own; it’s graded by the O2 sensors around it.' } },
    { type: 'mc', q: 'A monitor shows **“ready”**. What does that mean?',
      options: ['The system passed', 'The self-test has run since codes were last cleared', 'The car is ready to drive', 'No codes are stored'], answer: 1,
      why: '“Ready” = completed, not passed. A failed test sets a code instead; the monitor can still report ready.' },
    { type: 'order', q: 'Order what happens after someone clears codes.',
      items: ['Mode 04 clears codes', 'Non-continuous monitors show not ready', 'The car is driven through the right conditions', 'Monitors complete and show ready'],
      why: 'Clearing resets the non-continuous monitors. Only real driving that meets each monitor’s enable conditions sets them ready again.' },
    { type: 'mc', q: 'Which monitor is **continuous**?',
      options: ['Catalyst', 'EVAP', 'Misfire', 'O2 sensor heater'], answer: 2,
      why: 'Misfire, fuel system and comprehensive components run all the time. Catalyst, EVAP and O2 tests need specific conditions.' },
  ],
  cards: [
    { id: 'ready', front: 'Readiness monitor “ready” means?', back: 'The self-test has run since the last clear. Not necessarily passed.' },
    { id: 'cont', front: 'The three continuous monitors?', back: 'Misfire, fuel system, comprehensive components.' },
    { id: 'reset', front: 'What resets readiness monitors?', back: 'Clearing codes (Mode 04), battery disconnect, PCM reprogramming.' },
    { id: 'rule', front: 'How many “not ready” monitors does EPA guidance allow?', back: '1996–2000 cars: 2. 2001 and newer: 1. (States set their own rules.)' },
  ],
};
