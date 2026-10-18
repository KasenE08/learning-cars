// Terrain management modes
export default {
  steps: [
    { tag: 'metaphor', title: 'Camera presets for your car',
      body: [
        'Your phone camera has Portrait, Night and Sport modes. Same lens, same sensor: each mode just changes a **bundle of settings** at once.',
        'Drive modes work the same way. Turning the [[goat-modes|G.O.A.T. dial]] doesn’t add hardware; it loads a different set of calibrations for the hardware you have.',
      ] },
    { tag: 'how', title: 'The knobs a mode can turn',
      body: [
        '**Throttle mapping**: how much torque a given pedal position asks for. Sharp for Sport, soft and gradual for ice or rocks.',
        '**Shift schedule**: when the automatic upshifts, and how long it holds a lower gear.',
        '**Traction and stability control**: how much wheelspin or sliding is allowed before the brakes and engine step in.',
        '**AWD preload**: how hard the rear clutches clamp **before** anything slips. Plus, on Badlands, whether the **4x4 Lock** and **rear diff lock** switch on. Ford also mentions steering feel and sound in some modes.',
      ] },
    { tag: 'see', title: 'Same hardware, different settings', visualFirst: true,
      visual: { type: 'awd', mode: 'sand', scene: 'launch' },
      body: [
        'Flip between modes on the same scene and watch how the rear share changes.',
        'Ford doesn’t publish preload numbers for any mode. The values here only show the **direction** of the change (more off-road = more rear readiness), not real calibration.',
      ] },
    { tag: 'bronco', title: 'On-road modes',
      body: [
        '**Normal**: the default, balancing response and fuel use. Enthusiast sources say the car starts back in Normal every time.',
        '**Eco**: tuned for fuel efficiency.',
        '**Sport**: sharper throttle, holds lower gears longer and shifts quicker, sportier steering feel and sound.',
        '**Slippery** (snow, ice, wet): softer throttle, adjusted shift points, and **stricter** traction and stability control.',
      ],
      facts: ['bronco.goat', 'bronco.modesRoad'] },
    { tag: 'bronco', title: 'Off-road modes',
      body: [
        '**Sand** (soft sand or deep snow): Ford’s own description is vague. Owner reviews say it holds lower gears for momentum. Not confirmed by Ford.',
        '**Mud/Ruts** (Badlands): engages the **4x4 Lock** and allows more wheelspin, because spinning tires clear mud from the tread and keep you moving. **Sources disagree** on whether it also turns on the rear lock.',
        '**Rock Crawl** (Badlands): engages **4x4 Lock + rear diff lock**, and **damps the throttle** so you can creep over rocks smoothly. It also brings up the front trail camera at low speed.',
      ],
      facts: ['bronco.modesOff', 'bronco.rearLock'] },
    { tag: 'bronco', title: 'Trail Control: cruise control for trails',
      body: [
        '[[trail-control|Trail Control]] sets a crawl speed (about **1–20 mph**, 2–32 km/h) with the steering-wheel buttons. The car runs **throttle and brakes**; you just steer.',
        'Reverse is limited too: Ford’s page says under **5 mph (8 km/h)**; one review says 6 mph. Sources disagree.',
        'It’s on the 2024 Badlands per dealer listings and owner reports.',
      ],
      note: 'Trail Turn Assist and Trail 1-Pedal Drive are features of the full-size Bronco. No source found lists them for the Bronco Sport, so they’re left out here.',
      facts: ['bronco.trailControl'] },
  ],
  quiz: [
    { type: 'mc', q: 'Snowy road on the way to school. Which mode fits best?', options: ['Sport', 'Slippery', 'Rock Crawl', 'Mud/Ruts'], answer: 1,
      why: 'Slippery softens the throttle, adjusts shifting and tightens traction/stability control for snow, ice and wet roads.',
      wrong: { 3: 'Mud/Ruts allows more wheelspin on purpose. That helps in mud but is the opposite of what you want on an icy road.', 2: 'Rock Crawl locks things up for slow off-road crawling. Not for roads.' } },
    { type: 'mc', q: 'Why does Mud/Ruts let the wheels spin more?', options: ['To save fuel', 'Spinning clears mud from the tread and keeps momentum; cutting power would bog you down', 'To heat the tires', 'It doesn’t, it’s the same as Normal'], answer: 1,
      why: 'Strict traction control cuts power the moment a wheel spins. In mud that just stops you. A bit of controlled spin keeps you moving and cleans the tread.' },
    { type: 'mc', q: 'What does Rock Crawl switch on, per Ford?', options: ['Low range', '4x4 Lock and the rear diff lock', 'A rear stabilizer-bar disconnect', 'Trail Turn Assist'], answer: 1,
      why: 'Rock Crawl engages 4x4 Lock and the rear differential lock and damps the throttle. The Bronco Sport has no low range; the other two are full-size Bronco features.' },
    { type: 'mc', q: 'With Trail Control on, what does the driver do?', options: ['Nothing; it steers too', 'Steers; the car handles throttle and brakes at the set speed', 'Works the pedals; the car steers', 'Shifts gears manually'], answer: 1,
      why: 'Trail Control is low-speed off-road cruise control: you pick a speed with the steering-wheel buttons and steer, the car manages throttle and braking.' },
  ],
  cards: [
    { id: 'what', front: 'What does a drive mode change?', back: 'Calibrations, not hardware: throttle map, shift schedule, traction/stability limits, AWD preload, sometimes the locks.' },
    { id: 'slippery', front: 'Slippery mode?', back: 'Softer throttle, adjusted shifts, stricter traction/stability control: snow, ice, wet.' },
    { id: 'mud', front: 'Mud/Ruts mode?', back: 'Badlands: 4x4 Lock on, more wheelspin allowed to keep momentum.' },
    { id: 'rock', front: 'Rock Crawl mode?', back: 'Badlands: 4x4 Lock + rear diff lock, damped throttle for smooth creeping.' },
    { id: 'trail', front: 'Trail Control?', back: 'Low-speed off-road cruise: set ~1–20 mph, the car runs throttle and brakes, you steer.' },
  ],
};
