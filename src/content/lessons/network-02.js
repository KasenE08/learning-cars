// Sensors → ECU → actuators
export default {
  steps: [
    { tag: 'metaphor', title: 'The shower knob',
      body: [
        'You step into a shower: too cold. You turn the knob, wait, feel again, nudge it back. **Feel → compare → adjust → feel again.**',
        'Your skin is the **sensor**, your brain the **controller**, your hand on the knob the [[actuator]].',
        'Every module in a car runs loops like this, many times per second, without getting bored.',
      ] },
    { tag: 'see', title: 'Pedal to throttle', visualFirst: true,
      visual: { type: 'sensorloop', loop: 'throttle' },
      body: [
        'With [[drive-by-wire]] there’s no cable. The [[app-sensor|pedal sensor]] reports how far you pressed; the PCM decides how much air the engine should get.',
        'The PCM drives the throttle motor, then reads the [[tps|throttle position sensors]] to check it got there. That check is the **feedback**.',
      ] },
    { tag: 'how', title: 'Open loop vs closed loop',
      body: [
        '**Open loop:** act from a table, don’t check the result. Fast and simple, but it can’t notice drift (like a toaster on a timer).',
        '**Closed loop:** measure the result, compute the **error** (target − actual) and correct it. That’s a [[feedback-loop]].',
        'Engines use both: [[closed-loop|closed-loop fueling]] from the O2 sensor when warm; open loop at cold start and full throttle.',
        'Sensor physics (thermistors, Hall sensors, O2 cells) is in the Electrical unit’s *Sensors & actuators*. Here we care about the loop.',
      ] },
    { tag: 'see', title: 'Fan control: on/off with a gap', visualFirst: true,
      visual: { type: 'sensorloop', loop: 'fan' },
      body: [
        'Coolant temp sensor → PCM → radiator fan. The simplest loop: fan on when hot, off when cool.',
        'The on and off points are set apart ([[hysteresis]]). Otherwise the fan would click on and off every second around one temperature.',
      ] },
    { tag: 'math', title: 'Why loops must be fast',
      body: [
        'At 100 km/h (62 mph) a car covers `100 ÷ 3.6 ≈ 27.8 m` every second.',
        'A loop that runs every **10 ms** acts again every `27.8 × 0.01 ≈ 0.28 m` (11 in). One every **100 ms** waits 2.8 m (9 ft) between corrections.',
        'So brakes, steering and engine timing run fast loops; climate control can be slow. ~~Real loop rates are carmaker secrets; these are round numbers.~~',
      ] },
    { tag: 'see', title: 'ABS: a loop at every wheel', visualFirst: true,
      visual: { type: 'sensorloop', loop: 'abs' },
      body: [
        '[[wheel-speed-sensor|Wheel-speed sensors]] → [[abs]] module → valves that drop, hold and rebuild brake pressure at each wheel.',
        'If one wheel slows much faster than the car, it’s about to lock. The module releases that wheel’s pressure, then reapplies. Several times a second.',
      ] },
    { tag: 'how', title: 'Trust, but verify; share, don’t duplicate',
      body: [
        '**Plausibility:** the pedal has two sensors that must agree. If they don’t, the PCM sets a code and drops to [[limp-mode]]. That’s a [[plausibility-check]].',
        '**Sharing:** one sensor, many users. The ABS module turns wheel speeds into a vehicle speed and broadcasts it; the PCM, cluster, AWD and steering all read it from the bus.',
        'That’s why one bad sensor can light up several warnings at once.',
      ] },
    { tag: 'bronco', title: 'Loops you can see on your Bronco’s bus',
      body: [
        'The openpilot Ford signal file (community reverse-engineered, **not from Ford**) shows exactly this sharing on the main bus:',
        '`0x415` from **ABS_ESC** carries `Veh_V_ActlBrk`, the vehicle speed the brake system computed. `0x204` from the powertrain computer carries `ApedPos_Pc_ActlArb` (pedal %) and `EngAout_N_Actl` (engine rpm).',
        '~~The file labels that sender “PCM_HEV”, a quirk of the shared Ford/Lincoln file.~~ Later lessons decode these from **simulated** drives with made-up values.',
      ],
      facts: ['bronco.stability'] },
  ],
  quiz: [
    { type: 'order', q: 'Put one pass of a closed control loop in order.',
      items: ['Sensor measures', 'Module compares with the target', 'Module drives the actuator', 'Sensor measures the result'],
      why: 'Measure → compare (error) → act → measure again. The second measurement is what makes it *closed* loop.' },
    { type: 'mc', q: 'The two pedal sensors suddenly disagree. What does a well-designed PCM do?',
      options: ['Averages them and carries on', 'Ignores the pedal and holds the last value forever', 'Sets a fault code and limits power (limp mode)', 'Opens the throttle fully to be safe'], answer: 2,
      why: 'Two sensors exist so a failure can be caught. When they disagree the PCM can’t know which one is right, so it logs a code and falls back to a safe, limited mode.' },
    { type: 'mc', q: 'Why might one failed wheel-speed sensor turn on several dash warnings at once?',
      options: ['It shorts the battery', 'Many modules (ABS, stability, AWD, cluster) use that shared signal from the bus', 'Every warning light is on the same fuse', 'It doesn’t; that’s a myth'], answer: 1,
      why: 'Sensor data is shared over the network. Lose one signal and every module that relied on it may flag a fault.' },
  ],
  cards: [
    { id: 'loop', front: 'Steps of a closed control loop?', back: 'Measure → compare with target (error) → drive actuator → measure again.' },
    { id: 'openclosed', front: 'Open loop vs closed loop?', back: 'Open: act from a table without checking. Closed: measure the result and correct the error.' },
    { id: 'hyst', front: 'Why does a fan turn on and off at different temperatures?', back: 'Hysteresis: a gap between thresholds stops it flickering on and off.' },
    { id: 'plaus', front: 'Why two pedal sensors?', back: 'Plausibility: if they disagree, the PCM knows something failed and goes to limp mode.' },
    { id: 'share', front: 'Who computes the vehicle speed many modules use (on Fords, per openpilot)?', back: 'The brake system (ABS_ESC), from the wheel-speed sensors, broadcast as `Veh_V_ActlBrk` in `0x415`.' },
  ],
};
