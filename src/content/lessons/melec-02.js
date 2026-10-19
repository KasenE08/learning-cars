// Motorcycle ABS
export default {
  steps: [
    { tag: 'metaphor', title: 'A spotter with a hand on your lever',
      body: [
        'Imagine a friend riding pillion with a hand over yours on the brake lever. The instant the front tire starts to skid, they ease your fingers off a hair, then let you squeeze again.',
        'That’s [[abs]] on a bike, done many times a second by a computer.',
        'On a car a locked wheel means you can’t steer. On a bike a locked **front** wheel usually means the bike falls over within a moment.',
      ] },
    { tag: 'why', title: 'Why bikes need it even more',
      body: [
        'A spinning front wheel helps hold the bike up and steer it. Locked, it slides and the front tucks under.',
        'A locked **rear** skids sideways. Release it suddenly while it’s out of line and the tire can grip hard and flick the bike over (a highside).',
        'In a panic stop, people tend to grab or stomp. ABS catches the skid that grab would cause. IIHS’s largest study (65 models) found ABS bikes had about **22% fewer** fatal crash involvements per registered bike-year; an older, smaller study put it at 31%.',
        'The US doesn’t require ABS on motorcycles; the EU made it mandatory on new bikes over 125 cc (new models from 2016, all new bikes from 2017).',
      ] },
    { tag: 'see', title: 'Same loop as a car, two channels', visualFirst: true,
      visual: { type: 'parts', drawing: 'brakes' },
      body: [
        'A [[wheel-speed-sensor]] reads a toothed ring on each wheel. The ABS unit compares them with how fast the bike can really be slowing.',
        'Wheel about to lock → valve **holds**, **releases**, then **reapplies** pressure. A small pump returns the fluid. You feel it as pulsing in the lever and pedal.',
        '**Dual-channel** = front and rear each have their own sensor and valve, controlled separately.',
      ] },
    { tag: 'how', title: 'Extra tricks',
      body: [
        '[[rear-lift-mitigation|Rear-lift mitigation]]: if the rear wheel slows sharply because it’s lifting off the ground in a very hard stop, ABS eases front pressure so the bike doesn’t go over the bars.',
        '**Switchable rear ABS**: some sport bikes let you turn off rear ABS (front stays on) for track riding. That’s a track feature, not a street one.',
        '[[linked-brakes|Linked or combined]] systems also apply some front brake when you press the rear pedal.',
      ] },
    { tag: 'how', title: 'Cornering ABS needs an IMU',
      body: [
        'Leaned over, the tire is already using much of its grip to turn. Grab the brake and there’s little left, and braking forces also try to **stand the bike up** and run it wide.',
        '[[cornering-abs|Cornering ABS]] uses an [[imu]] (gyros + accelerometers) to know the lean angle. It limits how much and how fast pressure builds as lean grows.',
        'Bosch’s cornering system (MSC) debuted on the 2014 KTM 1190 Adventure, marketed as the first production bike with ABS that worked leaned over. It’s now common on bigger premium bikes; in the 500 cc class it’s rare.',
        'Even cornering ABS can’t create grip. It only uses what the tire has left.',
      ] },
    { tag: 'bikes', title: 'Your two bikes’ ABS',
      body: [
        '**Ninja 500**: dual-channel ABS, always on, not cornering. In the US Kawasaki also sells a non-ABS version, so it’s worth checking which one a listing is.',
        '**RS 457**: dual-channel ABS, not cornering (no IMU). Most sources say rear ABS can be switched off for the track; one US review says it’s always on, so it may differ by market.',
        'Neither has cornering ABS. Both still give the big win: a panic grab in a straight line is much less likely to lock a wheel.',
      ],
      facts: ['ninja.abs', 'rs457.abs'] },
  ],
  quiz: [
    { type: 'tap', q: 'Tap the part that tells ABS a wheel is about to lock.', visual: { type: 'parts', drawing: 'brakes' }, answer: 'wheel-sensor',
      why: 'The wheel speed sensor reads the toothed ring. A sudden drop in speed means a lock is starting.',
      wrong: { abs: 'That’s the unit that acts on the signal (valves + pump), not the sensor.' } },
    { type: 'mc', q: 'What extra sensor does **cornering** ABS need?', options: ['A second wheel speed sensor', 'An IMU that measures lean angle', 'A brake temperature sensor', 'GPS'], answer: 1,
      why: 'Lean angle decides how much grip is left for braking. Only an IMU (gyros + accelerometers) measures it.',
      wrong: { 0: 'Normal dual-channel ABS already has one per wheel. That tells it about locking, not lean.' } },
    { type: 'mc', q: 'Why can a locked **rear** that suddenly regrips be dangerous?', options: ['It overheats the brake', 'A rear that has slid out of line can grip hard and flick the bike over (highside)', 'It stalls the engine', 'It bends the swingarm'], answer: 1,
      why: 'The tire snaps back into grip while the bike is sideways, throwing it the other way.' },
    { type: 'order', q: 'Order one ABS cycle on a bike.', items: ['Wheel speed drops faster than the bike can slow', 'ABS unit closes the inlet valve (hold)', 'Releases pressure', 'Wheel spins back up', 'Pressure reapplied'],
      why: 'Sense, hold, release, recover, reapply, repeated many times a second.' },
  ],
  cards: [
    { id: 'why', front: 'Why is ABS even more important on a bike?', back: 'A locked front wheel usually means the front tucks and the bike falls.' },
    { id: 'dual', front: 'Dual-channel ABS?', back: 'Front and rear each have their own sensor and valve, controlled separately.' },
    { id: 'rlm', front: 'Rear-lift mitigation?', back: 'ABS eases front pressure when it sees the rear wheel lifting in a hard stop.' },
    { id: 'cabs', front: 'What does cornering ABS add?', back: 'An IMU’s lean angle, to limit brake pressure and its build-up rate while leaned.' },
    { id: 'bikes', front: 'Do the Ninja 500 or RS 457 have cornering ABS?', back: 'No. Both are dual-channel ABS without an IMU.' },
  ],
};
