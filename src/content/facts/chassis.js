// Chassis facts (suspension, steering, brakes, tires) for the 2024 Bronco Sport Badlands.
// Last checked: Oct 2026. Brake rotor sizes were left out: the only figures found were
// aftermarket parts listings for 2021–23, not a Ford spec.
export default {
  'bronco.tires': {
    value: 'Standard 225/65R17 all-terrain tires, 28.5 in (724 mm) tall; 235/65R17 all-terrain, 29 in (737 mm), optional',
    status: 'confirmed',
    sources: ['Ford support: Bronco Sport off-road hardware', 'Mavis Tire 2024 Bronco Sport Badlands fitment', 'Ford Authority Badlands reports', 'Goodyear 2024 Badlands fitment'],
    note: 'Factory tire brand, load index and speed rating not confirmed (a 2020 pre-launch report named Pirelli Scorpion A/T). The driver-door placard lists the exact size.',
  },
  'bronco.steering': {
    value: 'Rack-and-pinion with electric, speed-sensing power assist (EPAS)',
    status: 'confirmed',
    sources: ['Guide Auto 2024 Bronco Sport Badlands spec page', 'Ford dealer standard-equipment lists (“Electric Power-Assist Speed-Sensing Steering”)'],
    note: 'Not checked against Ford’s own spec sheet. Whether the motor sits on the column or on the rack is not confirmed.',
  },
  'bronco.stability': {
    value: 'Electronic stability control (Ford calls it AdvanceTrac), listed with Roll Stability Control (RSC)',
    status: 'unconfirmed',
    sources: ['One Canadian Ford dealer listing (2024 Badlands)', 'NHTSA FMVSS 126 (ESC required on new US light vehicles since model year 2012)'],
    note: 'Having ESC is certain (it’s federally required). The AdvanceTrac/RSC naming comes from a single dealer listing.',
  },
};
