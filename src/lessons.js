// Learning content for the Toyota Hilux Revo double cabin (1GD-FTV 2.8L diesel).
// Content compiled from public sources for demo/training purposes — verify against
// the Toyota Indus workshop manual before using it as official training material.

// ─── Your CAD model ───────────────────────────────────────────────────────────
// Put your file at /public/models/revo.glb (or drag a .glb onto the viewer).
// rotation: fix orientation so the truck's FRONT points to +X and Y is UP.
//   Z-up CAD export → [-Math.PI / 2, 0, 0]; front facing -X → [0, Math.PI, 0]
export const MODEL = {
  url: './models/revo.glb',
  rotation: [0, 0, 0],
  length: 5.33, // metres — model is auto-scaled to this length
}

// Map each lesson part to object/mesh names inside your GLB.
// Use "Inspect parts" in the viewer and click a mesh to see its name.
// Matching is case-insensitive and also matches names that START with the text.
export const PART_MAP = {
  body: ['body', 'cab', 'door', 'bed', 'hood', 'bonnet', 'bumper', 'glass', 'window'],
  engine: ['engine', 'block'],
  injectors: ['injector'],
  turbo: ['turbo'],
  egr: ['egr'],
  radiator: ['radiator', 'fan'],
  battery: ['battery'],
  alternator: ['alternator'],
  fuelFilter: ['fuel_filter', 'fuelfilter'],
  tank: ['fuel_tank', 'tank'],
  exhaust: ['exhaust'],
  dpf: ['dpf', 'catalyst'],
  fifthInjector: ['fifth_injector', 'addition_injector'],
  muffler: ['muffler', 'silencer'],
  brakes: ['brake_f', 'disc', 'caliper'],
  rearBrakes: ['brake_r', 'drum'],
  gearbox: ['gearbox', 'transmission'],
  transfer: ['transfer'],
  propshaft: ['propshaft', 'prop_shaft', 'driveshaft'],
  axles: ['axle', 'diff'],
}

// dir = direction the camera looks FROM (relative to the part), dist = distance
export const PARTS = {
  body: { name: 'Body & double cab', dir: [1, 0.5, 1], dist: 8 },
  engine: { name: '1GD-FTV engine', dir: [1, 0.9, 1], dist: 3.4 },
  injectors: { name: 'Common-rail injectors', dir: [0.5, 1, 0.6], dist: 2.4 },
  turbo: { name: 'VNT turbocharger', dir: [0.8, 0.7, -1], dist: 2.6 },
  egr: { name: 'EGR valve', dir: [0.6, 1, 0.8], dist: 2.4 },
  radiator: { name: 'Radiator & fan', dir: [1, 0.5, 0.6], dist: 3.2 },
  battery: { name: 'Battery', dir: [0.8, 0.9, -1], dist: 2.4 },
  alternator: { name: 'Alternator', dir: [1, 0.6, 1], dist: 2.4 },
  fuelFilter: { name: 'Fuel filter / water separator', dir: [0.5, 0.6, 1], dist: 2.3 },
  tank: { name: 'Fuel tank — 80 L', dir: [0.2, 0.1, -1], dist: 3.2 },
  exhaust: { name: 'Exhaust line', dir: [0.2, 0.15, 1], dist: 5 },
  dpf: { name: 'DPF + oxidation catalyst', dir: [0.4, 0.15, 1], dist: 2.6 },
  fifthInjector: { name: '5th (fuel-addition) injector', dir: [0.6, 0.3, 1], dist: 2 },
  muffler: { name: 'Muffler', dir: [0.2, 0.15, 1], dist: 2.6 },
  brakes: { name: 'Front disc brakes', dir: [0.6, 0.2, 1], dist: 2.4 },
  rearBrakes: { name: 'Rear drum brakes', dir: [-0.5, 0.2, 1], dist: 2.4 },
  gearbox: { name: '6-speed transmission', dir: [0.3, 0.25, 1], dist: 2.8 },
  transfer: { name: 'Transfer case (4WD)', dir: [0.2, 0.2, -1], dist: 2.6 },
  propshaft: { name: 'Propeller shafts', dir: [0.1, 0.3, 1], dist: 4.4 },
  axles: { name: 'Axles & differentials', dir: [0.7, 0.4, 1], dist: 5.2 },
}

export const SYSTEM_LESSONS = [
  {
    id: 'engine', kind: 'system', title: 'Engine & Air Intake', sub: '1GD-FTV 2.8L turbo-diesel', icon: 'Cog', color: '#ffb020', mins: 4,
    steps: [
      { focus: ['engine'], title: 'Meet the 1GD-FTV', text: 'The Revo uses a 2,755 cc four-cylinder turbo-diesel. It makes about 201 hp and 500 Nm (A/T) and uses a timing chain instead of a belt.' },
      { focus: ['injectors'], also: ['engine'], title: 'Common-rail injection', text: 'A high-pressure pump feeds a shared fuel rail. Each injector fires several tiny squirts per stroke, which keeps the engine quiet and efficient. Clean fuel is critical because injector tolerances are microscopic.' },
      { focus: ['turbo'], also: ['engine'], title: 'Variable-nozzle turbo', text: 'Exhaust gas spins the turbine, which drives the compressor and pushes more air into the engine. Movable vanes change the gas speed so boost arrives early at low rpm.', tip: 'Let the engine idle for 30 to 60 seconds after hard driving so the turbo bearings cool.' },
      { focus: ['egr'], also: ['engine'], title: 'EGR valve', text: 'The EGR valve sends a small amount of cooled exhaust back into the intake. This lowers combustion temperature and cuts NOx. Over time carbon builds up and the valve can stick.' },
    ],
    quiz: { q: 'Why does the 1GD-FTV need very clean diesel?', options: ['The turbo filters fuel', 'Common-rail injectors have microscopic tolerances', 'The EGR valve burns fuel'], answer: 1 },
  },
  {
    id: 'cooling', kind: 'system', title: 'Cooling System', sub: 'Radiator, fan, coolant', icon: 'Thermometer', color: '#4fc3ff', mins: 3,
    steps: [
      { focus: ['radiator'], title: 'Radiator & fan', text: 'Hot coolant from the engine flows through thin radiator tubes. Air passing over the fins carries the heat away. A viscous-clutch fan pulls air through when the truck is slow or idling.' },
      { focus: ['engine'], also: ['radiator'], title: 'Coolant circuit', text: 'The water pump circulates coolant through passages in the block and head. A thermostat stays closed until the engine reaches about 80 to 84°C, then opens to send coolant to the radiator.' },
      { focus: ['radiator'], title: 'Keep it clean', text: 'Dust and mud packed into the fins are the most common cause of overheating on Pakistani routes. Use Toyota Super Long Life Coolant only.', tip: 'Never open the radiator cap while the engine is hot.' },
    ],
    quiz: { q: 'When does the thermostat open?', options: ['At cold start', 'Around 80–84°C', 'Only above 110°C'], answer: 1 },
  },
  {
    id: 'fuel', kind: 'system', title: 'Fuel System', sub: 'Tank, filter, rail', icon: 'Fuel', color: '#3ddc97', mins: 3,
    steps: [
      { focus: ['tank'], title: '80-litre tank', text: 'The tank sits along the chassis under the bed. Diesel is drawn forward to the engine bay through steel lines.' },
      { focus: ['fuelFilter'], title: 'Filter & water separator', text: 'Water is heavier than diesel and collects at the bottom of the filter housing. A sensor turns on the water-in-fuel lamp when it needs draining.' },
      { focus: ['injectors'], also: ['engine'], title: 'High-pressure delivery', text: 'After filtering, the supply pump pressurises fuel to over 1,800 bar for the rail and injectors.' },
    ],
    quiz: { q: 'What does the water-in-fuel lamp tell you?', options: ['Drain the fuel filter separator', 'Top up the coolant', 'Replace the injectors'], answer: 0 },
  },
  {
    id: 'exhaust', kind: 'system', title: 'Exhaust & Emissions', sub: 'DPF, 5th injector, muffler', icon: 'Wind', color: '#c084fc', mins: 4,
    steps: [
      { focus: ['exhaust'], title: 'Exhaust path', text: 'Gas leaves the turbo, passes the catalyst and DPF, then the muffler, and exits at the rear.' },
      { focus: ['dpf'], also: ['exhaust'], title: 'Diesel particulate filter', text: 'The DPF traps soot. When it fills, the ECU raises exhaust temperature to burn the soot off. This process is called regeneration.' },
      { focus: ['fifthInjector'], also: ['dpf'], title: 'The 5th injector', text: 'This extra injector sprays a small amount of diesel into the exhaust to heat the catalyst and DPF during regeneration. If it clogs, regeneration fails.' },
      { focus: ['muffler'], also: ['exhaust'], title: 'Muffler', text: 'The muffler reduces exhaust noise. Check the hangers and joints for leaks during routine inspection.' },
    ],
    quiz: { q: 'What is DPF regeneration?', options: ['Replacing the filter', 'Burning trapped soot at high temperature', 'Cleaning the muffler'], answer: 1 },
  },
  {
    id: 'electrical', kind: 'system', title: 'Charging & Electrical', sub: 'Battery, alternator', icon: 'Zap', color: '#facc15', mins: 2,
    steps: [
      { focus: ['battery'], title: 'Battery', text: 'A healthy battery rests at 12.4 V or more. Heat shortens battery life, so test before summer.' },
      { focus: ['alternator'], also: ['engine'], title: 'Alternator', text: 'Driven by the engine belt, the alternator recharges the battery and powers the vehicle. With the engine running you should see 13.8 to 14.6 V at the battery.' },
    ],
    quiz: { q: 'Normal charging voltage with the engine running is…', options: ['11.5–12.0 V', '13.8–14.6 V', '16–18 V'], answer: 1 },
  },
  {
    id: 'drivetrain', kind: 'system', title: 'Drivetrain & 4WD', sub: 'Gearbox, transfer, axles', icon: 'Settings2', color: '#fb7185', mins: 4,
    steps: [
      { focus: ['gearbox'], also: ['engine'], title: '6-speed transmission', text: 'Power leaves the engine through a 6-speed automatic or manual gearbox.' },
      { focus: ['transfer'], also: ['gearbox'], title: 'Transfer case', text: 'The transfer case splits power to the front axle when 4H or 4L is selected. 4L gives extra torque for steep or loose ground.', tip: 'Use 4WD only on loose surfaces. Running it on dry tarmac strains the drivetrain.' },
      { focus: ['propshaft'], also: ['transfer'], title: 'Propeller shafts', text: 'Front and rear shafts carry drive to the differentials. Grease the joints every 10,000 km in dusty use.' },
      { focus: ['axles'], title: 'Axles & differentials', text: 'The differentials let the wheels turn at different speeds in corners. Check the diff oil for water after river crossings.' },
    ],
    quiz: { q: 'When should you use 4L?', options: ['Highway cruising', 'Steep or loose terrain at low speed', 'Dry city roads'], answer: 1 },
  },
  {
    id: 'brakes-sys', kind: 'system', title: 'Brakes', sub: 'Front discs, rear drums', icon: 'Disc', color: '#f97316', mins: 2,
    steps: [
      { focus: ['brakes'], title: 'Front disc brakes', text: 'Ventilated discs with calipers do most of the stopping work, especially when the truck is loaded.' },
      { focus: ['rearBrakes'], title: 'Rear drum brakes', text: 'Drums on the rear axle are robust and well protected from mud. They also house the parking brake.' },
    ],
    quiz: { q: 'Which brakes do most of the stopping?', options: ['Front discs', 'Rear drums', 'Parking brake'], answer: 0 },
  },
]

export const FAULT_LESSONS = [
  {
    id: 'f-dpf', kind: 'fault', code: 'P2002', severity: 'high', title: 'DPF Blocked / White Smoke', sub: 'Exhaust & emissions', icon: 'CloudFog', color: '#ff4d4d', mins: 3,
    steps: [
      { focus: ['dpf'], label: 'Symptom', title: 'What the driver notices', text: 'The DPF warning lamp comes on. There is white smoke and a strong exhaust smell, and the truck may drop into reduced power.' },
      { focus: ['dpf', 'fifthInjector'], label: 'Cause', title: 'Why it happens', text: 'Short trips never let the DPF get hot enough to regenerate. A clogged 5th injector or low-grade oil makes it worse.' },
      { focus: ['fifthInjector'], label: 'Diagnose', title: 'Check the 5th injector & sensors', text: 'Read soot load on a scanner. Check the DPF pressure-sensor hoses, then inspect the 5th injector tip for carbon.' },
      { focus: ['dpf'], label: 'Fix', title: 'Forced regeneration', text: 'Clean or replace the 5th injector. Then warm the engine and run a forced regeneration for 20 to 30 minutes without interruption.' },
      { focus: ['dpf'], label: 'Prevent', title: 'Prevention', text: 'Teach drivers to use the DPF switch when the lamp appears. Use only low-ash diesel engine oil.' },
    ],
    quiz: { q: 'Most common cause of DPF blockage?', options: ['Long highway trips', 'Short trips with no regeneration', 'Using 4WD'], answer: 1 },
  },
  {
    id: 'f-heat', kind: 'fault', code: 'P0217', severity: 'high', title: 'Engine Overheating', sub: 'Cooling', icon: 'Flame', color: '#ff4d4d', mins: 3,
    steps: [
      { focus: ['engine'], label: 'Symptom', title: 'What the driver notices', text: 'The temperature gauge climbs in traffic or on long climbs. There may be a coolant smell or steam.' },
      { focus: ['radiator'], label: 'Cause', title: 'Why it happens', text: 'Radiator fins blocked with dust, low coolant, a stuck thermostat or a slipping fan clutch.' },
      { focus: ['radiator'], label: 'Diagnose', title: 'Inspect safely', text: 'Let the engine cool fully. Check the reservoir level, pressure-test the system and look for leaks at the hoses and the plastic coolant manifold.' },
      { focus: ['radiator'], also: ['engine'], label: 'Fix', title: 'Clean & refill', text: 'Back-flush the fins from the engine side. Replace the thermostat if needed, refill with SLLC coolant and bleed the air out.' },
    ],
    quiz: { q: 'First thing to do when the engine overheats?', options: ['Open the radiator cap', 'Stop and let it cool', 'Add cold water to the hot engine'], answer: 1 },
  },
  {
    id: 'f-water', kind: 'fault', code: 'P0087', severity: 'medium', title: 'Water in Fuel', sub: 'Fuel system', icon: 'Droplets', color: '#ffb020', mins: 2,
    steps: [
      { focus: ['fuelFilter'], label: 'Symptom', title: 'What the driver notices', text: 'The water-in-fuel lamp lights up. The engine hesitates, misfires or is hard to start.' },
      { focus: ['tank', 'fuelFilter'], label: 'Cause', title: 'Why it happens', text: 'Contaminated diesel from a poor station, or condensation building up in a tank that is often left near empty.' },
      { focus: ['fuelFilter'], label: 'Fix', title: 'Drain & replace', text: 'Open the drain plug until clean diesel flows. Replace the filter and prime the system with the hand pump.' },
    ],
    quiz: { q: 'Where does water collect in the fuel system?', options: ['In the injectors', 'At the bottom of the fuel filter', 'In the exhaust'], answer: 1 },
  },
  {
    id: 'f-turbo', kind: 'fault', code: 'P0299', severity: 'high', title: 'Turbo Underboost', sub: 'Air intake', icon: 'Gauge', color: '#ff4d4d', mins: 3,
    steps: [
      { focus: ['turbo'], label: 'Symptom', title: 'What the driver notices', text: 'The truck loses power on climbs, there is a hissing or whistling noise, and it may go into limp mode.' },
      { focus: ['turbo'], also: ['engine'], label: 'Cause', title: 'Why it happens', text: 'A boost leak at an intercooler hose, carbon-stuck turbo vanes or a blocked air filter.' },
      { focus: ['turbo'], label: 'Fix', title: 'Test & repair', text: 'Replace the air filter, smoke-test the intake for leaks and sweep the vane actuator with a scanner.' },
    ],
    quiz: { q: 'A simple first check for low boost is…', options: ['Air filter condition', 'Tyre pressure', 'Battery voltage'], answer: 0 },
  },
  {
    id: 'f-brakes', kind: 'fault', code: 'INSP', severity: 'medium', title: 'Worn Brake Pads', sub: 'Brakes', icon: 'Disc', color: '#ffb020', mins: 2,
    steps: [
      { focus: ['brakes'], label: 'Symptom', title: 'What the driver notices', text: 'Squealing when braking, longer stopping distances, or a vibration in the pedal.' },
      { focus: ['brakes'], label: 'Fix', title: 'Replace pads', text: 'Replace pads thinner than about 3 mm. Measure the disc thickness, lubricate the slide pins and bed in the new pads.' },
    ],
    quiz: { q: 'Replace front pads below roughly…', options: ['10 mm', '3 mm', '0 mm'], answer: 1 },
  },
  {
    id: 'f-batt', kind: 'fault', code: 'P0562', severity: 'low', title: 'Weak Battery / Low Voltage', sub: 'Electrical', icon: 'BatteryLow', color: '#4fc3ff', mins: 2,
    steps: [
      { focus: ['battery'], label: 'Symptom', title: 'What the driver notices', text: 'Slow cranking in the morning, flickering warning lights, and the radio or smart key resetting.' },
      { focus: ['battery', 'alternator'], label: 'Diagnose', title: 'Test both ends', text: 'Load-test the battery, clean the terminals, and check the charging voltage at the alternator output.' },
    ],
    quiz: { q: 'A healthy battery at rest reads at least…', options: ['10.5 V', '12.4 V', '15 V'], answer: 1 },
  },
]
