// What's inside an ECU
export default {
  steps: [
    { tag: 'metaphor', title: 'A control room in a metal box',
      body: [
        'Picture a tiny factory control room. **Windows and gauges** (sensor inputs), an **operator** making thousands of decisions a second, a **rulebook** on the shelf, a **whiteboard** for live numbers, a **notebook** that survives the night shift.',
        'Plus a **phone line** to the other control rooms, **muscle** to pull the levers, and a **guard** who holds the keys.',
        'That’s an [[ecu]]. Same parts as the computers you’ll design in ECE, hardened for heat, vibration and a 12 V system that spikes and sags.',
      ] },
    { tag: 'see', title: 'Tour the board', visualFirst: true,
      visual: { type: 'parts', drawing: 'ecu' },
      body: [
        'Tap each block: connector, power supply, microcontroller, flash, RAM, EEPROM, security module, CAN transceiver, ADC inputs, output drivers, knock input.',
        'A simplified, generic board, not a specific Ford unit.',
      ] },
    { tag: 'how', title: 'Inputs: turning the world into numbers',
      body: [
        '**[[adc]]**: most sensors send a voltage (often in a 0–5 V range): MAP, throttle position, coolant [[thermistor]]. The ADC turns each into a number the code can use.',
        '**Timing inputs**: crank and cam position sensors send pulse trains; dedicated timer hardware measures them to the fraction of a degree, because spark and injection are scheduled by crank angle.',
        '**Knock input**: the piezo [[knock-sensor]] signal is filtered and only listened to in a crank-angle window after each cylinder fires. Knock rings at several kHz; one sensor maker quotes a typical window of **6–12 kHz**, varying by engine.',
        '**Network**: the [[can-transceiver|CAN transceiver]] chip converts the controller’s logic-level bits to and from the CAN_H / CAN_L wire voltages.',
      ] },
    { tag: 'how', title: 'The brain and its memories',
      body: [
        '**[[mcu]]**: a 32-bit automotive microcontroller, often multi-core, running a real-time OS. Fuel and spark for every cylinder every cycle: at 6,000 rpm a 4-cylinder fires 200 times a second.',
        '**[[flash-memory]]**: the program **and** the [[calibration]] (all the tables and limits). This is what a tune rewrites.',
        '**RAM**: live values (rpm, load, trims), gone at power-off. **[[eeprom]]** (or flash pretending to be one): small learned data kept across restarts, like adaptive fuel and knock values.',
        '**[[hsm|HSM]]** (hardware security module): a walled-off core that holds keys and does crypto. Chipmaker Infineon lists immobilizer, tuning protection and secure on-board communication as its jobs.',
      ] },
    { tag: 'how', title: 'Outputs: the muscle',
      body: [
        '**[[output-driver|Output drivers]]** switch real current: injectors, ignition coils, the throttle motor, solenoids.',
        '**Direct injectors** need a high, fast opening current, so the ECU has a boost-voltage stage just for them.',
        '**Coils**: the ECU switches each coil’s primary on for the dwell time, then off: the collapse fires the plug. Your 2.0 has one coil per plug.',
        'Solenoids for the [[wastegate]], cam phasers and purge valve are driven with [[pwm]]: fast on/off, where the duty cycle sets the average.',
      ],
      facts: ['bronco.ignition', 'bronco.injection'] },
    { tag: 'bronco', title: 'Your PCM',
      body: [
        'Ford calls it the **PCM** (powertrain control module). Ford doesn’t publish which hardware is inside.',
        'One tuning-file vendor lists the Bronco Sport’s as a **Bosch MG1**-family unit. Treat that as **unconfirmed**.',
        'For context: Bosch’s older MED17 family used single-core Infineon TriCore chips; the newer MG1 generation is multi-core, and tool makers report Bosch tightened its security around mid-2020.',
      ],
      facts: ['bronco.ecuHw'] },
  ],
  quiz: [
    { type: 'tap', q: 'Where does the calibration (the tables a tune changes) live? Tap it.', visual: { type: 'parts', drawing: 'ecu' }, answer: 'flash',
      why: 'Program and calibration sit in non-volatile flash. A “flash” tune is named after it.',
      wrong: { ram: 'RAM is wiped at power-off; it only holds live values.', eeprom: 'EEPROM holds small learned values (adaptations), not the main tables.' } },
    { type: 'tap', q: 'Tap the block that turns sensor voltages into numbers.', visual: { type: 'parts', drawing: 'ecu' }, answer: 'adc',
      why: 'The analog-to-digital converter samples a voltage (say, from the MAP sensor) and outputs an integer the code scales into kPa or °C.' },
    { type: 'mc', q: 'What survives a battery disconnect?',
      options: ['RAM live values', 'Flash and EEPROM contents', 'Nothing at all', 'Only RAM'], answer: 1,
      why: 'Flash (program + calibration) and EEPROM (learned values) are non-volatile. Some learned values are kept in RAM on purpose and do reset, which is why a car can drive oddly after a battery change until it relearns.' },
  ],
  cards: [
    { id: 'blocks', front: 'Main blocks of an ECU?', back: 'MCU, flash, RAM, EEPROM, HSM, ADC inputs, timing inputs, CAN transceiver, output drivers, power supply.' },
    { id: 'flash', front: 'What does flash memory hold?', back: 'The program and the calibration (tables, limits). A tune rewrites it.' },
    { id: 'eeprom', front: 'RAM vs EEPROM in an ECU?', back: 'RAM = live values, lost at power-off. EEPROM = small learned data kept across restarts.' },
    { id: 'hsm', front: 'What is an HSM for?', back: 'Secure key storage and crypto: immobilizer, secure boot/tuning protection, authenticated messages.' },
    { id: 'knock', front: 'How does the ECU listen for knock?', back: 'Filters the piezo knock-sensor signal (several kHz) only in a crank-angle window after each firing.' },
    { id: 'bronco', front: 'Who makes the Bronco Sport’s PCM?', back: 'Ford doesn’t say. One tuning vendor lists a Bosch MG1 unit (unconfirmed).' },
  ],
};
