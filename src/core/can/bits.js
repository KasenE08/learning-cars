// CAN signal packing, DBC conventions.
// Intel (little-endian, "@1"): start bit = LSB, counting up through bytes.
// Motorola (big-endian, "@0"): start bit = MSB, DBC "sawtooth" numbering (bit 7 of byte 0 is 7,
// the next bit after bit 0 of byte 0 is bit 15 of byte 1).

/** Bit positions (0..63, bit = byte*8 + bitInByte) of a signal, ordered from MSB to LSB. */
export function signalBits({ start, length, endian = 'big' }) {
  const out = [];
  if (endian === 'little') {
    for (let i = length - 1; i >= 0; i--) out.push(start + i);
    return out;
  }
  let b = start;
  for (let i = 0; i < length; i++) {
    out.push(b);
    b = b % 8 === 0 ? b + 15 : b - 1;
  }
  return out;
}

const bitOf = (bytes, pos) => (bytes[pos >> 3] >> (pos & 7)) & 1;

/** Raw unsigned value of a signal from a byte array. Uses BigInt-free math (length ≤ 32). */
export function extractRaw(bytes, sig) {
  let v = 0;
  for (const pos of signalBits(sig)) v = v * 2 + bitOf(bytes, pos);
  return v;
}

/** Physical value: raw → (two's complement if signed) × scale + offset. */
export function decode(bytes, sig) {
  let raw = extractRaw(bytes, sig);
  if (sig.signed && raw >= 2 ** (sig.length - 1)) raw -= 2 ** sig.length;
  return raw * (sig.scale ?? 1) + (sig.offset ?? 0);
}

/** Write a raw unsigned value into bytes (mutates and returns them). */
export function insertRaw(bytes, sig, raw) {
  const bits = signalBits(sig);
  let v = Math.max(0, Math.min(2 ** sig.length - 1, Math.round(raw)));
  for (let i = bits.length - 1; i >= 0; i--) {
    const pos = bits[i], byte = pos >> 3, mask = 1 << (pos & 7);
    if (v % 2) bytes[byte] |= mask; else bytes[byte] &= ~mask;
    v = Math.floor(v / 2);
  }
  return bytes;
}

/** Physical → raw, clamped to the signal's bit range. */
export function encodeValue(sig, value) {
  let raw = Math.round((value - (sig.offset ?? 0)) / (sig.scale ?? 1));
  if (sig.signed && raw < 0) raw += 2 ** sig.length;
  return raw;
}

export const toHex = (bytes) => [...bytes].map((b) => b.toString(16).toUpperCase().padStart(2, '0')).join('');
export const fromHex = (hex) => Uint8Array.from((hex.replace(/\s+/g, '').match(/../g) || []).map((h) => parseInt(h, 16)));
