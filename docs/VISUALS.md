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
- `layout` `{ layout: 'single'|'twin180'|'twin270'|'i4'|'i4x'|'i6'|'v6'|'v8'|'v8flat'|'boxer4'|'vtwin', pick?: boolean }`:
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

## (new, Phase 5) Track 4 visuals
Real Ford IDs/signals come from `src/core/can/ford.js` (community DBC, see CONTENT_GUIDE Phase 5 notes);
signal names below are exact names from that file. "SIMULATED" data comes from `src/core/can/sim.js` scenarios
(`idle`, `drive`, `blinker`, `steer`, `doors`, `pedal`, `brake`).

### Networks & OBD
- `network` `{ preset?: 'generic'|'ford', highlight?: '<moduleId>' }`: tappable map of ECUs on buses with a gateway
  and the OBD port. `generic`: ECM, TCM, ABS, EPS, airbag (SRS), BCM, cluster, infotainment, telematics, gateway on
  powertrain/chassis/body/infotainment buses. `ford`: module names seen on the main bus in the community DBC (PCM,
  ABS_ESC, PSCM, IPMA_ADAS camera, GWM gateway, TCCM) plus typical Ford body/infotainment modules (BCM, IPC, APIM/SYNC,
  TCU) behind the gateway, labeled "simplified; exact Bronco Sport wiring isn't public". Module ids: `ecm`, `tcm`,
  `abs`, `eps`, `srs`, `bcm`, `ipc`, `info`, `tcu`, `gw`, `obd`, `cam`, `awd`.
- `sensorloop` `{ loop: 'throttle'|'abs'|'fan' }`: animated sensor → ECU → actuator loop with live values
  (pedal sensor → PCM → electronic throttle; wheel-speed sensors → ABS module → valves; coolant temp → PCM → fan).
- `obdport` `{ highlight?: 'can'|'power'|'kline'|'j1850' }`: the 16-pin J1962 connector, tappable pins (2/10 J1850,
  4 chassis ground, 5 signal ground, 6/14 CAN high/low, 7/15 K/L-line, 16 battery +12 V). Chips filter by protocol.
- `pid` `{ pid?: '0C' }`: Mode 01 request/response builder. PIDs 04 load, 05 coolant, 0B MAP, 0C rpm, 0D speed,
  0F intake temp, 10 MAF, 11 throttle, 2F fuel level, 46 ambient temp. Shows `7DF [02 01 0C …]` → `7E8 [04 41 0C A B …]`,
  the SAE formula with A/B filled in, and a slider for the real value.
- `dtc` `{ code?: 'P0301' }`: type a code → letter (P/C/B/U), generic vs manufacturer digit, subsystem, fault;
  also shows the 2-byte encoding used in Mode 03 responses.

### CAN
- `busvolts` `{}`: CAN_H / CAN_L voltages for a few bits, dominant (≈3.5 V / 1.5 V) vs recessive (both ≈2.5 V),
  "add noise" (both wires shift together; the difference survives) and "remove a terminator" (ringing) toggles.
- `canframe` `{ id?: number, data?: 'hex', extended?: false }`: a real bit-level classic CAN frame: SOF, ID, RTR,
  IDE, r0, DLC, data, CRC-15 (computed), CRC delimiter, ACK, EOF, with stuff bits marked. Tap a field to explain it.
  Edit ID and data to see stuffing and CRC change. Defaults to `0x415` with a simulated speed.
- `arbitration` `{ ids?: [number, number, number] }`: nodes start sending at once; bit by bit, a dominant 0
  overwrites a recessive 1, losers drop out; lowest ID wins. User can change the IDs.
- `bittiming` `{ bitrate?: 125000|250000|500000|1000000 }`: one bit split into sync / propagation / phase 1 /
  phase 2 time quanta, sample point (e.g. 75–87.5%), bit time in µs, and a rough bus-length limit (rule of thumb).
- `errors` `{}`: transmit/receive error counters (TEC/REC) with buttons (error, successful frame); states error-active
  → error-passive (>127) → bus-off (TEC >255), and recovery.
- `canfd` `{}`: classic CAN vs CAN FD frame: 8 vs up to 64 data bytes, bit-rate switch in the data phase,
  payload efficiency bars.
- `isotp` `{ example?: 'vin' }`: ISO-TP multi-frame transfer of a VIN (Mode 09 PID 02): single/first/flow-control/
  consecutive frames, PCI bytes highlighted, reassembled text. Uses a made-up VIN with a valid check digit.
- `uds` `{ highlight?: '22' }`: UDS service list (10, 11, 14, 19, 22, 27, 2E, 31, 34, 36, 37, 3E) each tagged READ /
  CHANGES STATE / WRITES, example request/response for 0x22 F190 (VIN) and a negative response (0x7F + NRC).
  Says plainly which ones the app's read-only mode will never send.

### Decoding & reverse engineering
- `bitfield` `{ signal?: '<Ford signal name>', data?: 'hex', custom?: { start, length, endian: 'big'|'little',
  signed?, scale?, offset?, unit? }, editable?: true }`: 8×8 bit grid of a frame; highlights the signal's bits in
  order MSB→LSB, shows raw binary → raw number → physical value. With `editable`, sliders for start/length and
  an Intel/Motorola toggle. Default signal `Veh_V_ActlBrk`.
- `scaling` `{ scale?: 0.01, offset?: 0, unit?: 'km/h', bits?: 16 }`: raw ↔ physical line, `physical = raw × scale +
  offset`, with range and resolution readouts.
- `twos` `{ bits?: 8 }`: number wheel showing the same bits as unsigned vs two's complement signed.
- `checksum` `{ mode?: 'ford'|'mac' }`: `ford`: frames of 0x415 BrakeSysFeatures with the rolling counter and
  openpilot's documented Ford checksum recomputed live; "tamper a byte" → receiver rejects. `mac`: the same idea with
  a secret-key message authentication code + freshness counter (SecOC concept): a replayed or altered frame fails.
- `candump` `{ scenario?: 'drive', ids?: [hex numbers], highlight?: true }`: scrolling SIMULATED candump view,
  pause, filter by ID, bytes that just changed flash. Also a per-ID table (count, rate, last data) toggle.
- `capdiff` `{ base?: 'idle', action?: 'blinker' }`: compares two SIMULATED captures: for each ID and byte, how often
  it changed in each; bytes that change only in the action capture light up. Tap one to see its values.
- `sigplot` `{ scenario: 'drive', id: number, start?: number, length?: number, endian?: 'big'|'little', editable?: true }`:
  plots a chosen bit range of one ID over time. With the right bits the curve is smooth; with the wrong ones it's
  noise or a sawtooth. Great for "find the speed signal".

### Tuning
- `ecumap` `{ map?: 'fuel'|'ignition'|'boost', editable?: true }`: rpm × load table as a heat map (ILLUSTRATIVE
  numbers, not a real calibration), with interpolation between cells shown for a moving operating point; editing a
  cell shows the trade-off (e.g. more timing → more torque until the knock margin runs out).
- `parts` drawing `ecu` (ECU circuit board), parts: `connector`, `power`, `mcu`, `flash`, `ram`, `eeprom`, `hsm`,
  `can-xcvr`, `adc`, `drivers`, `knock`.

### Security
- `attack` `{ highlight?: 'obd'|'telematics'|'wireless'|'infotainment'|'keyfob'|'tpms'|'can-wiring' }`: car-top map
  of attack surfaces (remote vs physical), tap one for what it is, a landmark public case, and the defenses.
- `fob` `{ mode?: 'rolling'|'relay' }`: `rolling`: fob counter vs car's acceptance window; a replayed old code is
  rejected. `relay`: concept animation of a relay extending a keyless fob's range, and the countermeasures (motion-
  sensing fobs, UWB distance bounding, PIN-to-drive). Concept only.

## (new, Phase 6) CAN bench
- `canbench` `{ controls?: ['pedals','steer','shifter','turn','lights','wipers','doors','belt','parkbrake','ignition'], view?: 'log'|'table'|'decode', ids?: [numbers], names?: boolean }`:
  a compact live SIMULATED car + bus view inside a lesson (no recorder). Default controls: pedals, shifter, turn.
  Use `ids` to filter the view to the messages the step is about; `names: true` shows DBC message names.
  The full bench (recording, export .log / SavvyCAN CSV, import, compare captures, 11 challenges) is at `#/lab/can`.
