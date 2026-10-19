# Lesson content guide

Reader: Kasen, high-school senior headed into ECE/cybersecurity, ~7/10 car knowledge, visual learner,
learns from examples and metaphors. Owns a **2024 Ford Bronco Sport Badlands**. Choosing between a
**Kawasaki Ninja 500** and an **Aprilia RS 457**. Learning for fun, so lessons are low-pressure, short
and rewarding. Goal: understand cars well enough to know conceptually how to rebuild an engine and drivetrain.

## Hard rules
- **Accuracy first.** Verify every specific number, spec, date or claim you're not certain of with
  WebSearch. If sources conflict or you can't confirm, say so in the text ("sources disagree", "not confirmed")
  or leave it out. Never invent Bronco/Ford/Kawasaki/Aprilia specifics.
- **Gas engines only** (no EV/hybrid content beyond a one-line mention). **Theory only**: no
  hands-on how-to steps, torque specs or "do this in your garage" instructions.
- **Direct, no fluff.** Short bullets, every important detail kept. No essays. US English.
- **Metaphor first, then the real mechanics.** Step 1 of every lesson has tag `metaphor`.
- **Every lesson has at least one visual** (see docs/VISUALS.md). Use only the visual types and spec
  fields listed there.
- **Tie to the reader's vehicles** wherever it's honest to do so (a `bronco` or `bikes` step with `facts`).
- **Units:** use the more widely known unit first, the other in parentheses, labeled: "277 lb-ft (376 N·m)",
  "87.5 mm (3.44 in)". Engine internals and bikes: metric first.
- Lessons must take **3–7 minutes** (match the `min` in src/content/course.js): **4–8 steps**, each 2–5 bullets.

## File format
One file per lesson: `src/content/lessons/<unitId>-<nn>.js` (ids and titles come from src/content/course.js;
do not rename lessons). Look at `src/content/lessons/engine-02.js` and `engine-05.js` as the reference.

```js
export default {
  steps: [
    { tag: 'metaphor', title: 'Short punchy title', body: ['bullet', 'bullet'] },
    { tag: 'see', title: '…', visualFirst: true, visual: { type: 'cylinder', mode: 'cycle' }, body: ['…'] },
    { tag: 'bronco', title: '…', body: ['…'], facts: ['bronco.engine'] },
  ],
  quiz: [ /* 3–5 questions */ ],
  cards: [ { id: 'short-id', front: 'Question?', back: 'Answer.' } /* 3–6 */ ],
};
```
Step tags: `metaphor`, `how`, `see`, `math`, `bronco`, `bikes`, `key`, `why`.
Optional step fields: `visual`, `visualFirst` (visual above the bullets), `facts` (ids), `note` (small aside).

### Inline markup in any text
`**bold**` · `` `mono/formula` `` · `[[glossary-id]]` or `[[glossary-id|shown text]]` (must exist) · `~~muted aside~~`

### Quiz question types (mix them across a unit; every unit should use all four)
- `{ type: 'mc', q, options: [...], answer: <index>, why, wrong?: { <index>: 'why that pick is wrong' } }`
- `{ type: 'order', q, items: [...in correct order], why }`
- `{ type: 'num', q, answer: <number>, tol?: <absolute tolerance>, unit?: 'mm', hint?, why }`
  (tol defaults to 1% of the answer; use `tol: 0` for exact integers)
- `{ type: 'tap', q, visual: { type: 'parts', drawing: '<drawing>' }, answer: '<partId>', why, wrong?: { <partId>: '…' } }`
  (drawing and part ids must be from docs/VISUALS.md)
`why` must explain the reasoning honestly; it's shown whether right or wrong. Use `wrong` for common traps.

### Flashcards
3–6 per lesson, auto-added to spaced repetition when the lesson is finished. Front = a crisp question;
back = the answer in one or two lines. Unique `id` within the lesson.

## Glossary and facts (no shared-file edits)
- New glossary terms go in **your own** `src/content/glossary/<your-group>.js`:
  `export default [ { id: 'kebab-id', term: 'Term', aka: ['Other name'], lessons: ['unit-01'], def: 'One or two tight sentences.' } ];`
  Check existing ids first (`grep -rn "id: '" src/content/glossary*`) and don't duplicate them.
  Add a term for every new piece of jargon your lessons introduce.
- New vehicle facts go in **your own** `src/content/facts/<your-group>.js`:
  `export default { 'bronco.someFact': { value: '…', status: 'confirmed' | 'conflicting' | 'unconfirmed', sources: ['Named source', …], note?: '…' } };`
  Existing facts are in src/content/vehicles.js; reuse those ids instead of duplicating.
  Only add facts you researched; name real sources.

## Do not
- Edit any file outside your assigned lesson files and your own glossary/facts files.
- Run git commands, install packages, or touch the build config.

## Check your work
`npx vitest run tests/content.test.js tests/course.test.js` must pass (it checks tags, step counts, visuals,
quiz answers, tap part ids, glossary links, facts and card ids). Fix anything it reports.

## Phase 4b notes
- **Motorcycles:** the reader took the MSF Basic RiderCourse and drives daily. Build on MSF concepts (countersteering,
  braking, throttle control) instead of re-teaching basics, but stay theory: explain *why*, never give riding drills
  or "try this on the street". Be honest about safety (gear, training, track days as the place for limits).
  Ninja 500 and RS 457 are the running examples; compare them only with verified numbers (facts files).
- **Car culture:** sport bikes are a first-class part of culture here, not an afterthought. Label opinions as
  opinions; verify dates, numbers and "firsts" with WebSearch; be honest about myths and about the law
  (emissions tampering, exhaust noise, lighting, street racing).

## Phase 5 notes: Track 4 (computers, tuning, reverse engineering, security)
The reader's main interest. He's headed into ECE/cybersecurity, so be precise and technical, but still
metaphor first and short bullets. Extra step tags for this track: `code` (a Python exercise), `law`, `safety`.

### Honesty rules specific to this track
- **Ford signal data is community reverse-engineered.** `src/core/can/ford.js` is generated from openpilot's
  `ford_lincoln_base_pt.dbc` (commaai/opendbc, MIT). openpilot lists the Bronco Sport 2021-24 as supported.
  Every time a lesson shows a real Ford ID or signal, say it comes from the open-source openpilot project and
  is community reverse-engineered, **not from Ford**. Don't claim these are definitely on his OBD port:
  openpilot taps the bus at the camera behind the windshield, and on modern Fords the OBD port sits behind a
  gateway module (GWM), so normal traffic may not be visible there. Say so where relevant.
- **Simulated data is labeled simulated.** `src/core/can/sim.js` makes fake drives with the real message
  layouts but made-up values, timing and rates. Use the words "simulated" or "made-up values".
- **Read-only principle.** The app (Phase 7) will only ever read from a car. Explain write/flash/security-access
  services (UDS 0x2E, 0x27, 0x34/0x36, 0x31) conceptually so he understands them, but never give procedures for
  writing, flashing, bypassing security access, immobilizers, or emissions controls. Tuning is explained as
  concepts and trade-offs plus the law, not how to do it.
- **Security = theory, history, defense and ethics.** Landmark research (who, when, what it showed, how it was
  fixed) is great. No step-by-step attack instructions, no tool walkthroughs for attacking cars, no code that
  attacks anything. Always include the legal and ethical frame (authorization, coordinated disclosure, DMCA
  §1201 security-research exemption, UN R155/R156) and verify every date, CVE or claim.
- **Law:** be accurate and current (EPA tampering, CARB EO, Magnuson-Moss). Phase 4's `mods-02` and `law.*`
  facts already cover tunes; link instead of repeating.

### Python exercises (`code` steps)
The reader is **between "new to Python" and "knows the basics"**. Each exercise practices ONE idea.
```js
{ tag: 'code', title: 'Parse a candump line',
  body: ['One or two bullets of context (what and why).'],
  code: {
    id: 'decode-02-parse',               // MUST start with the lesson id, then a short slug
    prompt: 'Finish `parse_line(line)` so it returns `(can_id, data_bytes)`.',
    starter: 'def parse_line(line):\n    # 1. split on spaces\n    parts = line.split()\n    ___\n',
    setup: '...optional python run before the reader\'s code (helpers, sample data)...',
    files: { 'drive.log': 'sim:drive' }, // optional data files, see below
    tests: [ { name: 'Reads the ID as a number', code: 'assert parse_line(L)[0] == 0x415, f"got {parse_line(L)[0]!r}"' } ],
    hints: ['Gentle nudge', 'Bigger nudge', 'Nearly the answer'],
    solution: 'def parse_line(line):\n    ...\n',
  } }
```
- **Starter code**: mostly written, with comments, and `___` blanks (three underscores; the editor highlights
  them and running them gives "There's still a ___ blank to fill in"). Early exercises: 1–3 blanks. Later ones
  (decode-06, re-*) can leave a whole function body, but give the signature, a docstring and comments.
- **Tests**: 2–5 plain-English `name`s ("Converts 0x0FA0 to 40.0 km/h"). Use `assert cond, f"got {value!r}"` so a
  failure tells him what his code produced. Tests run in the same namespace as his code, after it. Don't depend
  on print output. The answer must pass every test and **the starter must fail at least one**: the test suite
  checks both by actually running Python.
- **Hints**: 2–3, from nudge to near-answer. **solution**: clean, idiomatic, commented, beginner-readable.
- Allowed: Python standard library only (no numpy). No `input()`, no `import js`/`pyodide`/`micropip`.
- **Line length**: keep lines ≤ 40 characters where practical (phones show ~34 columns; longer lines scroll).
- **Data files**: `files: { 'name.log': 'sim:<scenario>' }` writes a SIMULATED candump log into the working
  directory (open it with `open('name.log')`). Add `?ids=415,204` to keep only some IDs (hex, no 0x).
  Scenarios (src/core/can/sim.js): `idle` (10 s), `drive` (30 s: pull away, cruise ≈ 40 mph, brake to a stop),
  `blinker` (left 2–6 s, right 8–11 s), `steer` (wheel to −180° then +180°), `doors` (driver 2–5 s,
  passenger 6–8 s), `pedal` (accelerator pressed three times while parked), `brake` (brake pressed three times).
  Line format: `(0.020000) can0 415#0FA0C04D00000000` (timestamp in seconds, interface, hex ID, `#`, hex data).
  Values are deterministic, so tests may check exact results. Explore them with
  `node -e "import('./src/core/can/sim.js').then(s=>console.log(s.simFile('sim:blinker?ids=83').slice(0,400)))"`.
- Inline data is fine too: `files: { 'frames.txt': '415#0FA0...\n204#...\n' }` or a Python list in `setup`.
- **Check your work:** `npx vitest run tests/exercises.test.js` runs every exercise for real (answer passes,
  starter fails). Also run the content tests.

## Phase 6 notes: CAN Lab unit (`canlab`)
- The **CAN bench** (`#/lab/can`, code in `src/ui/can/bench.js`) drives `createCar({ full: true })` from
  `src/core/can/sim.js`: 16 real Ford message layouts from the community DBC (`src/core/can/ford.js`, includes
  `cycleMs` from the DBC's GenMsgCycleTime) with made-up values. Extra full-mode messages: 0x04C seatbelts,
  0x082 steering torque, 0x156 coolant/oil temp, 0x178 ambient temp/pressure, 0x217 four wheel speeds (rad/s),
  0x43E manifold pressure + charging-voltage command; plus wipers/high-beam in 0x83 and GearLvr in 0x176.
  Ignition Off silences the bus; Accessory keeps only body messages (0x04C, 0x083, 0x178, 0x3B3, 0x3C3).
  Temperatures warm up faster than reality (so you can watch); say so if you mention it.
- **Challenges** (`src/content/challenges.js`): ids `turn-id`, `turn-values`, `lamp`, `brake`, `door`, `speed`, `rpm`,
  `steer`, `gear`, `counter`, `wheels`. Link one with `[Try the lamp challenge](#/lab/can?c=lamp)` (in-app links:
  `[label](#/...)` work in any lesson text). Don't give away challenge answers in lessons: teach the method.
- **Capture formats**: candump `-l` (`(1700000000.123456) can0 415#0FA0C04D00000000`) and SavvyCAN native CSV
  (`Time Stamp,ID,Extended,Dir,Bus,LEN,D1..D8`, microsecond timestamps, 8-digit hex ID), from SavvyCAN's
  framefileio.cpp. Saved captures appear in the Python bench as files (`open("blinker-test.log")`).
- **Exercise data for full-mode logs**: `files: { 'drive.log': 'sim:drive?full' }` (also `?full&ids=217,415`).
  Scenarios are the same seven (`idle`, `drive`, `blinker`, `steer`, `doors`, `pedal`, `brake`); plain `sim:drive`
  stays the Phase 5 10-message car, so earlier exercises don't change.
