// Forks & shocks
export default {
  steps: [
    { tag: 'metaphor', title: 'Two pogo sticks and a door closer',
      body: [
        'Same team as on a car: a **spring** (the pogo stick) holds the bike up, a [[damper]] (the door closer) stops it bouncing.',
        'The difference: a bike carries them in just **three** places, two fork legs and one rear shock, and the rider is a huge share of the weight.',
        'Your weight, your gear and a passenger change the setup far more than on a car. That’s why bike suspension has a preload adjuster at least.',
      ] },
    { tag: 'how', title: 'Telescopic forks: right-way-up vs upside-down',
      body: [
        '[[conventional-fork|Conventional]]: thin [[stanchion|stanchions]] clamped at the top, fat sliders move with the wheel.',
        '[[usd-fork|Upside-down (USD)]]: fat tubes up in the [[triple-clamp|clamps]], thin stanchions at the bottom by the axle. Stiffer where bending loads are biggest (at the clamps), and the heavy part rides on the springs, so a bit less [[unsprung-weight]].',
        'USD downsides: costs more, and the exposed stanchions sit low where stones and grime hit the seals.',
        'Fork tube diameter alone doesn’t tell you quality: the damping inside matters more.',
      ] },
    { tag: 'how', title: 'Inside the fork: damper rod vs cartridge',
      body: [
        '[[damper-rod-fork|Damper rod]]: oil squeezed through a few fixed holes. Damping climbs with the **square** of speed, roughly: too soft on slow moves (dive), too harsh on sharp hits.',
        '[[cartridge-fork|Cartridge]]: a sealed damper inside the leg, with stacks of thin **shims** that bend open as flow rises. Much flatter, more controlled response.',
        'Same two jobs as on a car: [[compression-rebound|compression]] slows the wheel going up, **rebound** slows the spring pushing it back.',
      ] },
    { tag: 'see', title: 'Spring vs damper, one more time', visualFirst: true,
      visual: { type: 'suspension', view: 'damper' },
      body: [
        'Too little damping: the bike keeps pogoing after a bump. Too much: the wheel can’t drop back fast enough into the next dip and skips.',
        'On a bike that skipping means the tire briefly carries less load, which is lost grip mid-corner.',
      ] },
    { tag: 'how', title: 'Rear: monoshock and linkage',
      body: [
        'Most modern bikes use one [[monoshock]] under the seat, driven by the [[swingarm]].',
        'Many add a [[rising-rate|rising-rate linkage]] (Kawasaki calls it **Uni-Trak**): levers make the shock move more per mm of wheel travel as the wheel rises. Soft over small bumps, firm before bottoming.',
        'The wheel moves more than the shock does. That **leverage ratio** is why a rear [[spring-rate]] number means little without the linkage.',
      ] },
    { tag: 'how', title: 'Preload and sag (theory)',
      body: [
        '[[preload]] squashes the spring before your weight goes on. It changes **ride height and sag**, not the [[spring-rate]].',
        '[[sag]]: how far the bike sinks under its own weight and with you on board. It leaves travel to **extend** into dips as well as compress over bumps.',
        'A common rule of thumb is rider sag around a quarter to a third of travel; the owner’s manual or a suspension shop has the real target. If you can’t reach sag with preload, the spring rate is wrong for your weight.',
      ] },
    { tag: 'bikes', title: 'What your two bikes have',
      body: [
        '**Ninja 500**: 41 mm conventional fork, 120 mm (4.7 in) travel, no adjusters. Bottom-link Uni-Trak shock with adjustable preload, 130 mm (5.1 in) travel.',
        '**RS 457**: 41 mm USD fork, 120 mm travel, preload-adjustable. Monoshock with preload adjustment, 130 mm travel. No damping adjusters on either end.',
        'Neither bike lets you change damping. Both are tuned for the average rider; heavier or lighter riders are who notice it most.',
      ],
      facts: ['ninja.suspension', 'rs457.suspension'] },
  ],
  quiz: [
    { type: 'tap', q: 'Tap the part that suspends the **rear** wheel.', visual: { type: 'parts', drawing: 'moto-side' }, answer: 'shock',
      why: 'The monoshock sits under the seat and controls the swingarm. The swingarm holds the wheel; the shock does the springing and damping.',
      wrong: { swingarm: 'The swingarm holds the wheel and pivots, but the shock is the spring and damper.', fork: 'That’s the front suspension.' } },
    { type: 'mc', q: 'Turning up **preload** mainly changes…', options: ['Spring rate', 'Ride height and sag', 'Rebound damping', 'Fork offset'], answer: 1,
      why: 'Preload just compresses the spring a bit before load goes on. The spring’s rate (force per mm) stays the same.',
      wrong: { 0: 'The classic myth. Only a different spring changes the rate.' } },
    { type: 'mc', q: 'Why is an upside-down fork stiffer?', options: ['It uses thicker oil', 'The fat tubes sit in the clamps, where bending loads are biggest', 'It has more travel', 'It has a linkage'], answer: 1,
      why: 'Braking and cornering loads bend the fork most near the triple clamps. Putting the big tubes there resists it best.' },
    { type: 'mc', q: 'A damper-rod fork is often described as harsh on sharp bumps but soft under braking. Why?', options: ['Fixed holes: damping is weak at low speed and climbs steeply at high speed', 'Its springs are too stiff', 'It has no oil', 'It has too much trail'], answer: 0,
      why: 'Flow through a fixed hole rises roughly with the square of speed. Cartridges use flexing shims to flatten that curve.' },
  ],
  cards: [
    { id: 'usd', front: 'USD vs conventional fork?', back: 'USD: fat tubes on top in the clamps, stiffer, slightly less unsprung weight. Conventional: thin stanchions on top, simpler, cheaper.' },
    { id: 'cart', front: 'Damper rod vs cartridge?', back: 'Damper rod: fixed holes, damping climbs steeply with speed. Cartridge: flexing shim stacks, more controlled.' },
    { id: 'preload', front: 'What does preload change?', back: 'Ride height and sag, not spring rate.' },
    { id: 'sag', front: 'Why have sag at all?', back: 'So the wheel can extend into dips as well as compress over bumps.' },
    { id: 'unitrak', front: 'What is Uni-Trak?', back: 'Kawasaki’s rising-rate rear linkage: soft at the start of travel, firmer near bottoming.' },
  ],
};
