// Legendary engines: Europe
export default {
  steps: [
    { tag: 'metaphor', title: 'Signature dishes',
      body: [
        'Great restaurants are known for one dish they’ve perfected for decades.',
        'European makers are the same: Porsche’s **flat-six**, BMW M’s **high-revving sixes and V8s**, Ferrari’s **flat-plane V8**, AMG’s **big V8**, Audi’s **five-cylinder**.',
        'Each one tastes (sounds) different because of its layout.',
      ] },
    { tag: 'see', title: 'Porsche: the flat-six', visualFirst: true,
      visual: { type: 'layout', layout: 'boxer4' },
      body: [
        'The visual shows a flat-four; a flat-six adds one more opposed pair. Same idea: [[boxer-engine|pistons punching outward]] from both sides of the crank.',
        '**1963**: the 911 was shown as the 901 with a 2.0 L [[air-cooled]] flat-six, 130 PS. It was renamed 911 before sales began.',
        'Flat and low, hung behind the rear axle. Air-cooled until the 993 (to 1998); the 996 switched to water cooling, largely for emissions and four-valve heads.',
      ] },
    { tag: 'how', title: 'BMW M: S54 and S65',
      body: [
        '**S54** (E46 M3, 2000): 3.2 L [[inline-engine|inline-6]], 343 PS in Europe, 333 hp in the US, revving to about 8,000 rpm. Individual throttle bodies and a famously sharp response.',
        '**S65** (E90/E92 M3, 2007): 4.0 L V8, 420 PS (414 hp), **8,400 rpm** redline.',
        'The S65 is the M5’s S85 V10 minus two cylinders: same 92.0 × 75.2 mm bore and stroke.',
      ] },
    { tag: 'see', title: 'Ferrari: flat-plane V8s', visualFirst: true,
      visual: { type: 'layout', layout: 'v8flat' },
      body: [
        'Ferrari’s mid-engine V8s use a [[flat-plane]] crank: two inline-4s on one crank, even pulses per bank, a high wail.',
        '**458 Italia** (2009, F136 engine): 4,499 cc, 570 CV (562 hp), designed to rev to **9,000 rpm**.',
        'It was the last [[naturally-aspirated]] mid-engine Ferrari V8; the 488 GTB that replaced it went twin-turbo.',
      ] },
    { tag: 'how', title: 'Mercedes-AMG M156 and Audi’s five',
      body: [
        '**AMG M156** (2006): 6,208 cc non-turbo cross-plane V8, sold as “6.3” to honor Mercedes’ old 6.3 L V8. The first engine AMG designed entirely itself; about 514 PS in the E 63.',
        '“**One man, one engine**”: a single technician builds each AMG engine and signs a plate on it.',
        'Audi’s first **five-cylinder** came in the 1976 Audi 100 (2.1 L, 136 PS). Turbocharged with all-wheel drive in the 1980 **quattro**, it ruled rallying.',
        'A five fires every 720° ÷ 5 = **144°**, firing order 1-2-4-5-3: the warbly “half a V10” sound. Today’s RS 3 2.5 TFSI makes 400 PS.',
      ] },
    { tag: 'see', title: 'Signature engines side by side', visualFirst: true,
      visual: { type: 'compare', title: 'European icons at launch', metrics: [
        { key: 'ps', label: 'Power', unit: 'PS' },
        { key: 'l', label: 'Displacement', unit: 'L' },
      ], items: [
        { name: 'Porsche 901 flat-six', note: '1963', values: { ps: 130, l: 2.0 } },
        { name: 'BMW S54', note: 'E46 M3, 2000', values: { ps: 343, l: 3.2 } },
        { name: 'AMG M156', note: 'E 63, 2006–07', values: { ps: 514, l: 6.2 } },
        { name: 'BMW S65', note: 'E92 M3, 2007', values: { ps: 420, l: 4.0 } },
        { name: 'Ferrari F136', note: '458 Italia, 2009', values: { ps: 570, l: 4.5 } },
        { name: 'Audi 2.5 TFSI', note: 'Current RS 3', values: { ps: 400, l: 2.5 } },
      ] },
      body: [
        'Compare power per liter: the Ferrari makes about 127 PS/L without a turbo; the AMG makes about 83 PS/L but with huge low-end torque.',
        'The Audi five makes 160 PS/L with a turbo, the same downsizing trick as your EcoBoost.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'BMW’s **S65** V8 is closely related to which engine?', options: ['The S54 inline-6', 'The S85 V10 from the M5', 'The AMG M156', 'Ferrari’s F136'], answer: 1,
      why: 'It’s essentially the S85 V10 with two cylinders removed, sharing its 92.0 × 75.2 mm bore and stroke.' },
    { type: 'mc', q: 'What does AMG’s “**one man, one engine**” mean?', options: ['Each car has one engine', 'One technician assembles each engine start to finish and signs it', 'Only one engine type is made', 'One engine per customer'], answer: 1,
      why: 'Each AMG engine is built by a single technician, whose signature plate goes on the engine.' },
    { type: 'order', q: 'Order these debuts, oldest first.', items: ['Porsche 901 flat-six', 'Audi five-cylinder', 'BMW S54', 'AMG M156', 'Ferrari 458 Italia'],
      why: '1963, 1976, 2000, 2006, 2009.' },
  ],
  cards: [
    { id: 'porsche', front: 'Porsche 911 engine story?', back: 'Rear-mounted flat-six from 1963 (2.0 L, 130 PS); air-cooled until 1998, then water-cooled.' },
    { id: 'bmw', front: 'BMW S54 and S65?', back: 'S54: 3.2 I6 (E46 M3). S65: 4.0 V8, 8,400 rpm (E92 M3), a V10 minus two cylinders.' },
    { id: 'ferrari', front: 'Ferrari 458’s F136?', back: '4.5 L flat-plane V8, 570 CV, 9,000 rpm; last non-turbo mid-engine Ferrari V8.' },
    { id: 'amg', front: 'AMG M156?', back: '6.2 L (“6.3”) V8, 2006, AMG’s first fully in-house engine; one man, one engine.' },
    { id: 'audi5', front: 'Audi five-cylinder firing?', back: 'Every 144°, order 1-2-4-5-3. First Audi five: 1976 Audi 100.' },
  ],
};
