// Parse ELM327 text responses into bytes, and decode DTCs, readiness monitors and the VIN.
// Pure (no DOM), so it's unit-tested. We run the adapter with headers OFF and spaces ON, so a
// response line is just space-separated hex data bytes (a leading "N:" multi-frame counter is dropped).

const HEX = /^[0-9A-Fa-f]{2}$/;

/** Hex data bytes from one response line, dropping an ISO-TP frame counter like "0:". */
export function lineBytes(line) {
  const toks = line.trim().replace(/\r/g, '').split(/\s+/).filter(Boolean);
  if (toks[0] && /^[0-9A-Fa-f]:$/.test(toks[0])) toks.shift();     // multi-frame "0:" counter
  return toks.filter((t) => HEX.test(t)).map((t) => parseInt(t, 16));
}

/** All data bytes across lines (handles multi-line CAN responses). */
export const allBytes = (lines) => lines.flatMap(lineBytes);

export const STATUS_WORDS = ['NO DATA', 'UNABLE TO CONNECT', 'CAN ERROR', 'BUS INIT', 'BUS BUSY', 'STOPPED', 'ERROR', '?', 'SEARCHING'];
export const isStatus = (lines) => lines.some((l) => STATUS_WORDS.some((w) => l.toUpperCase().includes(w)));

/** Data bytes after a "41 <pid>" (Mode 01) reply. Returns null if the header isn't found. */
export function mode01Data(lines, pid) {
  const b = allBytes(lines);
  const p = parseInt(pid, 16);
  for (let i = 0; i < b.length - 1; i++) if (b[i] === 0x41 && b[i + 1] === p) return b.slice(i + 2);
  return null;
}

/** Decode one DTC from two bytes, e.g. (0x03,0x01) → "P0301". */
export function decodeDtc(b0, b1) {
  const letter = 'PCBU'[b0 >> 6];
  const d1 = (b0 >> 4) & 0x3;
  return `${letter}${d1}${((b0 & 0xf).toString(16) + (b1 >> 4).toString(16) + (b1 & 0xf).toString(16)).toUpperCase()}`;
}

/** Mode 03 (stored) / 07 (pending) response → list of DTC strings (padding 00 00 dropped). */
export function decodeDtcs(lines, mode = 0x43) {
  const b = allBytes(lines);
  const i = b.indexOf(mode);
  if (i < 0) return [];
  // After the header some ECUs send a count byte; skip it only if it makes the rest an even length.
  let rest = b.slice(i + 1);
  if (rest.length % 2 === 1) rest = rest.slice(1);
  const out = [];
  for (let k = 0; k + 1 < rest.length; k += 2) { if (rest[k] === 0 && rest[k + 1] === 0) continue; out.push(decodeDtc(rest[k], rest[k + 1])); }
  return [...new Set(out)];
}

const SPARK_MONITORS = ['Catalyst', 'Heated catalyst', 'Evaporative system', 'Secondary air', 'A/C refrigerant', 'Oxygen sensor', 'O2 sensor heater', 'EGR / VVT'];

/** Mode 01 PID 01 (A B C D) → MIL state, DTC count and the readiness monitors. */
export function decodeReadiness(data) {
  if (!data || data.length < 4) return null;
  const [A, B, C, D] = data;
  const base = [
    { name: 'Misfire', supported: !!(B & 0x01), ready: !(B & 0x10) },
    { name: 'Fuel system', supported: !!(B & 0x02), ready: !(B & 0x20) },
    { name: 'Components', supported: !!(B & 0x04), ready: !(B & 0x40) },
  ];
  const other = SPARK_MONITORS.map((name, i) => ({ name, supported: !!(C & (1 << i)), ready: !(D & (1 << i)) }));
  const monitors = [...base, ...other].filter((m) => m.supported);
  return { milOn: !!(A & 0x80), dtcCount: A & 0x7f, monitors, allReady: monitors.every((m) => m.ready) };
}

/** Mode 09 PID 02 response → VIN string (17 chars) or null. */
export function decodeVin(lines) {
  const b = allBytes(lines);
  for (let i = 0; i < b.length - 2; i++) {
    if (b[i] === 0x49 && b[i + 1] === 0x02) {
      // after 49 02 there's a message-count byte, then ASCII; keep printable chars
      const chars = b.slice(i + 3).filter((c) => c >= 0x20 && c < 0x7f).map((c) => String.fromCharCode(c)).join('');
      const vin = chars.replace(/[^A-HJ-NPR-Z0-9]/gi, '');
      if (vin.length >= 11) return vin.slice(0, 17);
    }
  }
  return null;
}
