// Boxer & flat engines
export default {
  steps: [
    { tag: 'metaphor', title: 'Two boxers touching gloves',
      body: [
        'Picture two boxers facing each other, punching **in** at the same moment and pulling **back** at the same moment.',
        'A [[boxer-engine]] lays its cylinders flat, in two opposing rows. Opposite pistons move **toward each other and apart together**.',
        'Every punch is matched by an equal punch from the other side, so the shaking cancels.',
      ] },
    { tag: 'see', title: 'Watch a flat-4', visualFirst: true,
      visual: { type: 'layout', layout: 'boxer4' },
      body: [
        'Two cylinders per side, banks 180° apart. Each piston has **its own crankpin**, which is what lets opposite pistons mirror each other.',
        'Four cylinders: a power stroke every **180°**, same as an inline-4.',
      ] },
    { tag: 'how', title: 'Why boxers are smooth',
      body: [
        '**Flat-4**: opposite pistons cancel the primary **and** secondary forces. A small [[rocking-couple]] remains, because each opposing pair is slightly offset along the crank.',
        '**Flat-6** (Porsche 911): fully balanced, like an inline-6.',
        '~~Trivia: in a “180° V” engine, opposite pistons share one crankpin and move the same way. Ferrari’s old “flat-12s” were really 180° Vs, not true boxers.~~',
      ] },
    { tag: 'how', title: 'Low, short… and wide',
      body: [
        '**Low**: the heavy engine mass sits low, which lowers the center of gravity. **Short**: like a V, about half the length of an inline.',
        '**Wide**: heads stick out to each side, crowding the steering and suspension. Two heads, two exhaust sides, and harder-to-reach spark plugs.',
        'Who uses them: Subaru (nearly every model), Porsche (911 and 718), BMW’s boxer-twin motorcycles and Honda’s Gold Wing flat-6.',
      ] },
    { tag: 'why', title: 'The Subaru rumble isn’t the boxer',
      body: [
        'A flat-4 **fires evenly**, every 180°. The famous burble came from the **exhaust**, not the layout.',
        'Older turbo Subaru EJ engines (WRX, STI) used **unequal-length headers**: one bank’s pipes were longer, so pulses reached the collector off-beat.',
        'Newer turbo FA engines (like the 2022+ WRX) use **equal-length headers**, and the rumble is mostly gone. Header design is covered in the Exhaust unit.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'Why do a boxer’s primary forces cancel?', options: ['It has balance shafts', 'Opposite pistons move in mirror image, toward and away from each other together', 'All pistons move in the same direction', 'It fires every 90°'], answer: 1,
      why: 'Each piston’s push is matched by its opposite twin pushing the other way at the same instant. That needs one crankpin per piston.' },
    { type: 'mc', q: 'Where did the classic WRX/STI rumble really come from?', options: ['The boxer layout fires unevenly', 'Unequal-length exhaust headers', 'The turbo', 'A cross-plane crank'], answer: 1,
      why: 'A flat-4 fires evenly. Unequal-length headers made pulses arrive at the collector off-beat. Equal-length headers on newer engines mostly removed the rumble.',
      wrong: { 0: 'A flat-4 fires every 180°, perfectly evenly.' } },
    { type: 'num', q: 'A Porsche flat-6 fires evenly. How many degrees between power strokes?', answer: 120, tol: 0, unit: '°',
      why: '720° ÷ 6 = **120°**, just like an inline-6.' },
    { type: 'order', q: 'Order these from **lowest** to **tallest** engine, typical layouts with the same cylinder count.', items: ['Boxer (flat)', 'V', 'Inline (upright)'],
      why: 'A boxer lies flat; a V stands its banks at an angle (lower than upright); an upright inline is the tallest. Real engines vary, but this is the general trend.' },
  ],
  cards: [
    { id: 'boxer', front: 'What is a boxer engine?', back: 'Cylinders flat in two opposing rows; opposite pistons move in and out together, each on its own crankpin.' },
    { id: 'flat4', front: 'Flat-4 balance?', back: 'Primary and secondary forces cancel; a small rocking couple remains.' },
    { id: 'boxer-trade', front: 'Boxer pros and cons?', back: 'Low center of gravity, short. But wide, two heads, harder to service.' },
    { id: 'rumble', front: 'Cause of the Subaru rumble?', back: 'Unequal-length headers (older EJ turbo engines), not the boxer layout itself.' },
  ],
};
