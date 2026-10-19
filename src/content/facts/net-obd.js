// Facts for Track 4 units `network` and `obd`. Last checked: Oct 2026.
// Several primary documents (SAE/ISO standards, Ford workshop manuals, CARB regulation text) are paywalled
// or were unreachable; where a fact rests on secondary sources, the note says so.

export default {
  'law.obdMandate': {
    value: 'OBD-II required on all new US passenger cars and light trucks from the 1996 model year. Legal basis: Clean Air Act Amendments of 1990 (section 202(m)); EPA’s OBD rule (Feb 1993) phased in from the 1994 model year. California (CARB) wrote the OBD II spec and required basic on-board diagnostics (now called “OBD-I”) earlier',
    status: 'conflicting',
    sources: ['EPA final rule, 58 FR 9468 (Feb 19, 1993)', 'Clean Air Act §202(m), 42 U.S.C. §7521(m)', 'Wikipedia: On-board diagnostics', 'The Truth About Cars: “Abandoned History: OBD-II”'],
    note: 'The 1996 date is consistent everywhere. The OBD-I start date is not: most sources say CARB required it from the 1988 model year, a few say 1991.',
  },
  'law.canMandate': {
    value: 'CAN (ISO 15765-4) is the required OBD-II protocol on US light vehicles from the 2008 model year. It was first allowed for OBD from the 2003 model year',
    status: 'confirmed',
    sources: ['ScanTool.net: “Which OBD-II Protocol is Supported By My Vehicle?”', 'Several scan-tool and OBD reference sites', 'US patent texts on OBD tools (citing the 2008 requirement)'],
    note: 'Many independent sources agree, but the regulation text itself (EPA 40 CFR 86.1806 / CARB 13 CCR 1968.2) wasn’t checked directly.',
  },
  'law.permanentDtc': {
    value: 'Permanent trouble codes (Mode $0A): stored in memory that a scan-tool clear (Mode $04) or a battery disconnect can’t erase. Only the car erases one, after the failed monitor runs again and passes. Phased in starting around the 2010 model year',
    status: 'conflicting',
    sources: ['GM TechLink: “Inspection/Maintenance Test DTCs Now Permanent DTCs”', 'Auto Service Professional', 'Snap-on knowledge base: OBD II Mode 10 permanent codes'],
    note: 'Sources disagree on the phase-in: “some 2009s, all 2010+”, “2010 start, all by 2012” (GM), or “2012 and newer”.',
  },
  'law.readinessRule': {
    value: 'EPA guidance used by state OBD inspections: model years 1996–2000 may have up to 2 monitors “not ready”; 2001 and newer, up to 1. More than that and the car is rejected until it’s driven enough to finish its self-tests',
    status: 'confirmed',
    sources: ['New York DMV: “What do you mean my car’s not ready?”', 'Texas DPS OBD II motorist FAQ', 'Maryland VEIP RepairCare bulletin (Dec 2002)'],
    note: 'Quoted by state programs; the original EPA guidance document wasn’t checked. Each state sets its own exact rules.',
  },
  'law.obdThreshold': {
    value: 'OBD II must light the MIL before a fault pushes tailpipe emissions above about 1.5× the car’s certified standard (some cleaner categories and parts use higher multiples, e.g. 1.75× or 2.5×)',
    status: 'confirmed',
    sources: ['CARB OBD II staff report (2002 rulemaking, attachment 4)', 'CARB OBD II regulation (13 CCR 1968.2)'],
  },
  'bronco.obdProtocol': {
    value: '2024 Bronco Sport: OBD-II over CAN (ISO 15765-4), on pins 6 and 14 of the port',
    status: 'confirmed',
    sources: ['Follows from the US 2008+ CAN requirement (see law.canMandate)', 'ScanTool.net protocol guide'],
    note: 'Ford commonly uses 11-bit IDs at 500 kbit/s for OBD, but that detail wasn’t confirmed for this model.',
  },
  'bronco.obdGateway': {
    value: 'Recent Bronco Sports use a gateway module (GWM) that Ford calls a “Smart Data Link Connector” (SDLC): the OBD port is wired to the gateway, which answers scan tools and decides what reaches the inner networks',
    status: 'unconfirmed',
    sources: ['Ford Customer Satisfaction Program 22N15 (Dec 12, 2023): reprograms the GWM on certain 2020–2023 model-year Bronco Sport, Escape and Corsair vehicles “equipped with Smart Data Link Connector”, because it “may not properly communicate with Inspection and Maintenance (I/M) emissions equipment”', 'Locksmith Ledger: “Get with the Program on Ford”', 'Dorman “smart data link module” parts listing'],
    note: 'Confirmed by Ford for the 2021–2023 Bronco Sport (Ford’s bulletin wording says 2020–2023). Not confirmed for the 2024 model, though it shares the same platform. Which inner buses the gateway exposes on the port isn’t public.',
  },
  'bronco.fordNetworks': {
    value: 'Ford workshop manual (2019+ Ranger, not the Bronco Sport): the GWM is the only module that translates messages across the truck’s 4–5 CAN networks (HS-CAN1–4, MS-CAN) and terminates each one; only HS-CAN1 and HS-CAN2 reach the OBD port, and the GWM relays the others onto HS-CAN2 for the scan tool',
    status: 'unconfirmed',
    sources: ['Ford Ranger (2019, PX3) workshop manual 418-00 “Communications Network – System Operation” (as quoted in search results)', 'Mustang6G and Ranger5G owner-forum threads'],
    note: 'Shows how Ford designs networks; the Bronco Sport’s own bus list isn’t public.',
  },
};
