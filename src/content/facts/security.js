// Facts for unit `security` (Vehicle Cybersecurity). Last checked: Oct 2026.
// Reuses bronco.obdGateway and bronco.fordNetworks from facts/net-obd.js.
export default {
  // ---------- Bronco Sport ----------
  'bronco.keyless': {
    value: 'Badlands: Intelligent Access (proximity keyless entry) with push-button start. Remote start shows up on many 2024 listings',
    status: 'unconfirmed',
    sources: ['Ford.com Bronco Sport Badlands page (2026 model year: “Intelligent Access with Push-Button Start” standard)', 'Dealer listings for 2024 Badlands units (“Push Start”, “proximity keyless entry with remote start”)'],
    note: 'Ford’s own standard-equipment list was only found for the 2026 model; for 2024 it comes from dealer listings. Whether your fob has a motion-sensing sleep mode or UWB ranging isn’t confirmed. Check your window sticker.',
  },
  'bronco.connectivity': {
    value: '2021–24 Bronco Sport: SYNC 3 infotainment on an 8 in touchscreen (Apple CarPlay / Android Auto, Bluetooth); 4G LTE Wi-Fi hotspot through the built-in FordPass Connect modem. The 2025 refresh moved to SYNC 4',
    status: 'unconfirmed',
    sources: ['Dealer listings for 2024 Bronco Sports (“8-inch SYNC 3”, “4G LTE mobile hotspot”)', 'Bronco Sport Forum (“all 21–24 Bronco Sports were equipped with SYNC 3.4”)', 'Ford Canada dealer page on the 2025 Bronco Sport (FordPass Connect hotspot)'],
    note: 'Not checked against a Ford spec sheet for 2024. Whether the modem can update other modules over the air isn’t confirmed; owners describe SYNC 3 updates over Wi-Fi or USB.',
  },

  // ---------- Law & policy ----------
  'law.dmca1201': {
    value: 'DMCA §1201 bans getting around access controls on copyrighted software (like ECU firmware). Since 2015 the Copyright Office has granted a “good-faith security research” exemption that covers car software; it is renewed every 3 years and the current one runs from Oct 28, 2024 to Oct 28, 2027',
    status: 'confirmed',
    sources: ['Copyright Office / Librarian of Congress final rules, 2015, 2018, 2021, 2024 (via EFF, PCWorld, Finnegan and IPWatchdog summaries)', 'EFF: security research and vehicle repair exemptions take effect (2016)'],
    note: '2015 version: listed device types (incl. motorized land vehicles), delayed one year for cars. 2018: device list dropped, so it covers computer programs generally. Conditions stay: a lawfully acquired device (or the owner’s authorization), solely good-faith research, and no breaking other laws such as the Computer Fraud and Abuse Act. Exact current wording not checked against the eCFR text.',
  },
  'law.unR155': {
    value: 'UN R155 (cybersecurity management system, CSMS) and R156 (software update management system, SUMS). In the EU, R155 applies to new vehicle types from July 6, 2022 and to all new vehicles from July 7, 2024',
    status: 'conflicting',
    sources: ['UK Vehicle Certification Agency: Cyber Security and Software Updating', 'Stellantis presentation to ITU (2021)', 'Hogan Lovells: new cyber security and software update rules (2022)'],
    note: 'R155 dates agree. For R156, the UK VCA gives staged EU dates (new types with OTA from 2022, more from 2024, all new complete vehicles from July 7, 2026), while some industry articles say both rules applied to all new vehicles from July 2024. The US does not use these UN rules; NHTSA’s 2022 cybersecurity best practices are guidance, not law.',
  },
  'law.fordVdp': {
    value: 'Ford runs a coordinated vulnerability disclosure program on HackerOne. It is disclosure only (no cash bounties); vehicles, the FordPass apps and Ford websites are listed in scope',
    status: 'unconfirmed',
    sources: ['HackerOne: Ford Vulnerability Disclosure Program policy history (safe-harbor flag added Oct 30, 2024)', 'FireBounty mirror of Ford’s policy (“hardware: Vehicle” in scope)', 'GovTech / BleepingComputer coverage of a 2021 report (“does not offer monetary incentives or bug bounties”)'],
    note: 'The live policy page couldn’t be loaded, so scope and rules come from mirrors and news. Read Ford’s current policy before reporting anything.',
  },
};
