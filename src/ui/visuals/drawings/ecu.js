// Generic engine ECU circuit board (illustrative layout, not any specific unit).
export const viewBox = '0 0 360 250';
export const labelsBuiltIn = true;

export const parts = {
  connector: { name: 'Harness connector', does: 'Dozens to 100+ pins: power, grounds, sensor inputs, actuator outputs and the CAN bus lines.', connects: 'The engine and car wiring harness.', where: 'Edge of the board.' },
  power: { name: 'Power supply', does: 'Turns noisy 12–14 V car power into clean 5 V / 3.3 V / lower rails, and survives cranking dips and load spikes.', connects: 'Battery and ignition feed → every chip.', where: 'Near the connector.' },
  mcu: { name: 'Microcontroller (MCU)', does: 'The brain: often a multi-core automotive chip running the engine-control software hundreds to thousands of times a second.', connects: 'Reads inputs, runs the maps, drives outputs, talks on CAN.', where: 'Center of the board.' },
  flash: { name: 'Flash memory', does: 'Holds the program and the calibration (all the maps and tables). This is what “flashing a tune” rewrites.', connects: 'Inside the MCU on most modern ECUs.', where: 'On-chip.' },
  ram: { name: 'RAM', does: 'Working memory for live values: rpm, airflow, current spark advance, learned trims while running.', connects: 'Inside the MCU.', where: 'On-chip.' },
  eeprom: { name: 'EEPROM / data flash', does: 'Small non-volatile memory for things that must survive power-off: learned adaptations, trouble codes, odometer copies, immobilizer data.', connects: 'MCU.', where: 'Small chip or a reserved flash area.' },
  hsm: { name: 'Security module (HSM)', does: 'Protected crypto core: keys, secure boot, checking that new software is signed by the maker before it runs.', connects: 'Part of many modern automotive MCUs.', where: 'On-chip.' },
  'can-xcvr': { name: 'CAN transceiver', does: 'Converts the MCU’s logic-level CAN signals into the differential CAN_H/CAN_L voltages on the wires, and back.', connects: 'MCU CAN controller ↔ bus wires in the connector.', where: 'Next to the connector.' },
  adc: { name: 'Input conditioning + ADC', does: 'Filters and protects sensor signals, then converts voltages (MAP, temps, pedal, O2) into numbers.', connects: 'Sensors → MCU.', where: 'Between connector and MCU.' },
  drivers: { name: 'Output drivers', does: 'Power transistors that switch injectors, ignition coils, the throttle motor, relays and solenoids, with current sensing and fault detection.', connects: 'MCU → actuators.', where: 'Usually along the connector, often heat-sinked.' },
  knock: { name: 'Knock signal processor', does: 'Amplifies and filters the knock sensors’ vibration signal so the MCU can detect detonation per cylinder.', connects: 'Knock sensors → MCU.', where: 'Near the inputs.' },
};

const box = (part, x, y, w, h, title, sub, fill = '#1d2126', stroke = '#5b6470') => `<g data-part="${part}">
  <rect class="hit" x="${x}" y="${y}" width="${w}" height="${h}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" class="hl" fill="${fill}" stroke="${stroke}" stroke-width="1.4"/>
  <text x="${x + w / 2}" y="${y + h / 2 - (sub ? 2 : -4)}" text-anchor="middle" class="sx-lbl">${title}</text>
  ${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 10}" text-anchor="middle" class="sx-sub">${sub}</text>` : ''}</g>`;

export function svg() {
  let traces = '';
  for (let i = 0; i < 9; i++) traces += `<path d="M44,${40 + i * 20} H54" stroke="#2f5e3d" stroke-width="2"/>`;
  return `<rect x="4" y="6" width="352" height="238" rx="10" fill="#0f2418" stroke="#2f5e3d" stroke-width="2"/>
  ${traces}
  <g data-part="connector"><rect class="hit" x="8" y="20" width="36" height="210"/>
    <rect x="10" y="22" width="32" height="206" rx="3" class="hl" fill="#262b31" stroke="#8994a1"/>
    ${Array.from({ length: 12 }, (_, i) => `<rect x="18" y="${30 + i * 16}" width="16" height="8" rx="1" fill="#c9a24a"/>`).join('')}
    <text x="26" y="242" text-anchor="middle" class="sx-sub">pins</text></g>
  ${box('power', 56, 16, 74, 40, 'POWER', '12 V → 5 V', '#2a2420', '#c9ad94')}
  ${box('can-xcvr', 56, 66, 74, 34, 'CAN XCVR', 'H/L ↔ logic', '#1d2a33', '#7fb2e0')}
  ${box('adc', 56, 110, 74, 40, 'INPUTS', 'ADC', '#1d2126', '#9fd3a8')}
  ${box('knock', 56, 160, 74, 30, 'KNOCK', 'sensor chip', '#1d2126', '#ffc21a')}
  ${box('drivers', 56, 198, 290, 36, 'OUTPUT DRIVERS', 'injectors · coils · throttle motor · relays', '#2a1a14', '#ff6b1a')}
  <g data-part="mcu"><rect class="hit" x="146" y="16" width="200" height="174"/>
    <rect x="146" y="16" width="200" height="174" rx="6" class="hl" fill="#16191d" stroke="#c9d1d9" stroke-width="1.6"/>
    <text x="246" y="34" text-anchor="middle" class="sx-lbl">MICROCONTROLLER (MCU)</text>
    <text x="246" y="46" text-anchor="middle" class="sx-sub">cores run the engine software</text></g>
  ${box('flash', 158, 58, 84, 56, 'FLASH', 'program + maps')}
  ${box('ram', 252, 58, 82, 56, 'RAM', 'live values')}
  ${box('hsm', 158, 124, 84, 56, 'HSM', 'keys, boot', '#22192a', '#c9a3e8')}
  ${box('eeprom', 252, 124, 82, 56, 'EEPROM', 'learned data')}
  `;
}
