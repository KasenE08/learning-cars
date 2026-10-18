// Drivetrain facts for drive-09 … drive-16 (diffs, AWD/4x4, G.O.A.T. modes). Last checked: Oct 2026.
// Ford's own pages and owner's-manual PDFs could not be opened from this environment, so Ford wording
// is as quoted in search results. Trail Control reuses 'bronco.trailControl' (facts/air.js).

const S = {
  fordSupport: 'Ford support: “Ford Bronco Sport 4x4 Capability: Brains on the Terrain”',
  fordPerf: 'Ford.com 2024 Bronco Sport performance page (G.O.A.T. Modes)',
  fordAuthority: 'Ford Authority: “Ford Bronco Sport G.O.A.T. Modes Explained” (Sep 2022)',
  broncoNation: 'Bronco Nation G.O.A.T. mode articles (2021 and 2025 Bronco Sport)',
  sae: 'SAE Mobility Engineering / SAE Mobilus: “Dana’s twin-clutch axle boosts Ford Bronco Sport’s off-road cred”',
  blueOval: 'Blue Oval Trucks: “Ford’s Dana Twin-Clutch Axle AWD System”',
  torqueNews: 'Torque News: “Most Ford Bronco Sport Badlands owners never use the rear locker”',
  expedition: 'Expedition Portal: “Bronco Sport is Compact but Mighty”',
};

export default {
  'bronco.rduSupplier': {
    value: 'Badlands twin-clutch rear drive unit is supplied by Dana (AdvanTEK family), not GKN’s Twinster',
    status: 'confirmed',
    sources: [S.sae, S.blueOval],
    note: 'Dana says it shares clutch packs with its single-clutch unit first used on the 2019 Ford Edge.',
  },
  'bronco.rearVector': {
    value: 'Ford: the twin-clutch RDU can send torque to a single rear wheel and divert virtually all rear-axle torque to either rear wheel',
    status: 'confirmed',
    sources: [S.fordSupport, S.expedition, S.sae],
  },
  'bronco.rearShare': {
    value: 'Up to about 50% of engine torque can go to the rear axle',
    status: 'unconfirmed',
    sources: [S.sae],
    note: 'Ford doesn’t publish a front/rear split. One review says the RDU can “shuffle 100% of available torque” rearward, which likely means between the two rear wheels, not front-to-rear.',
  },
  'bronco.lockSpeed': {
    value: 'Rear Differential Lock disengages above a set speed and re-engages below it. One owner’s-manual excerpt (2021): in Rock Crawl it is engaged below 30 mph (48 km/h)',
    status: 'unconfirmed',
    sources: [S.fordSupport, '2021 Bronco Sport owner’s manual excerpt (Drive Modes – Rock Crawl), as quoted in search results'],
    note: 'Ford’s support page gives no number. A parts retailer lists 24 mph. Check the 2024 manual’s Four-Wheel Drive section.',
  },
  'bronco.noLowRange': {
    value: 'No transfer case and no low range: AWD-based layout (PTU + rear drive unit) with 4x4 Lock and a rear diff lock instead',
    status: 'confirmed',
    sources: ['TFLcar 2021 Bronco Sport Badlands review', 'CarPro 2021 Bronco Sport Badlands review', S.fordSupport],
  },
  'bronco.crawlRatio': {
    value: '≈17.9:1 (1st gear 4.69 × final drive 3.81; no low range)',
    status: 'confirmed',
    sources: ['Checked: math from bronco.gearRatios × bronco.finalDrive', 'Bronco Sport Forum (owners quote ≈18:1)'],
  },
  'bronco.modesRoad': {
    value: 'Normal: default, balanced · Eco: fuel efficiency · Sport: sharper throttle, holds lower gears longer, quicker shifts, sportier steering/sound · Slippery: softer throttle, adjusted shifts, stricter traction/stability control',
    status: 'confirmed',
    sources: [S.fordPerf, S.fordAuthority],
    note: 'Ford publishes no calibration numbers. That the car restarts in Normal comes from enthusiast sources.',
  },
  'bronco.modesOff': {
    value: 'Sand: soft sand/deep snow · Mud/Ruts (Badlands): engages 4x4 Lock, allows more wheelspin · Rock Crawl (Badlands): 4x4 Lock + rear diff lock, damped throttle, front trail camera at low speed',
    status: 'conflicting',
    sources: [S.fordPerf, S.fordAuthority, S.broncoNation, '2021 Bronco Sport owner’s manual excerpt (Rock Crawl)'],
    note: 'Sources disagree on whether Mud/Ruts also turns on the rear lock. Ford’s Sand description is vague; “holds lower gears longer” comes only from owner reviews.',
  },
};
