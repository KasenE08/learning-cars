// The cylinder head
export default {
  steps: [
    { tag: 'metaphor', title: 'The lid with doors',
      body: [
        'If the block is a row of pots, the [[cylinder-head]] is the **lid**. It has **doors** (valves) to let air in and exhaust out, and a **lighter** (spark plug).',
        'Almost everything that decides how an engine **breathes** lives in the head.',
      ] },
    { tag: 'see', title: 'Inside a DOHC head', visualFirst: true,
      visual: { type: 'parts', drawing: 'head' },
      body: ['Tap each part. This slice cuts through one intake and one exhaust valve.'] },
    { tag: 'how', title: 'Ports and chamber',
      body: [
        '[[ports|Intake ports]] lead air from the intake manifold to the intake valves. Exhaust ports lead from the exhaust valves to the manifold or turbo.',
        'Port shape matters: smooth, well-aimed ports flow more air and make the mixture swirl and tumble for a faster burn. “Porting” a head means reshaping them.',
        'The [[combustion-chamber]] is a dome in the head’s underside. A **pent-roof** shape (like a tent) fits 4 valves and a central plug.',
      ] },
    { tag: 'how', title: 'Why four valves?',
      body: [
        'Two small intake valves have **more total opening (curtain) area** than one big one in the same space. More flow at high rpm.',
        'Smaller valves are lighter, so they can follow the cam at higher rpm.',
        'It leaves room for a **central spark plug**: the flame has the shortest path to every edge.',
      ] },
    { tag: 'how', title: 'Head gasket and head bolts',
      body: [
        'The [[head-gasket]] seals three things at once: combustion pressure, coolant and oil.',
        'When it fails: coolant in the oil (milky), oil in the coolant, white exhaust smoke, or combustion gas bubbling into the radiator → overheating.',
        'Many modern head bolts are **torque-to-yield**: they stretch on purpose when tightened, so they’re single-use. A rebuild detail you’ll see again.',
      ] },
    { tag: 'bronco', title: 'Your Bronco’s head',
      body: [
        '**DOHC, 4 valves per cylinder**: two camshafts on top, 16 valves total.',
        '**Direct injection**: an injector sprays fuel straight into each chamber at very high pressure. That’s the blue part in the diagram.',
        'The turbo bolts to the **exhaust side**, fed by the exhaust ports.',
      ],
      facts: ['bronco.valvetrain', 'bronco.injection'] },
  ],
  quiz: [
    { type: 'tap', q: 'Tap the **exhaust valve**.', visual: { type: 'parts', drawing: 'head' }, answer: 'exhaust-valve',
      why: 'The exhaust valve sits on the exhaust-port side and is usually smaller than the intake valve.',
      wrong: { 'intake-valve': 'That’s the intake valve: bigger, on the intake-port side.' } },
    { type: 'tap', q: 'Tap the **direct injector**.', visual: { type: 'parts', drawing: 'head' }, answer: 'injector',
      why: 'The injector sits under the intake port and sprays straight into the chamber.' },
    { type: 'mc', q: 'Main reason for 4 valves per cylinder instead of 2?', options: ['Cheaper to build', 'More total valve opening area for airflow', 'Quieter idle', 'Lower compression'], answer: 1,
      why: 'Two smaller valves give more opening (curtain) area than one big one in the same bore. They’re also lighter and leave room for a central plug.' },
    { type: 'mc', q: 'Milky oil plus losing coolant with no visible leak points most likely to…', options: ['Worn piston rings', 'A failed head gasket', 'A bad spark plug', 'A clogged air filter'], answer: 1,
      why: 'The head gasket separates coolant passages from oil passages. When it fails between them, the two mix.' },
  ],
  cards: [
    { id: 'head', front: 'What does the cylinder head hold?', back: 'Valves, ports, combustion chamber roof, spark plugs, (DOHC) camshafts, coolant passages.' },
    { id: '4v', front: 'Why 4 valves per cylinder?', back: 'More total opening area → more airflow; lighter valves rev higher; room for a central spark plug.' },
    { id: 'hg', front: 'Head gasket failure signs?', back: 'Milky oil, coolant loss, white smoke, bubbles in the coolant, overheating.' },
    { id: 'tty', front: 'Torque-to-yield bolts?', back: 'Designed to stretch when tightened. Single-use: replace them on reassembly.' },
  ],
};
