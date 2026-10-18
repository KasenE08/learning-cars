// Drivetrain facts for drive-01 … drive-08 (transmission). Last checked: Oct 2026.
// Ford's spec sheet and the NHTSA-hosted bulletins were found via search; the PDFs themselves
// could not be opened from this environment, so figures are as quoted in search results and
// cross-checked against auto123's spec pages.

const S = {
  fordSpec: 'Ford 2025 Bronco Sport Technical Specifications (media.ford.com / fromtheroad.ford.com PDF), 2.0 L column',
  auto123: 'auto123.com 2024 Bronco Sport Badlands 4x4 spec page',
  tsbSowc: 'Ford TSB 25-2567 (Jan 2026, supersedes 25-2127), posted on NHTSA: 2023–24 Bronco Sport / Maverick with 8F35',
  tsbFluid: 'Ford TSB 21B55 (Sep 2021): 2021–22 Bronco Sport, Escape, Maverick and others “equipped with an 8F35 transmission”',
  tsbTc: 'Ford TSB on NHTSA (MC-11032566): 8F35 torque converter shudder, 2021–2026 Bronco Sport and others',
  gears: 'Gears Magazine (ATRA), “Ford’s New 8-Speed” (May 2020) and “The 8F35 Project” (Jul 2025)',
  wiki: 'Wikipedia: Ford 8F transmission',
  blueoval: 'Blue Oval Trucks: Ford 8F35 transmission overview',
};

export default {
  'bronco.transModel': {
    value: 'Ford 8F35: a transverse 8-speed planetary automatic with a torque converter (and lockup clutch)',
    status: 'confirmed',
    sources: [S.tsbFluid, S.tsbSowc, S.tsbTc, S.gears],
    note: 'Ford’s own bulletins name the 8F35 for the Bronco Sport. The same family is used in the Escape, Maverick and Corsair.',
  },
  'bronco.gearRatios': {
    value: '1st 4.69 · 2nd 3.31 · 3rd 3.01 · 4th 1.92 · 5th 1.45 · 6th 1.00 · 7th 0.75 · 8th 0.62 · Reverse 2.96',
    status: 'confirmed',
    sources: [S.fordSpec, S.auto123],
    note: 'Ford’s sheet is for the 2025 model; auto123 lists the identical ratios for the 2022, 2024 and 2025 Badlands, and the 1.5 L uses the same ratios too.',
  },
  'bronco.finalDrive': {
    value: '3.81:1 final drive (some listings round to 3.80)',
    status: 'confirmed',
    sources: [S.fordSpec, S.auto123],
    note: 'Ford’s sheet says 3.81; auto123 and a state fleet spec sheet say 3.80. Almost certainly rounding.',
  },
  'bronco.sowc': {
    value: 'The 8F35 uses a hydraulically controlled selectable one-way clutch (SOWC); a Ford bulletin ties SOWC faults to loss of reverse',
    status: 'confirmed',
    sources: [S.tsbSowc, S.gears],
  },
  'bronco.tcShudder': {
    value: 'Ford service bulletin: 8F35 shudder below about 60 mph with no trouble codes, traced to the torque converter (2021–2026 Bronco Sport among the models listed)',
    status: 'unconfirmed',
    sources: [S.tsbTc],
    note: 'Ford’s own bulletin, but seen only through a search summary; the PDF could not be opened from here.',
  },
  'bronco.transClutches': {
    value: 'Two rotating (driving) clutches and four brake clutches select the 8 forward gears',
    status: 'unconfirmed',
    sources: [S.gears],
    note: 'One trade-magazine source. I could not find a reliable count of the planetary gearsets.',
  },
  'bronco.transOrigin': {
    value: 'Closely related to GM’s 9T-series front-drive 9-speed (Ford–GM joint development)',
    status: 'confirmed',
    sources: [S.wiki, S.gears, S.blueoval],
    note: 'Wikipedia says Ford dropped one gear from the 9-speed design; Blue Oval Trucks names the 9T50 specifically.',
  },
};
