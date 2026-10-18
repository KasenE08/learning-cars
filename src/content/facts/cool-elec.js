// Facts for the Cooling & Lubrication and Electrical units. Last checked: Oct 2026.

const S = {
  fordOil: 'Ford support: “What is the recommended engine oil for my vehicle?” (Motorcraft oil chart)',
  manual22: '2022 Bronco Sport owner’s manual (Capacities and Specifications, online copy)',
  sidney: 'Sidney Ford Bronco Sport maintenance guide',
  amsoil: 'AMSOIL vehicle lookup: 2024 Bronco Sport 2.0L',
  aggregators: 'Oil-spec aggregator sites (engineoildb, oilchangers, others)',
  nhtsa: 'NHTSA investigation RQ24014 / recall 24V-267 and 25V-019 documents',
  fordAuthority: 'Ford Authority recall coverage (2025)',
  dealers: 'Ford dealer window-sticker listings for 2024 Bronco Sport Badlands',
};

export default {
  'bronco.oilGrade': {
    value: 'SAE 5W-30 (Ford’s oil chart for the 2021–24 2.0L)',
    status: 'conflicting',
    sources: [S.fordOil, S.manual22, S.sidney, S.amsoil, S.aggregators],
    note: 'Ford’s chart and a 2022 owner’s manual copy say 5W-30 (spec WSS-M2C961-A1 in the 2022 manual). I couldn’t see the 2024 manual itself. Some sites list 0W-30 or 0W-20 as an extreme-cold option, and one lists 0W-20 as the main grade; the 2025 model may differ. Your own manual and oil filler cap are the final word.',
  },
  'bronco.oilCapacity': {
    value: '≈5.5 qt (5.2 L) with filter',
    status: 'conflicting',
    sources: [S.fordOil, S.manual22, S.aggregators],
    note: 'Ford’s chart and the 2022 manual say 5.5 qt; other sites say 5.3, 5.7 or 6.1 qt (6.1 looks like a 2025 figure).',
  },
  'bronco.startStop': {
    value: 'Auto start-stop is standard on the 2.0L EcoBoost',
    status: 'confirmed',
    sources: [S.dealers, S.nhtsa],
    note: 'Window stickers list “2.0L EcoBoost, inc: auto start-stop technology (STD)”.',
  },
  'bronco.battery': {
    value: '12 V enhanced flooded battery (EFB) from the factory at first; Ford switched to AGM during 2024 model-year production',
    status: 'confirmed',
    sources: [S.nhtsa, S.fordAuthority],
    note: 'Which one a specific 2024 has depends on its build date (and whether it had a recall battery swap).',
  },
  'bronco.batteryRecall': {
    value: 'Recall 24V-267 (Apr 2024, 2021–24 Bronco Sport): BCM/PCM software to detect a failing 12 V battery. Recall 25V-019 (Jan 2025): battery replacement for EFBs from one supplier',
    status: 'confirmed',
    sources: [S.nhtsa, S.fordAuthority],
    note: 'The issue: EFBs degrading (worst in hot climates) and causing sudden loss of power. NHTSA’s documents also mention the alternator’s deceleration-charging strategy as adding load on the battery.',
  },
};
