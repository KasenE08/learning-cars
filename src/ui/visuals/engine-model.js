// Shared 4-stroke model (crank angle θ in degrees, 0..720; 0 = TDC at the start of intake,
// 360 = TDC at the start of power). Illustrative valve timing, typical of a modern engine.

export const VALVES = {
  intake: { open: 710, close: 230 },  // opens 10° BTDC, closes 50° ABDC
  exhaust: { open: 490, close: 10 },  // opens 50° BBDC, closes 10° ATDC
};
export const SPARK = 345;              // 15° before TDC

export const STROKES = [
  { id: 'intake', name: 'Intake', from: 0, to: 180 },
  { id: 'compression', name: 'Compression', from: 180, to: 360 },
  { id: 'power', name: 'Power', from: 360, to: 540 },
  { id: 'exhaust', name: 'Exhaust', from: 540, to: 720 },
];

export const norm720 = (a) => ((a % 720) + 720) % 720;
export const strokeAt = (t) => STROKES.find((s) => norm720(t) >= s.from && norm720(t) < s.to);

/** 0..1 lift with zero velocity at open/close. */
export function liftFrac(t, { open, close }) {
  const d = norm720(t - open);
  const dur = norm720(close - open);
  if (d >= dur) return 0;
  return (1 - Math.cos((2 * Math.PI * d) / dur)) / 2;
}
export const isOpen = (t, v) => liftFrac(t, v) > 0.02;

/** Piston pin height above crank center for throw r and rod length l. */
export function pinHeight(t, r, l) {
  const a = (t * Math.PI) / 180;
  return r * Math.cos(a) + Math.sqrt(l * l - (r * Math.sin(a)) ** 2);
}

/** Cam lobe outline (nose pointing up, -y). base radius, max lift, half-width in cam degrees. */
export function lobePath(base, lift, half = 60, step = 4) {
  const pts = [];
  for (let p = 0; p < 360; p += step) {
    const s = p > 180 ? p - 360 : p;
    const r = base + (Math.abs(s) < half ? (lift * (1 + Math.cos((Math.PI * s) / half))) / 2 : 0);
    const a = (p * Math.PI) / 180;
    pts.push(`${(r * Math.sin(a)).toFixed(2)},${(-r * Math.cos(a)).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}

/** Gas color inside the cylinder for a crank angle: { fill, opacity, flame }. */
export function gasAt(t) {
  const a = norm720(t);
  const lerp = (x, y, k) => x + (y - x) * Math.min(1, Math.max(0, k));
  if (a < 200) return { kind: 'fresh', o: lerp(0.12, 0.42, a / 200) };
  if (a < SPARK + 22) return { kind: 'fresh', o: lerp(0.42, 0.72, (a - 200) / (SPARK - 200)) };
  if (a < 390) return { kind: 'flame', o: 0.95, k: (a - SPARK) / 45 };
  if (a < 540) return { kind: 'burnt', o: lerp(0.85, 0.45, (a - 390) / 150), k: (a - 390) / 150 };
  return { kind: 'exhaust', o: lerp(0.45, 0.1, (a - 540) / 180) };
}
