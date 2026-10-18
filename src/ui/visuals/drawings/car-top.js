// Bronco Sport–shaped compact SUV, top-down X-ray. Front at the top. Layout simplified
// (exact Ford component positions are not published here): transverse engine, 8-speed on the
// driver side, PTU → driveshaft → rear drive unit.
import { label } from '../svg.js';

export const viewBox = '-70 0 440 600';
export const defaultLabels = false;

export const parts = {
  engine: { name: 'Engine', does: '2.0 L turbo inline-4. Makes the power.', connects: 'Transmission (left), turbo + exhaust, intake, cooling, PCM.', where: 'Front, mounted sideways (transverse).', lesson: 'engine-01' },
  turbo: { name: 'Turbocharger', does: 'Exhaust gas spins a turbine that drives a compressor, forcing extra air into the engine.', connects: 'Exhaust manifold → turbine; compressor → intercooler → throttle.', where: 'Bolted to the engine’s exhaust side.' },
  intercooler: { name: 'Intercooler', does: 'Cools the hot compressed air from the turbo so it’s denser and less knock-prone.', connects: 'Turbo compressor → intercooler → throttle body.', where: 'Low in the nose, in the airflow.' },
  radiator: { name: 'Radiator', does: 'Sheds engine heat from the coolant into the air.', connects: 'Hoses to the engine, water pump and thermostat; fan behind it.', where: 'Front of the engine bay, behind the grille.' },
  airbox: { name: 'Air filter box', does: 'Draws in outside air and filters it before the turbo.', connects: 'Snorkel → filter → MAF sensor → turbo inlet.', where: 'Front corner of the engine bay.' },
  battery: { name: '12 V battery', does: 'Starts the car and buffers the electrical system.', connects: 'Starter, alternator, fuse boxes, every module.', where: 'Engine bay.' },
  pcm: { name: 'PCM (engine computer)', does: 'Ford’s ECU: runs fuel, spark, throttle and boost, and talks to other modules over CAN.', connects: 'Sensors, injectors, coils, throttle, wastegate; CAN bus.', where: 'Engine bay, near the battery (position simplified).' },
  transmission: { name: '8-speed automatic', does: 'Picks a gear ratio so the engine stays in a useful rpm range. Includes the front differential.', connects: 'Engine → transmission → front halfshafts + PTU.', where: 'Driver side of the engine.' },
  ptu: { name: 'Power transfer unit (PTU)', does: 'Right-angle gearbox that takes drive from the transmission and turns it 90° toward the rear.', connects: 'Transmission output → driveshaft.', where: 'On the transmission, behind the front axle line.' },
  driveshaft: { name: 'Driveshaft', does: 'Spins drive from the PTU back to the rear drive unit.', connects: 'PTU ↔ rear drive unit, with joints at each end.', where: 'Down the center tunnel under the floor.' },
  rdu: { name: 'Rear drive unit (RDU)', does: 'Badlands: twin-clutch unit, one clutch pack per rear wheel, computer-controlled. Can lock both for the rear diff-lock button.', connects: 'Driveshaft in; two rear halfshafts out.', where: 'Between the rear wheels.' },
  axles: { name: 'Halfshafts (CV axles)', does: 'Carry drive from the differentials to each wheel while the suspension moves and the front wheels steer.', connects: 'Diff/RDU ↔ wheel hubs, CV joints at both ends.', where: 'Front and rear, wheel to center.' },
  wheels: { name: 'Wheels & tires', does: 'The only part touching the ground. Grip limits everything else.', connects: 'Hubs, brakes, suspension.', where: 'Four corners.' },
  brakes: { name: 'Brakes', does: 'Discs at all four wheels clamp to slow the car. ABS keeps wheels from locking.', connects: 'Master cylinder + booster → brake lines → calipers.', where: 'Inside each wheel; master cylinder at the firewall.' },
  'susp-front': { name: 'Front suspension', does: 'MacPherson struts: a coil spring and damper in one unit that also locates the wheel.', connects: 'Strut tops in the body, lower control arms, steering knuckles.', where: 'Front corners.' },
  'susp-rear': { name: 'Rear suspension', does: 'Independent rear: links and an arm per side let each wheel move on its own.', connects: 'Subframe, springs, dampers, rear knuckles.', where: 'Rear corners.' },
  steering: { name: 'Steering', does: 'Rack and pinion with electric power assist. Turning the wheel slides the rack, which turns the front wheels.', connects: 'Steering wheel → column → rack → tie rods → knuckles.', where: 'Behind the front axle line.' },
  exhaust: { name: 'Exhaust', does: 'Carries burnt gas back, cleans it (catalytic converter) and quiets it (muffler).', connects: 'Turbo outlet → cat → pipes → muffler → tailpipe.', where: 'Under the car, front to back.' },
  'fuel-tank': { name: 'Fuel tank', does: 'Holds gasoline. An in-tank pump feeds the engine’s high-pressure pump.', connects: 'Fuel lines to the engine; vapor lines to the charcoal canister.', where: 'Under the rear seat, ahead of the rear axle.' },
};

export function svg(id, { labels }) {
  const wheel = (x, y) => `<rect x="${x}" y="${y}" width="28" height="66" rx="8" class="hl" fill="#14171a" stroke="#8994a1" stroke-width="1.4"/><path d="M${x + 4},${y + 10} h20 M${x + 4},${y + 22} h20 M${x + 4},${y + 34} h20 M${x + 4},${y + 46} h20 M${x + 4},${y + 58} h20" stroke="#2a3038" stroke-width="2"/>`;
  const disc = (x, y) => `<rect x="${x}" y="${y}" width="6" height="40" rx="2" class="hl" fill="#9aa5b1"/><rect x="${x + (x < 150 ? 5 : -5)}" y="${y + 12}" width="6" height="16" rx="1" class="hl" fill="#ff6b1a"/>`;
  return `
  <!-- body (X-ray) -->
  <path d="M86,64 Q150,50 214,64 L238,90 L242,540 Q242,556 226,558 L74,558 Q58,556 58,540 L62,90 Z" fill="rgba(255,255,255,0.025)" stroke="#5b6470" stroke-width="1.6"/>
  <path d="M70,232 Q150,214 230,232 M74,250 L226,250 M74,500 L226,500" fill="none" stroke="#3a424c" stroke-width="1.2"/>
  <path d="M84,262 h132 M84,520 h132" stroke="#3a424c" stroke-width="2" stroke-dasharray="6 6"/>
  <rect x="92" y="282" width="46" height="56" rx="8" fill="none" stroke="#2a3038"/><rect x="162" y="282" width="46" height="56" rx="8" fill="none" stroke="#2a3038"/>
  <rect x="88" y="400" width="124" height="46" rx="8" fill="none" stroke="#2a3038"/>
  <circle cx="115" cy="264" r="14" fill="none" stroke="#3a424c" stroke-width="2"/>
  <!-- wheels + brakes -->
  <g data-part="wheels"><rect class="hit" x="36" y="124" width="40" height="80"/><rect class="hit" x="224" y="124" width="40" height="80"/><rect class="hit" x="36" y="426" width="40" height="80"/><rect class="hit" x="224" y="426" width="40" height="80"/>
    ${wheel(40, 130)}${wheel(232, 130)}${wheel(40, 432)}${wheel(232, 432)}</g>
  <g data-part="brakes"><rect class="hit" x="68" y="140" width="14" height="50"/><rect class="hit" x="218" y="140" width="14" height="50"/><rect class="hit" x="68" y="442" width="14" height="50"/><rect class="hit" x="218" y="442" width="14" height="50"/><rect class="hit" x="86" y="214" width="34" height="18"/>
    ${disc(72, 143)}${disc(222, 143)}${disc(72, 445)}${disc(222, 445)}<rect x="88" y="216" width="28" height="12" rx="3" class="hl" fill="#3a424c" stroke="#8994a1"/></g>
  <!-- suspension -->
  <g data-part="susp-front"><rect class="hit" x="78" y="154" width="22" height="24"/><rect class="hit" x="200" y="154" width="22" height="24"/>
    <circle cx="90" cy="166" r="9" class="hl" fill="#1f5d80" stroke="#7fb2e0"/><circle cx="210" cy="166" r="9" class="hl" fill="#1f5d80" stroke="#7fb2e0"/>
    <path d="M78,184 L112,196 M222,184 L188,196" class="hl" stroke="#7fb2e0" stroke-width="3" fill="none"/></g>
  <g data-part="susp-rear"><rect class="hit" x="76" y="440" width="50" height="50"/><rect class="hit" x="174" y="440" width="50" height="50"/>
    <path d="M76,452 L124,446 M76,480 L124,486 M80,466 L118,420 M224,452 L176,446 M224,480 L176,486 M220,466 L182,420" class="hl" stroke="#7fb2e0" stroke-width="3" fill="none"/>
    <circle cx="96" cy="466" r="8" class="hl" fill="#1f5d80" stroke="#7fb2e0"/><circle cx="204" cy="466" r="8" class="hl" fill="#1f5d80" stroke="#7fb2e0"/></g>
  <!-- steering -->
  <g data-part="steering"><rect class="hit" x="80" y="196" width="140" height="16"/><rect class="hit" x="104" y="210" width="20" height="44"/>
    <rect x="96" y="200" width="108" height="8" rx="3" class="hl" fill="#6d7782" stroke="#a9b3bd"/><path d="M96,204 L74,196 M204,204 L226,196 M112,208 L115,250" class="hl" stroke="#a9b3bd" stroke-width="2.5" fill="none"/></g>
  <!-- front-end: radiator, intercooler, airbox, battery, pcm -->
  <g data-part="intercooler"><rect class="hit" x="96" y="60" width="108" height="14"/><rect x="100" y="64" width="100" height="7" rx="2" class="hl" fill="#2b5f86" stroke="#7fb2e0"/></g>
  <g data-part="radiator"><rect class="hit" x="80" y="74" width="140" height="16"/><rect x="84" y="78" width="132" height="8" rx="2" class="hl" fill="#1f5d80" stroke="#7fb2e0"/></g>
  <g data-part="airbox"><rect class="hit" x="66" y="92" width="44" height="26"/><rect x="70" y="95" width="36" height="20" rx="3" class="hl" fill="#2a3038" stroke="#8994a1"/></g>
  <g data-part="battery"><rect class="hit" x="190" y="92" width="44" height="22"/><rect x="194" y="95" width="34" height="16" rx="2" class="hl" fill="#3a424c" stroke="#ffc21a"/><text x="211" y="107" text-anchor="middle" style="font-size:9px;fill:#ffc21a">12V</text></g>
  <g data-part="pcm"><rect class="hit" x="200" y="116" width="34" height="18"/><rect x="204" y="119" width="24" height="12" rx="2" class="hl" fill="#262b31" stroke="#ff6b1a"/></g>
  <!-- powertrain -->
  <g data-part="transmission"><rect class="hit" x="78" y="112" width="52" height="54"/><path d="M82,118 L126,114 L126,164 L82,160 Z" class="hl" fill="#3a424c" stroke="#8994a1" stroke-width="1.4"/><text x="104" y="142" text-anchor="middle" style="font-size:9px">8AT</text></g>
  <g data-part="engine"><rect class="hit" x="126" y="106" width="74" height="58"/><rect x="128" y="110" width="70" height="50" rx="4" class="hl" fill="#4a535e" stroke="#c9d1d9" stroke-width="1.4"/>
    ${[0, 1, 2, 3].map((i) => `<circle cx="${139 + i * 16}" cy="130" r="6" fill="#262b31" stroke="#8994a1"/>`).join('')}</g>
  <g data-part="turbo"><rect class="hit" x="146" y="160" width="34" height="24"/><circle cx="162" cy="172" r="9" class="hl" fill="#ff6b1a" stroke="#ffa060"/><circle cx="162" cy="172" r="3" fill="#0c0e10"/></g>
  <g data-part="ptu"><rect class="hit" x="116" y="164" width="26" height="26"/><rect x="120" y="168" width="18" height="18" rx="3" class="hl" fill="#ffc21a" stroke="#ffe08a"/></g>
  <g data-part="axles"><rect class="hit" x="70" y="160" width="160" height="12" /><rect class="hit" x="70" y="460" width="160" height="12"/>
    <path d="M76,166 L82,164 M126,162 L222,166 M76,466 L134,466 M166,466 L224,466" class="hl" stroke="#c9d1d9" stroke-width="4" fill="none" stroke-linecap="round"/></g>
  <g data-part="driveshaft"><rect class="hit" x="122" y="186" width="16" height="260"/><path d="M129,188 L135,452" class="hl" stroke="#c9d1d9" stroke-width="5" fill="none"/><circle cx="129" cy="190" r="4" fill="#8994a1"/><circle cx="135" cy="450" r="4" fill="#8994a1"/></g>
  <g data-part="rdu"><rect class="hit" x="128" y="446" width="44" height="38"/><rect x="132" y="452" width="36" height="28" rx="5" class="hl" fill="#ff6b1a" stroke="#ffa060"/><path d="M140,456 v20 M160,456 v20" stroke="#1a0c03" stroke-width="2"/></g>
  <!-- fuel + exhaust -->
  <g data-part="fuel-tank"><rect class="hit" x="94" y="350" width="112" height="64"/><path d="M98,356 L126,356 L126,370 L146,370 L146,356 L202,356 L202,408 L98,408 Z" class="hl" fill="rgba(255,194,26,0.12)" stroke="#ffc21a" stroke-width="1.4"/></g>
  <g data-part="exhaust"><rect class="hit" x="156" y="182" width="24" height="320"/><rect class="hit" x="150" y="500" width="80" height="30"/>
    <path d="M162,182 L168,206 L170,350 L188,360 L190,420 L178,500" class="hl" fill="none" stroke="#b39a84" stroke-width="5" stroke-linejoin="round"/>
    <rect x="162" y="210" width="16" height="30" rx="5" class="hl" fill="#7d6a52" stroke="#c9ad94"/>
    <rect x="152" y="504" width="70" height="20" rx="8" class="hl" fill="#5b4d40" stroke="#c9ad94"/><path d="M222,514 L236,530" stroke="#c9ad94" stroke-width="4"/></g>
  <text x="150" y="40" text-anchor="middle" class="geo-t">FRONT</text>
  ${labels ? `<g class="labels">
    ${label('Intercooler', -64, 60, 100, 67)}
    ${label('Air box', -64, 100, 70, 104)}
    ${label('8-speed auto', -64, 128, 84, 138)}
    ${label('Wheel + brake', -64, 156, 52, 150)}
    ${label('PTU', -64, 184, 122, 178)}
    ${label('Steering rack', -64, 212, 98, 204)}
    ${label('Driveshaft', -64, 320, 131, 320)}
    ${label('Fuel tank', -64, 382, 100, 382)}
    ${label('Rear susp.', -64, 470, 84, 470)}
    ${label('Radiator', 364, 82, 214, 82, 'end')}
    ${label('Battery', 364, 104, 228, 102, 'end')}
    ${label('PCM', 364, 126, 228, 124, 'end')}
    ${label('Engine', 364, 148, 196, 140, 'end')}
    ${label('Turbo', 364, 176, 170, 172, 'end')}
    ${label('Catalytic conv.', 364, 226, 178, 226, 'end')}
    ${label('Exhaust', 364, 330, 170, 330, 'end')}
    ${label('Rear drive unit', 364, 456, 168, 462, 'end')}
    ${label('Muffler', 364, 520, 220, 514, 'end')}
  </g>` : ''}`;
}
