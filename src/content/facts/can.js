// Facts for unit `can` (CAN Bus in Depth). Last checked: Oct 2026.
// Ford network details come from Ford workshop manuals for OTHER models, Ford bulletins quoted in search results,
// and openpilot's open-source code (community work, not Ford documents). Reuses law.canMandate, bronco.obdProtocol,
// bronco.obdGateway, bronco.fordNetworks (net-obd.js) and bronco.openpilotListing (py-decode.js).
export default {
  'ford.hsMsCan': {
    value: 'Classic Ford layout: HS-CAN up to 500 kbit/s on OBD pins 6/14 (powertrain, chassis) and MS-CAN up to 125 kbit/s on OBD pins 3/11 (body, comfort)',
    status: 'confirmed',
    sources: ['Ford 2014 Mustang workshop manual, 418-00 Module Communications Network', 'Ford 2019 Ranger workshop manual, 418-00 Communications Network (as quoted in search results)', 'pinouts.ru and obdplanet Ford OBD pinout pages'],
    note: 'Newer Fords split traffic further (HS-CAN1–4 behind a gateway); which buses reach the port varies by model.',
  },
  'ford.openpilotCanFd': {
    value: 'In openpilot’s Ford code, the Bronco Sport 2021–24 (like the Escape 2020–22, Explorer and Maverick) is a classic-CAN platform (Ford Q3 harness). The Escape 2023–24, F-150 2021–23, Mach-E, Expedition 2022–24 and Ranger 2024 are CAN FD platforms (Ford Q4 harness)',
    status: 'confirmed',
    sources: ['commaai/opendbc opendbc/car/ford/values.py (FordPlatformConfig vs FordCANFDPlatformConfig; harness = ford_q4 if CANFD else ford_q3)'],
    note: 'Describes the bus openpilot connects to at the windshield camera, not every bus in the car. Community code, not a Ford document.',
  },
  'ford.openpilotDiag': {
    value: 'openpilot identifies a Bronco Sport by asking modules for their software part numbers (UDS 0x3E tester present + 0x22 read DID F188) at diagnostic addresses PSCM/EPS 0x730, ABS 0x760, radar 0x764 and camera 0x706. Its code notes the PCM (0x7E0) is “unlikely” to answer “from behind the gateway”',
    status: 'confirmed',
    sources: ['commaai/opendbc opendbc/car/ford/values.py (FW_QUERY_CONFIG)', 'commaai/opendbc opendbc/car/ford/fingerprints.py (FORD_BRONCO_SPORT_MK1)', 'commaai/opendbc opendbc/car/fw_query_definitions.py'],
    note: 'Read-only queries made from the camera’s bus. Addresses are what openpilot uses, gathered by the community, not published by Ford.',
  },
  'bronco.gateway2025': {
    value: 'A Ford bulletin for the 2025 Bronco Sport refers to its “Enhanced Central Gateway”; another notes that Ford’s dealer tool may fail to talk to modules on HS-CAN2 or HS-CAN3 on some 2025 Maverick and Bronco Sport vehicles',
    status: 'unconfirmed',
    sources: ['Ford technical service bulletins hosted by NHTSA (2025–2026), as quoted in search results'],
    note: 'The bulletin PDFs couldn’t be opened directly, only their search summaries. Nothing here covers the 2024 model or the full bus list.',
  },
  'ford.fnv': {
    value: 'Ford’s “Fully Networked Vehicle” (FNV) electrical architecture debuted (as FNV2) on the 2021 Mustang Mach-E and F-150; a key feature is over-the-air updates for most modules',
    status: 'confirmed',
    sources: ['Ford Authority (Nov and Dec 2020 FNV articles)', 'NXP press release on its Ford collaboration (gateway/OTA processors)'],
    note: 'Whether the Bronco Sport uses FNV, and which version, wasn’t confirmed.',
  },
};
