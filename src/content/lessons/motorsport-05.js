// Drifting & drag racing
export default {
  steps: [
    { tag: 'metaphor', title: 'Figure skating vs the 100-meter dash',
      body: [
        '**Drifting** is figure skating: judges score how you did it (line, angle, style), not just how fast.',
        '**Drag racing** is the 100 m dash: two lanes, a start light, a finish line. The start matters as much as top speed.',
        'Both grew out of street culture, and both moved to tracks for the same reason: on the street, people die.',
      ] },
    { tag: 'how', title: 'Drifting: how it’s judged',
      body: [
        'Roots: Japanese mountain-road (touge) driving. Keiichi Tsuchiya, the “Drift King,” and Daijiro Inada of *Option* magazine helped start **D1 Grand Prix** in **2001**.',
        'In the US, **Formula DRIFT** grew from a 2003 demo at Irwindale into its first pro event at Road Atlanta in **April 2004**.',
        '[[drifting|Drifting]] is judged on **line** (hitting the [[clipping-point|clipping points]] and zones), **angle** (how sideways, held under control) and **style** (commitment, smoothness, proximity). Some rulebooks also count speed at a set point.',
        'In [[tandem-battle|tandem battles]] two cars run together: the leader sets the line, the chaser tries to stay glued to them. Then they swap.',
      ] },
    { tag: 'see', title: 'Why drift cars need a better diff', visualFirst: true,
      visual: { type: 'diffturn', diff: 'open', pick: true, scene: 'slip' },
      body: [
        'With an [[open-differential]], the unloaded inside rear wheel spins up and the outside one loses drive. The slide dies.',
        'Switch to LSD or locked: both rear wheels keep pushing, so the driver can hold [[oversteer]] with the throttle. Drift cars are [[rwd]] with an [[lsd]] or a locked/welded diff.',
        'Plus big steering-angle kits, a hydraulic handbrake to start slides, and lots of tires.',
      ] },
    { tag: 'how', title: 'Drag racing: NHRA classes',
      body: [
        'The **NHRA** was founded in **1951** by Wally Parks to get hot-rodders off the street and onto safe, legal strips. The classic distance: the **quarter mile (1,320 ft)**.',
        '[[top-fuel|Top Fuel]] and Funny Car burn [[nitromethane]] in supercharged 500 ci V8s, often estimated near **11,000 hp** (nobody can dyno that directly, so treat it as an estimate). They’ve raced **1,000 ft** since July 2008, after Scott Kalitta’s fatal crash, for more runoff room.',
        '[[pro-stock|Pro Stock]]: 500 ci naturally aspirated V8s, fuel injection since 2016, a 10,500 rpm limit. Pro Stock Motorcycle races too.',
        'Most racers aren’t pros: [[bracket-racing|bracket racing]] lets almost any street car compete on consistency.',
      ] },
    { tag: 'math', title: 'The tree, the light and the ET',
      body: [
        'The [[christmas-tree|Christmas tree]]: Pro tree = all three ambers at once, green **0.4 s** later. Sportsman tree = ambers **0.5 s** apart.',
        '[[reaction-time|Reaction time]] is measured from the green (0.000 = perfect). Negative = **red light**: you left early and lose.',
        'Your [[elapsed-time|ET]] starts when **you** leave, so the race goes to whoever reaches the finish line first: **RT + ET**.',
        'Example: A has RT 0.050 + ET 11.200 = **11.250**. B has RT 0.010 + ET 11.230 = **11.240**. B wins with the slower car: a [[holeshot-win]]. [[trap-speed|Trap speed]] tells you more about the car’s power.',
      ] },
    { tag: 'see', title: 'Milestones', visualFirst: true,
      visual: { type: 'timeline', title: 'Drag and drift history',
        events: [
          { year: 1951, title: 'NHRA founded', note: 'Wally Parks, California.' },
          { year: 2001, title: 'D1 Grand Prix', note: 'Japan’s pro drift series, with tsuiso (chase) battles.' },
          { year: 2004, title: 'Formula DRIFT', note: 'First pro event at Road Atlanta, after a 2003 demo at Irwindale.' },
          { year: 2008, title: 'Nitro to 1,000 ft', note: 'Top Fuel and Funny Car shortened for safety.' },
          { year: 2016, title: 'Pro Stock goes EFI', note: 'Carburetors out after decades; 10,500 rpm limit.' },
        ] },
      body: [
        'Tap the years: both sports moved from streets and parking lots to organized, sanctioned tracks.',
        'Most rule changes on this list were about **safety** or **cost**, the same two forces that shape every series in this unit.',
      ] },
    { tag: 'key', title: 'Keep it off the street',
      body: [
        'Street racing and street drifting are **illegal everywhere in the US**, and they kill drivers and bystanders. Penalties can include losing your license and having the car impounded.',
        'The legal versions are cheap and accessible: **“test and tune” nights** at a drag strip, **drift days** and autocross. You can run your own car there, with tech inspection and safety crews.',
        'This is theory, not a how-to: learning to drift or launch belongs at those events, with coaching.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'A racer’s reaction time shows **−0.012**. What happened?', options: ['Perfect launch', 'Red light: they left before the green and lose', 'They were 0.012 s late', 'Timing error'], answer: 1,
      why: 'Negative means they broke the beam before the green came on. That’s a red light: they lose (unless the other lane also fouls worse).' },
    { type: 'mc', q: 'Which is **not** a core drift judging criterion?', options: ['Line', 'Angle', 'Style', 'Lap time'], answer: 3,
      why: 'Drifting is judged on line, angle and style (some rulebooks add speed at a point). It isn’t a timed race.' },
    { type: 'order', q: 'Order a drag start on the **Sportsman** tree.', items: ['Pre-stage lights', 'Stage lights', 'Amber 1', 'Amber 2', 'Amber 3', 'Green'],
      why: 'Roll in until pre-stage lights, creep to stage, then the ambers count down 0.5 s apart to green. (On a Pro tree, all three ambers light together.)' },
  ],
  cards: [
    { id: 'drift-judge', front: 'How is drifting scored?', back: 'Line (clipping points/zones), angle and style; tandem battles decide brackets.' },
    { id: 'tree', front: 'Pro tree vs Sportsman tree?', back: 'Pro: all ambers at once, green 0.4 s later. Sportsman: ambers count down 0.5 s apart.' },
    { id: 'rtet', front: 'Who wins a drag race?', back: 'First to the finish line: reaction time + ET. A slower car can win on the light (holeshot).' },
    { id: '1000ft', front: 'Why do Top Fuel cars race 1,000 ft?', back: 'Since July 2008, after Scott Kalitta’s fatal crash: more room to stop past the finish.' },
    { id: 'drift-diff', front: 'Why do drift cars need an LSD or locked diff?', back: 'An open diff lets the light inside wheel spin, so drive and the slide die.' },
  ],
};
