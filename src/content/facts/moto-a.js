// Bike engine + drivetrain facts (units mengine, mdrive). Last checked: Oct 2026.
// Reuses ninja.engine/boreStroke/output/weight/clutch/crankAngle/tires/sprockets/quickshifter and the rs457.* equivalents.
// Network access was limited to web search summaries; single-source items are marked.

export default {
  // ---------- Kawasaki Ninja 500 ----------
  'ninja.gearRatios': {
    value: 'Primary reduction 2.029 (69/34) · 6-speed: 1st 2.929, 2nd 2.056, 3rd 1.619, 4th 1.333, 5th 1.154, 6th 1.037 · final reduction 3.071 (43/14), chain',
    status: 'confirmed',
    sources: ['Kawasaki Australia official 2025/2026 Ninja 500 spec pages', 'Kawasaki Malaysia Ninja 500 SE page (same primary and final ratios)', 'Sprocket Center / Vortex fitment (14/43 stock sprockets)'],
    note: 'The gear-by-gear ratios come from Kawasaki Australia’s sheet; the US sheet does not list them. Assumed identical for the 2024 model (same engine and gearbox).',
  },
  'ninja.redline': {
    value: 'About 11,000–11,700 rpm (sources disagree)',
    status: 'conflicting',
    sources: ['Cycle News 2024 Ninja 500 review (11,700 rpm)', 'RevZilla Common Tread first ride (11,700 rpm)', 'Bike Review Australia (11,000 rpm)', 'Ninja400Riders / KawasakiWorld owner posts (limiter ≈11,300 rpm, tach reads high)'],
    note: 'Kawasaki’s spec sheets don’t publish a redline. Owners report the tach reads several hundred rpm high near the top.',
  },
  'ninja.clutchActuation': {
    value: 'Cable-actuated clutch (assist & slipper, wet multi-plate)',
    status: 'confirmed',
    sources: ['Cycle News 2024 Ninja 500 review (“cable actuated”)', 'Bennetts BikeSocial review (“lightest cable clutch”)', 'NHTSA recall 25V-146 (clutch release shaft/lever weld, 2024 Ninja 500)'],
  },
  'ninja.lube': {
    value: 'Forced lubrication, wet sump. One oil for engine, gearbox and clutch',
    status: 'confirmed',
    sources: ['Kawasaki Malaysia Ninja 500 SE spec page', 'Kawasaki India Ninja 500 spec page', 'Kawasaki Australia spec page'],
    note: '“Shared oil” follows from the wet clutch and gearbox living in the engine cases; Kawasaki’s sheets list only “wet sump”.',
  },
  'ninja.vs400': {
    value: 'Ninja 400: 399 cc, 70.0 × 51.8 mm, 33.4 kW (45 PS) @ 10,000 rpm, 37.0 N·m @ 8,000 rpm. The 500 keeps the 70.0 mm bore and lengthens the stroke to 58.6 mm',
    status: 'confirmed',
    sources: ['Kawasaki India Ninja 400 spec page', '1000PS Ninja 400 vs Ninja 500 SE comparison', 'Visordown Ninja 400 launch report'],
    note: 'Some reviews say the stroke grew 8.6 mm; the published strokes differ by 6.8 mm.',
  },

  // ---------- Aprilia RS 457 ----------
  'rs457.clutch': {
    value: 'Wet multi-plate clutch with slipper function, cable-actuated',
    status: 'confirmed',
    sources: ['Aprilia RS 457 technical sheet (“wet multiplate with slipper”)', 'Motorcyclist RS 457 review (“cable-actuated clutch with slipper function”)', 'SlashGear RS 457 review (light cable clutch)'],
    note: 'Aprilia says “slipper”. Several reviews call it “slip & assist” and describe a very light pull, but Aprilia’s sheet doesn’t mention assist ramps, so the assist part is unconfirmed.',
  },
  'rs457.redline': {
    value: 'About 10,500–10,700 rpm (sources disagree)',
    status: 'conflicting',
    sources: ['Motorcycle.com RS 457 first ride (10,700 rpm)', 'RevZilla RS 457 track review (10,700 rpm)', 'SlashGear and Autocar India (10,500 rpm)', 'BT Moto tuner page (stock limiter 10,600 rpm)'],
  },
  'rs457.gearbox': {
    value: '6-speed sequential gearbox, chain final drive. Gear ratios and primary ratio not found',
    status: 'confirmed',
    sources: ['Aprilia RS 457 technical sheet (6 gears)', 'Motorcycle.com spec page (chain)', 'Cycle News RS 457 review'],
    note: 'Cycle News says the gears run on roller cages instead of bushings (single source). Gear-by-gear ratios weren’t found in any source I could reach.',
  },
  'rs457.sprockets': {
    value: 'Stock sprockets reported as 15-tooth front / 43-tooth rear, 520 pitch chain',
    status: 'unconfirmed',
    sources: ['Aftermarket chain-kit listings (“stock 15 front / 43 rear, 520”)', 'CBC Moto OEM Aprilia front sprocket listing (15T for RS 457)'],
    note: 'Retailer data only; not checked against Aprilia’s parts catalog.',
  },
  'rs457.qsUpDown': {
    value: 'The accessory quickshifter is bi-directional (up and down, auto-blip on downshifts); ≈$399 in the US at launch per one review',
    status: 'confirmed',
    sources: ['Ultimate Motorcycling RS 457 review (“accessory up/down quickshifter, $399”)', 'Gaadify (bi-directional quickshifter, India 2024)', 'Visordown RS 457 review (accessory quickshifter)'],
    note: 'Prices vary by market and year; check a dealer.',
  },

  // ---------- Other bikes (examples) ----------
  'bikes.zx10rRamAir': {
    value: '2025 Kawasaki Ninja ZX-10R: 149.3 kW (203 PS) @ 13,200 rpm · 156.8 kW (213 PS) with ram air (claimed)',
    status: 'confirmed',
    sources: ['Kawasaki Australia official 2025 Ninja ZX-10R spec sheet', 'Kawasaki India ZX-10R page (ram-air rating)'],
    note: 'The ram-air figure is Kawasaki’s claim at speed; the 2026 model lists 196 / 206 PS.',
  },
};
