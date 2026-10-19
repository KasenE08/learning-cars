// Lists, loops & functions
const RPMS = `rpms = [702, 706, 798, 2754, 3082,
        2758, 2602, 1768, 1806, 1838,
        1858, 1414, 1224, 700, 702]
`;

export default {
  steps: [
    { tag: 'metaphor', title: 'A train and a worker',
      body: [
        'A [[list]] is a **train of numbered cars**, each holding one value. Car numbers start at **0**.',
        'A `for` [[loop]] is a worker who walks down the train and does the **same job at every car**.',
        'A [[function]] is that job written down once, with a name, so you can reuse it on any train.',
      ] },
    { tag: 'see', title: 'A signal is a list of readings', visualFirst: true,
      visual: { type: 'sigplot', scenario: 'drive', id: 0x204, start: 28, length: 13, endian: 'big' },
      body: [
        'Engine rpm over a **simulated** 30-second drive (made-up values). Every dot on the curve is one reading.',
        'The bits come from `EngAout_N_Actl` in ID `0x204`, a layout from the open-source openpilot project’s community-reverse-engineered DBC (not from Ford).',
        'In Python, readings like these live in a list. The exercises use one reading every 2 seconds from this drive.',
      ] },
    { tag: 'how', title: 'Lists',
      body: [
        '`rpms = [702, 798, 2754]` makes a list. `rpms[0]` is the **first** item (702); `rpms[-1]` is the last.',
        '`len(rpms)` counts items (3). `rpms.append(3082)` adds one to the end.',
        'Built-ins worth knowing: `sum(rpms)`, `max(rpms)`, `min(rpms)`.',
        'Asking for `rpms[3]` in a 3-item list is an **IndexError**: positions are 0, 1, 2.',
      ] },
    { tag: 'how', title: 'for, if & indentation',
      body: [
        '`for r in rpms:` runs the indented lines once per item, with `r` set to that item.',
        '`if r > 2500:` runs its indented lines only when the test is true. Tests: `>` `<` `>=` `<=` `==` (equal) `!=` (not equal).',
        'The **colon** and the **4-space indent** are how Python knows what’s inside. No braces.',
        '`==` compares; `=` stores. `if r = 2500:` is a SyntaxError.',
      ],
      note: 'A function’s variables (like `total` inside it) live only inside that function.' },
    { tag: 'code', title: 'Average rpm',
      body: [
        'The classic loop: start a running total at 0, add each reading, divide by how many there were.',
        '(`sum()` would do it in one go; writing the loop once shows what it’s doing.)',
      ],
      code: {
        id: 'python-02-average',
        prompt: 'Finish `average(readings)` so it returns the mean of the list.',
        starter: `# Simulated rpm, one reading per 2 s
${RPMS}
def average(readings):
    total = 0
    for r in readings:
        # add this reading to the total
        total = ___
    # divide by how many readings
    return total / ___

print(average(rpms))
`,
        tests: [
          { name: 'Average of [1000, 2000, 3000] is 2000', code: 'v = average([1000, 2000, 3000])\nassert v == 2000, f"got {v!r}"' },
          { name: 'Works for a single reading', code: 'v = average([700])\nassert v == 700, f"average([700]) gave {v!r}"' },
          { name: 'The simulated drive averages about 1647 rpm', code: 'v = average(rpms)\nassert abs(v - 1647.47) < 0.01, f"got {v!r}"' },
        ],
        hints: [
          'Each time through the loop, the new total is the old total plus `r`.',
          'How many readings? `len(readings)`.',
          '`total = total + r` and `return total / len(readings)`',
        ],
        solution: `# Simulated rpm, one reading per 2 s
${RPMS}
def average(readings):
    total = 0
    for r in readings:
        total = total + r
    # mean = total / how many
    return total / len(readings)

print(average(rpms))  # 1647.47
`,
      } },
    { tag: 'code', title: 'Count readings over a limit',
      body: [
        'Same loop, now with an `if` inside: count how many readings are **above** a limit.',
        '`rpms` (the same simulated list) is already loaded for you.',
      ],
      code: {
        id: 'python-02-over',
        prompt: 'Finish `count_over(readings, limit)` so it returns how many readings are greater than `limit`.',
        setup: RPMS,
        starter: `def count_over(readings, limit):
    count = 0
    for r in readings:
        # is r above the limit?
        if ___:
            count = count + 1
    return count

print(count_over(rpms, 2500))
`,
        tests: [
          { name: '4 simulated readings are over 2500 rpm', code: 'v = count_over(rpms, 2500)\nassert v == 4, f"got {v!r}"' },
          { name: 'Returns 0 when nothing is over', code: 'v = count_over([700, 800], 6000)\nassert v == 0, f"got {v!r}"' },
          { name: 'A reading exactly at the limit isn’t “over” it', code: 'v = count_over([2500, 2501], 2500)\nassert v == 1, f"got {v!r}; use > rather than >="' },
        ],
        hints: [
          'The test compares the current reading `r` with `limit`.',
          '“Greater than” is `>`.',
          '`if r > limit:`',
        ],
        solution: `def count_over(readings, limit):
    count = 0
    for r in readings:
        # strictly greater than
        if r > limit:
            count = count + 1
    return count

print(count_over(rpms, 2500))  # 4
`,
      } },
    { tag: 'key', title: 'The pattern you’ll reuse',
      body: [
        'Almost every log tool is: **start empty → loop over lines → test with `if` → keep or count → return**.',
        'Next lesson, the “items” become lines of text from a CAN log, and you’ll pull numbers out of them.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'With `rpms = [700, 800, 900]`, what is `rpms[1]`?', options: ['700', '800', '900', 'IndexError'], answer: 1,
      why: 'Positions start at 0: `rpms[0]` is 700, `rpms[1]` is 800.' },
    { type: 'order', q: 'Put the lines of `average` in working order.',
      items: ['`def average(readings):`', '`total = 0`', '`for r in readings:`', '`total = total + r`', '`return total / len(readings)`'],
      why: 'Define the function, start the total at 0, loop, add each reading inside the loop, then return after the loop has finished.' },
    { type: 'tap', q: 'Engine rpm starts in the engine computer, which reads the crankshaft position sensor. Tap it.', visual: { type: 'parts', drawing: 'car-top' }, answer: 'pcm',
      why: 'Ford calls its engine computer the PCM (powertrain control module). It works out rpm and shares it with other modules over CAN.',
      wrong: { engine: 'The engine makes the rotation; the PCM is the computer that measures and broadcasts it.', transmission: 'The transmission uses engine speed, but the PCM measures it.' } },
  ],
  cards: [
    { id: 'index0', front: 'First and last items of list `xs`?', back: '`xs[0]` and `xs[-1]`. Positions start at 0.' },
    { id: 'len', front: 'How do you count the items in a list?', back: '`len(xs)`.' },
    { id: 'loop', front: 'What does `for r in rpms:` do?', back: 'Runs the indented block once per item, with `r` set to each item in turn.' },
    { id: 'eq', front: '`=` vs `==`?', back: '`=` stores a value; `==` asks “are these equal?” (inside `if`).' },
    { id: 'pattern', front: 'The basic log-processing pattern?', back: 'Start empty → loop over items → `if` test → keep/count → return.' },
  ],
};
