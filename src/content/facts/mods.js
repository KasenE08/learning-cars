// Facts for unit `mods` (Mods: What Actually Works). Last checked: Oct 2026.
// Power-gain numbers from tuners and parts makers are their own claims and are marked unconfirmed.
// Reuses bronco.output, bronco.wheelHp, bronco.fuel, bronco.tires, bronco.clearance, bronco.suspension,
// bronco.bigBroncoFuel, ninja.tires, rs457.tires, ninja.suspension, rs457.suspension, rs457.electronics from other files.
export default {
  // ---------- Bronco Sport: power mods ----------
  'bronco.intakeClaims': {
    value: 'K&N 63-2618 intake (2.0 L Bronco Sport/Maverick): “estimated” +7.82 hp @ 3,998 rpm, +10.18 lb-ft. aFe Momentum GT: “+16 hp / +18 lb-ft max gains”. Neither is CARB-legal in California',
    status: 'unconfirmed',
    sources: ['K&N product page 63-2618 (gain estimate + “not legal for sale or use in California”)', 'aFe Momentum GT listing (“not currently CARB exempt”)'],
    note: 'Both are the sellers’ own numbers (the aFe listing’s exact engine fitment wasn’t confirmed); no independent back-to-back dyno found. Owners on Bronco Sport Forum call stock-turbo intakes “mostly for noise”.',
  },
  'bronco.catBack': {
    value: 'Borla S-Type cat-back (140882) for 2021–25 Bronco Sport 2.0 L: 2.5 in inlet, dual mufflers, dual 2.25 in tailpipes; install requires cutting the factory pipe; marketed as “drone-free”',
    status: 'unconfirmed',
    sources: ['Borla product pages 140882 / 140882CB'],
    note: 'Maker’s description. Borla publishes no power claim for it. Some retailers list it as discontinued.',
  },
  'bronco.tuneGains': {
    value: 'Vivid Racing ECU flash: 186 → 222 whp and 246 → 300 lb-ft at the wheels (+36 whp, +54 lb-ft) on a Mustang chassis dyno. Livernois: “up to 40 hp and 75 lb-ft” on 93 octane',
    status: 'unconfirmed',
    sources: ['Vivid Racing project-car blog (2021 Badlands dyno)', 'The Drive / Ford Authority coverage of the Vivid tune (2021)', 'Livernois Motorsports SEMA 2021 press release via Ford Authority'],
    note: 'Tuners’ own tests. The Drive noticed Vivid’s graph didn’t exactly match its written numbers, and Vivid’s tune was sold for off-road use. Livernois’s claim covers both the 1.5 L and 2.0 L and doesn’t say wheel or crank.',
  },
  'bronco.cobbEo': {
    value: 'COBB Accessport for the 2.0 L Bronco Sport carries CARB Executive Orders D-660-124 (2021–22) and D-660-196 (2021–24); the Stage 1 Power Package (intake + tune) is D-660-168 / D-660-197',
    status: 'unconfirmed',
    sources: ['COBB “CARB EO numbers for COBB Ford Products” table', 'COBB Bronco Sport Badlands tuning page'],
    note: 'From COBB’s own pages, not looked up in CARB’s EO database. COBB: the package EO only covers the car when all its parts are installed together. COBB gives no Bronco Sport power figure beyond “significant”.',
  },

  // ---------- Bronco Sport: suspension, tires, off-road ----------
  'bronco.liftKit': {
    value: 'Ford Performance M-18000-BSL “Bronco Sport Lift Kit – Badlands”: for 2021–25 NON-Badlands Bronco Sports. Raises them 20 mm front / 30 mm rear to Badlands-style suspension, ≈1 in more travel. $920 list',
    status: 'confirmed',
    sources: ['Ford Performance Parts listing M-18000-BSL', 'Ford Authority (Aug 2025)', 'Steeda and Watson Racing listings'],
    note: 'Includes front struts, rear dampers and springs, anti-roll bars, end links and rear knuckles. 3 yr/36,000 mi Ford Performance warranty when a Ford dealer or ASE-certified tech installs it. It does nothing for a truck that is already a Badlands.',
  },
  'bronco.levelKit': {
    value: 'Zone Offroad ZONF1103: 1 in front-only strut-spacer leveling kit sold for the Bronco Sport Badlands (0 in rear); maker says it clears 245/65R17 tires',
    status: 'unconfirmed',
    sources: ['Zone Offroad product page', 'Retailer listings (Rudy’s, Desert Rat)', 'Bronco6G forum (CV-angle discussion)'],
    note: 'Maker’s claims. Retailers disagree on model years (2021–22 vs 2021–24). Zone says its design “prevents extreme CV angles”; forum owners expect shorter CV axle life with any spacer lift.',
  },
  'bronco.maxTire': {
    value: 'Owner reports: 235/70R17 (≈30.0 in) and 245/65R17 (≈29.5 in) fit a stock Badlands, sometimes lightly touching the liners at full lock; 255/70R17 (≈31 in) does not clear at full lock',
    status: 'unconfirmed',
    sources: ['Bronco Sport Forum: “Biggest tire I can fit without a lift?”, “Big Tires for BS Badlands”, “Big Bend max tire size”'],
    note: 'Forum anecdotes, not a Ford spec. A Car and Driver figure of ≈30.5 in for the Badlands is quoted second-hand on the forum but wasn’t confirmed. Diameters are calculated from the size codes.',
  },
  'bronco.sasquatch': {
    value: '2025+ Bronco Sport Badlands Sasquatch package (not available on your 2024): 235/65R17 (≈29 in) Goodyear Territory A/T, about 0.5 in more ride height, HOSS 3.0 suspension with rear Bilstein position-sensitive dampers, steel skid plates; ≈$2,990',
    status: 'confirmed',
    sources: ['Ford Authority (Jan 2025)', 'TFLcar (Aug 2024)', 'MotorWeek'],
    note: 'Lift reported as 0.6 in (TFL) and “almost half an inch” (MotorWeek). One outlet’s “31-inch tires” conflicts with the 235/65R17 size and looks like an error.',
  },
  'bronco.recovery': {
    value: 'Badlands: front tow hooks and one frame-mounted rear recovery point, plus skid plates protecting the underbody and rockers, all standard',
    status: 'confirmed',
    sources: ['Ford support: Bronco Sport off-road hardware', 'Ford Authority (June 2024: “front tow hooks and a single rear recovery point”)'],
    note: 'The exact number and location of 2024 skid plates wasn’t confirmed; check your build sheet. The 2025 refresh added a pair of rear hooks.',
  },

  // ---------- Bikes ----------
  'ninja.slipOn': {
    value: 'Akrapovič titanium slip-on for the Ninja 500: +0.3 kW (0.4 hp) @ 8,750 rpm and +0.3 N·m @ 5,000 rpm vs stock, on Akrapovič’s dyno; “plug-and-play, no remapping necessary”',
    status: 'unconfirmed',
    sources: ['Akrapovič Ninja 500 / Z500 slip-on listing (via Bike Biz, Sportbike Track Gear)'],
    note: 'Maker’s own figure, and refreshingly honest: well inside normal dyno run-to-run variation.',
  },
  'ninja.flash': {
    value: 'BT Moto Stage 1 ECU flash for the Ninja 500: 45 → 50 whp and 27 → 29 lb-ft (37 → 39 N·m) at the wheel on pump gas',
    status: 'unconfirmed',
    sources: ['BT Moto product page (dyno chart)'],
    note: 'Vendor claim. The page doesn’t say what exhaust was fitted for each run, so it may not isolate the flash.',
  },
  'ninja.sprockets': {
    value: 'Stock final drive: 14-tooth front, 43-tooth rear sprocket, 520 chain (108 links)',
    status: 'confirmed',
    sources: ['Sprocket Center Ninja 500 (2024–26) fitment', 'Vortex (“OEM gearing 14 front / 43 rear”)', 'Rocky Mountain ATV/MC parts listing'],
    note: 'Retailers agree; not checked against Kawasaki’s own parts list. The Ninja 400 used 14/41, which is why 41T kits show up in searches.',
  },
  'ninja.quickshifter': {
    value: 'No Kawasaki quickshifter accessory found for the Ninja 500. Aftermarket kits exist: HealTech QuickShifter Easy (sensor + harness) and FTECU (needs an ECU flash to enable)',
    status: 'unconfirmed',
    sources: ['Sportbike Track Gear HealTech listing (Ninja 500 2024–26)', 'Norton Motorsports FTECU listing', 'Kawasaki UK/CH accessory pages (KQS listed for other models)'],
  },
  'rs457.quickshifter': {
    value: 'Aprilia sells a quickshifter (AQS) as a dealer accessory; the dealer enables it with Piaggio diagnostic software. Aftermarket up/down kits also need that dealer activation',
    status: 'confirmed',
    sources: ['Gaadify (India: accessory at Rs 27,999 + labor, 2024)', 'Motodracing IRC RS 457 quickshifter listing', 'RideApart launch report (quickshifter optional)'],
    note: 'Current US price not found.',
  },

  // ---------- Law (US) ----------
  'law.cobbSettlement': {
    value: 'Sept 2024: EPA and DOJ settled with COBB Tuning for just over $2.9 million over emissions defeat devices; COBB must stop selling them but may keep selling tunes with CARB Executive Orders',
    status: 'confirmed',
    sources: ['EPA news release: “United States Reaches Agreement with COBB Tuning Products for Clean Air Act Violations”', 'Carscoops (Sept 2024)'],
    note: 'Penalty was reduced based on COBB’s limited ability to pay.',
  },
  'law.epaEnforcement': {
    value: 'Clean Air Act: removing or disabling emission controls, or making, selling or installing defeat devices, is illegal. FY2020–23 it was an EPA national enforcement priority: 172 civil cases, $55.5 million in penalties',
    status: 'confirmed',
    sources: ['EPA: National Enforcement and Compliance Initiative “Stopping Aftermarket Defeat Devices”', 'EPA enforcement alert on defeat devices (updated Oct 2025)', 'SEMA government-affairs brief (Sept 2025)'],
    note: 'Per SEMA, the aftermarket came off EPA’s national priority list after 2023. The law itself didn’t change, and EPA’s 2025 alert still warns against tampering.',
  },
  'law.carbEo': {
    value: 'California: a part that can affect emissions (intake, tune, header, turbo, downpipe) needs a CARB Executive Order (EO) number to be sold, installed or used on a street car; Smog Check and BAR Referees verify EO numbers',
    status: 'confirmed',
    sources: ['CARB: Aftermarket, Performance, and Add-on Parts', 'CARB Advisory 292 (July 2020)', 'California Vehicle Code §27156 (via law-firm summaries)'],
    note: 'Cat-back exhausts that leave the cat and sensors alone are generally treated as replacement parts needing no EO (CARB guidance as quoted by exhaust makers). Racing-only parts are exempt only on true race vehicles.',
  },
  'law.caNoise': {
    value: 'California Vehicle Code §27151: an exhaust on a car under 6,000 lb GVWR (not motorcycles) passes at 95 dBA or less in the current SAE test; modifying an exhaust to be louder than allowed, or driving with one, is illegal',
    status: 'confirmed',
    sources: ['California Vehicle Code §27151 (Justia, california.public.law)', 'Ask the Ref (BAR Referee citation info)'],
    note: 'A cited car may need a Referee noise certificate; court fines can still apply.',
  },
  'law.motoNoise': {
    value: 'US: EPA noise standard of 80 dB(A) for 1986+ street motorcycles; compliant aftermarket exhausts carry an EPA label. California (SB 435): 2013+ street bikes must have the EPA-labeled exhaust; fines $50–100 first offense, and police can’t stop you for that alone',
    status: 'confirmed',
    sources: ['40 CFR Part 205 (motorcycle noise, labeling)', 'California SB 435 enrolled bill text and analyses (2010)', 'RideApart / Roadracing World coverage'],
    note: 'In the EU, replacement exhausts must be type-approved (“e-marked”, UN ECE R92) for that specific bike.',
  },
  'law.magMoss': {
    value: 'Magnuson-Moss Warranty Act / FTC: a maker or dealer can’t deny warranty coverage just because you used an aftermarket part or an independent shop; it must show the aftermarket part caused the need for repairs, and can then deny only that repair',
    status: 'confirmed',
    sources: ['FTC consumer alert: “Auto Warranties, Routine Maintenance, and Repairs”', 'FTC printed alert (govinfo.gov)'],
  },
};
