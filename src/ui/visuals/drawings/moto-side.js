// Faired sport bike, side X-ray (right side, front to the right). Original shape loosely
// in the Ninja 500 / RS 457 class. Layout simplified.
export const viewBox = '0 0 600 360';
export const defaultLabels = false;

import { label } from '../svg.js';

export const parts = {
  engine: { name: 'Parallel-twin engine', does: 'Two cylinders side by side, sharing one crank. Ninja 500: 451 cc. RS 457: 457 cc.', connects: 'Airbox + throttle bodies above, exhaust below, clutch and gearbox behind the crank.', where: 'Center of the bike, cylinders tilted forward.', lesson: 'engine-04' },
  gearbox: { name: 'Gearbox (6-speed)', does: 'Sequential gearbox in the same case as the engine. Click up/down one gear at a time.', connects: 'Clutch → input shaft → output shaft → front sprocket.', where: 'Behind the crank, inside the engine cases.' },
  clutch: { name: 'Wet multi-plate clutch', does: 'Stack of friction and steel plates running in engine oil. The Ninja 500’s is an assist & slipper clutch.', connects: 'Crank gear → clutch basket; clutch hub → gearbox input.', where: 'Right side of the engine, under a round cover.' },
  radiator: { name: 'Radiator', does: 'Cools the liquid-cooled engine.', connects: 'Hoses to the water pump and cylinder head.', where: 'In front of the engine, behind the front wheel.' },
  airbox: { name: 'Airbox', does: 'Filters intake air and calms it before the throttle bodies.', connects: 'Intake ducts → filter → throttle bodies.', where: 'Under the fuel tank.' },
  throttle: { name: 'Throttle bodies', does: 'Control airflow into each cylinder. The RS 457’s are ride-by-wire (electronic, no cable). The Ninja 500 doesn’t list ride-by-wire.', connects: 'Airbox → throttle → intake ports. Injectors sit here.', where: 'Behind the cylinders, under the tank.' },
  exhaust: { name: 'Exhaust + muffler', does: 'Headers from both cylinders merge into one pipe with a catalyst, then a short muffler.', connects: 'Exhaust ports → collector → cat → muffler.', where: 'Under the engine to a low side muffler.' },
  tank: { name: 'Fuel tank', does: 'Holds fuel; an in-tank pump feeds the injectors.', connects: 'Fuel pump → injectors.', where: 'Above the engine, between your knees.' },
  frame: { name: 'Frame', does: 'Holds the steering head, engine and swingarm in exact alignment. Ninja 500: steel trellis. RS 457: aluminum twin-beam with the engine as a stressed member.', connects: 'Steering head, engine mounts, swingarm pivot.', where: 'Wraps around the engine.' },
  fork: { name: 'Front fork', does: 'Two telescopic legs with springs and damping. Steers and suspends the front wheel. Ninja 500: 41 mm conventional. RS 457: 41 mm upside-down.', connects: 'Triple clamps at the steering head → front axle.', where: 'Front of the bike.' },
  shock: { name: 'Rear shock', does: 'Single spring/damper unit (monoshock) that suspends the swingarm.', connects: 'Frame ↔ swingarm (Ninja: via a bottom linkage).', where: 'Under the seat, in front of the rear wheel.' },
  swingarm: { name: 'Swingarm', does: 'Pivoting arm that holds the rear wheel and lets it move up and down.', connects: 'Swingarm pivot on the frame ↔ rear axle.', where: 'Behind the engine to the rear wheel.' },
  chain: { name: 'Chain & sprockets', does: 'Final drive: front sprocket on the gearbox output pulls the chain, which turns the rear sprocket. Sprocket sizes set the final drive ratio.', connects: 'Gearbox output → front sprocket → chain → rear sprocket → rear wheel.', where: 'Left side of a real bike (shown here in X-ray).' },
  'front-brake': { name: 'Front brake', does: 'Does most of the stopping. Ninja 500: 310 mm disc, 2-piston caliper. RS 457: 320 mm disc, radial 4-piston caliper. ABS on both.', connects: 'Lever → master cylinder → caliper.', where: 'Front wheel.' },
  'rear-brake': { name: 'Rear brake', does: 'Smaller disc for stability and low-speed control.', connects: 'Foot pedal → master cylinder → caliper.', where: 'Rear wheel.' },
  abs: { name: 'ABS unit', does: 'Pump and valves that release brake pressure if a wheel is about to lock.', connects: 'Brake lines, wheel speed sensors, ECU.', where: 'Under the seat/frame (position simplified).' },
  ecu: { name: 'ECU', does: 'Runs fuel and ignition (and on the RS 457, ride modes and traction control).', connects: 'Sensors, injectors, coils, throttle; CAN on modern bikes.', where: 'Under the seat (position simplified).' },
  battery: { name: 'Battery', does: 'Small 12 V battery for starting and electronics.', connects: 'Starter, regulator, ECU.', where: 'Under the seat.' },
  wheels: { name: 'Wheels & tires', does: '17-inch wheels on both bikes. Round-profile tires let the bike lean.', connects: 'Axles, brakes, fork/swingarm.', where: 'Front and rear.' },
  clipons: { name: 'Clip-on bars', does: 'Low handlebars clamped to the fork legs for a sporty riding position.', connects: 'Throttle, clutch lever, brake lever, switches.', where: 'Top of the fork.' },
  quickshifter: { name: 'Shift lever (quickshifter)', does: 'Left-foot shifter. A quickshifter sensor here cuts ignition for an instant so you can upshift without the clutch. Optional on the RS 457.', connects: 'Shift lever → shift drum in the gearbox.', where: 'Left footpeg.' },
  fairing: { name: 'Fairing', does: 'Bodywork that cuts drag and keeps wind off you.', connects: 'Frame brackets, headlight, mirrors.', where: 'Front and sides.' },
};

export function svg(id, { labels } = {}) {
  return `
  <!-- tail, seat, belly pan (body outline) -->
  <path d="M302,128 L214,124 L150,112 L142,122 L196,150 L300,152 Z" fill="rgba(255,107,26,0.07)" stroke="#8994a1" stroke-width="2" stroke-linejoin="round"/>
  <path d="M296,126 L210,122 L206,132 L298,138 Z" fill="#2a3038" stroke="#5b6470"/>
  <path d="M300,252 Q340,268 392,236" fill="none" stroke="#5b6470" stroke-width="2"/>
  <g data-part="fairing"><rect class="hit" x="380" y="80" width="130" height="60"/><path class="hl" d="M506,156 Q500,108 444,96 L404,100 L396,140 L414,226 L474,236 Q506,206 506,156 Z" fill="rgba(255,107,26,0.10)" stroke="#a9b3bd" stroke-width="2" stroke-linejoin="round"/>
    <path d="M444,96 L456,64 L478,72 L470,100" fill="rgba(127,178,224,0.12)" stroke="#a9b3bd" stroke-width="1.6"/>
    <path d="M500,140 L486,146 L486,160 L503,160" fill="#e8e4da" opacity="0.8"/></g>
  <g data-part="wheels"><circle class="hit" cx="130" cy="282" r="70"/><circle class="hit" cx="476" cy="282" r="70"/>
    <circle cx="130" cy="282" r="66" class="hl" fill="none" stroke="#8994a1" stroke-width="9"/><circle cx="476" cy="282" r="64" class="hl" fill="none" stroke="#8994a1" stroke-width="8"/>
    <circle cx="130" cy="282" r="5" fill="#8994a1"/><circle cx="476" cy="282" r="5" fill="#8994a1"/></g>
  <g data-part="rear-brake"><circle class="hit" cx="130" cy="282" r="26"/><circle cx="130" cy="282" r="22" class="hl" fill="none" stroke="#c9d1d9" stroke-width="3"/><rect x="146" y="290" width="12" height="16" rx="2" class="hl" fill="#ff6b1a"/></g>
  <g data-part="front-brake"><circle class="hit" cx="476" cy="282" r="38"/><circle cx="476" cy="282" r="34" class="hl" fill="none" stroke="#c9d1d9" stroke-width="3"/><rect x="448" y="246" width="16" height="22" rx="3" class="hl" fill="#ff6b1a" transform="rotate(-30 456 257)"/></g>
  <g data-part="swingarm"><rect class="hit" x="130" y="214" width="140" height="30" transform="rotate(-22 200 229)"/><path d="M258,224 L134,280" class="hl" stroke="#a9b3bd" stroke-width="12" stroke-linecap="round"/></g>
  <g data-part="chain"><rect class="hit" x="110" y="230" width="200" height="70"/><path d="M296,234 L130,256 M296,256 L134,308" class="hl" stroke="#c9ad94" stroke-width="3" stroke-dasharray="4 2"/>
    <circle cx="294" cy="245" r="11" class="hl" fill="none" stroke="#c9ad94" stroke-width="3"/><circle cx="130" cy="282" r="28" class="hl" fill="none" stroke="#c9ad94" stroke-width="3" stroke-dasharray="4 2"/></g>
  <g data-part="shock"><rect class="hit" x="226" y="150" width="34" height="80"/><path d="M246,158 L236,222" class="hl" stroke="#7fb2e0" stroke-width="7"/><path d="M236,170 l18,4 l-18,4 l18,4 l-18,4 l18,4 l-18,4" class="hl" stroke="#ffc21a" stroke-width="2" fill="none"/></g>
  <g data-part="frame"><rect class="hit" x="250" y="110" width="160" height="30"/>
    <path class="hl" d="M408,110 L266,150 L254,214 M408,124 L300,214 M300,150 L330,206" fill="none" stroke="#c9d1d9" stroke-width="6" stroke-linejoin="round"/><circle cx="410" cy="116" r="9" fill="#5b6470"/></g>
  <g data-part="fork"><rect class="hit" x="404" y="96" width="70" height="190" transform="rotate(-24 440 190)"/><path d="M412,100 L472,276 M422,98 L480,270" class="hl" stroke="#e6c46a" stroke-width="6"/></g>
  <g data-part="clipons"><rect class="hit" x="398" y="86" width="40" height="22"/><path d="M402,98 L432,94" class="hl" stroke="#c9d1d9" stroke-width="5" stroke-linecap="round"/></g>
  <g data-part="radiator"><rect class="hit" x="392" y="150" width="26" height="74"/><rect x="398" y="156" width="12" height="62" rx="2" class="hl" fill="#1f5d80" stroke="#7fb2e0" transform="rotate(-14 404 187)"/></g>
  <g data-part="engine"><rect class="hit" x="300" y="150" width="96" height="80"/><path class="hl" d="M310,206 L340,150 L392,162 L372,222 Z" fill="#4a535e" stroke="#c9d1d9" stroke-width="1.4"/>
    <path d="M344,160 l32,8 M340,170 l30,8 M336,180 l30,8" stroke="#262b31" stroke-width="3"/></g>
  <g data-part="gearbox"><rect class="hit" x="268" y="206" width="56" height="44"/><path d="M272,212 L320,212 L322,246 L276,248 Z" class="hl" fill="#3a424c" stroke="#8994a1"/></g>
  <g data-part="clutch"><circle class="hit" cx="322" cy="222" r="20"/><circle cx="322" cy="222" r="16" class="hl" fill="#262b31" stroke="#ffc21a" stroke-width="2"/><circle cx="322" cy="222" r="5" fill="#ffc21a"/></g>
  <g data-part="exhaust"><rect class="hit" x="190" y="222" width="190" height="40"/><path d="M360,222 Q370,248 330,258 L240,262" class="hl" fill="none" stroke="#b39a84" stroke-width="7" stroke-linecap="round"/>
    <rect x="194" y="248" width="56" height="24" rx="10" class="hl" fill="#5b4d40" stroke="#c9ad94" transform="rotate(-10 222 260)"/></g>
  <g data-part="throttle"><rect class="hit" x="296" y="140" width="34" height="24"/><rect x="300" y="144" width="24" height="14" rx="3" class="hl" fill="#6d7782" stroke="#a9b3bd"/></g>
  <g data-part="airbox"><rect class="hit" x="300" y="118" width="80" height="24"/><rect x="304" y="122" width="70" height="18" rx="4" class="hl" fill="#2a3038" stroke="#8994a1"/></g>
  <g data-part="tank"><rect class="hit" x="290" y="92" width="110" height="30"/><path class="hl" d="M296,120 Q300,94 350,92 Q392,92 400,110 L396,124 Z" fill="rgba(255,194,26,0.1)" stroke="#ffc21a" stroke-width="1.4"/></g>
  <g data-part="battery"><rect class="hit" x="226" y="128" width="30" height="20"/><rect x="230" y="132" width="22" height="13" rx="2" class="hl" fill="#3a424c" stroke="#ffc21a"/></g>
  <g data-part="ecu"><rect class="hit" x="196" y="130" width="28" height="18"/><rect x="200" y="134" width="20" height="11" rx="2" class="hl" fill="#262b31" stroke="#ff6b1a"/></g>
  <g data-part="abs"><rect class="hit" x="266" y="160" width="28" height="22"/><rect x="270" y="164" width="18" height="14" rx="2" class="hl" fill="#262b31" stroke="#7fb2e0"/></g>
  <g data-part="quickshifter"><rect class="hit" x="252" y="238" width="30" height="24"/><path d="M262,248 L284,256" class="hl" stroke="#ffc21a" stroke-width="4" stroke-linecap="round"/><circle cx="262" cy="248" r="5" class="hl" fill="#ffc21a"/></g>
  <text x="590" y="350" text-anchor="end" class="geo-t">FRONT →</text>
  ${labels ? `<g class="labels">
    ${label('Seat / tail', 20, 92, 180, 128)}
    ${label('ECU', 20, 118, 206, 140)}
    ${label('Rear shock', 20, 170, 242, 180)}
    ${label('Swingarm', 20, 204, 200, 252)}
    ${label('Chain', 20, 330, 200, 270)}
    ${label('Muffler', 160, 345, 210, 262)}
    ${label('Tank', 300, 30, 340, 96)}
    ${label('Airbox', 230, 60, 320, 124)}
    ${label('Clipons', 400, 40, 418, 96)}
    ${label('Fairing', 590, 70, 494, 132, 'end')}
    ${label('Radiator', 590, 196, 408, 196, 'end')}
    ${label('Fork', 590, 226, 462, 240, 'end')}
    ${label('Front brake', 590, 320, 500, 296, 'end')}
    ${label('Engine', 360, 300, 352, 196)}
    ${label('Clutch', 300, 320, 322, 236)}
  </g>` : ''}`;
}
