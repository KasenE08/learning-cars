// Liquid cooling loop with thermostat bypass and heater core.
import { schematic } from './schematic.js';
export const labelsBuiltIn = true;
export const viewBox = '0 0 360 400';
export const parts = {
  pump: { name: 'Water pump', does: 'Impeller that keeps coolant moving whenever the engine runs (belt, chain or electric drive).', connects: 'Radiator outlet / bypass in → engine jackets out.', where: 'Front of the engine.' },
  jacket: { name: 'Block + head jackets', does: 'Passages around the cylinders and combustion chambers where coolant picks up heat.', connects: 'Pump → block → head → thermostat.', where: 'Cast into the block and head.' },
  thermostat: { name: 'Thermostat', does: 'Wax-pellet valve. Closed when cold so the engine warms fast; opens around normal operating temperature to send coolant to the radiator.', connects: 'Engine outlet → radiator (open) or bypass (closed).', where: 'In a housing on the engine outlet.' },
  radiator: { name: 'Radiator', does: 'Thin tubes and fins that hand the heat to air flowing through the grille.', connects: 'Thermostat → radiator → pump.', where: 'Front of the car.' },
  fan: { name: 'Cooling fan', does: 'Electric fan that pulls air through the radiator when the car is slow or stopped.', connects: 'Controlled by the PCM via temperature.', where: 'Behind the radiator.' },
  'heater-core': { name: 'Heater core', does: 'Mini radiator inside the dash. Your cabin heat is engine waste heat.', connects: 'Hot engine outlet → heater core → back to the pump.', where: 'Behind the dashboard.' },
  reservoir: { name: 'Expansion tank + cap', does: 'Room for coolant to expand. The pressure cap raises the boiling point well above 100 °C (212 °F).', connects: 'Radiator / system top.', where: 'Engine bay, translucent tank.' },
  bypass: { name: 'Bypass', does: 'Short path straight back to the pump while the thermostat is closed, so coolant still circulates through the engine.', connects: 'Thermostat housing → pump inlet.', where: 'Small hose or internal passage.' },
  'temp-sensor': { name: 'Coolant temp sensor', does: 'Thermistor the PCM reads for fueling, fan control and your gauge.', connects: 'Wired to the PCM.', where: 'Near the thermostat/outlet.' },
};
export function svg() {
  return schematic({
    links: [
      { d: 'M110,292 L110,262', kind: 'coolant' },
      { d: 'M180,156 L216,156', kind: 'hotcoolant' },
      { d: 'M252,156 L280,156', kind: 'hotcoolant' },
      { d: 'M305,330 L305,352 L136,352 L136,320', kind: 'coolant' },
      { d: 'M234,176 L234,314 L140,314', kind: 'hotcoolant', w: 5, slow: true },
      { d: 'M150,140 Q150,64 130,64', kind: 'hotcoolant', w: 5 },
      { d: 'M40,64 Q14,64 14,200 Q14,300 84,304', kind: 'coolant', w: 5 },
      { d: 'M305,100 L305,82', kind: 'coolant', w: 4, slow: true },
    ],
    nodes: [
      { id: 'heater-core', x: 40, y: 44, w: 90, h: 40, label: 'HEATER CORE' },
      { id: 'reservoir', x: 276, y: 40, w: 58, h: 42, shape: 'tank', label: 'TANK', sub: 'pressure cap' },
      { id: 'jacket', x: 40, y: 140, w: 140, h: 122, label: 'ENGINE', sub: 'block + head jackets', deco: '<rect x="56" y="156" width="108" height="90" rx="6" class="sx-deco"/>' },
      { id: 'temp-sensor', x: 186, y: 120, w: 34, h: 18, label: 'ECT', ly: 133 },
      { id: 'thermostat', x: 216, y: 140, w: 36, h: 36, shape: 'circle', label: 'T', sub: 'stat' },
      { id: 'radiator', x: 280, y: 100, w: 50, h: 230, label: 'RAD', deco: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<path d="M286,${114 + i * 21} h38" class="sx-deco"/>`).join('') },
      { id: 'fan', x: 250, y: 214, w: 26, h: 26, shape: 'circle', label: 'FAN', ly: 258 },
      { id: 'pump', x: 84, y: 292, w: 52, h: 52, shape: 'circle', label: 'PUMP' },
      { id: 'bypass', x: 150, y: 304, w: 70, h: 20, shape: 'path', art: '', label: 'BYPASS', sub: 'when cold', ly: 296 },
    ],
  });
}
