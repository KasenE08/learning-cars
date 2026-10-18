// Reference-vehicle facts. Every fact carries its sources and a status:
//   'confirmed'   = independent sources agree (and the math checks out where possible)
//   'conflicting' = sources disagree; lessons say so instead of picking one silently
//   'unconfirmed' = only one weak source; shown with a warning
// Sources here are named so you can check them yourself. Last checked: Oct 2026.

const S = {
  edmunds: 'Edmunds 2024–25 Bronco Sport review',
  dealer: 'Ford dealer spec sheets (several)',
  wiki: 'Wikipedia: Ford Bronco Sport / EcoBoost',
  ultimatespecs: 'ultimatespecs.com',
  kawiAU: 'Kawasaki Australia official Ninja 500 spec page',
  cycleworld: 'Cycle World Ninja 500 test',
  apriliaDealer: 'Aprilia dealer spec listings (RS 457)',
  forums: 'Owner forums + parts catalogs (Escape/Maverick share the engine)',
  math: 'Checked: π/4 × bore² × stroke × cylinders matches the rated displacement',
};

export const facts = {
  // ---------- 2024 Ford Bronco Sport Badlands ----------
  'bronco.engine': { value: '2.0 L turbocharged inline-4 (EcoBoost)', status: 'confirmed', sources: [S.edmunds, S.dealer, S.wiki] },
  'bronco.output': { value: '250 hp @ 5,500 rpm · 277 lb-ft @ 3,000 rpm', status: 'conflicting', sources: [S.edmunds, S.dealer],
    note: 'Ford’s published rating. Some sources (incl. Wikipedia) list 245 hp / 275 lb-ft.' },
  'bronco.boreStroke': { value: '87.5 mm × 83.1 mm (3.44 in × 3.27 in)', status: 'confirmed', sources: [S.ultimatespecs, S.wiki, S.math],
    note: 'A few dealer sheets say 87.4 mm bore; 87.5 mm is the one that gives 1,999 cc.' },
  'bronco.displacement': { value: '1,999 cc (2.0 L, ≈122 cu in)', status: 'confirmed', sources: [S.math, S.wiki] },
  'bronco.compression': { value: '10.0:1 (most listings)', status: 'conflicting', sources: [S.dealer, S.ultimatespecs],
    note: 'Dealer sheets mostly say 10.0:1; other sources say 9.7:1 or 10.8:1. Not confirmed against Ford’s own spec sheet.' },
  'bronco.valvetrain': { value: 'DOHC, 4 valves per cylinder (16 total)', status: 'confirmed', sources: [S.dealer, S.ultimatespecs] },
  'bronco.followers': { value: 'Direct-acting mechanical bucket lifters', status: 'unconfirmed', sources: ['One Ford dealer engine overview'] },
  'bronco.vvt': { value: 'Ti-VCT: twin independent variable cam timing (intake and exhaust cams)', status: 'unconfirmed', sources: ['Ford dealer engine overview (“2.0L Ti-VCT GTDI I-4”)'] },
  'bronco.injection': { value: 'Direct injection (fuel sprayed straight into the cylinder)', status: 'confirmed', sources: [S.wiki, S.dealer],
    note: '“GTDI” = gasoline turbocharged direct injection.' },
  'bronco.timingDrive': { value: 'Timing chain (the 1.5 L base engine uses a belt)', status: 'confirmed', sources: [S.forums] },
  'bronco.firingOrder': { value: '1-3-4-2, cylinder 1 at the timing-chain end', status: 'confirmed', sources: [S.forums] },
  'bronco.mounting': { value: 'Mounted sideways (transverse), on Ford’s C2 platform shared with the Escape', status: 'confirmed', sources: [S.wiki] },
  'bronco.trans': { value: '8-speed automatic', status: 'confirmed', sources: [S.edmunds, S.dealer] },
  'bronco.4x4': { value: 'Advanced 4x4 with twin-clutch rear drive unit and rear differential lock (Badlands only)', status: 'confirmed', sources: [S.edmunds, S.wiki] },

  // ---------- Kawasaki Ninja 500 ----------
  'ninja.engine': { value: '451 cc liquid-cooled DOHC 8-valve parallel twin', status: 'confirmed', sources: [S.kawiAU, S.cycleworld, S.math] },
  'ninja.boreStroke': { value: '70.0 mm × 58.6 mm', status: 'confirmed', sources: [S.kawiAU, S.math] },
  'ninja.compression': { value: '11.3:1', status: 'confirmed', sources: [S.kawiAU] },

  // ---------- Aprilia RS 457 ----------
  'rs457.engine': { value: '457 cc liquid-cooled parallel twin', status: 'confirmed', sources: [S.apriliaDealer, S.math] },
  'rs457.boreStroke': { value: '69.0 mm × 61.1 mm', status: 'confirmed', sources: [S.apriliaDealer, S.math] },
  'rs457.compression': { value: '10.5:1', status: 'unconfirmed', sources: [S.apriliaDealer] },
};

export const fact = (id) => {
  const f = facts[id];
  if (!f) throw new Error(`Unknown fact ${id}`);
  return f;
};
