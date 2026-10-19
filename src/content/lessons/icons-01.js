// Legendary engines: Japan
export default {
  steps: [
    { tag: 'metaphor', title: 'Amps with hidden headroom',
      body: [
        'Picture a guitar amp labeled “max volume 7” that was secretly built to go to 11.',
        'Under the [[gentlemens-agreement]], Japan’s best engines were all advertised at **280 PS** or less, while many were engineered with room for far more.',
        'Tuners found that headroom. That’s how these engines became legends.',
      ] },
    { tag: 'see', title: 'Why two of them are straight-sixes', visualFirst: true,
      visual: { type: 'layout', layout: 'i6' },
      body: [
        'Toyota’s **2JZ-GTE** and Nissan’s **RB26DETT** are both [[inline-engine|inline-6s]]: naturally balanced, no balance shafts, silky to redline.',
        'Long and strong: a long iron block with a crank supported between every cylinder handles huge boost.',
      ] },
    { tag: 'how', title: '2JZ-GTE and RB26DETT',
      body: [
        '**2JZ-GTE** (Toyota): 3.0 L, square 86.0 × 86.0 mm, iron block, [[sequential-turbo|sequential twin turbos]]. Debuted 1991 in the Aristo, famous from 1993 in the A80 Supra. 280 PS in Japan; the US Supra Turbo was rated **320 hp, 315 lb-ft**.',
        '**RB26DETT** (Nissan): 2.6 L (2,568 cc), 86 × 73.7 mm, iron block, forged internals, [[twin-turbo|twin turbos]]. Built for the 1989 R32 Skyline GT-R, designed with Group A racing in mind. 280 PS, 353 N·m (260 lb-ft).',
        'Both are famous for making far more than stock power with bigger turbos. Exact “stock block” limits are forum lore and vary wildly; treat big claims carefully.',
      ] },
    { tag: 'how', title: 'Mazda rotaries',
      body: [
        'A [[rotary-engine]] spins triangular rotors instead of pumping pistons: tiny, light, smooth, and it loves revs.',
        '**13B-REW** (FD RX-7, US from 1993): two rotors of 654 cc (1.3 L total), sequential twin turbos, **255 hp** in the US.',
        '**20B** (1990 Eunos Cosmo): three rotors, one of the first production twin-sequential-turbo engines. The four-rotor **R26B** won Le Mans in 1991 in the 787B, the first Japanese winner.',
        'The trade-offs: thirsty, burns a little oil by design, and [[apex-seal]] wear is the classic failure.',
      ] },
    { tag: 'how', title: 'Honda: VTEC and 9,000 rpm',
      body: [
        '[[vtec]] switches the valves onto a wilder cam lobe at high rpm: mild manners low down, race-engine breathing up top.',
        '**F20C** (S2000, 1999): 2.0 L, no turbo, **9,000 rpm** redline in Japan. 250 PS in Japan, 240 hp in the US: about 120–124 hp per liter, often cited as the highest [[specific-output]] of any non-turbo production car engine of its time.',
        '**K20A** (2001, Civic Type R EP3 and Integra Type R DC5): 220 PS in the Japanese Integra Type R with i-VTEC; other versions were rated a little lower. Today the K-series is the go-to engine swap for Honda builds.',
      ] },
    { tag: 'see', title: 'The 280 PS ceiling, visible', visualFirst: true,
      visual: { type: 'compare', title: 'Rated power in Japan at launch', metrics: [
        { key: 'ps', label: 'Rated power (Japan)', unit: 'PS' },
        { key: 'l', label: 'Displacement', unit: 'L' },
      ], items: [
        { name: 'RB26DETT', note: 'R32 GT-R, 1989', values: { ps: 280, l: 2.6 } },
        { name: '2JZ-GTE', note: 'Aristo 1991 / Supra 1993', values: { ps: 280, l: 3.0 } },
        { name: '13B-REW', note: 'FD RX-7', values: { ps: 255, l: 1.3 } },
        { name: 'F20C', note: 'S2000, 1999', values: { ps: 250, l: 2.0 } },
        { name: 'K20A', note: 'Integra Type R DC5, 2001', values: { ps: 220, l: 2.0 } },
        { name: 'VR38DETT', note: 'R35 GT-R, 2007 (after the cap)', values: { ps: 480, l: 3.8 } },
      ] },
      body: [
        'Two different engines, both exactly **280 PS**: that’s the advertising cap, not a coincidence.',
        '**VR38DETT** came after the cap: a 3.8 L twin-turbo V6 with plasma-sprayed bores, each one hand-assembled by a single master builder (takumi) at Yokohama. 480 PS at launch, 530 hp by 2011.',
      ] },
    { tag: 'bronco', title: 'Your EcoBoost vs the S2000',
      body: [
        'Your 2.0 L EcoBoost: about 250 hp from 2.0 L, roughly **125 hp per liter**, about the same as the F20C.',
        'Same number, opposite method: the Honda gets it by revving to 9,000 rpm; yours gets it from a turbo at 5,500 rpm, with far more torque far lower down.',
        'That’s the modern trade: boost replaced revs.',
      ],
      facts: ['bronco.output', 'bronco.displacement'] },
  ],
  quiz: [
    { type: 'mc', q: 'Why were the R32 GT-R and the Supra Turbo both rated exactly **280 PS** in Japan?', options: ['Same engine', 'The gentlemen’s agreement capped advertised power', 'Japanese law limited displacement', 'Both had limiters at 180 km/h'], answer: 1,
      why: 'Carmakers agreed to advertise no more than 280 PS from 1989. Different engines, same printed number.' },
    { type: 'mc', q: 'The rotary engine’s best-known weak point?', options: ['Timing belt', 'Apex seal wear', 'Pushrods', 'Balance shafts'], answer: 1,
      why: 'Apex seals do the job of piston rings at the rotor tips. Wear and failure there is the classic rotary rebuild.',
      wrong: { 2: 'Rotaries don’t have pushrods, or valves at all; ports in the housing do the job.' } },
    { type: 'tap', q: 'VTEC changes which lobe drives the valves. Tap the part with the lobes.', visual: { type: 'parts', drawing: 'engine-section' }, answer: 'camshaft',
      why: 'VTEC adds an extra high-lift, long-duration lobe on the camshaft and locks the rocker arms onto it at high rpm.',
      wrong: { valves: 'The valves follow whichever lobe is engaged; the lobes live on the cam.', crank: 'The crank drives the cam but has no lobes.' } },
    { type: 'order', q: 'Order these engines’ debuts, oldest first.', items: ['RB26DETT', '20B', '2JZ-GTE', 'F20C', 'VR38DETT'],
      why: 'RB26DETT 1989, 20B 1990, 2JZ-GTE 1991, F20C 1999, VR38DETT 2007.' },
  ],
  cards: [
    { id: '2jz', front: '2JZ-GTE in one line?', back: '3.0 L iron-block I6, 86 × 86 mm, sequential twin turbos. 280 PS JDM, 320 hp US Supra.' },
    { id: 'rb26', front: 'RB26DETT in one line?', back: '2.6 L iron-block I6, twin turbos, forged internals. R32 GT-R (1989), 280 PS.' },
    { id: 'rotary', front: 'Mazda rotary icons?', back: '13B-REW (FD RX-7), 20B three-rotor (Cosmo), R26B four-rotor (787B, Le Mans 1991).' },
    { id: 'f20c', front: 'F20C claim to fame?', back: 'Non-turbo 2.0 L, 9,000 rpm redline, about 120–124 hp/L.' },
    { id: 'vr38', front: 'VR38DETT build detail?', back: 'Each engine hand-assembled by one takumi at Yokohama; plasma-sprayed bores.' },
  ],
};
