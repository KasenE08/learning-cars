// Myths & snake oil
export default {
  steps: [
    { tag: 'metaphor', title: 'The $30 miracle pill',
      body: [
        'A diet pill that “melts fat while you sleep” sells on hope. Car snake oil works the same way: a cheap gadget, a big promise, and testimonials instead of tests.',
        'Ask one question: if a $30 part really gave 10% better mpg or power, why wouldn’t automakers (who pay fines for missing fuel-economy targets) bolt it on for free?',
        '~~That test isn’t perfect: OEMs also skip real gains for cost, noise, emissions or warranty reasons. Tunes are the proof. But gadgets fail it badly.~~',
      ] },
    { tag: 'how', title: 'Magnets, tornadoes and miracle additives',
      body: [
        '**Fuel-line magnets**: claim to “align” fuel molecules. Gasoline isn’t magnetic in any useful way. The EPA evaluated four magnet products; none improved fuel economy.',
        '**“Tornado” intake swirlers**: vanes in the intake tube to “spin” the air. Air is already turbulent after the filter, throttle and turbo; vanes add restriction. No credible test shows a gain.',
        'The EPA has looked at **100+** “gas-saving” devices over the years without finding one that significantly improves mileage. Popular Mechanics’ 2005 test of seven found none that helped.',
        '**Fuel additives**: detergents can keep injectors clean (that’s maintenance, and good gasoline already has them). On a [[direct-injection]] engine, fuel never touches the intake valves, so no fuel additive can clean [[intake-valve-deposits]].',
      ] },
    { tag: 'how', title: 'Octane above what the engine needs',
      body: [
        '[[octane]] is **knock resistance**, not energy. Premium holds about the same energy as regular.',
        'If an engine was designed for 87 and never knocks on it, 93 changes nothing but your bill.',
        'Turbo engines with [[knock-sensor|knock sensors]] are the exception: on higher octane the ECU can keep more [[spark-advance]] at high load. Ford rates the full-size Bronco 2.3 at **275 hp on 87 vs 300 hp on premium**.',
        'Your 2.0: Ford says 87 minimum, premium **recommended for best performance**. Ford doesn’t publish a regular-vs-premium power split for it.',
      ],
      facts: ['bronco.fuel', 'bronco.bigBroncoFuel'] },
    { tag: 'how', title: '“Cold” air intakes and fake scoops',
      body: [
        'An open cone filter under the hood breathes engine-bay air, which can be far hotter than outside air in traffic. Higher [[iat]] → ECU pulls timing → **less** power than the stock sealed airbox.',
        'Stock airboxes usually draw from a cool spot (behind the grille or headlight) on purpose. A [[cold-air-intake]] is only “cold” if it’s sealed and fed outside air.',
        'A **hood scoop** only helps if it feeds the intake or vents real heat. A stick-on scoop over a sealed intake adds frontal area and drag, nothing else.',
      ] },
    { tag: 'see', title: 'What add-ons cost at speed', visualFirst: true,
      visual: { type: 'aero' },
      body: [
        '`Drag = ½ · ρ · Cd · A · v²`. Raise frontal area or [[drag-coefficient|Cd]] a little (scoops, roof racks, light bars, a non-functional wing) and watch the force rise.',
        'Drag grows with **speed squared**; the power to push through it grows with **speed cubed**. Aero junk costs most on the highway.',
        'Real wings make [[downforce]] on track cars that need it, at the price of drag.',
      ] },
    { tag: 'key', title: 'Snake-oil detector',
      visual: { type: 'checklist', title: 'Before believing a gain claim',
        groups: [
          { name: 'The test', items: [
            { check: 'Same dyno, same day, back-to-back runs, before and after', why: 'Different days and dynos alone can move results by a few percent.' },
            { check: 'Several runs, not one best pull', why: 'One cherry-picked run can sit at the top of normal variation.' },
            { check: 'Wheel vs wheel or crank vs crank', why: 'Mixing them invents or hides gains.' },
          ] },
          { name: 'The claim', items: [
            { check: '“Up to” numbers or percent-mpg promises', why: 'Usually the best rpm, best day, best case.' },
            { check: 'Testimonials instead of data', why: 'The butt dyno and placebo are strong.' },
            { check: 'A mechanism that fits physics', why: '“Aligns molecules” or “ionizes fuel” doesn’t.' },
          ] },
          { name: 'The fine print', items: [
            { check: 'A CARB EO number if it touches intake, fuel or emissions', why: 'No EO = not street-legal in California, and sometimes a hint it was never tested.' },
          ] },
        ] },
      body: [
        'Tap through it. A real part passes most of these; a gadget fails nearly all.',
        'Watch out for the [[butt-dyno]]: louder and sharper always *feels* faster.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'What did the EPA find when it evaluated fuel-line magnet products?',
      options: ['Small but real mpg gains', 'None improved fuel economy', 'They worked only on diesels', 'They raised octane'], answer: 1,
      why: 'None of the magnet products the EPA evaluated increased fuel economy. Out of 100+ “gas savers” reviewed over the years, none gave a significant improvement.' },
    { type: 'mc', q: 'When can higher-octane fuel actually add power?',
      options: ['Always: it has more energy', 'Never', 'When the engine has knock control and was holding back timing on lower octane (often turbo engines)', 'Only in carbureted engines'], answer: 2,
      why: 'Octane is knock resistance. It only helps when the ECU can use it to run more spark advance, as Ford’s 2.3 Bronco ratings (275 hp on 87, 300 on premium) show.',
      wrong: { 0: 'Premium has about the same energy as regular. The difference is resistance to knock.' } },
    { type: 'mc', q: 'An open cone filter in the engine bay can make **less** power than the stock airbox because…',
      options: ['Cone filters block airflow', 'It breathes hot engine-bay air; the ECU pulls timing for the higher intake temperature', 'It confuses the knock sensor', 'It lowers boost on purpose'], answer: 1,
      why: 'Hotter air is less dense and more knock-prone, so the ECU retards spark. The stock box usually breathes cooler outside air.' },
  ],
  cards: [
    { id: 'magnets', front: 'Do fuel magnets work?', back: 'No. EPA evaluated magnet products; none improved fuel economy.' },
    { id: 'octane', front: 'When does premium help?', back: 'Only when knock control was pulling timing on lower octane (often turbo engines). Otherwise it does nothing.' },
    { id: 'additive-di', front: 'Can fuel additives clean a DI engine’s intake valves?', back: 'No. On direct injection, fuel never touches the intake valves.' },
    { id: 'cone', front: 'Why can an open cone intake lose power?', back: 'Hot engine-bay air → higher IAT → ECU pulls timing.' },
    { id: 'scoop', front: 'Does a hood scoop help a car with a sealed intake elsewhere?', back: 'No. Only drag, unless it feeds the intake or vents real heat.' },
  ],
};
