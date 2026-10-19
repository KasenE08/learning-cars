// Buying a used sport bike
export default {
  steps: [
    { tag: 'metaphor', title: 'Like buying a used phone',
      body: [
        'With a used phone, you check the corners first: scuffed corners = it’s been dropped. Bikes are the same, because unlike cars, **bikes fall over**.',
        'A tip-over in a driveway is cosmetic. A crash at speed can bend things you can’t see. Your job is telling them apart, or paying someone who can.',
        'No pressure: a good used bike is a great deal, and walking away from a bad one is a win too.',
      ] },
    { tag: 'how', title: 'Crash clues on the outside',
      body: [
        '**Bar ends, lever tips, mirrors, footpeg ends**: ground-off metal or paint, bent or mismatched aftermarket levers.',
        '[[frame-slider|Frame sliders]] scuffed flat, scratched engine covers, cracked fairing tabs, zip ties, or brand-new plastics on an old bike.',
        'Look **both sides**. One scuffed side = probably a tip-over. Damage at the front, bent bars and scraped tank = a harder crash.',
      ] },
    { tag: 'how', title: 'Is it straight? (concept)',
      body: [
        'With the front wheel pointing straight ahead, the bars should be square too. If they’re not, something is twisted or bent.',
        'Fork legs: look for oil on the [[stanchion|stanchions]] (leaking seals), pitting, or tubes that don’t look parallel. A fork twisted in its clamps is a cheap fix; a **bent** tube is not.',
        'The frame and [[steering-head]] carry everything. Cracks, kinks, or ground-off paint on frame rails and footpeg mounts are serious. Shops can measure straightness properly.',
        'Rear wheel should line up with the front. Crooked tracking can mean a bent swingarm or frame.',
      ] },
    { tag: 'see', title: 'Know the parts you’re checking', visualFirst: true,
      visual: { type: 'parts', drawing: 'moto-side' },
      body: [
        'Tap the frame, fork, swingarm, chain and wheels: those are the expensive things to find bent or worn.',
        'Clip-ons, levers and fairings are cheap to replace, but they’re the **evidence** of what happened.',
      ] },
    { tag: 'how', title: 'Chain, sprockets and tires',
      body: [
        'Chain: rust, stiff (kinked) links, and too much slack. [[hooked-sprocket|Hooked sprocket teeth]] mean chain and sprockets are due together.',
        'Sprocket sizes: a much bigger rear sprocket than stock can mean stunting or just quicker gearing. Ask why. Stock Ninja 500: **14/43**.',
        'Tires: read the [[dot-date-code|DOT date]] (old rubber has less grip even with tread) and the shape: a flat-squared center = mostly straight-line miles.',
      ],
      facts: ['ninja.sprockets'] },
    { tag: 'how', title: 'Records, valves and history',
      body: [
        'Ask for **service records**. DOHC bikes need periodic **valve clearance checks** ([[valve-lash]]): a skipped check is a real cost.',
        'Reported intervals: Ninja 500 **24,000 km (15,000 mi)**; RS 457 also about 24,000 km. Both figures are third-party; confirm in the owner’s manual.',
        '[[stunt-bike|Stunt]] history: crash cage, hand brake, worn tank and tail, oversized rear sprocket. Hard on clutch, chain and frame. **Track** bikes (drilled bolts for safety wire, race bodywork, no mirrors) are often well maintained but used hard. Ask, and price it in.',
        'Title and VIN: the VIN on the steering head must match the title. [[title-brand|Title brands]] and NHTSA’s recall lookup work for bikes too.',
      ],
      facts: ['ninja.valveCheck', 'rs457.service'] },
    { tag: 'see', title: 'Used sport bike checklist', visualFirst: true,
      visual: { type: 'checklist', title: 'Used sport bike inspection',
        groups: [
          { name: 'Paperwork', items: [
            { check: 'VIN on the steering head matches the title', why: 'A mismatch or ground-off number = walk away.' },
            { check: 'Title brand and open recalls', why: 'Salvage and rebuilt bikes cost more to insure and are worth less.' },
            { check: 'Service records, incl. valve check', why: 'Proof of care; a skipped valve check is a known cost.' },
          ] },
          { name: 'Crash evidence', items: [
            { check: 'Bar ends, levers, pegs, mirrors, sliders', why: 'Scrapes tell you which side it went down on, and how hard.' },
            { check: 'Bars square with the front wheel; forks parallel', why: 'Twisted or bent front end after a crash.' },
            { check: 'Frame rails and subframe: cracks, kinks, ground-off paint', why: 'Structural damage, the expensive kind.' },
          ] },
          { name: 'Wear items', items: [
            { check: 'Chain slack and rust; sprocket teeth shape', why: 'Hooked teeth = chain and sprockets due.' },
            { check: 'Tire DOT dates and wear shape', why: 'Old rubber grips less; flat center = straight-line miles.' },
            { check: 'Fork seals dry, brakes firm', why: 'Leaks and spongy brakes are safety items.' },
          ] },
          { name: 'Running', items: [
            { check: 'Cold start, idle, no smoke or rattles', why: 'Engine health, same as a car.' },
            { check: 'Clutch doesn’t slip; shifts cleanly', why: 'Slip under load = worn clutch, common on stunted bikes.' },
          ] },
          { name: 'Before paying', items: [
            { check: 'Shop inspection if anything looks off', why: 'A bike shop can check alignment, steering-head bearings and frame straightness.' },
          ] },
        ] },
      body: [
        'Tap through it as you look. A seller who won’t let a shop look at it is giving you an answer.',
        'Bring a friend who rides; a second pair of eyes catches what excitement hides.',
      ] },
    { tag: 'bikes', title: 'The money you don’t see: insurance',
      body: [
        'Riders **under 25** pay the most, and **sport bikes** cost more to insure than standards or cruisers. Big sport bikes with a young rider can cost thousands per year.',
        'Many insurers discount for an MSF course (sources quote roughly 5–20%; it varies by company and state).',
        '**Get quotes for the Ninja 500 and the RS 457 before you buy.** Same rider, similar power, but insurers rate models differently. Budget gear too: a good helmet, jacket, gloves, boots.',
        'Opinion: a new bike with a warranty can make more sense than a cheap used one with a mystery history. Both are fine choices if you go in informed.',
      ] },
  ],
  quiz: [
    { type: 'tap', q: 'On most motorcycles the VIN is stamped on the steering head. Tap the part it belongs to.', visual: { type: 'parts', drawing: 'moto-side' }, answer: 'frame',
      why: 'The steering head is the front of the **frame**, where the fork pivots. The VIN stamped there must match the title.',
      wrong: { fork: 'The fork turns inside the steering head, but the VIN is on the frame itself.', tank: 'The tank is removable; VINs go on the frame so they stay with the bike.' } },
    { type: 'mc', q: 'Only the **left** side has scuffed bar end, lever and slider; frame and forks look fine. Most likely?', options: ['High-speed crash', 'A tip-over or low-speed drop on the left', 'Stunting', 'Track use'], answer: 1,
      why: 'One-sided, cosmetic scrapes usually mean it fell over. Still check the bars are square and the lever works, but this is often fine.' },
    { type: 'num', q: 'A tire’s DOT code ends in **1219**. What year was it made?', answer: 2019, tol: 0,
      why: 'Week 12 of **2019**. In late 2026 that tire is 7+ years old: past many makers’ suggested limit, whatever the tread looks like.' },
    { type: 'mc', q: 'The rear sprocket teeth are **hooked** like waves. What does that mean?', options: ['Normal for new sprockets', 'Chain and sprockets are worn and should be replaced together', 'Only the chain needs lube', 'The bike has a slipper clutch'], answer: 1,
      why: 'Hooked teeth = worn sprockets. A new chain on worn sprockets (or the reverse) wears out fast, so they’re replaced as a set.' },
  ],
  cards: [
    { id: 'crash', front: 'Where do crash clues show on a sport bike?', back: 'Bar ends, lever tips, pegs, mirrors, sliders, fairing tabs, frame rails. Check both sides.' },
    { id: 'straight', front: 'Quick straightness check (concept)?', back: 'Bars square when the wheel points straight; forks parallel; rear wheel in line with the front.' },
    { id: 'hooked', front: 'Hooked sprocket teeth?', back: 'Worn sprockets: replace chain and sprockets together.' },
    { id: 'valves', front: 'Why ask about valve checks?', back: 'DOHC bikes need periodic clearance checks (Ninja 500 reported at 15,000 mi); a skipped one is a real cost.' },
    { id: 'insure', front: 'Insurance reality for a new young rider?', back: 'Under 25 + sport bike = high premiums. Get quotes for each model before buying; ask about MSF discounts.' },
  ],
};
