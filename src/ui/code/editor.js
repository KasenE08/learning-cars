// Lightweight Python editor: a textarea over a syntax-highlighted <pre>.
// Phone-friendly: no autocorrect, 16px text (no iOS zoom), a key bar for symbols, auto-indent.
import { html, el, esc } from '../dom.js';

const KW = new Set('and as assert break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield'.split(' '));
const BI = new Set('print len range int str hex bin float list dict set tuple open enumerate zip sorted min max sum abs round isinstance bytes bytearray format any all map filter reversed ord chr'.split(' '));
const TOKEN = /(#[^\n]*)|("""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|[rbf]?"(?:\\.|[^"\\\n])*"?|[rbf]?'(?:\\.|[^'\\\n])*'?)|(\b0[xX][0-9a-fA-F_]+\b|\b0[bB][01_]+\b|\b\d[\d_]*(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)|(___)/g;

export function highlight(src) {
  let out = '', last = 0, prev = '';
  src.replace(TOKEN, (m, com, str, num, word, blank, i) => {
    out += esc(src.slice(last, i));
    last = i + m.length;
    if (com) out += `<span class="tk-c">${esc(m)}</span>`;
    else if (str) out += `<span class="tk-s">${esc(m)}</span>`;
    else if (num) out += `<span class="tk-n">${esc(m)}</span>`;
    else if (m === '___') out += `<span class="tk-blank">${esc(m)}</span>`;
    else if (word) {
      if (KW.has(m)) out += `<span class="tk-k">${m}</span>`;
      else if (prev === 'def' || prev === 'class') out += `<span class="tk-f">${m}</span>`;
      else if (BI.has(m)) out += `<span class="tk-b">${m}</span>`;
      else out += esc(m);
      prev = m;
      return m;
    }
    if (!/^\s*$/.test(m)) prev = '';
    return m;
  });
  return out + esc(src.slice(last)) + '\n';
}

const KEYS = [
  ['⇥', '    '], ['(', '('], [')', ')'], ['[', '['], [']', ']'], [':', ':'], ['=', '='], ['"', '"'], ["'", "'"],
  ['#', '#'], ['0x', '0x'], ['>>', ' >> '], ['<<', ' << '], ['&', ' & '], ['|', ' | '], ['+', ' + '], ['-', ' - '], ['*', ' * '], [',', ', '], ['.', '.'],
];

export function editor({ value = '', onChange = () => {}, label = 'Python code', minLines = 6 } = {}) {
  const root = el(html`<div class="ed" data-noswipe>
    <div class="ed__box">
      <pre class="ed__hl" aria-hidden="true"></pre>
      <textarea class="ed__ta" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="${label}"></textarea>
    </div>
    <div class="ed__keys" role="toolbar" aria-label="Insert symbol">${KEYS.map(([k, v]) => html`<button type="button" tabindex="-1" data-ins="${v}">${k}</button>`)}</div>
  </div>`);
  const ta = root.querySelector('textarea'), hl = root.querySelector('.ed__hl');
  ta.value = value;
  const paint = () => {
    hl.innerHTML = highlight(ta.value);
    const lines = Math.max(minLines, ta.value.split('\n').length + 1);
    root.style.setProperty('--lines', lines);
  };
  const sync = () => { hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft; };
  const insert = (text) => {
    ta.focus();
    ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
    ta.dispatchEvent(new Event('input'));
  };
  ta.addEventListener('input', () => { paint(); sync(); onChange(ta.value); });
  ta.addEventListener('scroll', sync);
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        const s = ta.value.lastIndexOf('\n', ta.selectionStart - 1) + 1;
        const n = ta.value.slice(s, s + 4).match(/^ {0,4}/)[0].length;
        if (n) { ta.setRangeText('', s, s + n, 'end'); ta.dispatchEvent(new Event('input')); }
      } else insert('    ');
    } else if (e.key === 'Enter' && !e.isComposing) {
      e.preventDefault();
      const s = ta.value.lastIndexOf('\n', ta.selectionStart - 1) + 1;
      const line = ta.value.slice(s, ta.selectionStart);
      let indent = line.match(/^ */)[0];
      if (/:\s*(#.*)?$/.test(line)) indent += '    ';
      insert('\n' + indent);
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      root.dispatchEvent(new CustomEvent('run-code', { bubbles: true }));
    }
  });
  // keep the key bar from stealing focus (so the iPhone keyboard stays open)
  root.querySelector('.ed__keys').addEventListener('pointerdown', (e) => { if (e.target.closest('[data-ins]')) e.preventDefault(); });
  root.querySelector('.ed__keys').addEventListener('click', (e) => { const b = e.target.closest('[data-ins]'); if (b) insert(b.dataset.ins); });
  paint();
  return {
    el: root,
    get value() { return ta.value; },
    set(v) { ta.value = v; paint(); onChange(v); },
    focus() { ta.focus(); },
    markLine(n) {
      root.querySelector('.ed__err')?.remove();
      if (!n) return;
      const mark = el(html`<i class="ed__err" style="--ln:${n - 1}"></i>`);
      root.querySelector('.ed__box').append(mark);
    },
  };
}
