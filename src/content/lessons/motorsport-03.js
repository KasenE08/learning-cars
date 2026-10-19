// NASCAR & ovals
export default {
  steps: [
    { tag: 'metaphor', title: 'A peloton at 180 mph',
      body: [
        'In a bike race, riders tuck in behind each other because the rider in front does the hard work against the wind. Pack riders save energy and go faster together.',
        'NASCAR on big ovals works the same way: 40 cars in tight lines, all using each other’s air. Who you team up with matters as much as how fast your car is.',
      ] },
    { tag: 'how', title: 'What NASCAR is',
      body: [
        'Founded in **1948** by Bill France Sr. in Daytona Beach, Florida. First “Strictly Stock” race: **1949**, Charlotte. First Daytona 500: **1959**.',
        'Three national series: **Cup** (the top), O’Reilly Auto Parts, and Trucks. Most tracks are ovals; a few road courses and a street race too.',
        'New for 2026: **“The Chase”** is back. The top 16 in regular-season points race a 10-race postseason, and the driver with the most points after the finale is champion. A race win is now worth 55 points.',
      ] },
    { tag: 'how', title: 'The Next Gen car',
      body: [
        'A [[stock-car]] once meant a showroom car. Today’s [[next-gen-car|Next Gen car]] (2022) is a purpose-built racer with a composite body shaped like a Camaro, Mustang or Camry.',
        'Mostly common parts from single suppliers to control cost: **5-speed sequential transaxle**, **independent rear suspension**, **18 in single-lug wheels**.',
        'Engine: a **358 ci (5.86 L) pushrod V8**, [[ohv|overhead-valve]], naturally aspirated. Cup cars used carburetors for about 62 years and switched to **fuel injection in 2012**.',
      ] },
    { tag: 'see', title: 'The sound of the V8', visualFirst: true,
      visual: { type: 'layout', layout: 'v8' },
      body: [
        'A [[cross-plane]] V8: even firing overall, uneven per bank, which gives the classic American rumble.',
        'Pushrods keep the engine short and low with one cam in the block. Old tech, but strong, compact and well understood.',
      ] },
    { tag: 'how', title: 'One engine, many power levels',
      body: [
        'NASCAR sets the power per track with a [[tapered-spacer]]: a plate under the throttle body, a type of [[air-restrictor]]. Smaller holes = less air = less power.',
        '2022–2025: about **670 hp** at most tracks. For 2026, road courses and tracks under 1.5 miles get **750 hp**.',
        'At [[superspeedway|superspeedways]] (Daytona, Talladega, Atlanta) the spacer is much tighter. Most reports put it near **510 hp**; we couldn’t confirm that figure from NASCAR itself.',
      ] },
    { tag: 'see', title: 'Drafting and banking', visualFirst: true,
      visual: { type: 'aero' },
      body: [
        'Drag climbs with speed squared, so at 180+ mph air is the biggest enemy. In [[drafting]], the car behind sits in the leader’s low-pressure wake; the leader also gains because the follower fills its turbulent “hole.” Together they beat a lone car.',
        '[[banking|Banked turns]] tilt the track (Daytona’s turns are banked **31°**), so the track itself pushes the car toward the inside and the tires need less grip.',
        'Less power at superspeedways keeps cars close together, so packs and big multi-car crashes are part of the show. ~~Fans argue about whether that’s good racing.~~',
      ] },
    { tag: 'why', title: 'What reached the road (and what didn’t)',
      body: [
        '“**Win on Sunday, sell on Monday**”: an old industry saying. Early stock cars really were showroom cars, so wins sold cars.',
        'Today the car shares almost nothing mechanical with the road car it looks like. The biggest legacy is **safety**: NASCAR made head-and-neck restraints mandatory in late 2001 after Dale Earnhardt’s fatal crash, and it helped bring energy-absorbing SAFER barriers to ovals.',
        'The pushrod V8 lives on in road cars like the Corvette, but that’s shared history, not trickle-down.',
      ] },
  ],
  quiz: [
    { type: 'num', q: 'The Cup engine is **358 cubic inches**. How many liters? (1 ci = 16.387 cc)', answer: 5.87, tol: 0.03, unit: 'L',
      hint: '358 × 16.387 = ? cc, then ÷ 1000',
      why: '358 × 16.387 = 5,867 cc ≈ **5.87 L**. Sources quote 5.86 or 5.9 L; that’s just rounding.' },
    { type: 'mc', q: 'Why can two drafting cars go faster than one car alone?', options: ['The leader pulls the follower with a vacuum', 'Together they leave less total turbulent wake, so the pair has less total drag', 'The follower gets more engine power', 'Drafting only helps the leader'], answer: 1,
      why: 'The follower sits in low-pressure air (less drag), and it fills the leader’s wake (the leader loses less to the low pressure behind it). Both benefit.',
      wrong: { 3: 'Both cars benefit, though the follower usually gains more.' } },
    { type: 'mc', q: 'NASCAR wants **less** power at Daytona than at a short track. What does it change?', options: ['A different engine', 'A tighter tapered spacer (smaller holes) under the throttle body', 'Lower octane fuel', 'A rev limiter only'], answer: 1,
      why: 'Same engine; the tapered spacer restricts airflow. Less air → less fuel can be burned → less power.' },
    { type: 'order', q: 'Put these NASCAR milestones in order.', items: ['NASCAR founded', 'First Daytona 500', 'Fuel injection replaces carburetors', 'Next Gen car debuts', '750 hp package + The Chase returns'],
      why: '1948 → 1959 → 2012 → 2022 → 2026.' },
  ],
  cards: [
    { id: 'nextgen', front: 'NASCAR Next Gen car (2022)?', back: 'Composite body, 5-speed sequential transaxle, independent rear, 18 in single-lug wheels, 358 ci pushrod V8.' },
    { id: 'spacer', front: 'Tapered spacer?', back: 'NASCAR’s air restrictor under the throttle body. Hole size sets the power: 750 hp short tracks/road courses (2026), 670 hp most ovals.' },
    { id: 'draft', front: 'Why drafting works?', back: 'Follower rides in low-pressure wake; leader’s wake gets filled. The pair has less drag than either car alone.' },
    { id: 'banking', front: 'What does banking do?', back: 'Tilts the turn so the track pushes the car inward, so tires need less grip. Daytona: 31°.' },
    { id: 'efi', front: 'When did Cup cars get fuel injection?', back: '2012, after about 62 years of carburetors.' },
  ],
};
