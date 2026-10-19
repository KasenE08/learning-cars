// Capture file formats.
// candump -l (can-utils):  (1700000000.123456) can0 415#0FA0C04D00000000
// SavvyCAN native CSV (format from SavvyCAN's framefileio.cpp saveNativeCSVFile):
//   Time Stamp,ID,Extended,Dir,Bus,LEN,D1,D2,D3,D4,D5,D6,D7,D8
//   2000,00000415,false,Rx,0,8,0F,A0,C0,4D,00,00,00,00,
import { toHex } from './bits.js';

const hex = (n, w) => n.toString(16).toUpperCase().padStart(w, '0');

export function toCandump(frames, iface = 'can0') {
  return frames.map((f) => `(${f.t.toFixed(6)}) ${iface} ${hex(f.id, f.id > 0x7ff ? 8 : 3)}#${toHex(f.data)}`).join('\n') + '\n';
}

export function toSavvyCsv(frames) {
  const lines = ['Time Stamp,ID,Extended,Dir,Bus,LEN,D1,D2,D3,D4,D5,D6,D7,D8'];
  for (const f of frames) {
    const d = [...f.data];
    const bytes = Array.from({ length: 8 }, (_, i) => (i < d.length ? hex(d[i], 2) : '00'));
    lines.push(`${Math.round(f.t * 1e6)},${hex(f.id, 8)},${f.id > 0x7ff ? 'true' : 'false'},Rx,0,${d.length},${bytes.join(',')},`);
  }
  return lines.join('\n') + '\n';
}

const bytesOf = (h) => Uint8Array.from((h.match(/../g) || []).map((x) => parseInt(x, 16)));

/** Parse candump -l or SavvyCAN CSV text → { frames, format, skipped }. Times start at 0. */
export function parseCapture(text) {
  const lines = String(text).split(/\r?\n/).filter((l) => l.trim());
  const frames = [];
  let skipped = 0, format = 'unknown';
  if (/^Time Stamp,ID,Extended/i.test(lines[0] || '')) {
    format = 'savvycan';
    for (const l of lines.slice(1)) {
      const c = l.split(',');
      const len = Number(c[5]), id = parseInt(c[1], 16), t = Number(c[0]) / 1e6;
      if (!Number.isFinite(id) || !Number.isFinite(t) || !(len >= 0 && len <= 8)) { skipped++; continue; }
      frames.push({ t, id, data: Uint8Array.from(c.slice(6, 6 + len).map((x) => parseInt(x, 16))) });
    }
  } else {
    format = 'candump';
    const re = /^\s*\((\d+(?:\.\d+)?)\)\s+\S+\s+([0-9A-Fa-f]{1,8})#([0-9A-Fa-f]*)\s*$/;
    for (const l of lines) {
      const m = re.exec(l);
      if (!m || m[3].length % 2 || m[3].length > 16) { skipped++; continue; } // skips CAN FD (##) and remote frames
      frames.push({ t: Number(m[1]), id: parseInt(m[2], 16), data: bytesOf(m[3]) });
    }
  }
  if (frames.length) { const t0 = frames[0].t; if (t0 > 1e6) for (const f of frames) f.t -= t0; }
  return { frames, format, skipped };
}
