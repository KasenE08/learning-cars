// Performance + rebuild facts for the reference vehicles. Last checked: Oct 2026.
// Reuses bronco.output, bronco.gearRatios, bronco.finalDrive, bronco.tires, bronco.fuel, bronco.clearance from other files.

export default {
  // ---------- 2024 Ford Bronco Sport Badlands ----------
  'bronco.curbWeight': { value: '≈3,710 lb (≈1,684 kg) curb weight', status: 'confirmed',
    sources: ['KBB 2024 Bronco Sport Badlands specs (3,713 lb)', 'Ford dealer listings (LaFontaine Ford: 3,713 lb; others: 3,707 lb)', 'iSeeCars 2024 Bronco Sport specs'],
    note: 'Listings say 3,707 or 3,713 lb; options shift it a little. Not checked against a Ford sheet directly.' },
  'bronco.mpg': { value: 'EPA 21 mpg city · 26 highway · 23 combined', status: 'confirmed',
    sources: ['KBB 2024 Bronco Sport Badlands', 'Ford dealer research pages (2.0 L, 8-speed)'],
    note: 'Not read off fueleconomy.gov itself. A few dealer listings show other numbers that look like data errors.' },
  'bronco.towing': { value: '2,200 lb max trailer with the Class II trailer tow package · 220 lb max tongue weight', status: 'confirmed',
    sources: ['Auto123 2024 Badlands spec sheet', 'towingspecs.com 2024 Bronco Sport', 'Dealer listing for a Badlands with the Class II package'] },
  'bronco.dimensions': { value: 'Wheelbase 105.1 in · length 172.7 in · width 74.3 in (body) · height 71.4 in · track 63.4 in front / 62.8 in rear', status: 'confirmed',
    sources: ['Autoblog 2024 Badlands specs', 'Auto123 2024 Badlands spec sheet', 'iSeeCars 2024 Bronco Sport dimensions'] },
  'bronco.payload': { value: '≈890 lb in most listings; others say about 1,000 lb', status: 'conflicting',
    sources: ['Bronco Sport Forum (Badlands load-capacity thread)', 'iSeeCars 2024 Bronco Sport specs', 'Dealer listing (1,000 lb)'],
    note: 'One listing’s GVWR (4,730 lb) minus curb weight gives ≈1,020 lb, which doesn’t match 892 lb either. The door-jamb sticker on your truck is the real number.' },
  'bronco.wheelHp': { value: '≈200–210 hp at the wheels, stock (one tuner’s AWD chassis dyno)', status: 'unconfirmed',
    sources: ['Vivid Racing project-car blog (AWD Mustang dyno, 2021 Badlands)'],
    note: 'Single source, and its own later post implies a lower stock figure. No independent stock dyno found.' },
  'bronco.rduFluid': { value: 'Owner reports: rear drive unit (RDU) fluid very dark at ≈18,000 mi; owners suggest ≈30k mi for RDU and 30–60k mi for PTU fluid', status: 'unconfirmed',
    sources: ['Bronco Sport Forum (“More RDU issues”, PTU/RDU fluid threads)'],
    note: 'Anecdotes, not Ford’s schedule. I couldn’t find Ford’s official PTU/RDU interval; check your owner’s manual / scheduled maintenance guide.' },
  'bronco.bigBroncoFuel': { value: 'Full-size 2021 Bronco 2.3 L EcoBoost (not your Sport): 275 hp / 315 lb-ft on regular 87, 300 hp / 325 lb-ft on premium', status: 'confirmed',
    sources: ['Ford spec sheet footnote as reported by TFLcar and Ford Authority (May 2021)', 'Bronco Nation tech-spec post'],
    note: 'Ford’s footnote: ratings achieved on premium fuel per SAE J1349. A real example of why fuel footnotes matter.' },

  // ---------- Kawasaki Ninja 500 ----------
  'ninja.output': { value: '33.4 kW (45 PS, ≈45 hp) @ 9,000 rpm · 42.6 N·m (31.4 lb-ft) @ 6,000 rpm (claimed, at the crank)', status: 'confirmed',
    sources: ['Kawasaki Australia official Ninja 500 spec page', 'Kawasaki Malaysia official Ninja 500 SE page'] },
  'ninja.weight': { value: '171 kg (377 lb) curb · 157 kg (346 lb) estimated dry', status: 'confirmed',
    sources: ['Kawasaki Australia official Ninja 500 spec page', 'Kawasaki Malaysia official Ninja 500 SE page'],
    note: 'Kawasaki’s curb weight includes all fluids, a near-full tank and the tool kit. The SE and ABS versions can differ slightly.' },

  // ---------- Aprilia RS 457 ----------
  'rs457.output': { value: '35 kW (47.6 PS, ≈47 hp) @ 9,400 rpm · 43.5 N·m (32.1 lb-ft) @ 6,700 rpm (claimed)', status: 'confirmed',
    sources: ['Aprilia European dealer brochure (35 kW, A2-licence limit)', 'Wikipedia: Aprilia RS457', '1000PS model data'],
    note: 'Aprilia’s “47.6 hp” is metric horsepower (PS/CV). 35 kW = 46.9 hp in US (mechanical) horsepower. Not read off aprilia.com directly.' },
  'rs457.weight': { value: '175 kg (386 lb) kerb · 159 kg (351 lb) dry', status: 'confirmed',
    sources: ['1000PS model data', 'Wikipedia: Aprilia RS457 (160 kg dry, 175 kg wet)', 'MotoPlanète RS 457 spec page'],
    note: 'Dry weight is listed as 159 or 160 kg. How full the tank is in Aprilia’s kerb figure isn’t stated, so a curb-vs-kerb comparison with the Ninja is close, not exact.' },
};
