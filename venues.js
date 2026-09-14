// SAMPLE DATA — invented venues placed on a real map.
//
// The businesses, their accessibility facts and the reviews are all made up for
// the prototype. The coordinates are real (Bristol Harbourside), so the map, the
// streets and the distances are genuine. Replace this file with real survey data
// — or an OpenStreetMap import — and nothing else has to change.
//
// attrs values are either 'value' (inherits the venue's `updated`/`source`) or
// ['value', 'YYYY-MM-DD', 'source'] when that one fact was checked separately.
// Sources: community | venue | audit | osm
//
// FEATURES are the "where exactly" layer: each entrance, toilet, lift and parking
// bay has its own coordinates, so the app can point at the step-free door instead
// of dropping one pin on the middle of the building.

export const CATEGORIES = {
  cafe:        { label: 'Café',        icon: '☕' },
  cinema:      { label: 'Cinema',      icon: '🎬' },
  library:     { label: 'Library',     icon: '📚' },
  supermarket: { label: 'Supermarket', icon: '🛒' },
  pub:         { label: 'Pub',         icon: '🍺' },
  museum:      { label: 'Museum',      icon: '🏛' },
  pharmacy:    { label: 'Pharmacy',    icon: '💊' },
  gym:         { label: 'Leisure',     icon: '🏊' },
  transport:   { label: 'Station',     icon: '🚉' },
  park:        { label: 'Park',        icon: '🌳' },
  bank:        { label: 'Bank',        icon: '🏦' },
  restaurant:  { label: 'Restaurant',  icon: '🍽' },
};

export const FEATURE_KINDS = {
  entrance: { label: 'Entrance',  icon: '🚪' },
  toilet:   { label: 'Toilet',    icon: '🚻' },
  lift:     { label: 'Lift',      icon: '🛗' },
  parking:  { label: 'Parking',   icon: '🅿️' },
  seating:  { label: 'Seating',   icon: '🪑' },
  quiet:    { label: 'Quiet space', icon: '🤫' },
  counter:  { label: 'Counter',   icon: '🧾' },
};

export const VENUES = [
  {
    id: 'cafe-luna', name: 'Café Luna', category: 'cafe', lng: -2.59665, lat: 51.44955,
    address: '3 Narrow Quay', updated: '2026-08-02', source: 'community',
    blurb: 'Corner coffee house with a wide level entrance — and a touchscreen that not everyone can use.',
    attrs: {
      step_free_entrance: 'yes', door_width: 'wide', door_type: 'auto',
      tactile_paving: ['no', '2024-03-18', 'community'],
      step_free_inside: 'yes', lift: 'single', aisle_width: 'wide', seating: 'plenty',
      accessible_toilet: 'full', changing_places: 'no',
      ordering: 'touchscreen', staff_training: 'basic', deaf_comms: 'written',
      hearing_loop: 'no', visual_alarm: 'no', braille_signage: 'no', guide_dog: 'welcome',
      noise: 'moderate', lighting: 'standard', quiet_space: 'no', clear_signage: 'pictorial',
      accessible_parking: 'nearby', dropped_kerb: 'yes',
    },
    features: [
      { kind: 'entrance', name: 'Main entrance', lng: -2.59685, lat: 51.44947, detail: 'Level threshold, automatic sliding door 95cm wide. Directly on Narrow Quay.' },
      { kind: 'toilet', name: 'Accessible toilet', lng: -2.59656, lat: 51.44966, detail: 'Ground floor, rear left past the counter. Right-hand transfer, grab rail, outward-opening door. No RADAR key needed.' },
      { kind: 'counter', name: 'Ordering kiosks', lng: -2.59665, lat: 51.44957, detail: 'Two touchscreens just inside. Screen is at 120cm with no audio output or headphone jack. Staff will take an order if you ask at the hatch.' },
      { kind: 'parking', name: 'Blue badge bays', lng: -2.59599, lat: 51.44942, detail: '2 bays on Narrow Quay, about 50m east. Dropped kerb at the crossing.' },
    ],
  },
  {
    id: 'quay-picturehouse', name: 'Quay Picturehouse', category: 'cinema', lng: -2.59800, lat: 51.44995,
    address: '12 Canons Road', updated: '2026-07-21', source: 'venue',
    blurb: 'Two-screen independent cinema. Strong on audio description, weaker on captions.',
    attrs: {
      step_free_entrance: 'alt', door_width: 'wide', door_type: 'light', tactile_paving: 'yes',
      step_free_inside: 'yes', lift: 'accessible', aisle_width: 'standard', seating: 'plenty',
      accessible_toilet: 'full', changing_places: 'no',
      ordering: 'app', staff_training: 'trained', deaf_comms: 'written',
      hearing_loop: 'yes', visual_alarm: 'yes',
      captions: 'some', audio_description: 'yes',
      braille_signage: 'yes', guide_dog: 'welcome',
      noise: 'moderate', lighting: 'soft', quiet_space: 'yes', clear_signage: 'pictorial',
      accessible_parking: 'onsite', dropped_kerb: 'yes',
    },
    features: [
      { kind: 'entrance', name: 'Main entrance (3 steps)', lng: -2.59823, lat: 51.44986, detail: 'Three steps up from Canons Road, handrail on the right only.' },
      { kind: 'entrance', name: 'Step-free entrance', lng: -2.59765, lat: 51.44991, detail: 'On the Millennium Promenade side, 30m around the corner. Signposted from the main door. Level throughout, door 90cm, intercom at 100cm. Brings you out beside the box office.' },
      { kind: 'lift', name: 'Lift to Screen 2', lng: -2.59794, lat: 51.45003, detail: 'Car 110×140cm. Tactile buttons and spoken floor announcements.' },
      { kind: 'toilet', name: 'Accessible toilet', lng: -2.59814, lat: 51.45007, detail: 'Foyer level, beside the lift. Left-hand transfer, emergency cord reaches the floor.' },
      { kind: 'quiet', name: 'Relaxed screening room', lng: -2.59780, lat: 51.44998, detail: 'Screen 2 runs relaxed screenings on Sundays — lights partly up, sound lowered, free to move around.' },
    ],
  },
  {
    id: 'harbourside-library', name: 'Harbourside Library', category: 'library', lng: -2.59955, lat: 51.45055,
    address: '1 Anchor Road', updated: '2026-09-01', source: 'audit',
    blurb: 'Independently audited this year. The best-equipped building on the harbourside.',
    attrs: {
      step_free_entrance: 'yes', door_width: 'wide', door_type: 'auto', tactile_paving: 'yes',
      step_free_inside: 'yes', lift: 'accessible', aisle_width: 'wide', seating: 'plenty',
      accessible_toilet: 'full', changing_places: 'yes',
      ordering: 'staff', staff_training: 'trained', deaf_comms: 'bsl',
      hearing_loop: 'yes', visual_alarm: 'yes',
      braille_signage: 'yes', guide_dog: 'welcome',
      noise: 'quiet', lighting: 'standard', quiet_space: 'yes', clear_signage: 'pictorial',
      accessible_parking: 'onsite', dropped_kerb: 'yes',
    },
    features: [
      { kind: 'entrance', name: 'Main entrance', lng: -2.59977, lat: 51.45045, detail: 'Level, automatic doors, tactile paving across the full approach.' },
      { kind: 'lift', name: 'Lift to all 3 floors', lng: -2.59945, lat: 51.45064, detail: 'Car 140×150cm, tactile and braille buttons, spoken announcements.' },
      { kind: 'toilet', name: 'Changing Places room', lng: -2.59967, lat: 51.45068, detail: 'First floor. Ceiling hoist, adult-sized bench, 12m² floor area.' },
      { kind: 'quiet', name: 'Quiet study room', lng: -2.59929, lat: 51.45051, detail: 'Bookable sensory-calm room on the ground floor — dimmable lighting, no music.' },
      { kind: 'parking', name: 'Blue badge bays', lng: -2.60004, lat: 51.45041, detail: '4 bays in the library car park, 15m from the door, all with hatched transfer space.' },
    ],
  },
  {
    id: 'marlow-market', name: 'Marlow Market', category: 'supermarket', lng: -2.59520, lat: 51.45185,
    address: '40 Baldwin Street', updated: '2026-06-14', source: 'community',
    blurb: 'Physically easy to get around, but a hard sensory environment.',
    attrs: {
      step_free_entrance: 'yes', door_width: 'wide', door_type: 'auto', tactile_paving: 'no',
      step_free_inside: 'yes', lift: ['small', '2023-11-02', 'community'],
      aisle_width: 'wide', seating: 'limited',
      accessible_toilet: 'basic', changing_places: 'no',
      ordering: 'touchscreen', staff_training: 'basic', deaf_comms: 'written',
      hearing_loop: 'no', visual_alarm: 'no', braille_signage: 'no', guide_dog: 'welcome',
      noise: 'loud', lighting: 'harsh', quiet_space: 'no', clear_signage: 'text',
      accessible_parking: 'onsite', dropped_kerb: 'yes',
    },
    features: [
      { kind: 'entrance', name: 'Main entrance', lng: -2.59542, lat: 51.45176, detail: 'Level, wide automatic doors. Trolleys block the left side at busy times.' },
      { kind: 'lift', name: 'Lift to car park', lng: -2.59503, lat: 51.45195, detail: 'Small car, roughly 90×110cm — a powerchair will not turn inside.' },
      { kind: 'toilet', name: 'Larger cubicle', lng: -2.59493, lat: 51.45183, detail: 'Rear of the store. Wider than standard but no grab rails and no transfer space.' },
      { kind: 'parking', name: 'Blue badge bays', lng: -2.59559, lat: 51.45198, detail: '6 bays by the trolley bay, level route to the door.' },
    ],
  },
  {
    id: 'the-anchor', name: 'The Anchor Inn', category: 'pub', lng: -2.59380, lat: 51.44980,
    address: '2 Welsh Back', updated: '2026-05-30', source: 'community',
    blurb: 'A 200-year-old listed building. Warm welcome, but the building itself shuts people out.',
    attrs: {
      step_free_entrance: 'no', door_width: 'narrow', door_type: 'heavy', tactile_paving: 'no',
      step_free_inside: 'partial', lift: 'stairs_only', aisle_width: 'tight', seating: 'plenty',
      accessible_toilet: 'none', changing_places: 'no',
      ordering: 'staff', staff_training: 'none', deaf_comms: 'speech',
      hearing_loop: 'no', visual_alarm: 'no', braille_signage: 'no', guide_dog: 'welcome',
      noise: 'loud', lighting: 'soft', quiet_space: 'no', clear_signage: 'text',
      accessible_parking: 'none', dropped_kerb: 'no',
    },
    features: [
      { kind: 'entrance', name: 'Front door', lng: -2.59400, lat: 51.44971, detail: 'Three worn stone steps, 17cm each, no handrail. Heavy oak door 68cm wide opening outward.' },
      { kind: 'entrance', name: 'Yard door', lng: -2.59354, lat: 51.44977, detail: 'Also stepped — two steps from the beer garden. Staff have said a portable ramp is "being looked into".' },
    ],
  },
  {
    id: 'harbour-museum', name: 'Harbour Museum', category: 'museum', lng: -2.59880, lat: 51.44757,
    address: 'Prince’s Wharf', updated: '2026-08-19', source: 'venue',
    blurb: 'Victorian building, thoughtfully retrofitted. Ask for the side entrance — it is easy to miss.',
    attrs: {
      step_free_entrance: 'alt', door_width: 'standard', door_type: 'light', tactile_paving: 'no',
      step_free_inside: 'yes', lift: 'accessible', aisle_width: 'standard', seating: 'plenty',
      accessible_toilet: 'full', changing_places: 'no',
      ordering: 'staff', staff_training: 'trained', deaf_comms: 'written',
      hearing_loop: 'yes', visual_alarm: 'yes', audio_description: 'yes',
      braille_signage: 'yes', guide_dog: 'welcome',
      noise: 'quiet', lighting: 'soft', quiet_space: 'yes', clear_signage: 'pictorial',
      accessible_parking: 'nearby', dropped_kerb: 'yes',
    },
    features: [
      { kind: 'entrance', name: 'Grand entrance (7 steps)', lng: -2.59902, lat: 51.44748, detail: 'Seven stone steps up from Prince’s Wharf, handrails both sides.' },
      { kind: 'entrance', name: 'Step-free entrance', lng: -2.59850, lat: 51.44753, detail: 'Down the lane on the east side, marked with a small blue sign. Level, door 80cm, bell at 95cm — staff answer within about a minute.' },
      { kind: 'lift', name: 'Lift to galleries 2–4', lng: -2.59873, lat: 51.44767, detail: 'Car 120×140cm, tactile buttons, spoken floor announcements.' },
      { kind: 'toilet', name: 'Accessible toilet', lng: -2.59896, lat: 51.44770, detail: 'Ground floor by the cloakroom. Both-side transfer, alarm cord reaches the floor.' },
      { kind: 'quiet', name: 'Ships gallery (quiet)', lng: -2.59863, lat: 51.44772, detail: 'Rarely busy, soft lighting, benches throughout. Staff can lend ear defenders.' },
    ],
  },
  {
    id: 'bridge-pharmacy', name: 'Bridge Pharmacy', category: 'pharmacy', lng: -2.59540, lat: 51.44880,
    address: '8 Prince Street', updated: '2026-07-05', source: 'community',
    blurb: 'Tiny shop, one step, but staff will bring a ramp out if you ring ahead.',
    attrs: {
      step_free_entrance: 'alt', door_width: 'standard', door_type: 'heavy', tactile_paving: 'no',
      step_free_inside: 'yes', lift: 'single', aisle_width: 'tight', seating: 'limited',
      accessible_toilet: 'none', changing_places: 'no',
      ordering: 'staff', staff_training: 'trained', deaf_comms: 'written',
      hearing_loop: 'yes', visual_alarm: 'no', braille_signage: 'no', guide_dog: 'welcome',
      noise: 'quiet', lighting: 'standard', quiet_space: 'no', clear_signage: 'text',
      accessible_parking: 'nearby', dropped_kerb: 'yes',
    },
    features: [
      { kind: 'entrance', name: 'Front door', lng: -2.59557, lat: 51.44872, detail: 'One step, 12cm. Portable ramp kept behind the counter — press the bell at 105cm on the left post and staff come out.' },
      { kind: 'counter', name: 'Consultation room', lng: -2.59527, lat: 51.44887, detail: 'Private room at the back, level access, hearing loop switched on. Door 76cm.' },
    ],
  },
  {
    id: 'riverside-leisure', name: 'Riverside Leisure', category: 'gym', lng: -2.60035, lat: 51.45010,
    address: 'Millennium Promenade', updated: '2026-08-28', source: 'venue',
    blurb: 'Pool hoist and accessible changing. No visual fire alarm, which matters here.',
    attrs: {
      step_free_entrance: 'yes', door_width: 'wide', door_type: 'auto', tactile_paving: 'yes',
      step_free_inside: 'yes', lift: 'accessible', aisle_width: 'wide', seating: 'plenty',
      accessible_toilet: 'full', changing_places: 'yes',
      ordering: 'app', staff_training: 'trained', deaf_comms: 'written',
      hearing_loop: 'no', visual_alarm: 'no', braille_signage: 'no', guide_dog: 'welcome',
      noise: 'loud', lighting: 'harsh', quiet_space: 'no', clear_signage: 'pictorial',
      accessible_parking: 'onsite', dropped_kerb: 'yes',
    },
    features: [
      { kind: 'entrance', name: 'Main entrance', lng: -2.60055, lat: 51.45001, detail: 'Level, automatic doors, tactile paving on the approach.' },
      { kind: 'toilet', name: 'Accessible changing room', lng: -2.60023, lat: 51.45021, detail: 'Poolside. Ceiling hoist, adult bench, both-side transfer, 14m².' },
      { kind: 'lift', name: 'Pool hoist', lng: -2.60010, lat: 51.45013, detail: 'Fixed hoist at the shallow end. Staff trained to operate it — 20 minutes notice preferred.' },
      { kind: 'parking', name: 'Blue badge bays', lng: -2.60070, lat: 51.44997, detail: '3 bays directly outside the entrance.' },
    ],
  },
  {
    id: 'harbourside-station', name: 'Harbourside Station', category: 'transport', lng: -2.59250, lat: 51.45120,
    address: 'Station Approach', updated: '2026-09-04', source: 'audit',
    blurb: 'Step-free to two of four platforms. Plan ahead if you are heading north.',
    attrs: {
      step_free_entrance: 'yes', door_width: 'wide', door_type: 'auto', tactile_paving: 'yes',
      step_free_inside: 'partial', lift: 'accessible', aisle_width: 'wide', seating: 'plenty',
      accessible_toilet: 'full', changing_places: 'no',
      ordering: 'touchscreen', staff_training: 'trained', deaf_comms: 'written',
      hearing_loop: 'yes', visual_alarm: 'yes', braille_signage: 'yes', guide_dog: 'welcome',
      noise: 'loud', lighting: 'standard', quiet_space: 'no', clear_signage: 'pictorial',
      accessible_parking: 'onsite', dropped_kerb: 'yes',
    },
    features: [
      { kind: 'entrance', name: 'Street entrance', lng: -2.59273, lat: 51.45110, detail: 'Level from Station Approach, automatic doors, tactile paving throughout the concourse.' },
      { kind: 'lift', name: 'Lift to platforms 1 & 2', lng: -2.59237, lat: 51.45132, detail: 'Car 150×150cm, tactile buttons, spoken announcements. Runs 05:30–00:30.' },
      { kind: 'entrance', name: 'Platforms 3 & 4 — stairs only', lng: -2.59212, lat: 51.45125, detail: 'Footbridge with 22 steps. No lift. Staff will re-route you via Northgate if you ask at the gateline.' },
      { kind: 'toilet', name: 'Accessible toilet', lng: -2.59289, lat: 51.45129, detail: 'Concourse, beside the ticket office. RADAR key needed — staff hold a spare.' },
    ],
  },
  {
    id: 'lantern-park', name: 'Lantern Park', category: 'park', lng: -2.59400, lat: 51.45010,
    address: 'Queen Square', updated: '2026-07-30', source: 'community',
    blurb: 'Smooth wide paths and genuinely quiet corners. The toilet needs a RADAR key.',
    attrs: {
      step_free_entrance: 'yes', door_width: 'wide', door_type: 'auto', tactile_paving: 'no',
      step_free_inside: 'yes', lift: 'single', aisle_width: 'wide', seating: 'plenty',
      accessible_toilet: 'full', changing_places: 'no',
      ordering: 'staff', staff_training: 'basic', deaf_comms: 'written',
      hearing_loop: 'no', visual_alarm: 'no', braille_signage: 'no', guide_dog: 'welcome',
      noise: 'quiet', lighting: 'soft', quiet_space: 'yes', clear_signage: 'pictorial',
      accessible_parking: 'nearby', dropped_kerb: 'yes',
    },
    features: [
      { kind: 'entrance', name: 'West gate', lng: -2.59432, lat: 51.44994, detail: 'Level, 140cm wide, no barrier or kissing gate.' },
      { kind: 'entrance', name: 'North gate', lng: -2.59377, lat: 51.45030, detail: 'Level but a 95cm chicane barrier — tight for a wide powerchair.' },
      { kind: 'toilet', name: 'Accessible toilet', lng: -2.59396, lat: 51.45014, detail: 'By the café hut. RADAR key needed, no key held on site.' },
      { kind: 'quiet', name: 'Walled garden', lng: -2.59365, lat: 51.45002, detail: 'Screened from the road, low noise, benches with arms and backs every 25m.' },
    ],
  },
  {
    id: 'northbank', name: 'Northbank Bank', category: 'bank', lng: -2.59650, lat: 51.45080,
    address: '22 Broad Quay', updated: '2026-06-02', source: 'venue',
    blurb: 'Hearing loop at every desk, but you cannot get through the door without help.',
    attrs: {
      step_free_entrance: 'no', door_width: 'standard', door_type: 'heavy', tactile_paving: 'no',
      step_free_inside: 'yes', lift: 'single', aisle_width: 'standard', seating: 'limited',
      accessible_toilet: 'none', changing_places: 'no',
      ordering: 'app', staff_training: 'trained', deaf_comms: 'bsl',
      hearing_loop: 'yes', visual_alarm: 'yes', braille_signage: 'yes', guide_dog: 'welcome',
      noise: 'quiet', lighting: 'standard', quiet_space: 'no', clear_signage: 'text',
      accessible_parking: 'nearby', dropped_kerb: 'no',
    },
    features: [
      { kind: 'entrance', name: 'Front door', lng: -2.59670, lat: 51.45071, detail: 'Two steps, 15cm each, brass handrail on the right. Heavy door. No alternative entrance and no ramp.' },
      { kind: 'counter', name: 'Service desks', lng: -2.59634, lat: 51.45088, detail: 'All five desks have a working induction loop. One colleague signs BSL, usually Tuesdays and Thursdays.' },
    ],
  },
  {
    id: 'tin-whistle', name: 'The Tin Whistle', category: 'restaurant', lng: -2.59930, lat: 51.44720,
    address: '9 Wapping Road', updated: '2026-09-08', source: 'community',
    blurb: 'Opened last month — almost nothing is known about it yet. Be the first to check it.',
    attrs: {
      step_free_entrance: 'yes',
      ordering: 'table',
      noise: 'moderate',
    },
    features: [
      { kind: 'entrance', name: 'Front door', lng: -2.59950, lat: 51.44711, detail: 'Reported level by one visitor. Width not measured yet.' },
    ],
  },
];

export const VENUE_BY_ID = Object.fromEntries(VENUES.map(v => [v.id, v]));

/** Normalise the shorthand attr format into { value, verified, source }. */
export function readAttr(venue, attrId) {
  const raw = venue.attrs[attrId];
  if (raw === undefined) return null;
  return Array.isArray(raw)
    ? { value: raw[0], verified: raw[1], source: raw[2] }
    : { value: raw, verified: venue.updated, source: venue.source };
}
