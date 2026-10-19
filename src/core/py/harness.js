// Runs one exercise attempt in a Pyodide instance: data files → setup → your code → tests.
// Shared by the browser worker and the Node test suite, so what passes in tests passes in the app.

export const USER_FILE = 'main.py';

/** Turn a Python traceback into { line, text, friendly } for beginners. */
export function formatError(message, file = USER_FILE) {
  const lines = String(message || '').trim().split('\n');
  const last = lines[lines.length - 1] || 'Error';
  let line = null;
  for (const l of lines) {
    const m = l.match(new RegExp(`File "${file.replace('.', '\\.')}", line (\\d+)`));
    if (m) line = Number(m[1]);
  }
  let friendly = '';
  if (/name '___' is not defined/.test(last)) friendly = 'There’s still a ___ blank to fill in.';
  else if (/^IndentationError/.test(last)) friendly = 'Python cares about indentation: lines inside a def, if or for need 4 more spaces than the line above.';
  else if (/^SyntaxError/.test(last)) friendly = 'Python couldn’t read this line. Check for a missing colon, bracket or quote.';
  else if (/^NameError/.test(last)) friendly = 'That name doesn’t exist yet. Check the spelling, or define it first.';
  else if (/^TypeError/.test(last)) friendly = 'A value is the wrong type for this operation (for example adding text to a number).';
  else if (/^ValueError: invalid literal for int\(\) with base 16/.test(last)) friendly = 'int(text, 16) got something that isn’t hex. Print the text to see what it really is.';
  else if (/^IndexError/.test(last)) friendly = 'You asked for a position past the end of a list or string. Remember positions start at 0.';
  else if (/^KeyError/.test(last)) friendly = 'That key isn’t in the dictionary.';
  else if (/^ZeroDivisionError/.test(last)) friendly = 'Something divided by zero.';
  return { line, text: last, friendly };
}

/**
 * @param py a loaded Pyodide instance
 * @param ex { code, setup?, files?: { name: text }, tests?: [{ name, code }] }
 * @param out function receiving printed text
 */
export async function runExercise(py, ex, out = () => {}) {
  py.setStdout({ batched: (s) => out(s + '\n') });
  py.setStderr({ batched: (s) => out(s + '\n') });
  try { py.setStdin({ error: true }); } catch { /* older API */ }
  try { py.FS.mkdirTree('/data'); } catch { /* exists */ }
  for (const [name, text] of Object.entries(ex.files || {})) py.FS.writeFile(`/data/${name}`, text);
  const ns = py.globals.get('dict')();
  const res = { ok: false, error: null, tests: [], ran: false };
  try {
    py.runPython('import os\nos.chdir("/data")', { globals: ns });
    if (ex.setup) py.runPython(ex.setup, { globals: ns, filename: 'setup.py' });
    py.runPython(ex.code ?? '', { globals: ns, filename: USER_FILE });
    res.ran = true;
  } catch (e) {
    res.error = formatError(e.message);
    ns.destroy?.();
    return res;
  }
  for (const t of ex.tests || []) {
    try {
      py.runPython(t.code, { globals: ns, filename: 'check.py' });
      res.tests.push({ name: t.name, ok: true });
    } catch (e) {
      const err = formatError(e.message, 'check.py');
      const assertion = err.text.match(/^AssertionError:?\s*(.*)$/);
      res.tests.push({ name: t.name, ok: false, msg: assertion ? assertion[1] || 'Not quite.' : err.text, friendly: assertion ? '' : err.friendly });
    }
  }
  res.ok = res.tests.length > 0 && res.tests.every((t) => t.ok);
  ns.destroy?.();
  return res;
}
