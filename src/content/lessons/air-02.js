// Throttle bodies & drive-by-wire
export default {
  steps: [
    { tag: 'metaphor', title: 'Faucet handle vs smart faucet',
      body: [
        'Old cars: the pedal pulls a cable that opens the throttle directly. Like turning a faucet handle.',
        'Drive-by-wire: your pedal is a **request**. A computer decides how far to open the valve. Like telling a smart faucet “medium flow” and letting it handle the rest.',
      ] },
    { tag: 'see', title: 'The throttle body', visualFirst: true,
      visual: { type: 'parts', drawing: 'intake' },
      body: [
        'Tap the **throttle**. On a turbo car it sits after the intercooler, right before the manifold.',
        'A housing with a round **butterfly plate** on a shaft. Plate edge-on = [[wot]]. Plate across the bore = nearly closed (idle).',
        'Gas engines control power by **restricting air**. That restriction costs work: [[pumping-loss]], one reason they’re least efficient at light load.',
      ] },
    { tag: 'how', title: 'The by-wire chain',
      body: [
        '**[[app-sensor|Pedal position sensor]]**: measures how far you press. Two independent signals, so a faulty one gets caught.',
        '**[[ecu|PCM]]**: reads the pedal plus speed, gear and traction data, decides how much torque to deliver, and picks a throttle angle.',
        '**Throttle motor**: a small electric motor (through gears) turns the plate. A doubled **[[tps|throttle position sensor]]** reports the real angle back.',
        'If the signals disagree, the PCM drops into reduced-power [[limp-mode]] and sets a trouble code. Springs park the plate slightly open so the engine can still run.',
      ] },
    { tag: 'why', title: 'Why every new car went by-wire',
      body: [
        '**Traction control** can close the throttle itself when a wheel spins, faster than your foot.',
        '**Cruise and adaptive cruise** just send a torque request. No extra cable-pulling actuator.',
        '**Idle speed, smooth shifts** (brief torque cuts during gear changes), launch control and drive modes all become software.',
        '“Sport” pedal maps often just open the throttle **more for the same pedal travel**. It feels quicker; peak power is the same.',
      ] },
    { tag: 'bronco', title: 'Trail Control needs the computer to own the throttle',
      body: [
        'Badlands **Trail Control** holds a set crawl speed off-road (under 20 mph forward, under 5 mph in reverse) while you just steer.',
        'That only works because the PCM can open the throttle (and the brake system can brake) with no foot involved.',
        'The G.O.A.T. modes also run through this system: same pedal, different software response.',
      ],
      facts: ['bronco.trailControl', 'bronco.goat'] },
    { tag: 'bikes', title: 'Ride-by-wire on bikes',
      body: [
        'Same idea with a twist grip: grip sensor → ECU → throttle motor. Bikes call it **ride-by-wire**.',
        'The RS 457 has it, which is what makes its 3 ride modes and traction control possible.',
      ],
      facts: ['rs457.electronics'] },
  ],
  quiz: [
    { type: 'order', q: 'Put the drive-by-wire chain in order.',
      items: ['You press the pedal', 'Pedal position sensor signals the PCM', 'PCM picks a throttle angle', 'Throttle motor turns the plate', 'Throttle position sensor confirms the angle'],
      why: 'Pedal = request, PCM = decision, motor = action, TPS = feedback so the PCM knows the plate actually went where it asked.' },
    { type: 'mc', q: 'Why does drive-by-wire make traction control much easier?', options: ['It makes the engine lighter', 'The PCM can close the throttle on its own when a wheel spins', 'It adds more brake pressure', 'It removes the need for a transmission'], answer: 1,
      why: 'With a cable, only your foot moves the throttle. By-wire, the computer can cut torque instantly, regardless of pedal position.' },
    { type: 'tap', q: 'Tap the **throttle**.', visual: { type: 'parts', drawing: 'intake' }, answer: 'throttle',
      why: 'The throttle body sits just before the intake manifold, after the intercooler on a turbo car.',
      wrong: { maf: 'That’s the MAF sensor: it measures air, it doesn’t control it.', manifold: 'The manifold is after the throttle; it splits the air to each cylinder.' } },
    { type: 'mc', q: 'Why are the pedal and throttle position sensors **doubled**?', options: ['To double the signal strength', 'So the PCM can cross-check them and catch a fault', 'One is for cold weather', 'One is for cruise control only'], answer: 1,
      why: 'A computer that controls power needs to know its inputs are real. If two readings disagree, it goes to limp mode instead of trusting a bad one.' },
  ],
  cards: [
    { id: 'dbw', front: 'Drive-by-wire chain?', back: 'Pedal sensor → PCM → throttle motor, with a throttle position sensor reporting back.' },
    { id: 'why-dbw', front: 'What does drive-by-wire enable?', back: 'Traction control, (adaptive) cruise, idle control, smooth shifts, drive modes, Trail Control.' },
    { id: 'limp', front: 'What happens if throttle sensor signals disagree?', back: 'Limp mode: reduced power and a trouble code.' },
    { id: 'pump-loss', front: 'What is pumping loss?', back: 'Work wasted pulling air past a partly closed throttle. Hurts light-load efficiency.' },
  ],
};
