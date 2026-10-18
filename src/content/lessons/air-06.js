// Port vs direct injection
export default {
  steps: [
    { tag: 'metaphor', title: 'Sugar in the pitcher vs syrup in the glass',
      body: [
        '**Port injection**: stir the sugar into the pitcher before pouring. Plenty of time to mix, very even.',
        '**Direct injection**: a precise shot of syrup into each glass, at exactly the right moment. More control, but the glass (cylinder) is where it all happens.',
      ] },
    { tag: 'see', title: 'Where the injector lives', visualFirst: true,
      visual: { type: 'parts', drawing: 'head' },
      body: [
        'Tap the **injector**, **intake port** and **intake valve**.',
        'Port injection aims at the back of the intake valve. Direct injection pokes into the combustion chamber itself.',
      ] },
    { tag: 'how', title: 'Port fuel injection (PFI)',
      body: [
        '[[port-injection]]: one injector per intake port, at about 40–60 psi (3–4 bar).',
        'Fuel has the whole intake stroke to vaporize and mix: a very even mixture.',
        'Simple, quiet, cheap, and the spray **washes the intake valves** clean.',
      ] },
    { tag: 'how', title: 'Direct injection (DI)',
      body: [
        '[[direct-injection]]: injector in the chamber at roughly 500–3,000 psi, spraying during the intake (sometimes compression) stroke.',
        '**[[charge-cooling]]**: fuel evaporating inside the cylinder soaks up heat. Cooler charge = denser and less knock-prone.',
        'That knock margin buys more compression or more boost. A big reason turbo engines like EcoBoost went DI.',
        'Costs: [[hpfp|high-pressure pump]], pricier injectors, ticking noise, and more soot particles.',
      ] },
    { tag: 'why', title: 'The DI catch: carbon on the intake valves',
      body: [
        'Oily [[pcv]] vapor from the crankcase (plus some exhaust pushed back during [[valve-overlap|overlap]]) flows past the hot intake valves.',
        'With PFI, fuel keeps rinsing them. With DI only, nothing does, so deposits bake on: [[intake-valve-deposits|carbon buildup]].',
        'Heavy buildup chokes airflow: rough idle, misfires, lost power, usually only after many miles. It doesn’t affect port-injected engines the same way.',
      ] },
    { tag: 'how', title: 'Best of both: dual injection',
      body: [
        '[[dual-injection]]: a port **and** a direct injector per cylinder; the PCM blends them by rpm and load.',
        'Port at light load (clean valves, smooth mixing). Direct at high load (charge cooling, knock resistance).',
        'Examples: Toyota’s D-4S engines; Ford added port injectors to the 3.5 L EcoBoost in the 2017 F-150.',
      ] },
    { tag: 'bronco', title: 'Your 2.0: direct injection',
      body: [
        'Your engine is “GTDI”: gasoline turbocharged **direct injection**. That’s confirmed.',
        'Dealer and owner sources describe it as **DI only**. One forum post claims port injectors too; that’s **not confirmed**.',
        'If it is DI only, it’s in the group that can build intake-valve carbon over time. DI is also part of how it makes about 250 hp (some sources say 245) from 2.0 L on boost without knocking.',
      ],
      facts: ['bronco.injection', 'bronco.portInjection', 'bronco.output'] },
  ],
  quiz: [
    { type: 'mc', q: 'Which system keeps the intake valves washed with fuel?', options: ['Direct injection', 'Port injection', 'Neither', 'Only carburetors'], answer: 1,
      why: 'Port injectors spray onto the back of the intake valve, so fuel constantly rinses deposits off. DI sprays into the cylinder, past the valves.' },
    { type: 'mc', q: 'What is the main **knock** benefit of direct injection?', options: ['Higher fuel pressure makes a bigger spark', 'Fuel evaporating in the cylinder cools the charge', 'It removes the need for a throttle', 'It burns less oxygen'], answer: 1,
      why: 'Evaporation pulls heat from the air charge right where it matters, so the engine can tolerate more compression or boost before knocking.' },
    { type: 'tap', q: 'Tap where a **port** injector sprays its fuel: the back of this part.', visual: { type: 'parts', drawing: 'head' }, answer: 'intake-valve',
      why: 'Port injectors aim at the back of the intake valve, so the fuel washes it and vaporizes on the hot valve.',
      wrong: { 'exhaust-valve': 'Fuel never goes to the exhaust side on purpose.', chamber: 'The chamber is where a direct injector sprays.' } },
    { type: 'mc', q: 'On a dual-injection engine, which injector does most of the work at **light load**?', options: ['Direct', 'Port', 'Both shut off', 'Whichever is colder'], answer: 1,
      why: 'Port injection at light load keeps the valves clean and mixes smoothly; DI takes over under high load for charge cooling.' },
  ],
  cards: [
    { id: 'pfi', front: 'Port injection: where and how much pressure?', back: 'Into the intake port, at the back of the valve. ~40–60 psi (3–4 bar).' },
    { id: 'di', front: 'Direct injection’s big advantage?', back: 'Charge cooling → knock resistance → more compression/boost.' },
    { id: 'carbon', front: 'Why do DI-only engines build intake-valve carbon?', back: 'PCV oil vapor bakes onto the valves, and no fuel washes them.' },
    { id: 'dual', front: 'How does dual injection split the work?', back: 'Port at light load, direct at high load.' },
  ],
};
