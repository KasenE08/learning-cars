// Facts for the Engine Layouts and Exhaust units. Last checked: Oct 2026.
export default {
  'ninja.crankAngle': { value: '180° crank (one piston up while the other is down), with a balancer shaft', status: 'confirmed',
    sources: ['Le Repaire des Motards Ninja 500 review', 'Wikipedia: Kawasaki Eliminator (same 451 cc engine)', 'Eliminator first-ride reviews (Motorcycle.com, Common Tread)', 'Ultimate Motorcycling Ninja 500 review (balancer shaft)'],
    note: 'Kawasaki’s own spec sheets don’t state the crank angle; the 180° figure comes from independent reviews that agree.' },
  'rs457.crankAngle': { value: '270° crank with a balance shaft (same idea as the RS 660)', status: 'confirmed',
    sources: ['Ultimate Motorcycling RS 457 review', 'Motorcyclist RS 457 test', 'Bikes Republic Malaysia launch report (counterbalancer shaft)', 'Visordown RS 457 review'],
    note: 'Confirmed by several independent reviews; not checked against an Aprilia factory spec page.' },
  'bronco.exhaustManifold': { value: 'Exhaust manifold cast into the cylinder head (integrated exhaust manifold), feeding the turbo directly', status: 'unconfirmed',
    sources: ['Ward’s Auto on Ford’s 2.0 L EcoBoost (original version)', 'Maverick Truck Club owner forum (current 2.0 L)'],
    note: 'Well documented for the 2.0 EcoBoost family; not confirmed against Ford documentation for the 2024 Bronco Sport engine specifically.' },
};
