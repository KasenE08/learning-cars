// Manual gearbox internals
export default {
  steps: [
    { tag: 'metaphor', title: 'Every gear is already spinning',
      body: [
        'Picture a row of desk fans, all running. Choosing one isn’t switching it on; it’s **plugging its output** into the room.',
        'A modern manual gearbox works the same way: every gear pair is always meshed and turning. Shifting just picks **which one is locked to its shaft**.',
      ] },
    { tag: 'math', title: 'Ratio = teeth ÷ teeth',
      body: [
        '[[gear-ratio|Gear ratio]] = `driven teeth ÷ driving teeth`. A 12-tooth gear driving a 36-tooth gear = **3:1**.',
        'Output turns **3× slower** with **3× the torque** (minus a few percent lost to friction).',
        'Ratio below 1 (say 0.75:1) = **overdrive**: output spins faster than the engine. Great for quiet, efficient cruising.',
        'Bigger steps between gears → bigger rpm drop on each upshift.',
      ] },
    { tag: 'see', title: 'Inside the case', visualFirst: true,
      visual: { type: 'exploded', assembly: 'gearbox' },
      body: [
        'Follow the teardown order: case halves, then the **shafts** with their gear pairs, **synchro hubs and sleeves**, and the **shift forks** that move the sleeves.',
        'Bearings at each shaft end carry the load; the whole thing runs in gear oil.',
      ] },
    { tag: 'how', title: '2-shaft vs 3-shaft',
      body: [
        '**2-shaft** (most FWD [[transaxle|transaxles]]): an **input shaft** and an **output shaft**, side by side. Power crosses through **one** gear pair. The output’s small pinion drives the differential directly.',
        '**3-shaft** (classic RWD): input → a fixed “head” gear pair → the [[layshaft]] (countershaft) → back up to a **mainshaft** that lines up with the input.',
        '3-shaft trick: lock the input straight to the mainshaft and you get **direct drive, 1:1**, with no gear mesh in the path. That’s why many RWD boxes have a 1.00 gear.',
        '3-shaft ratio = head-pair ratio × selected-pair ratio.',
      ] },
    { tag: 'how', title: 'Constant mesh',
      body: [
        '[[constant-mesh|Constant mesh]]: all forward gears stay meshed. On one shaft the gears are **fixed**; their partners on the other shaft **freewheel** on needle bearings.',
        'A sleeve splined to the shaft slides over and locks one freewheeling gear to it. That gear now carries the power; the rest just spin along.',
        'Teeth are usually **helical** (angled): quieter and stronger than straight-cut, but they push sideways, so the shafts need thrust bearings.',
        'Very old “crash boxes” slid whole gears into mesh. Hence the name, and the noise.',
      ] },
    { tag: 'see', title: 'Pick a gear', visualFirst: true,
      visual: { type: 'gearshift' },
      body: [
        'Select N, 1–5 and R. Watch the sleeve slide and the lit power path move to a different gear pair.',
        'Low gears pair a **small** driving gear with a **big** driven gear; top gear is close to equal sizes or overdrive.',
        'Now pick **R** and look for the third gear in the path.',
      ] },
    { tag: 'how', title: 'Reverse: the idler',
      body: [
        'Two meshed gears spin in **opposite** directions. Add a third, the [[reverse-idler]], between them and the output flips direction.',
        'Reverse is often **straight-cut** (spur) teeth: that’s the whine you hear backing up in many manuals.',
        'On many boxes reverse has **no synchro**, so it grinds if the car (or input shaft) isn’t stopped first.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'In a constant-mesh gearbox, what actually changes when you select a gear?', options: ['Gears slide into mesh with each other', 'A sleeve locks one freewheeling gear to its shaft', 'The clutch disc changes size', 'Oil pressure switches gear pairs'], answer: 1,
      why: 'All gears are always meshed. Selecting a gear slides a synchro sleeve to lock that gear to its shaft.',
      wrong: { 0: 'That’s the old “crash box” design. Modern forward gears never slide into mesh.' } },
    { type: 'mc', q: 'Why does reverse need an idler gear?', options: ['To make reverse a higher gear', 'A third gear in the path flips the output’s direction', 'To quiet the gearbox', 'To engage the synchro'], answer: 1,
      why: 'Each mesh reverses direction. Two meshes (input → idler → output) give the opposite direction to a normal one-mesh forward gear.' },
    { type: 'mc', q: 'What is special about **direct drive** in a 3-shaft gearbox?', options: ['It uses the smallest gears', 'Input locks straight to the output: 1:1 with no gear mesh in the path', 'It only works in reverse', 'It disconnects the engine'], answer: 1,
      why: 'Input and mainshaft are in line, so a sleeve can join them directly. No meshing teeth = least friction and noise.' },
  ],
  cards: [
    { id: 'ratio', front: 'How do you get a gear ratio from teeth?', back: 'Driven teeth ÷ driving teeth. 36 ÷ 12 = 3:1.' },
    { id: 'overdrive', front: 'What is overdrive?', back: 'A ratio below 1:1. Output spins faster than the input; used for cruising.' },
    { id: '2v3', front: '2-shaft vs 3-shaft gearbox?', back: '2-shaft (FWD): input + output, one gear pair in the path. 3-shaft (RWD): input → layshaft → mainshaft; offers direct 1:1.' },
    { id: 'mesh', front: 'Constant mesh?', back: 'All gears always meshed; partners freewheel until a sleeve locks one to its shaft.' },
    { id: 'idler', front: 'Reverse idler?', back: 'Extra gear between two others that flips the output direction.' },
  ],
};
