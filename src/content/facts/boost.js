// Forced-induction facts for the reference vehicles. Last checked: Oct 2026.
export default {
  'bronco.turboType': {
    value: 'Single twin-scroll turbocharger',
    status: 'confirmed',
    sources: [
      'Ford dealer engine guide (Team Ford Canada): Bronco Sport 2.0 L “uses a twin-scroll turbocharger”',
      'RPM Canada 2020 Escape road test spec sheet (“2.0L Twin-Scroll EcoBoost”)',
      'Carscoops / Automotive Fleet coverage of the 2015-on 2.0 L EcoBoost (twin-scroll turbo + exhaust manifold integrated into the head)',
    ],
    note: 'No Ford press release found that says it outright. Sources are a Ford dealer page, a road-test spec sheet for the Escape (same engine) and trade press on the 2015-on 2.0 EcoBoost family.',
  },
  'bronco.wastegate': {
    value: 'Wastegate opened by an actuator and rod, controlled by the PCM',
    status: 'confirmed',
    sources: [
      'Ford service bulletin (Oct 2021, 2021 Bronco Sport 2.0 L): low power + codes P0243/P0299 from an inoperative wastegate actuator, missing e-clip or damaged actuator rod',
      'Ford service bulletin SSM 54857 (2020–2026 Escape / Bronco Sport 2.0 L/2.3 L): wastegate actuator linkage procedure',
    ],
    note: 'Whether the actuator is vacuum-driven through a solenoid or an electric motor is not confirmed. A parts guide describes the related Edge 2.0 as electronically controlled and vacuum-actuated.',
  },
  'bronco.bypassValve': {
    value: 'Electronic compressor bypass (diverter) valve that recirculates air back to the turbo inlet',
    status: 'confirmed',
    sources: ['Turbosmart Kompact EM fitment listing (2021+ Bronco Sport 2.0 L)', 'Go Fast Bits Bronco Sport valve listing (replaces the factory electronic diverter valve)'],
    note: 'Described by aftermarket makers whose parts replace it; not checked against Ford’s workshop manual.',
  },
  'bronco.peakBoost': {
    value: 'About 16 psi (≈1.1 bar) gauge at peak, in owner data logs. Ford does not publish a boost figure',
    status: 'unconfirmed',
    sources: ['Maverick Truck Club owner logs (2.0 EcoBoost Maverick: 15.7 psi Normal, 16.5 psi Sport)'],
    note: 'Anecdotal, and logged on a Maverick with the same 2.0 L, not a Bronco Sport. Treat as a ballpark.',
  },
  'bronco.intercooler': {
    value: 'Front-mounted charge air cooler (owners reach it by removing the front bumper). Type not confirmed; air-to-air is likely',
    status: 'unconfirmed',
    sources: ['Bronco Sport Forum thread “Is upgrading the intercooler a thing?”'],
    note: 'Only owner-forum descriptions found; no Ford spec stating air-to-air vs air-to-water.',
  },
};
