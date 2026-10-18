// Compression ratio
export default {
  steps: [
    { tag: 'metaphor', title: 'A bike pump that bites back',
      body: [
        'Pump a bike tire hard and the pump gets **hot**. Squeezing air heats it and packs it tight.',
        'An engine squeezes the mixture before lighting it. The tighter the squeeze, the harder the burning gas pushes back: more work from the same fuel.',
        'Squeeze too hard and the mixture lights **by itself**. Diesels do that on purpose. Gas engines must not.',
      ] },
    { tag: 'math', title: 'The ratio',
      body: [
        '[[compression-ratio]] = (swept volume + clearance volume) ÷ clearance volume.',
        '**Clearance volume** = the space left above the piston at TDC (chamber + gasket + piston dish).',
        'Bronco example: 499.7 cc swept per cylinder. At 10.0:1, clearance = 499.7 ÷ 9 = **55.5 cc**.',
      ] },
    { tag: 'see', title: 'Same swept volume, less room', visualFirst: true,
      visual: { type: 'compression', swept: 500, cr: 10 },
      body: ['Slide the ratio. Watch clearance volume shrink and the efficiency and knock numbers change.'] },
    { tag: 'why', title: 'Why higher is better, until it isn’t',
      body: [
        'More compression → the gas **expands more** on the power stroke → more of its heat becomes work → better **efficiency**.',
        'The limit is **knock**: the last bit of unburned mixture ignites on its own from heat and pressure, before the flame gets there. It’s a sharp pressure spike that can crack pistons.',
        'Higher **octane** fuel resists knock. That’s all octane is: knock resistance, not “more energy.”',
      ] },
    { tag: 'why', title: 'Turbo engines run lower ratios',
      body: [
        'Boost already packs extra air in, so cylinder pressure is high **before** the piston squeezes it.',
        'To keep knock in check, turbo engines usually use lower compression than non-turbo ones. Direct injection helps: fuel evaporating in the cylinder cools the charge.',
        '**Static** ratio is pure geometry. **Dynamic** compression depends on when the intake valve actually closes, so cam timing changes the real squeeze.',
      ] },
    { tag: 'bronco', title: 'The numbers',
      body: [
        'Bronco 2.0: most dealer spec sheets say **10.0:1**, but other sources say 9.7 or 10.8. **Sources disagree**; this isn’t confirmed against Ford’s own sheet yet.',
        'Ninja 500: **11.3:1** (Kawasaki). RS 457: **10.5:1** (dealer listings). Non-turbo bikes run higher compression than your turbo car, as expected.',
      ],
      facts: ['bronco.compression', 'ninja.compression', 'rs457.compression'] },
  ],
  quiz: [
    { type: 'num', q: 'Swept volume **500 cc**, clearance volume **50 cc**. Compression ratio? (enter the first number, e.g. 9 for 9:1)', answer: 11, tol: 0.05, unit: ': 1',
      why: '(500 + 50) ÷ 50 = **11:1**. A common mistake is 500 ÷ 50 = 10. Don’t forget to add the clearance volume.' },
    { type: 'mc', q: 'What limits how high compression can go on a gasoline engine?', options: ['The spark plug’s voltage', 'Knock (the mixture self-igniting)', 'The size of the fuel tank', 'Valve spring strength'], answer: 1,
      why: 'Squeeze too much and the end gas self-ignites before the flame front: knock. Higher octane and good chamber design raise the limit.' },
    { type: 'mc', q: 'Why do turbocharged gas engines usually have lower compression ratios?', options: ['Turbos need lighter pistons', 'Boost already raises cylinder pressure, so lower CR keeps knock in check', 'To make more noise', 'Lower CR makes more power by itself'], answer: 1,
      why: 'Boost + high static compression = very high pressure and heat = knock. Turbo engines trade some compression for boost.' },
    { type: 'mc', q: 'Higher octane fuel means…', options: ['More energy per gallon', 'More resistance to knock', 'Cleaner exhaust', 'Faster burning'], answer: 1,
      why: 'Octane rating is knock resistance. It only helps if the engine is designed or tuned to use it.' },
    { type: 'num', q: 'Your Bronco: **499.7 cc** swept per cylinder at **10.0:1**. Clearance volume?', answer: 55.5, tol: 0.3, unit: 'cc',
      hint: 'CR − 1 = swept ÷ clearance.', why: 'Clearance = swept ÷ (CR − 1) = 499.7 ÷ 9 = **55.5 cc**.' },
  ],
  cards: [
    { id: 'cr', front: 'Compression ratio formula?', back: '(swept + clearance) ÷ clearance.' },
    { id: 'knock', front: 'What is knock?', back: 'End gas self-igniting from heat and pressure before the flame reaches it. A sharp pressure spike that damages pistons.' },
    { id: 'octane', front: 'What does octane measure?', back: 'Resistance to knock. Not energy content.' },
    { id: 'turbo-cr', front: 'Why do turbo engines run lower compression?', back: 'Boost already raises cylinder pressure; lower CR keeps knock under control.' },
    { id: 'clear', front: 'Clearance volume from CR?', back: 'Clearance = swept ÷ (CR − 1).' },
  ],
};
