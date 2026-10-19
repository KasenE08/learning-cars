// Facts for Motorsport Basics + Buying & Jargon. Last checked: Oct 2026.
export default {
  'bronco.vin': {
    value: 'VIN starts with 3FM: 3 = Mexico, FM = Ford (multipurpose vehicle). Built in Hermosillo, Mexico. 10th character R = 2024 model year',
    status: 'confirmed',
    sources: ['NHTSA vPIC decode of a 2023 Bronco Sport VIN (via CarWhere)', 'Bumper.com Bronco Sport VIN guide (WMI 3FM)', 'Wikipedia: Ford Bronco Sport (assembly)', '49 CFR 565 model-year table'],
    note: 'One VIN guide names a different Ford Mexico plant; the NHTSA decode and Wikipedia both say Hermosillo. Read your own VIN on the dash or door jamb.',
  },
  'ninja.valveCheck': {
    value: 'Valve clearance check every 24,000 km (15,000 mi); basic service every 12,000 km (7,600 mi) or 1 year',
    status: 'unconfirmed',
    sources: ['maintenanceschedule.com Ninja 500 (2024+) schedule'],
    note: 'Third-party summary, not Kawasaki’s document. The owner’s manual for the exact year and market is the real source.',
  },
  'rs457.service': {
    value: 'Free services at 1,000 / 6,000 / 10,000 km, then every 6,000 km or 6 months (India). Valve check reported at 24,000 km (15,000 mi)',
    status: 'unconfirmed',
    sources: ['Aprilia India RS 457 after-sales page (service intervals)', 'Motoryk RS 457 service table (valve interval)'],
    note: 'Intervals can differ by market; the valve figure is from a third-party site.',
  },
};
