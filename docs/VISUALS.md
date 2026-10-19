# Visual catalog (use only these in lessons)

`visual: { type, ...spec }`. Everything is interactive SVG. "(new)" visuals are being built in parallel
with Phase 4a; their specs below are final, so use them exactly as written.

## Existing
- `cylinder` `{ mode: 'basic' | 'cycle' | 'geometry' }`: animated single-cylinder cutaway (play/pause/scrub).
  cycle = 4-stroke with valve lamps + gas colors; geometry = crank throw / stroke = 2r, one revolution.
- `parts` `{ drawing }`: tap a part → name, what it does, what it connects to, where it lives. Also the visual for `tap` quiz questions.
- `displacement` `{ cylinders?: boolean, preset?: 'bronco' | 'ninja' | 'rs457' }`: bore/stroke sliders → cc, L, ci, bore÷stroke.
- `compression` `{ swept?: 500, cr?: 10 }`: compression-ratio slider; clearance volume, ideal Otto efficiency, knock risk.
- `crank` `{ orders?: boolean, shake?: boolean }`: inline-4 side view, firing order 1-3-4-2 (toggle 1-2-4-3), primary/secondary shaking forces.
- `valvetrain` `{ profile?: 'stock' | 'hot' }`: cam lobe → bucket → valve with live lift curve.
- `timing` `{ view: 'chain' | 'circle' }`: timing chain 2:1 drive / valve-timing circle with VVT slider (overlap).
- `exploded` `{ assembly: 'engine' | 'gearbox' | 'diff' | 'turbo' | 'clutch' | 'wetclutch' }`: take-apart view with teardown order.
- `awd` `{ mode?: 'eco'|'normal'|'sport'|'slippery'|'sand'|'mud'|'rock', scene?: 'cruise'|'launch'|'ice'|'air'|'turn' }`:
  Bronco Sport Badlands torque flow (PTU, driveshaft, twin-clutch RDU, rear lock, TC braking). Illustrative.

## Parts drawings (for `parts` visuals and `tap` questions) and their part ids
- `engine-section`: head, camshaft, valves, plug, gasket, block, cylinder, jacket, piston, rod, crank, pan
- `piston`: crown, top-ring, second-ring, oil-ring, lands, skirt, pin-boss, wrist-pin, small-end, rod
- `head`: intake-cam, exhaust-cam, bucket, spring, guide, intake-valve, exhaust-valve, seat, intake-port, exhaust-port, plug, injector, chamber, coolant, gasket
- `car-top` (Bronco top X-ray): engine, turbo, intercooler, radiator, airbox, battery, pcm, transmission, ptu, driveshaft, rdu, axles, wheels, brakes, susp-front, susp-rear, steering, exhaust, fuel-tank
- `car-side`: engine, turbo, radiator, battery, transmission, ptu, driveshaft, rdu, wheels, brakes, susp-front, susp-rear, steering, exhaust, fuel-tank, intercooler, body
- `moto-side`: engine, gearbox, clutch, radiator, airbox, throttle, exhaust, tank, frame, fork, shock, swingarm, chain, front-brake, rear-brake, abs, ecu, battery, wheels, clipons, quickshifter, fairing
- `rdu` (twin-clutch rear drive unit): input, pinion, ring, clutch-l, clutch-r, actuators, outputs, case
### (new) system schematics with animated flow, also `parts` drawings
- `intake`: snorkel, filter, maf, compressor, intercooler, throttle, map, manifold, runners
- `fuel`: tank, pump, lp-line, hp-pump, rail, injectors, pressure-sensor, evap
- `exhaust`: manifold, turbine, wastegate, o2-up, cat, o2-down, resonator, muffler, tailpipe
- `cooling`: pump, jacket, thermostat, radiator, fan, heater-core, reservoir, bypass, temp-sensor
- `oil`: sump, pickup, pump, filter, gallery, mains, rods, cams, turbo-feed, piston-jets, pressure-sensor
- `charging`: alternator, belt, battery, starter, fuse-box, ground, loads, pcm
- `brakes`: pedal, booster, master, lines, abs, caliper, rotor, pads, wheel-sensor

## (new) Interactive visuals
- `layout` `{ layout: 'single'|'twin180'|'twin270'|'i4'|'i6'|'v6'|'v8'|'v8flat'|'boxer4'|'vtwin', pick?: boolean }`:
  front-view animation of the layout's pistons with firing flashes; readout of cylinders, bank angle, crank type,
  firing interval (°), and a one-line balance note. `pick: true` shows chips to switch layouts.
- `diffturn` `{ diff: 'open'|'lsd'|'locked'|'twinclutch', pick?: boolean, scene?: 'turn'|'slip' }` (key is `diff`, not `type`):
  top view of a driven axle; steering slider makes the outer wheel travel farther; shows each wheel's speed and
  torque, spider gears spinning (open/LSD), and what happens with one wheel on ice (`scene: 'slip'`).
- `turbo` `{ bov?: boolean }`: throttle + rpm sliders → exhaust flow → shaft speed (with lag) → boost gauge;
  wastegate opens at target boost; with `bov` a blow-off/bypass valve vents when the throttle snaps shut.
- `clutchengage` `{}`: clutch-pedal slider; engine rpm vs gearbox input rpm, slip %, clamp force, heat; stall if dumped at low rpm.
- `gearshift` `{}`: 2-shaft manual gearbox; pick N, 1–5 or R; the synchro sleeve slides, the power path lights up,
  ratio and output speed shown. Reverse uses an idler gear.
- `planetary` `{}`: animated planetary gearset; choose which member is input, which is held; shows ratio
  (reduction, overdrive, reverse, direct).
- `torqueconv` `{}`: engine rpm + vehicle speed sliders → impeller/turbine speeds, stator freewheel/locked,
  torque multiplication (up to ~2:1, illustrative), stall, lockup clutch toggle.
- `dyno` `{ engine: 'bronco'|'ninja'|'rs457'|'compare' }`: torque + hp curves with an rpm cursor
  (hp = lb-ft × rpm ÷ 5252 shown live). Curve shapes are illustrative, anchored to published peak figures.
- `gearing` `{ preset?: 'bronco'|'generic' }` (bronco = real 8F35 ratios 4.69…0.62, final 3.81, 28.5 in tire): gear ratios × final drive × tire diameter → road speed per
  1,000 rpm, rpm at a chosen speed, and torque multiplication at the wheels; editable.
- `suspension` `{ view: 'damper'|'types'|'align' }`: damper = bump animation (spring vs damper, too soft/too stiff);
  types = MacPherson / double wishbone / multi-link / solid axle side by side; align = camber, caster and toe sliders.
- `tire` `{ code?: '235/65R17 104T' }`: sidewall decoder; type a size, see each field explained and the
  overall diameter/circumference computed.
- `circuit` `{ view: 'fuse'|'relay' }`: battery → fuse → switch → load; overload to blow the fuse; relay view shows
  a small control current switching a big load current.
- `aero` `{}`: drag = ½ρ·Cd·A·v²; sliders for Cd, frontal area and speed; drag force and power needed to push through air.

## (new, Phase 4b) Motorcycle visuals
- `lean` `{}`: speed + turn-radius sliders → required lean angle (tan θ = v² ÷ (g·r)), front view of a bike leaning,
  a grip-limit marker, and a "Countersteer" button that plays the sequence: push right bar → front wheel steers left
  for an instant → bike falls right → turns right.
- `raketrail` `{ preset?: 'ninja' }`: side view of a front end; rake, fork offset and wheel radius sliders → trail
  (trail = (R·sin rake − offset) ÷ cos rake). Ninja preset = Kawasaki's 24.5° / 92 mm.
- `slipper` `{}`: aggressive downshift; engine-braking torque spike → rear wheel hop/chatter without a slipper clutch,
  controlled slip with one (ramps lift the pressure plate). Toggle slipper on/off.
- `quickshift` `{}`: timeline of an upshift with clutch vs quickshifter: sensor trigger, ignition/fuel cut (tens of ms),
  dogs disengage/re-engage, drive torque trace. Also shows an auto-blip downshift (bi-directional).
- `traction` `{}`: bike traction control: throttle, grip (dry/wet/gravel) and lean sliders → rear slip %, TC level 1–3 /
  off cutting torque; shows why lean angle changes the allowed slip (lean-sensitive TC needs an IMU).
- `gearing` also accepts a custom vehicle: `{ type: 'gearing', label, ratios: [...], primary?: n, front?: teeth, rear?: teeth,
  final?: n, tire: inches, redline }`. For bikes: overall = primary × gear × (rear ÷ front). Only use numbers you verified.

## (new, Phase 4b) Culture visuals (all data comes from your spec, so it must be verified)
- `timeline` `{ title?, events: [{ year: 1989, title: 'Short title', note?: 'one line' }] }`: tappable horizontal timeline.
- `compare` `{ title?, metrics: [{ key: 'hp', label: 'Power', unit: 'hp' }], items: [{ name: 'Car or bike', note?, values: { hp: 276 } }] }`:
  side-by-side bars per metric (2–6 items, 2–5 metrics). Missing values allowed (shown as "n/a").
- `checklist` `{ title?, groups: [{ name: 'Engine', items: [{ check: 'What to look at', why: 'What it tells you' }] }] }`:
  tappable inspection checklist with a progress bar (not saved).
