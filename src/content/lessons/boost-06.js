// Blow-off & bypass valves
export default {
  steps: [
    { tag: 'metaphor', title: 'A fan blowing at a slammed door',
      body: [
        'A big fan blows down a hallway. Someone slams the door at the end. The air has nowhere to go, so it piles up and **bounces back** at the fan.',
        'When you lift off the gas, the throttle is that door, and the still-spinning turbo is the fan.',
        'The fix: a side door that pops open the instant the main one shuts.',
      ] },
    { tag: 'how', title: 'Why lifting off is a problem',
      body: [
        'Under boost the turbo spins at 100,000+ rpm. Lift off and the throttle snaps shut in a split second; the turbo can’t stop that fast.',
        'The compressor keeps pushing air into a dead end. Pressure between the compressor and throttle spikes while flow collapses.',
        'Air tries to go **backward** through the compressor in rapid pulses: [[compressor-surge]], the “stu-tu-tu” flutter.',
        'Surge slows the wheel (more lag when you get back on it) and hammers the thrust bearing and blades.',
      ] },
    { tag: 'see', title: 'Snap the throttle shut', visualFirst: true,
      visual: { type: 'turbo', bov: true },
      body: [
        'Build boost, then drop the throttle to zero. Watch the valve open and vent the trapped pressure.',
        'The valve opens on **manifold vacuum**: once the throttle closes, the manifold side drops below atmospheric, and that pull (plus boost on the other side) lifts the valve off its spring.',
      ] },
    { tag: 'how', title: 'Vent it or recirculate it',
      body: [
        '[[blow-off-valve]] (BOV): dumps the air to the atmosphere. Loud “pssh”. Popular with tuners.',
        '[[bypass-valve]] (recirculating, or diverter): sends it back to the compressor **inlet**. Quiet; the air stays in the system.',
        'Why factory cars recirculate: on a **MAF** car the sensor already measured that air before the turbo, and the ECU fueled for it. Vent it and that fuel has no air: the engine runs **rich** for a moment and can stumble or even stall.',
        'Cars that meter air only by manifold pressure (speed-density) mind venting less. Many modern bypass valves are **electronic**: an ECU-switched valve bolted to the compressor housing.',
      ] },
    { tag: 'bronco', title: 'Yours recirculates',
      body: [
        'The 2.0 EcoBoost uses an **electronic diverter (bypass) valve** that routes air back to the turbo inlet, per the aftermarket makers whose parts replace it.',
        'So you won’t hear a “pssh” from a stock Bronco Sport: the trapped boost goes quietly back into the turbo’s inlet.',
        'Aftermarket vent-to-atmosphere and dual-port valves exist for it. Whether they upset the 2.0’s fueling depends on how its PCM meters air, which isn’t confirmed here.',
      ],
      note: 'Bypass-valve type is from aftermarket fitment listings, not Ford’s workshop manual.',
      facts: ['bronco.bypassValve'] },
  ],
  quiz: [
    { type: 'mc', q: 'What causes compressor surge when you lift off?', options: ['The wastegate opens', 'The throttle shuts while the turbo still pushes air, so pressure spikes and flow reverses', 'The intercooler freezes', 'The oil drain backs up'], answer: 1,
      why: 'The compressor keeps spinning into a closed throttle. Too much pressure for too little flow makes the air stall and reverse through the wheel in pulses.' },
    { type: 'order', q: 'You lift off at full boost. Put it in order.', items: ['Throttle snaps shut', 'Pressure spikes between compressor and throttle', 'Manifold vacuum opens the valve', 'Trapped air vents or recirculates', 'Turbo keeps spinning without surging'],
      why: 'Closed throttle → pressure spike → vacuum signal opens the valve → the pressure has an escape → no surge.' },
    { type: 'tap', q: 'Tap the sensor that already counted the air a blow-off valve would dump.', visual: { type: 'parts', drawing: 'intake' }, answer: 'maf',
      why: 'The MAF sits before the turbo. Air it measured but the engine never receives still got fuel, so venting it makes the mixture briefly rich.',
      wrong: { map: 'The MAP sensor reads manifold pressure after the throttle. Engines that rely on it alone mind venting less.' } },
    { type: 'mc', q: 'Why do most factory turbo cars use a **recirculating** valve?', options: ['It makes more boost', 'Metered air stays in the system (no rich stumble on MAF cars), and it’s quiet', 'It’s required to open the wastegate', 'Blow-off valves can’t open fast enough'], answer: 1,
      why: 'Recirculating keeps the MAF reading honest and avoids the noise. Venting is mostly a sound choice.' },
  ],
  cards: [
    { id: 'surge', front: 'Compressor surge?', back: 'Airflow stalling and reversing through the compressor in pulses, e.g. throttle shut at boost. The “flutter”.' },
    { id: 'bov-byp', front: 'Blow-off vs bypass valve?', back: 'BOV vents to the air (“pssh”). Bypass/diverter recirculates to the compressor inlet (quiet).' },
    { id: 'maf-why', front: 'Why do MAF cars recirculate?', back: 'Vented air was already metered and fueled → brief rich stumble or stall.' },
    { id: 'signal', front: 'What opens a classic BOV?', back: 'Manifold vacuum when the throttle closes, overcoming the valve spring.' },
  ],
};
