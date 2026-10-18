// Inline-4, side section. Teardown order of a real rebuild: top end off, pan off,
// pistons + rods out the top, crank out the bottom.
const C = [75, 145, 215, 285]; // cylinder centers
const UP = [true, false, false, true]; // 1 & 4 at TDC, 2 & 3 at BDC
const AX = 262, R = 22;

export default {
  title: 'Inline-4 engine',
  box: [20, 0, 320, 330],
  boxOut: [-40, -350, 440, 830],
  note: 'A real teardown also removes the timing chain, intake, exhaust and accessories first. They’re left off here for clarity.',
  info: {
    cover: { name: 'Valve (cam) cover', short: 'Valve cover', does: 'Sealed lid over the cams. Keeps oil in and dirt out.' },
    cams: { name: 'Camshafts', short: 'Cams', does: 'Two shafts (DOHC). Unbolt the cam caps after locking the timing.' },
    head: { name: 'Cylinder head', short: 'Head', does: 'Comes off after the cams and head bolts (often torque-to-yield: replace them).' },
    gasket: { name: 'Head gasket', short: 'Head gasket', does: 'Always replaced. Both surfaces get checked for flatness before reassembly.' },
    pan: { name: 'Oil pan', short: 'Oil pan', does: 'Removed to reach the bottom end: rod caps, main caps, oil pump pickup.' },
    pistons: { name: 'Pistons + rods', short: 'Pistons + rods', does: 'Rod caps off, then each piston/rod is pushed out the top of its bore. Keep each set together and marked by cylinder.' },
    crank: { name: 'Crankshaft', short: 'Crankshaft', does: 'Main caps off, then the crank lifts out. Journals get measured for wear.' },
    block: { name: 'Block', short: 'Block', does: 'What’s left. Bores get measured for taper and out-of-round; may be honed or bored oversize.' },
  },
  parts: [
    { id: 'block', step: 8, dx: 0, dy: 0, label: [180, 250],
      art: `<rect x="40" y="118" width="280" height="140" class="hl" fill="url(#xhatch)" stroke="#8994a1" stroke-width="1.4"/>${C.map((c) => `<rect x="${c - 28}" y="118" width="56" height="112" fill="#0e1114" stroke="#5b6470"/>`).join('')}` },
    { id: 'crank', step: 7, dx: 0, dy: 50, label: [180, 300],
      art: `<rect x="34" y="${AX - 4}" width="292" height="8" rx="3" class="hl" fill="#c9d1d9"/>${C.map((c, i) => { const py = UP[i] ? AX - R : AX + R; return `<rect x="${c - 14}" y="${Math.min(py, AX) - 6}" width="28" height="${R + 12}" rx="3" class="hl" fill="#3a424c" stroke="#8994a1"/><circle cx="${c}" cy="${py}" r="7" fill="#c9d1d9"/>`; }).join('')}` },
    { id: 'pan', step: 5, dx: 0, dy: 120, label: [180, 340],
      art: `<path class="hl" d="M44,262 L316,262 L306,318 L54,318 Z" fill="#14171a" stroke="#8994a1" stroke-width="1.4"/><rect x="58" y="300" width="244" height="14" fill="#b8860b" opacity="0.5"/>` },
    ...C.map((c, i) => {
      const crown = UP[i] ? 132 : 176, wrist = crown + 20, pin = UP[i] ? AX - R : AX + R;
      return { id: `p${i + 1}`, info: 'pistons', step: 6, dx: 0, dy: -185, label: i === 0 ? [c, crown - 6] : undefined,
        art: `<rect x="${c - 26}" y="${crown}" width="52" height="34" rx="2" class="hl" fill="#8f99a3" stroke="#c9d1d9"/><path d="M${c},${wrist} L${c},${pin}" stroke="#aab4bf" stroke-width="10" stroke-linecap="round"/><circle cx="${c}" cy="${wrist}" r="5" fill="#2a3038"/>` };
    }),
    { id: 'gasket', step: 4, dx: 0, dy: -228, label: [180, 106],
      art: `<rect x="40" y="112" width="280" height="6" class="hl" fill="#2b3138" stroke="#8994a1"/>` },
    { id: 'head', step: 3, dx: 0, dy: -270, label: [180, 96],
      art: `<rect x="40" y="52" width="280" height="60" class="hl" fill="url(#xhatch)" stroke="#8994a1" stroke-width="1.4"/>${C.map((c) => `<rect x="${c - 4}" y="56" width="8" height="40" fill="#e8e4da"/>`).join('')}` },
    { id: 'cams', step: 2, dx: 0, dy: -300, label: [180, 34],
      art: `<rect x="44" y="40" width="272" height="6" rx="3" class="hl" fill="#c9d1d9"/>${C.map((c) => `<ellipse cx="${c - 12}" cy="43" rx="7" ry="9" class="hl" fill="#ff6b1a"/><ellipse cx="${c + 12}" cy="43" rx="7" ry="9" class="hl" fill="#ff6b1a"/>`).join('')}` },
    { id: 'cover', step: 1, dx: 0, dy: -330, label: [180, 6],
      art: `<rect x="50" y="10" width="260" height="24" rx="10" class="hl" fill="#262b31" stroke="#a9b3bd" stroke-width="1.4"/>` },
  ],
};
