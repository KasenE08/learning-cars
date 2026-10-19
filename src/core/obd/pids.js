// OBD-II Mode 01 PIDs we read, with SAE J1979 decode formulas. Pure (no DOM), so it's testable
// and shared by the real-car reader and the demo transport. Formulas match the `pid` visual.
// A/B/C/D are the data bytes after the "41 <pid>" response header.

export const PIDS = {
  '04': { name: 'Engine load', unit: '%', calc: ([A]) => (A * 100) / 255, icon: 'load' },
  '05': { name: 'Coolant temp', unit: '°C', alt: 'F', calc: ([A]) => A - 40, icon: 'temp' },
  '0B': { name: 'Intake MAP', unit: 'kPa', calc: ([A]) => A, icon: 'map' },
  '0C': { name: 'Engine RPM', unit: 'rpm', calc: ([A, B]) => (256 * A + B) / 4, icon: 'rpm' },
  '0D': { name: 'Vehicle speed', unit: 'km/h', alt: 'mph', calc: ([A]) => A, icon: 'speed' },
  '0F': { name: 'Intake air temp', unit: '°C', alt: 'F', calc: ([A]) => A - 40, icon: 'temp' },
  '10': { name: 'MAF air flow', unit: 'g/s', calc: ([A, B]) => (256 * A + B) / 100, icon: 'air' },
  '11': { name: 'Throttle position', unit: '%', calc: ([A]) => (A * 100) / 255, icon: 'load' },
  '1F': { name: 'Run time since start', unit: 's', calc: ([A, B]) => 256 * A + B, icon: 'clock' },
  '2F': { name: 'Fuel level', unit: '%', calc: ([A]) => (A * 100) / 255, icon: 'fuel' },
  '42': { name: 'Module voltage', unit: 'V', calc: ([A, B]) => (256 * A + B) / 1000, icon: 'volt' },
  '46': { name: 'Ambient air temp', unit: '°C', alt: 'F', calc: ([A]) => A - 40, icon: 'temp' },
  '5C': { name: 'Engine oil temp', unit: '°C', alt: 'F', calc: ([A]) => A - 40, icon: 'temp' },
};

// How many data bytes each PID returns (for the demo transport to synthesize a reply).
export const PID_BYTES = { '04': 1, '05': 1, '0B': 1, '0C': 2, '0D': 1, '0F': 1, 10: 2, 11: 1, '1F': 2, '2F': 1, 42: 2, 46: 1, '5C': 1 };

export const toF = (c) => (c * 9) / 5 + 32;
export const toMph = (kph) => kph / 1.609344;

/** Pretty display string for a decoded PID value, with the second unit in parentheses. */
export function formatPid(pid, value) {
  const p = PIDS[pid];
  if (!p) return `${value}`;
  const v = Math.round(value * 10) / 10;
  if (p.alt === 'F') return `${v} °C (${Math.round(toF(value))} °F)`;
  if (p.alt === 'mph') return `${Math.round(value)} km/h (${Math.round(toMph(value))} mph)`;
  return `${v % 1 === 0 ? v : v.toFixed(1)} ${p.unit}`;
}
