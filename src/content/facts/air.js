// Facts researched for unit `air` (Air, Fuel & Spark). Last checked: Oct 2026.
export default {
  'bronco.portInjection': {
    value: 'Direct injection only (no port injectors) as far as sources show',
    status: 'unconfirmed',
    sources: ['Team Ford (Ford dealer) Bronco Sport powertrain comparison: lists the 2.0 L as direct injection', 'Bronco Sport Forum owner thread on carbon cleaning the 2.0 (“the 2.0 only has direct injection”)'],
    note: 'One post in the same forum thread claims the 2.0 has both port and direct injection, with no Ford source. Not confirmed against Ford service information either way.',
  },
  'bronco.fuel': {
    value: 'Designed to run on regular unleaded, 87 AKI minimum; premium (91 AKI or higher) “recommended for best overall vehicle and engine performance”',
    status: 'unconfirmed',
    sources: ['Bronco Sport Forum owners quoting the 2023 and 2025 Badlands owner’s manuals (“Choosing the Right Fuel”)', 'Ford dealer blogs (Alpine Ford, Quality Auto Mall) on 2026 Bronco Sport fuel', 'KBB 2023 Badlands spec listing (“Recommended fuel: Premium”)'],
    note: 'Seen only in owner and dealer quotes of the manual, not in Ford’s manual itself. Whether Ford’s published hp/torque ratings for the 2.0 were measured on premium is not confirmed (no Ford footnote found).',
  },
  'bronco.hpfp': {
    value: 'Cam-driven high-pressure fuel pump on the cylinder head feeding the direct-injection rail',
    status: 'confirmed',
    sources: ['Stratified Automotive: “Upgrading your EcoBoost fuel system, Part 1”', 'Go-Parts P0087 guide for the 2.0L EcoBoost'],
    note: 'Which camshaft drives it isn’t confirmed for the 2.0. Rail pressure figures found (about 1,000–2,150 psi) come from a forum post, not a Ford spec.',
  },
  'bronco.ignition': {
    value: 'Coil-on-plug: four individual ignition coils, one per cylinder',
    status: 'confirmed',
    sources: ['Extreme Terrain: 4-piece ignition coil kit for 2021–23 2.0L EcoBoost Bronco Sport', 'Motorcraft single-coil listings that fit the Bronco Sport 2.0'],
    note: 'Spark plug part number and gap were not confirmed and are left out on purpose.',
  },
  'bronco.trailControl': {
    value: 'Trail Control (standard on Badlands): off-road cruise control that holds a set low speed, under 20 mph forward and under 5 mph in reverse',
    status: 'confirmed',
    sources: ['Ford.com 2024 Bronco Sport off-roading features page', 'Ford dealer listings for 2024 Badlands'],
  },
};
