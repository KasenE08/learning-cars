// Python in five minutes
export default {
  steps: [
    { tag: 'metaphor', title: 'A calculator with sticky notes',
      body: [
        '[[python]] is a calculator that remembers. You write lines; it runs them **top to bottom**, like a recipe.',
        'A [[variable]] is a **sticky note**: a name stuck on a value. `rpm = 3000` writes 3000 on a note called `rpm`.',
        'Why Python for cars: open-source car tools like **cantools** and **python-can** are Python, and a few lines turn raw bus data into speed and rpm.',
      ] },
    { tag: 'see', title: 'Where this is heading', visualFirst: true,
      visual: { type: 'candump', scenario: 'drive', ids: [0x415], highlight: true },
      body: [
        'A **simulated** log (made-up values) of one CAN message, the way the Linux tool [[candump]] prints it.',
        'Each line is one frame from the [[can-bus]]: a time, an ID, then 8 bytes of hex. Watch the first bytes climb as the truck speeds up.',
        'By the end of Decoding Signals you’ll write Python that turns these lines into speed over time.',
      ] },
    { tag: 'how', title: 'print, comments & numbers',
      body: [
        '`print(42)` shows a value. A line starting with `#` is a **comment**: notes for humans, Python skips it.',
        'Whole numbers are **ints** (`3000`); numbers with a point are **floats** (`64.26`).',
        '`+ - *` work as usual. `/` **always gives a float**: `3000 / 60` is `50.0`.',
        '`//` divides and drops the remainder (`7 // 2` is `3`); `%` gives the remainder (`7 % 2` is `1`).',
        '`=` means “store”, not “equals”: `rpm = rpm + 100` reads the old note, adds 100, writes the new value.',
      ] },
    { tag: 'how', title: 'Text and f-strings',
      body: [
        'Text is a [[string]]: anything in quotes, `"can0"` or `\'415\'`. `"40" + "1"` is `"401"` (glued, not added).',
        'An [[f-string]] drops values into text: `f"{rpm} rpm"` → `"3000 rpm"`.',
        'Format inside the braces: `f"{39.929:.1f}"` → `"39.9"` (one decimal). `f"{4000:04X}"` → `"0FA0"` (hex, 4 digits; next lessons).',
        'Text that looks like a number is still text: `"4000"` and `4000` are different things until you convert with `int()`.',
      ] },
    { tag: 'code', title: 'Revs per second',
      body: [
        'Small win first: one variable, one calculation.',
        'Engine speed is in revolutions per **minute**; a minute has 60 seconds.',
      ],
      code: {
        id: 'python-01-revs',
        prompt: 'Set `per_sec` to how many revolutions the engine makes each **second** at `rpm`.',
        starter: `# The engine is turning 3000 rpm
# (revolutions per MINUTE).
rpm = 3000

# How many revolutions per SECOND?
# Use the rpm variable and /
per_sec = ___

print(per_sec)
`,
        tests: [
          { name: '3000 rpm works out to 50 revs per second', code: 'assert per_sec == 50, f"per_sec is {per_sec!r}, expected 50"' },
          { name: 'per_sec is a number, not text', code: 'assert isinstance(per_sec, (int, float)), f"per_sec is {type(per_sec).__name__}; drop the quotes"' },
        ],
        hints: [
          'Revs per second = revs per minute ÷ seconds per minute.',
          'Division in Python is `/`.',
          '`per_sec = rpm / 60`',
        ],
        solution: `# The engine is turning 3000 rpm
# (revolutions per MINUTE).
rpm = 3000

# 60 seconds in a minute
per_sec = rpm / 60

print(per_sec)  # 50.0
`,
      } },
    { tag: 'code', title: 'km/h to mph',
      body: [
        '`def` makes a **[[function]]**: a reusable recipe. Values go in through the brackets; `return` hands the answer back.',
        'Ford’s speed signal on CAN is in **km/h** (per the community DBC from the open-source openpilot project, not from Ford), while your dash shows mph. So you’ll convert a lot.',
        '1 mile is exactly **1.609344 km**.',
      ],
      code: {
        id: 'python-01-mph',
        prompt: 'Finish `kph_to_mph(kph)` so it returns the speed in mph.',
        starter: `# 1 mile = 1.609344 km, exactly
KM_PER_MILE = 1.609344

def kph_to_mph(kph):
    # km/h divided by km per mile
    mph = ___
    return mph

speed = kph_to_mph(100)
print(f"100 km/h = {speed:.1f} mph")
`,
        tests: [
          { name: '100 km/h is about 62.1 mph', code: 'v = kph_to_mph(100)\nassert v is not None, "the function returned nothing; keep the return line"\nassert abs(v - 62.137) < 0.01, f"kph_to_mph(100) gave {v!r}"' },
          { name: '0 km/h is 0 mph', code: 'assert kph_to_mph(0) == 0, f"got {kph_to_mph(0)!r}"' },
          { name: 'The simulated cruise speed, 64.26 km/h, is about 39.9 mph', code: 'v = kph_to_mph(64.26)\nassert abs(v - 39.93) < 0.01, f"kph_to_mph(64.26) gave {v!r}"' },
        ],
        hints: [
          'Use the input `kph` and the constant `KM_PER_MILE`.',
          'A mile is longer than a kilometer, so the mph number is smaller: divide.',
          '`mph = kph / KM_PER_MILE`',
        ],
        solution: `# 1 mile = 1.609344 km, exactly
KM_PER_MILE = 1.609344

def kph_to_mph(kph):
    # a mile is longer, so divide
    mph = kph / KM_PER_MILE
    return mph

speed = kph_to_mph(100)
print(f"100 km/h = {speed:.1f} mph")
`,
      } },
  ],
  quiz: [
    { type: 'mc', q: 'What does `print(3000 / 60)` show?', options: ['`50`', '`50.0`', '`3000 / 60`', 'An error'], answer: 1,
      why: 'In Python 3, `/` always produces a float, even when it divides evenly. Use `//` if you want a whole number.',
      wrong: { 0: 'That’s what `3000 // 60` would show.', 2: 'Without quotes it’s math, not text, so Python calculates it.' } },
    { type: 'num', q: 'What is `7 // 2` in Python?', answer: 3, tol: 0,
      hint: '`//` divides and drops the remainder.', why: '7 ÷ 2 = 3.5; `//` keeps only the whole part, **3**. (`7 % 2` would give the remainder, 1.)' },
    { type: 'mc', q: 'What does `"40" + "1"` give?', options: ['`41`', '`"401"`', '`"41"`', 'An error'], answer: 1,
      why: 'Both are strings (in quotes), so `+` glues them together. Convert with `int()` first if you want arithmetic.' },
    { type: 'mc', q: 'Which line shows `rpm` inside text, like “3000 rpm”?', options: ['`print("{rpm} rpm")`', '`print(f"{rpm} rpm")`', '`print(rpm + " rpm")`', '`# print(rpm)`'], answer: 1,
      why: 'Only an f-string (the `f` before the quote) fills in `{rpm}`.',
      wrong: { 0: 'Without the `f`, the braces print literally: `{rpm} rpm`.', 2: 'Adding a number to text raises a TypeError.', 3: 'The `#` makes it a comment, so it never runs.' } },
  ],
  cards: [
    { id: 'variable', front: 'What does `rpm = 3000` do?', back: 'Stores 3000 under the name `rpm` (a variable). `=` means “store”, not “equals”.' },
    { id: 'div', front: '`/` vs `//` vs `%` in Python?', back: '`/` float division (`7/2` = 3.5); `//` drops the remainder (3); `%` is the remainder (1).' },
    { id: 'fstring', front: 'How do you put a value into text?', back: 'An f-string: `f"{speed:.1f} mph"` (`:.1f` = one decimal).' },
    { id: 'def', front: 'What do `def` and `return` do?', back: '`def` defines a reusable function; `return` hands its result back to whoever called it.' },
    { id: 'mph', front: 'km/h → mph?', back: 'Divide by 1.609344 (km in a mile, exact).' },
  ],
};
