// JDM
export default {
  steps: [
    { tag: 'metaphor', title: 'The Japan-only bonus track',
      body: [
        'Some albums get a **Japan-only bonus track**. Same band, but a version the rest of the world never got.',
        '[[jdm]] cars are like that: models and specs Japan kept for itself, often stronger, rarer or just different.',
        'A Japanese car sold new in the US is the regular album: still great, still Japanese, but not the bonus track.',
      ] },
    { tag: 'how', title: 'What “JDM” strictly means',
      body: [
        '**JDM = Japanese domestic market**: built to be sold new in Japan. Usually right-hand drive, km/h speedometer, Japan-spec engine and lights.',
        'A Honda Integra Type R sold new in Japan is JDM. An Acura Integra Type R built for the US is [[usdm]], even though Honda is Japanese.',
        'Your Ninja 500 shortlist is the same: Kawasaki is Japanese, but a US-market Ninja is not JDM.',
        'In slang “JDM” has come to mean **any Japanese performance car or style**. Common, but technically wrong. Know both meanings.',
      ] },
    { tag: 'see', title: 'The golden era', visualFirst: true,
      visual: { type: 'timeline', title: 'Japan’s performance golden era', events: [
        { year: 1989, title: 'R32 Skyline GT-R & Eunos Roadster (Miata)', note: 'Same year the 280 PS agreement starts' },
        { year: 1990, title: 'Honda NSX', note: 'Aluminum mid-engine supercar' },
        { year: 1993, title: 'A80 Supra (2JZ-GTE) and FD RX-7 reach the US' },
        { year: 1995, title: 'Initial D manga begins', note: 'Made the AE86 and touge driving famous' },
        { year: 1999, title: 'R34 GT-R and Honda S2000' },
        { year: 2004, title: '280 PS cap breaks', note: 'Honda Legend at 300 PS; sources say the pact ended 2004–05' },
      ] },
      body: [
        'Tap through: most of the legends landed in about **ten years**, during Japan’s late-’80s boom and just after it.',
        'Many of these never came to the US in their top form (the Skyline GT-R never did), which is part of the mystique.',
      ] },
    { tag: 'how', title: 'The 280 PS gentlemen’s agreement',
      body: [
        'From 1989 Japanese carmakers agreed to **advertise** no more than **280 PS (276 hp)**: the [[gentlemens-agreement]]. The aim was to avoid a horsepower war.',
        'So the R32 GT-R, the Supra Turbo and others were all “280 PS” in Japan. Enthusiasts have long claimed some made more; that’s widely repeated, not an official figure.',
        'Export versions could be rated higher: the US Supra Turbo was rated **320 hp**.',
        'The cap broke in 2004 (Honda Legend, 300 PS); sources put the official end in 2004 or 2005.',
      ] },
    { tag: 'key', title: 'The US 25-year rule',
      body: [
        'Cars not built for the US usually don’t meet US safety standards (FMVSS), so they can’t simply be imported.',
        'The [[twenty-five-year-rule]]: once a vehicle is **25 years old from its manufacture date**, NHTSA lets it in without meeting those standards. EPA’s own exemption is **21 years**, for unmodified vehicles.',
        'That’s why R32 GT-Rs (built from 1989) arrived legally around **2014**, and R34s (from 1999) around **2024**. Sources disagree on whether it counts by month or by year; brokers check the exact build date.',
        '[[show-or-display]] (since 1999) is the narrow exception: a few approved rare cars early, max 2,500 miles a year. States can still add rules; California is strictest.',
      ] },
    { tag: 'why', title: 'What the scene values (and the myths)',
      body: [
        'Values: light, high-revving, reliable engines; clean “factory-plus” builds with genuine Japanese parts; motorsport and anime/manga roots.',
        'Myth: **“JDM engines are unkillable.”** Some are famously overbuilt (the 2JZ’s iron block), but a 30-year-old engine is still a 30-year-old engine.',
        'Myth: **“Imported JDM engines all have low miles.”** It’s a common sales claim; mileage on a used import engine is usually hard to verify.',
        '~~Opinion: the “JDM” label sells parts, so expect it on things that have never been near Japan.~~',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'Which of these is **JDM** in the strict sense?', options: ['A US-market Acura Integra Type R', 'A Honda Integra Type R sold new in Japan', 'Any Honda', 'A Civic with a Japanese body kit'], answer: 1,
      why: 'JDM means built to be sold new in Japan. The Acura is a US-market car made by a Japanese company: USDM.',
      wrong: { 0: 'Japanese brand, but built for the US market. That’s USDM.', 3: 'That’s the slang meaning (Japanese style), not the strict one.' } },
    { type: 'mc', q: 'What was the **gentlemen’s agreement**?', options: ['A speed limit on Japanese highways', 'Carmakers agreeing to advertise no more than 280 PS (276 hp)', 'A ban on turbochargers', 'A US import quota'], answer: 1,
      why: 'From 1989 to about 2004–05, Japanese makers capped their advertised power at 280 PS to avoid a horsepower war.' },
    { type: 'order', q: 'Put these in order of debut, oldest first.', items: ['R32 Skyline GT-R', 'Honda NSX', 'A80 Supra (US)', 'Honda S2000'],
      why: 'R32 GT-R 1989, NSX 1990, the A80 Supra reached the US in 1993, and the S2000 arrived in 1999.' },
  ],
  cards: [
    { id: 'jdm', front: 'What does JDM strictly mean?', back: 'Japanese domestic market: built to be sold new in Japan. A US-market Japanese car is USDM.' },
    { id: 'cap', front: 'Japan’s gentlemen’s agreement?', back: 'Advertised power capped at 280 PS (276 hp), 1989 to about 2004–05.' },
    { id: 'rule', front: 'US 25-year rule?', back: 'NHTSA: 25+ years from manufacture → can be imported without meeting FMVSS. EPA: 21 years, unmodified.' },
    { id: 'sod', front: 'What is Show or Display?', back: 'NHTSA exemption (1999) for a short list of rare cars, max 2,500 miles a year.' },
  ],
};
