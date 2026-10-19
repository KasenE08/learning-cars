// Facts for units `re` (Reverse Engineering) and `tune` (ECU Tuning). Last checked: Oct 2026.
// Reuses bronco.openpilotListing, bronco.obdGateway (facts/py-decode.js, net-obd.js), law.readinessRule,
// bronco.tuneGains, bronco.cobbEo and the law.* facts from facts/mods.js.
export default {
  'bronco.ecuHw': {
    value: 'Ford does not publish which ECU hardware the Bronco Sport’s PCM uses. One tuning-file vendor lists the 2.0 L (and 1.5 L) as a Bosch MG1-family unit (“MG1CS017”)',
    status: 'unconfirmed',
    sources: ['iTunesystem tuning-spec pages for the 2021+ Bronco Sport 2.0T and 1.5T (third-party tuning-file vendor)'],
    note: 'A single secondary source; not checked against a Ford part label, service manual or teardown.',
  },
  'bronco.warranty': {
    value: 'Ford New Vehicle Limited Warranty for 2021–2024 Bronco Sport: bumper-to-bumper 3 years / 36,000 miles; powertrain 5 years / 60,000 miles (whichever comes first)',
    status: 'confirmed',
    sources: ['Ford responses to NHTSA information requests (2024 investigation files RQ24014 / PE24002 for 2021–24 Bronco Sport)'],
    note: 'The 5 yr / 60,000 mi powertrain figure was found stated for the 2022–23 model years; the 2024 warranty guide itself wasn’t checked. Certified pre-owned listings advertise a separate 7 yr / 100,000 mi CPO powertrain plan.',
  },
  'law.smogSoftware': {
    value: 'California: since July 19, 2021, Smog Check (BAR-OIS) fails cars whose engine software doesn’t match an approved configuration (“Modified Software”), using the calibration ID (CAL ID) and calibration verification number (CVN) the car reports over OBD. CARB-EO software is allowed; the fix is to restore stock or EO software',
    status: 'confirmed',
    sources: ['California BAR presentation “BAR-OIS Modified Software” (July 2021)', 'BAR Smog Check newsletter, Spring 2021: “Illegal Software Modifications Detected During Smog Check Inspections”', 'SEMA eNews (2021): “California Smog Inspectors to Check for Illegally Tuned Vehicles”'],
    note: 'BAR said it had collected CAL ID / CVN data since 2015 to build the approved list, and projected 5–10 failures a day statewide at launch.',
  },
  'law.dmcaVehicle': {
    value: 'US copyright law (DMCA §1201) has a temporary exemption that lets the owner of a lawfully acquired vehicle get past software locks when that’s necessary to diagnose, repair or lawfully modify it, as long as no other law (e.g. EPA or safety rules) is broken',
    status: 'confirmed',
    sources: ['37 CFR 201.40(b) vehicle exemption as described in Copyright Office rulemaking filings (2021, 2024 cycles)', 'Auto Innovators / MEMA filings to the Copyright Office (2024, 2026 renewal petitions)'],
    note: 'Renewed every three years; the paragraph number has moved between cycles. It is copyright law only: it doesn’t make an emissions-defeating tune legal. The exact 2024 rule text wasn’t checked.',
  },
};
