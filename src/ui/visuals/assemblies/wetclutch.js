// Wet multi-plate clutch (motorcycles; the same idea as each clutch pack in the Bronco's RDU).
const F = [90, 108, 126, 144, 162];   // friction plate x
const S = [99, 117, 135, 153];        // steel plate x
const all = [...F.map((x) => ['f', x]), ...S.map((x) => ['s', x])].sort((a, b) => a[1] - b[1]);
const finalX = (i) => 160 + i * 18;

export default {
  title: 'Wet multi-plate clutch',
  box: [20, 30, 340, 230],
  boxOut: [-90, 20, 510, 340],
  note: 'Bikes: the basket is driven by the crank, the hub drives the gearbox. Bronco RDU: the same plate-stack idea, squeezed by an actuator instead of springs.',
  info: {
    springs: { name: 'Clutch springs + bolts', does: 'Coil (or one diaphragm) springs clamp the whole stack. Pulling the lever compresses them to release the clutch.' },
    'pressure-plate': { name: 'Pressure plate', does: 'Outer plate the springs push against. The clutch lever’s pushrod lifts it to disengage.' },
    friction: { name: 'Friction plates', does: 'Lined with friction material. Tabs on their outside lock into the basket, so they spin with the engine.' },
    steel: { name: 'Steel plates', does: 'Plain steel. Teeth on their inside lock into the hub, so they spin with the gearbox. Squeezed together, frictions + steels lock engine to gearbox.' },
    hub: { name: 'Clutch hub (inner)', does: 'Splined to the gearbox input shaft. Slipper clutches have ramps here that let the hub slip on hard downshifts.' },
    basket: { name: 'Clutch basket (outer)', does: 'Driven by a gear on the crankshaft (the primary drive). Slots in its wall hold the friction plates’ tabs.' },
  },
  parts: [
    { id: 'basket', step: 5, dx: -50, dy: 0, label: [70, 262],
      art: `<path class="hl" d="M200,48 L72,48 L72,232 L200,232" fill="none" stroke="#8994a1" stroke-width="4"/><rect x="48" y="70" width="24" height="140" class="hl" fill="#3a424c" stroke="#ffc21a"/><path d="M48,80 h-6 M48,96 h-6 M48,112 h-6 M48,128 h-6 M48,144 h-6 M48,160 h-6 M48,176 h-6 M48,192 h-6" stroke="#ffc21a" stroke-width="3"/>` },
    { id: 'springs', step: 1, dx: 168, dy: 0, label: [196, 64],
      art: `${[90, 140, 190].map((y) => `<path class="hl" d="M184,${y - 8} l8,4 l-8,4 l8,4 l-8,4 l8,4" stroke="#ffc21a" stroke-width="2" fill="none"/>`).join('')}<rect x="200" y="136" width="10" height="8" class="hl" fill="#c9d1d9"/>` },
    { id: 'pressure-plate', step: 2, dx: 156, dy: 0, label: [178, 228],
      art: `<rect x="172" y="66" width="12" height="148" rx="2" class="hl" fill="#5a6470" stroke="#c9d1d9"/>` },
    ...all.map(([k, x], i) => ({
      id: `${k}${i}`, info: k === 'f' ? 'friction' : 'steel', step: 3, dx: finalX(i) - x, dy: 0,
      label: i === 0 ? [x, 244] : i === 1 ? [x, 50] : undefined,
      art: k === 'f'
        ? `<rect x="${x}" y="58" width="6" height="164" rx="1" class="hl" fill="#7d6a52" stroke="#c9ad94"/><rect x="${x - 1}" y="52" width="8" height="8" fill="#c9ad94"/><rect x="${x - 1}" y="220" width="8" height="8" fill="#c9ad94"/>`
        : `<rect x="${x}" y="76" width="5" height="128" rx="1" class="hl" fill="#9aa5b1" stroke="#dfe5ea"/>`,
    })),
    { id: 'hub', step: 4, dx: 0, dy: 112, label: [130, 212],
      art: `<rect x="84" y="98" width="92" height="84" rx="4" class="hl" fill="#3a424c" stroke="#8994a1"/><rect x="84" y="134" width="92" height="12" fill="#262b31"/>` },
  ],
};
