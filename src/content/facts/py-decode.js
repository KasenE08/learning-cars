// Facts for units `python` and `decode`. Last checked: Oct 2026.
export default {
  'bronco.openpilotListing': {
    value: 'openpilot lists the Ford Bronco Sport 2021–24 (with Co-Pilot360 Assist+) as supported, using a Ford Q3 harness; it reads the main bus with opendbc’s ford_lincoln_base_pt.dbc',
    status: 'confirmed',
    sources: ['comma.ai openpilot Supported Cars list (docs.comma.ai/CARS)', 'commaai/opendbc opendbc/car/ford/values.py (FORD_BRONCO_SPORT_MK1, FordCarDocs package “Co-Pilot360 Assist+”)'],
    note: 'The DBC is community reverse-engineered, not a Ford document. openpilot connects at the windshield camera, not the OBD port; what the OBD port shows depends on the gateway.',
  },
};
