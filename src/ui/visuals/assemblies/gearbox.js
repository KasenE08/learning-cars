// Manual 5-speed, 2-shaft layout (as in front-drive manuals), side section.
// Input shaft gears are fixed; output shaft gears spin free until a synchro locks one.
const D = 80, IN_Y = 110, OUT_Y = IN_Y + D;
const G = [[90, 14], [140, 20], [190, 26], [240, 32], [290, 36]]; // [x, input radius]: 1st..5th
const gear = (x, r, y, fill) => `<rect x="${x - 8}" y="${y - r}" width="16" height="${2 * r}" rx="2" class="hl" fill="${fill}" stroke="#c9d1d9"/><path d="M${x - 8},${y - r + 4} h16 M${x - 8},${y + r - 4} h16" stroke="#262b31" stroke-width="2" stroke-dasharray="2 2"/>`;

export default {
  title: 'Manual gearbox',
  box: [10, 26, 380, 290],
  boxOut: [-10, -130, 420, 620],
  note: 'Gear ratio = output gear teeth ÷ input gear teeth. 1st: small gear drives big gear (lots of torque); 5th: nearly equal sizes. Your Bronco’s 8-speed automatic uses planetary gearsets instead. Covered in Drivetrain.',
  info: {
    case: { name: 'Gearbox case', short: 'Case halves', does: 'Two aluminum halves that hold the shaft bearings in exact alignment and keep the gear oil in.' },
    forks: { name: 'Shift forks + rails', short: 'Shift forks', does: 'The gear lever slides a rail; its fork pushes a synchro sleeve sideways onto the chosen gear.' },
    input: { name: 'Input shaft', short: 'Input shaft', does: 'Driven by the clutch. Its gears are cut into or fixed to the shaft, so they always spin with the engine.' },
    synchros: { name: 'Synchro hubs + sleeves', short: 'Synchros', does: 'Splined to the output shaft. A cone matches the gear’s speed, then the sleeve’s teeth (dogs) lock that gear to the shaft.' },
    output: { name: 'Output shaft + gears', short: 'Output shaft', does: 'Its gears are always meshed with the input gears but spin freely on bearings until a synchro locks one. Drives the differential.' },
  },
  parts: [
    { id: 'case-top', info: 'case', step: 1, dx: 0, dy: -150, label: [200, 40],
      art: `<path class="hl" d="M20,152 L20,44 Q20,34 30,34 L370,34 Q380,34 380,44 L380,152" fill="none" stroke="#8994a1" stroke-width="4"/>` },
    { id: 'case-bot', info: 'case', step: 1, dx: 0, dy: 200,
      art: `<path class="hl" d="M20,152 L20,302 Q20,312 30,312 L370,312 Q380,312 380,302 L380,152" fill="none" stroke="#8994a1" stroke-width="4"/>` },
    { id: 'forks', step: 2, dx: 0, dy: 150, label: [200, 306],
      art: `<rect x="60" y="282" width="280" height="6" rx="3" class="hl" fill="#6d7782"/>${[115, 215, 315].map((x) => `<path class="hl" d="M${x - 8},${OUT_Y + 24} L${x - 8},282 M${x + 8},${OUT_Y + 24} L${x + 8},282" stroke="#a9b3bd" stroke-width="4" fill="none"/>`).join('')}` },
    { id: 'input', step: 3, dx: 0, dy: -70, label: [330, 92],
      art: `<rect x="30" y="${IN_Y - 4}" width="330" height="8" rx="3" class="hl" fill="#c9d1d9"/>${G.map(([x, r]) => gear(x, r, IN_Y, '#5a6470')).join('')}<path d="M34,${IN_Y - 4} v8 M40,${IN_Y - 4} v8 M46,${IN_Y - 4} v8" stroke="#5b6470"/>` },
    { id: 'synchros', step: 4, dx: 0, dy: -64, label: [215, 152],
      art: [115, 215, 315].map((x) => `<rect x="${x - 6}" y="${OUT_Y - 22}" width="12" height="44" rx="2" class="hl" fill="#ff6b1a" stroke="#ffa060"/>`).join('') },
    { id: 'output', step: 5, dx: 0, dy: 0, label: [330, 268],
      art: `<rect x="40" y="${OUT_Y - 4}" width="330" height="8" rx="3" class="hl" fill="#c9d1d9"/>${G.map(([x, r]) => gear(x, D - r, OUT_Y, '#3a424c')).join('')}<text x="90" y="${OUT_Y + 4}" text-anchor="middle" style="font-size:10px">1</text><text x="140" y="${OUT_Y + 4}" text-anchor="middle" style="font-size:10px">2</text><text x="190" y="${OUT_Y + 4}" text-anchor="middle" style="font-size:10px">3</text><text x="240" y="${OUT_Y + 4}" text-anchor="middle" style="font-size:10px">4</text><text x="290" y="${OUT_Y + 4}" text-anchor="middle" style="font-size:10px">5</text>` },
  ],
};
