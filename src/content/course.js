// The whole course map. Lesson ids are `${unitId}-${nn}` (e.g. "engine-03").
// `phase` is the build phase that delivers a unit's lessons; until then they show as "planned".
// `path` is the recommended order through every track. Every lesson stays open anytime.

export const tracks = [
  { id: 'mech', code: 'T1', title: 'How Cars Work', blurb: 'Every major system: what it does, what it connects to, where it sits.' },
  { id: 'moto', code: 'T2', title: 'Motorcycles', blurb: 'What changes on two wheels. Ninja 500 and RS 457 as running examples.' },
  { id: 'culture', code: 'T3', title: 'Car Culture', blurb: 'Mods that work (and myths), scenes, motorsport, icons, buying.' },
  { id: 'tech', code: 'T4', title: 'Computers & Tuning', blurb: 'ECUs, OBD-II, CAN bus, decoding, reverse engineering, tuning, security.' },
];

const L = (title, min = 5) => ({ title, min });

export const units = [
  // ---------------- Track 1: How cars work ----------------
  { id: 'engine', track: 'mech', title: 'Engine Fundamentals', phase: 2, lessons: [
    L('What an engine actually does', 4), L('The 4-stroke cycle', 6), L('The block: cylinders, bore & stroke'), L('Displacement: the math', 4),
    L('Pistons & rings'), L('Rods & the crankshaft'), L('The cylinder head'), L('Valves, cams & the valvetrain', 6),
    L('Timing: belts, chains & sync', 6), L('Compression ratio'), L('Firing order & balance', 6),
  ] },
  { id: 'layout', track: 'mech', title: 'Engine Layouts', phase: 4, lessons: [
    L('Inline engines'), L('V engines'), L('Boxer & flat engines', 4), L('Singles, twins & odd layouts'),
  ] },
  { id: 'air', track: 'mech', title: 'Air, Fuel & Spark', phase: 4, lessons: [
    L('The intake path', 4), L('Throttle bodies & drive-by-wire'), L('Measuring air: MAF & MAP'), L('Air-fuel ratio', 6),
    L('Fuel delivery: tank to injector'), L('Port vs direct injection'), L('Ignition: coils & spark plugs'), L('Knock & octane', 6),
  ] },
  { id: 'boost', track: 'mech', title: 'Forced Induction', phase: 4, lessons: [
    L('Why boost works', 4), L('Turbo anatomy', 6), L('Spool, lag & sizing'), L('Wastegates & boost control', 6),
    L('Intercoolers'), L('Blow-off & bypass valves', 4), L('Superchargers', 6),
  ] },
  { id: 'exhaust', track: 'mech', title: 'Exhaust', phase: 4, lessons: [
    L('Manifolds & headers'), L('Catalytic converters & O2 sensors', 6), L('Mufflers & resonators', 4), L('Why exhausts sound the way they do', 6),
  ] },
  { id: 'cool', track: 'mech', title: 'Cooling & Lubrication', phase: 4, lessons: [
    L('The cooling loop'), L('Thermostat, pump & radiator'), L('The oil system', 6), L('Oil: viscosity & the numbers'),
  ] },
  { id: 'drive', track: 'mech', title: 'Drivetrain', phase: 4, lessons: [
    L('Drive layouts: FWD, RWD, AWD, 4x4'), L('The clutch', 6), L('Manual gearbox internals', 6), L('Synchros & shifting'),
    L('Planetary gearsets', 6), L('Torque converters', 6), L('How an automatic shifts', 6), L('Dual-clutch transmissions'),
    L('CVTs', 4), L('Driveshafts, U-joints & CV joints'), L('The open differential', 6), L('Limited-slip differentials', 6),
    L('Locking differentials'), L('AWD vs 4x4: couplings & transfer cases', 7), L("Your Bronco Sport's 4x4 system", 7), L('Terrain management modes'),
  ] },
  { id: 'chassis', track: 'mech', title: 'Suspension, Steering & Brakes', phase: 4, lessons: [
    L('Springs & dampers'), L('Suspension types', 6), L('Alignment: camber, caster, toe'), L('Steering: rack & electric assist'),
    L('Brake hydraulics'), L('Discs, calipers & pads'), L('ABS, traction & stability control', 6), L('Wheels & tires: reading a sidewall'),
  ] },
  { id: 'elec', track: 'mech', title: 'Electrical', phase: 4, lessons: [
    L('Battery & 12-volt basics'), L('Alternator & charging'), L('The starter', 4), L('Wiring, fuses & relays', 6), L('Sensors & actuators', 6),
  ] },
  { id: 'perf', track: 'mech', title: 'Performance', phase: 4, lessons: [
    L('Horsepower vs torque', 6), L('Power bands & dyno charts'), L('Gearing & final drive', 6), L('Weight & power-to-weight', 4),
    L('Aero: drag & downforce'), L('How to read a spec sheet', 6),
  ] },
  { id: 'rebuild', track: 'mech', title: 'Rebuild Concepts', phase: 4, lessons: [
    L('Engine teardown & inspection', 7), L('Machining, tolerances & clearances', 7), L('Reassembly & break-in', 6), L('Drivetrain rebuild concepts', 7),
  ] },

  // ---------------- Track 2: Motorcycles ----------------
  { id: 'mengine', track: 'moto', title: 'Bike Engines', phase: 4, lessons: [
    L('Cars vs bikes: what changes'), L('Parallel twins & crank angles', 6), L('High revs & specific output'), L('Bike cooling, oiling & airboxes'),
  ] },
  { id: 'mdrive', track: 'moto', title: 'Bike Drivetrain', phase: 4, lessons: [
    L('The wet multi-plate clutch'), L('The sequential gearbox', 6), L('Slipper & assist clutches'), L('Quickshifters', 4), L('Chain drive & sprockets', 6),
  ] },
  { id: 'mchassis', track: 'moto', title: 'Bike Chassis', phase: 4, lessons: [
    L('Frames'), L('Rake, trail & wheelbase', 6), L('Forks & shocks'), L('Countersteering & lean', 6), L('Bike tires & contact patch', 4),
  ] },
  { id: 'melec', track: 'moto', title: 'Brakes & Riding Electronics', phase: 4, lessons: [
    L('Bike brakes'), L('Motorcycle ABS'), L('Ride-by-wire & ride modes'), L('Traction control'), L('Ninja 500 vs RS 457: spec showdown', 7),
  ] },

  // ---------------- Track 3: Car culture ----------------
  { id: 'scenes', track: 'culture', title: 'Scenes & Styles', phase: 4, lessons: [
    L('JDM'), L('Euro'), L('American muscle'), L('Tuner culture'), L('Off-road & overland'), L('Sport bike culture', 6),
  ] },
  { id: 'motorsport', track: 'culture', title: 'Motorsport Basics', phase: 4, lessons: [
    L('Formula 1', 6), L('Rally'), L('NASCAR & ovals'), L('Endurance & GT racing'), L('Drifting & drag racing'), L('MotoGP & superbikes'),
  ] },
  { id: 'mods', track: 'culture', title: 'Mods: What Actually Works', phase: 4, lessons: [
    L('Intakes & exhausts', 6), L('Tunes'), L('Suspension: coilovers, drops & lifts', 6), L('Wheels, tires & brakes'), L('Myths & snake oil', 6), L('Off-road mods'), L('Bike mods: what actually works', 6),
  ] },
  { id: 'icons', track: 'culture', title: 'Iconic Engines & Cars', phase: 4, lessons: [
    L('Legendary engines: Japan', 6), L('Legendary engines: USA', 6), L('Legendary engines: Europe', 6), L('Cars that changed everything', 6), L('Legendary sport bikes', 7),
  ] },
  { id: 'buying', track: 'culture', title: 'Buying & Jargon', phase: 4, lessons: [
    L('Buying used: what to check', 7), L('Reading a VIN', 4), L('History reports & red flags'), L('Car jargon decoder', 6), L('Buying a used sport bike', 7),
  ] },

  // ---------------- Track 4: Computers, tuning & reverse engineering ----------------
  { id: 'network', track: 'tech', title: 'The Car Is a Network', phase: 5, lessons: [
    L('ECUs & modules'), L('Sensors → ECU → actuators'), L('Gateways & domains'),
  ] },
  { id: 'obd', track: 'tech', title: 'OBD-II', phase: 5, lessons: [
    L('What OBD-II is (and why it exists)', 4), L('The port & pinout'), L('OBD-II protocols'), L('Services & PIDs', 6), L('Trouble codes decoded', 6), L('Readiness monitors', 4),
  ] },
  { id: 'can', track: 'tech', title: 'CAN Bus in Depth', phase: 5, lessons: [
    L('Why CAN exists', 4), L('The physical layer', 6), L('Anatomy of a frame', 7), L('IDs & arbitration', 6), L('Bit timing & bus speeds', 6),
    L('Errors & fault confinement', 6), L('CAN FD'), L('Multiple buses in one car'), L('How Ford organizes its networks', 6), L('ISO-TP & UDS diagnostics', 7),
  ] },
  { id: 'python', track: 'tech', title: 'Python for Car Data', phase: 5, lessons: [
    L('Python in five minutes', 6), L('Lists, loops & functions', 7), L('Text, hex & bytes', 7), L('Bits: shifts & masks', 7),
  ] },
  { id: 'decode', track: 'tech', title: 'Decoding Signals', phase: 5, lessons: [
    L('Scaling & offsets'), L('Bit packing', 6), L('Endianness', 6), L('Signed values'), L('Counters & checksums', 6), L('DBC files', 6),
  ] },
  { id: 're', track: 'tech', title: 'Reverse Engineering', phase: 5, lessons: [
    L('The RE mindset & setup'), L('Sniffing traffic'), L('Change one thing at a time', 6), L('Diffing captures', 6), L('Finding counters, checksums & constants', 6),
  ] },
  { id: 'tune', track: 'tech', title: 'ECU Tuning', phase: 5, lessons: [
    L("What's inside an ECU"), L('Maps: fuel, timing, boost', 7), L('How tuners modify maps', 6), L('Flashing & tuning tools'), L('Risks: engines, warranty & the law', 7),
  ] },
  { id: 'security', track: 'tech', title: 'Vehicle Cybersecurity', phase: 5, lessons: [
    L('Attack surfaces'), L('Landmark research', 7), L('Key fobs & theft attacks', 6), L('How manufacturers defend', 6), L('Rules, ethics & disclosure'),
  ] },
];

// Recommended order: fundamentals first, with bikes, culture and computers woven in once
// the systems they build on are covered. Rebuild concepts close the course.
export const path = [
  'engine', 'layout', 'scenes', 'air', 'boost', 'exhaust', 'cool', 'mengine',
  'network', 'elec', 'obd', 'drive', 'mdrive', 'motorsport', 'chassis', 'mchassis',
  'melec', 'perf', 'mods', 'can', 'python', 'decode', 're', 'icons', 'tune', 'security', 'buying', 'rebuild',
];
