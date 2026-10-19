// How Ford organizes its networks
export default {
  steps: [
    { tag: 'metaphor', title: 'Floors of an office building',
      body: [
        'Each department works on its own floor and chats freely there: powertrain on one, body on another, infotainment on a third.',
        'A **receptionist** in the middle passes only the notes each floor needs, and handles visitors at the front door.',
        'In a modern Ford, the floors are CAN buses, the receptionist is the **gateway module (GWM)**, and the front door is your OBD port.',
      ] },
    { tag: 'see', title: 'A Ford-style map', visualFirst: true,
      visual: { type: 'network', preset: 'ford', highlight: 'gw' },
      body: [
        'Simplified. The module names are ones that appear in the community openpilot DBC or are common Ford names; the **exact Bronco Sport wiring isn’t public**.',
        'Tap the gateway, then the OBD port: on newer Fords the port connects to the gateway, not straight to every bus.',
      ] },
    { tag: 'how', title: 'Then and now',
      body: [
        '**Classic Ford:** [[hs-can|HS-CAN]] (up to 500 kbit/s, OBD pins 6/14) for powertrain and chassis, plus [[ms-can|MS-CAN]] (up to 125 kbit/s, pins 3/11) for body and comfort. Both reached the port.',
        '**Newer Fords** (Ford’s 2019 Ranger manual, for example): several high-speed buses named **HS-CAN1 to HS-CAN4** plus MS-CAN, with the GWM as the **only** module that translates between them. It also terminates each bus.',
        'In that Ranger manual only HS-CAN1 and HS-CAN2 reach the port; the GWM relays the others for the scan tool.',
        'Ford’s “Fully Networked Vehicle” (FNV) architecture arrived on the 2021 Mach-E and F-150, built around over-the-air updates.',
      ],
      facts: ['ford.hsMsCan', 'bronco.fordNetworks', 'ford.fnv'] },
    { tag: 'bronco', title: 'What’s actually known about yours',
      body: [
        '**Confirmed by Ford:** 2020–23 Bronco Sports with a [[sdlc|Smart Data Link Connector]] have the gateway built into the OBD connector (a 2023 Ford customer-satisfaction program reprogrammed it).',
        'A Ford bulletin for the **2025** Bronco Sport mentions an “Enhanced Central Gateway” and HS-CAN2/HS-CAN3 (seen only via search summaries).',
        '**Not confirmed:** the 2024 model’s exact bus list, speeds and which modules sit on which bus. Ford’s workshop manual has it; it isn’t public.',
      ],
      facts: ['bronco.obdGateway', 'bronco.gateway2025'] },
    { tag: 'how', title: 'Who sends what (community DBC)',
      body: [
        'openpilot’s `ford_lincoln_base_pt.dbc` (community reverse-engineered, **not from Ford**; it covers many Ford and Lincoln models) lists senders:',
        '`PSCM` (power steering) → **0x07E** `SteeringPinion_Data`. `ABS_ESC` → **0x415** `BrakeSysFeatures`. `PCM` → **0x176** `PowertrainData_10`. **0x202/0x204** are labeled `PCM_HEV` (a powertrain-module name; labels may not match the exact module in your car).',
        '`GWM` → **0x083** `Steering_Data_FD1`, **0x091** `Yaw_Data_FD1`, **0x3B3** `BodyInfo_3_FD1`, **0x3C3** `BCM_Lamp_Stat_FD1`: the gateway **forwards** turn-signal, door, lamp and yaw info from other buses onto this one.',
        '`IPMA_ADAS` (the [[ipma]] camera) is a receiver of almost everything: it needs speed, steering, yaw and lamps to do lane keeping.',
      ] },
    { tag: 'see', title: 'That bus, simulated', visualFirst: true,
      visual: { type: 'candump', scenario: 'drive', ids: [0x07e, 0x204, 0x3b3, 0x415] },
      body: [
        '**Simulated** traffic: real community-DBC layouts, made-up values and rates. Speed (0x415) and rpm (0x204) change; 0x3B3 sits mostly still.',
        'Turn on the per-ID table to compare how often each one is sent.',
      ] },
    { tag: 'how', title: 'Where openpilot plugs in, and why',
      body: [
        'openpilot’s Ford harness connects at the **windshield camera** (IPMA), not the OBD port. There it sees the camera’s own bus, which carries the steering, braking and speed traffic the camera needs for lane keeping.',
        'Its code identifies a Bronco Sport by asking modules for their software part numbers (read-only UDS requests) at **PSCM 0x730, ABS 0x760, radar 0x764, camera 0x706**.',
        'The same code notes the PCM (diagnostic address 0x7E0) is “unlikely” to answer “from behind the gateway”.',
      ],
      facts: ['ford.openpilotDiag'] },
    { tag: 'key', title: 'What this means at the OBD port',
      body: [
        'Standard OBD-II requests (speed, rpm, codes) work: the gateway answers or forwards them. That’s the law.',
        'The raw broadcast traffic above may **not** be visible at the port: the gateway decides what crosses.',
        'So a future “read live data” feature should expect OBD/UDS answers, not a full view of every bus.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'In the community Ford DBC, which module is listed as the sender of **0x3B3 BodyInfo_3_FD1** (doors, turn lamps)?', options: ['PCM', 'ABS_ESC', 'GWM (gateway)', 'PSCM'], answer: 2,
      why: 'The gateway forwards body information from another bus onto this one. The ID tells you what the message is; the gateway is just the module putting it on this bus.' },
    { type: 'mc', q: 'Why might a CAN sniffer on the Bronco Sport’s OBD port see little or no normal broadcast traffic?', options: ['The port has no CAN pins', 'The OBD port connects to a gateway that decides what crosses, and normal traffic may not be forwarded', 'CAN only works when the car is moving', 'Ford encrypts all CAN traffic'], answer: 1,
      why: 'On these Fords the port is wired to the gateway (Ford’s SDLC). Diagnostic requests get answered, but internal broadcast traffic isn’t necessarily passed through.',
      wrong: { 3: 'Nothing here shows Ford encrypting CAN traffic. The limit is the gateway, not encryption.' } },
    { type: 'order', q: 'Follow a turn-signal status from the body side to the camera.', items: ['Body module sets the lamp state on its bus', 'Gateway (GWM) receives it', 'GWM re-sends it on the main bus as 0x3B3', 'Camera (IPMA) reads it'],
      why: 'Messages don’t hop buses by themselves: the gateway receives on one bus and transmits on the other. The DBC lists GWM as the sender of 0x3B3, and IPMA_ADAS among its receivers.' },
  ],
  cards: [
    { id: 'classic', front: 'Classic Ford networks on the OBD port?', back: 'HS-CAN up to 500 kbit/s (pins 6/14) and MS-CAN up to 125 kbit/s (pins 3/11).' },
    { id: 'gwm', front: 'What does Ford’s GWM do?', back: 'The only module that translates between buses (HS-CAN1–4, MS-CAN); terminates each; handles the OBD port.' },
    { id: 'senders', front: 'Community DBC senders of 0x07E, 0x415, 0x3B3?', back: '0x07E PSCM (steering), 0x415 ABS_ESC (brake/speed), 0x3B3 GWM (forwarded body info).' },
    { id: 'op', front: 'Where does openpilot connect on a Bronco Sport, and why?', back: 'At the windshield camera (IPMA): that bus carries steering, braking and speed traffic. The OBD port sits behind the gateway.' },
    { id: 'known', front: 'Is the 2024 Bronco Sport’s exact bus layout public?', back: 'No. A gateway at the OBD connector is confirmed for 2020–23; the full bus list isn’t public.' },
  ],
};
