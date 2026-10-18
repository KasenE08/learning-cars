// Dual-clutch transmissions
export default {
  steps: [
    { tag: 'metaphor', title: 'Two hands on the monkey bars',
      body: [
        'Crossing monkey bars, you grab the **next** bar before letting go of the last one. You never hang from nothing.',
        'A [[dct]] does that with gears: the next gear is already grabbed and waiting, and the shift is just **letting go with one hand while closing the other**.',
      ] },
    { tag: 'how', title: 'Two gearboxes in one case',
      body: [
        'Think of it as **two manual gearboxes** side by side, each with its own clutch, run by a computer.',
        '**Odd gears** (1, 3, 5, 7) sit on one input shaft; **even gears** (2, 4, 6) and usually reverse on the other.',
        'The two input shafts are **nested**: a solid inner shaft runs inside a hollow outer one, each driven by its own clutch.',
        'Inside it’s manual-gearbox hardware: constant-mesh gears, synchro sleeves and forks, moved by hydraulic or electric actuators.',
      ] },
    { tag: 'how', title: 'Preselection: the trick',
      body: [
        'Accelerating in 2nd: the even clutch is closed. The computer has already slid the **3rd-gear** sleeve into place on the odd shaft, whose clutch is open.',
        'Upshift = open the even clutch while closing the odd one. A **clutch-to-clutch** swap with no gap in drive.',
        'Then it [[preselection|preselects]] the next likely gear (4th, or back to 2nd if you’re slowing).',
        'Guess wrong (sudden kickdown to a gear on the **same** shaft) and it must swap sleeves first: a noticeable delay.',
      ] },
    { tag: 'see', title: 'Two clutches, one hand-off', visualFirst: true,
      visual: { type: 'clutchengage' },
      body: [
        'This is a single clutch. Now imagine two: as one slider goes **down**, the other comes **up** at the same moment.',
        'A DCT has no torque converter, so pulling away from a stop is pure clutch **slip**, exactly like the start of this slider. That matters below.',
      ] },
    { tag: 'key', title: 'Wet vs dry',
      body: [
        '**[[wet-dry-clutch|Wet]]**: multi-plate clutches running in oil. Oil carries heat away, so they handle more torque and stop-and-go; small losses to oil drag. Porsche’s PDK is wet.',
        '**Dry**: like a manual car’s clutch, in air. Lighter and more efficient, but heat builds up fast in traffic and on hills; used for small, low-torque cars.',
        'Ford’s dry-clutch **PowerShift** DCT (early-2010s Focus and Fiesta) became notorious for low-speed shudder and hesitation.',
      ],
      visual: { type: 'exploded', assembly: 'wetclutch' } },
    { tag: 'why', title: 'Fast on track, fussy in traffic',
      body: [
        '**Pros**: very quick, seamless shifts; manual-gearbox efficiency (no converter slip); great for performance cars.',
        '**Cons**: launches and creeping are done by **slipping a clutch**, so parking, crawling and hill starts can feel hesitant or jerky, and that slip is heat and wear.',
        'Complex and costly to repair. A torque-converter automatic is smoother at walking pace; a DCT shines once moving.',
      ] },
    { tag: 'bronco', title: 'Why a converter suits your Bronco',
      body: [
        'Your Bronco uses a **torque-converter planetary** automatic (8F35). Converter multiplication and smooth creep suit crawling over rocks.',
        'Off-road crawling at 1 mph would mean nonstop clutch slip for a DCT; the converter just slips oil.',
        'Some motorcycles (Honda’s DCT models) use dual-clutch boxes too, but both your shortlist bikes have a manual clutch lever.',
      ],
      facts: ['bronco.transModel'] },
  ],
  quiz: [
    { type: 'mc', q: 'Accelerating in **4th** in a typical DCT. What’s happening on the other shaft?', options: ['Nothing; it’s locked', '3rd or 5th is preselected with its clutch open', 'It’s driving the rear wheels', 'Reverse is engaged for safety'], answer: 1,
      why: '4th is even, so the odd shaft is idle. The computer readies the likely next gear (5th if accelerating, 3rd if slowing) so the shift is just a clutch swap.' },
    { type: 'mc', q: 'Why can a sudden kickdown from 6th to 4th be slow in a DCT?', options: ['The torque converter must unlock', '6th and 4th are on the same shaft, so it must swap sleeves before the clutches can hand off', 'The oil is too cold', 'DCTs can’t downshift'], answer: 1,
      why: 'Both are even gears. The even shaft is busy carrying 6th, so the box often goes via an odd gear (like 5th) or makes you wait while it re-sleeves.' },
    { type: 'mc', q: 'Main advantage of a **wet** DCT over a dry one?', options: ['Lighter', 'Handles more torque and heat (oil cools the clutches)', 'No synchros needed', 'Uses a torque converter'], answer: 1,
      why: 'Oil carries heat away from the plates, so wet units survive high torque and traffic better. Dry units are lighter and more efficient but heat up fast.',
      wrong: { 0: 'That’s the dry clutch’s advantage.' } },
    { type: 'mc', q: 'Where does a DCT typically feel **worst**?', options: ['Full-throttle upshifts', 'Highway cruising', 'Creeping in traffic and slow hill starts', 'Downshifts under braking'], answer: 2,
      why: 'No converter means low-speed drive comes from a slipping clutch: hesitation, judder and heat. Once moving, shifts are excellent.' },
  ],
  cards: [
    { id: 'what', front: 'What is a DCT?', back: 'Two manual gearboxes in one case: odd gears on one shaft, even on the other, each with its own computer-controlled clutch.' },
    { id: 'presel', front: 'Preselection?', back: 'The idle shaft already has the next gear engaged; the shift is just swapping clutches.' },
    { id: 'wetdry', front: 'Wet vs dry DCT clutches?', back: 'Wet: in oil, more torque/heat capacity. Dry: lighter, more efficient, overheats in traffic.' },
    { id: 'lowspeed', front: 'Why are DCTs fussy at low speed?', back: 'No torque converter: creep and launches come from slipping a clutch.' },
    { id: 'shafts', front: 'How do a DCT’s two input shafts fit?', back: 'Nested: solid inner shaft inside a hollow outer shaft, each driven by its own clutch.' },
  ],
};
