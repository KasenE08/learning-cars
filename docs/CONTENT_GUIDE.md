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
