// The attribute registry.
//
// This is the core of the app. A venue stores plain FACTS ("ordering is by
// touchscreen"). This registry decides what each fact MEANS for each access need.
//
// Per need:
//   w     relevance weight 0–10. Absent = irrelevant to that need, so it is
//         hidden from that person's details and never affects their score.
//   rate  how good each possible value is for that need, 0 (useless) – 1 (ideal).
//   gate  values that make the place unusable for that need. A gate is not a low
//         score, it is a hard stop — one 15cm step is not "92% accessible".
//
// Note `ordering` and `lighting`: the same fact scores in OPPOSITE directions for
// different needs. A touchscreen kiosk is a wall for a blind customer and a relief
// for a non-speaking one. That is the whole reason this app exists.

export const GROUPS = [
  'Getting in',
  'Moving around',
  'Toilets',
  'Communication & service',
  'Sensory environment',
  'Arrival & parking',
];

export const ATTRIBUTES = [
  {
    id: 'step_free_entrance', group: 'Getting in', label: 'Step-free entrance',
    values: {
      yes: 'The main entrance is level — no steps',
      alt: 'Main door has steps, but there is a step-free entrance elsewhere',
      no:  'Steps at every entrance and no ramp available',
    },
    needs: {
      wheelchair: { w: 10, rate: { yes: 1, alt: 0.7, no: 0 }, gate: ['no'] },
      mobility:   { w: 7,  rate: { yes: 1, alt: 0.75, no: 0.2 } },
    },
  },
  {
    id: 'door_width', group: 'Getting in', label: 'Doorway width',
    values: {
      wide:     'Doorway 90cm or wider',
      standard: 'Doorway roughly 78–85cm',
      narrow:   'Doorway under 75cm — too narrow for most wheelchairs',
    },
    needs: {
      wheelchair: { w: 9, rate: { wide: 1, standard: 0.65, narrow: 0 }, gate: ['narrow'] },
      mobility:   { w: 3, rate: { wide: 1, standard: 0.9, narrow: 0.5 } },
    },
  },
  {
    id: 'door_type', group: 'Getting in', label: 'Door operation',
    values: {
      auto:  'Automatic sliding or powered door',
      light: 'Manual door, light to push',
      heavy: 'Heavy manual door, opens towards you',
    },
    needs: {
      wheelchair: { w: 6, rate: { auto: 1, light: 0.65, heavy: 0.15 } },
      mobility:   { w: 5, rate: { auto: 1, light: 0.75, heavy: 0.3 } },
      blind:      { w: 2, rate: { auto: 0.8, light: 1, heavy: 0.5 } },
    },
  },
  {
    id: 'tactile_paving', group: 'Getting in', label: 'Tactile paving at the door',
    values: {
      yes: 'Tactile paving marks the approach and entrance',
      no:  'No tactile surface to find the entrance by cane',
    },
    needs: {
      blind:     { w: 7, rate: { yes: 1, no: 0.25 } },
      lowvision: { w: 4, rate: { yes: 1, no: 0.5 } },
    },
  },
  {
    id: 'step_free_inside', group: 'Moving around', label: 'Step-free inside',
    values: {
      yes:     'Every public area is reachable without steps',
      partial: 'Some areas have steps and cannot be reached',
      no:      'Internal steps block most of the venue',
    },
    needs: {
      wheelchair: { w: 9, rate: { yes: 1, partial: 0.4, no: 0 }, gate: ['no'] },
      mobility:   { w: 6, rate: { yes: 1, partial: 0.55, no: 0.2 } },
    },
  },
  {
    id: 'lift', group: 'Moving around', label: 'Lift',
    values: {
      accessible:  'Lift fits a wheelchair, with tactile buttons and audio',
      small:       'Lift is small — no space to turn a wheelchair',
      stairs_only: 'Upper floors are reachable by stairs only',
      single:      'Single storey — no lift needed',
    },
    needs: {
      wheelchair: { w: 8, rate: { accessible: 1, small: 0.45, stairs_only: 0, single: 1 }, gate: ['stairs_only'] },
      mobility:   { w: 6, rate: { accessible: 1, small: 0.8, stairs_only: 0.15, single: 1 } },
      blind:      { w: 3, rate: { accessible: 1, small: 0.7, stairs_only: 0.6, single: 1 } },
    },
  },
  {
    id: 'aisle_width', group: 'Moving around', label: 'Space to move',
    values: {
      wide:     'Wide, uncluttered routes throughout',
      standard: 'Enough room, but tight in places',
      tight:    'Cramped, furniture blocks the route',
    },
    needs: {
      wheelchair: { w: 7, rate: { wide: 1, standard: 0.6, tight: 0.1 } },
      blind:      { w: 4, rate: { wide: 1, standard: 0.7, tight: 0.3 } },
      lowvision:  { w: 3, rate: { wide: 1, standard: 0.7, tight: 0.35 } },
      mobility:   { w: 3, rate: { wide: 1, standard: 0.75, tight: 0.4 } },
    },
  },
  {
    id: 'seating', group: 'Moving around', label: 'Somewhere to sit',
    values: {
      plenty:  'Plenty of seating, including seats with arms',
      limited: 'A few seats, often taken',
      none:    'No seating — standing only',
    },
    needs: {
      mobility:  { w: 8, rate: { plenty: 1, limited: 0.5, none: 0 } },
      sensory:   { w: 3, rate: { plenty: 1, limited: 0.5, none: 0.2 } },
      cognitive: { w: 2, rate: { plenty: 1, limited: 0.6, none: 0.3 } },
    },
  },
  {
    id: 'accessible_toilet', group: 'Toilets', label: 'Accessible toilet',
    values: {
      full:  'Full accessible toilet — grab rails and transfer space',
      basic: 'Larger cubicle, but no grab rails or transfer space',
      none:  'No accessible toilet on site',
    },
    needs: {
      wheelchair: { w: 9, rate: { full: 1, basic: 0.4, none: 0 } },
      mobility:   { w: 6, rate: { full: 1, basic: 0.7, none: 0.2 } },
    },
  },
  {
    id: 'changing_places', group: 'Toilets', label: 'Changing Places facility',
    values: {
      yes: 'Changing Places room with hoist and adult bench',
      no:  'No Changing Places facility',
    },
    needs: {
      wheelchair: { w: 4, rate: { yes: 1, no: 0.5 } },
    },
  },
  {
    id: 'ordering', group: 'Communication & service', label: 'How you order or pay',
    values: {
      staff:       'Order by speaking to staff at a counter',
      touchscreen: 'Self-service touchscreen only',
      app:         'Order through a phone app',
      table:       'Table service — staff come to you',
    },
    needs: {
      blind:     { w: 8, rate: { staff: 1, touchscreen: 0, app: 0.55, table: 1 } },
      lowvision: { w: 5, rate: { staff: 1, touchscreen: 0.3, app: 0.7, table: 1 } },
      mute:      { w: 9, rate: { staff: 0.2, touchscreen: 1, app: 1, table: 0.4 } },
      deaf:      { w: 6, rate: { staff: 0.4, touchscreen: 1, app: 1, table: 0.5 } },
      hoh:       { w: 4, rate: { staff: 0.45, touchscreen: 1, app: 1, table: 0.55 } },
      sensory:   { w: 4, rate: { staff: 0.5, touchscreen: 1, app: 1, table: 0.6 } },
      cognitive: { w: 5, rate: { staff: 0.85, touchscreen: 0.5, app: 0.4, table: 0.9 } },
    },
  },
  {
    id: 'staff_training', group: 'Communication & service', label: 'Staff awareness',
    values: {
      trained: 'Staff are trained in disability awareness',
      basic:   'Staff are willing but untrained',
      none:    'Staff have had no disability training',
    },
    needs: {
      wheelchair: { w: 4, rate: { trained: 1, basic: 0.6, none: 0.25 } },
      mobility:   { w: 3, rate: { trained: 1, basic: 0.6, none: 0.25 } },
      blind:      { w: 6, rate: { trained: 1, basic: 0.55, none: 0.2 } },
      lowvision:  { w: 5, rate: { trained: 1, basic: 0.6, none: 0.25 } },
      deaf:       { w: 6, rate: { trained: 1, basic: 0.5, none: 0.2 } },
      hoh:        { w: 5, rate: { trained: 1, basic: 0.55, none: 0.25 } },
      mute:       { w: 7, rate: { trained: 1, basic: 0.5, none: 0.15 } },
      sensory:    { w: 5, rate: { trained: 1, basic: 0.55, none: 0.2 } },
      cognitive:  { w: 7, rate: { trained: 1, basic: 0.5, none: 0.2 } },
    },
  },
  {
    id: 'deaf_comms', group: 'Communication & service', label: 'Ways to communicate',
    values: {
      bsl:     'At least one staff member signs',
      written: 'Staff will write things down or type on a screen',
      speech:  'Spoken communication only',
    },
    needs: {
      deaf: { w: 9, rate: { bsl: 1, written: 0.6, speech: 0.1 } },
      hoh:  { w: 5, rate: { bsl: 1, written: 0.8, speech: 0.35 } },
      mute: { w: 8, rate: { bsl: 0.9, written: 1, speech: 0.15 } },
    },
  },
  {
    id: 'hearing_loop', group: 'Communication & service', label: 'Hearing loop',
    values: {
      yes: 'Induction loop fitted and switched on',
      no:  'No hearing loop',
    },
    needs: {
      hoh:  { w: 8, rate: { yes: 1, no: 0.3 } },
      deaf: { w: 3, rate: { yes: 0.8, no: 0.4 } },
    },
  },
  {
    id: 'visual_alarm', group: 'Communication & service', label: 'Visual fire alarm',
    values: {
      yes: 'Fire alarm flashes as well as sounds',
      no:  'Fire alarm is audible only',
    },
    needs: {
      deaf: { w: 7, rate: { yes: 1, no: 0.2 } },
      hoh:  { w: 5, rate: { yes: 1, no: 0.4 } },
    },
  },
  {
    id: 'captions', group: 'Communication & service', label: 'Captioned screenings',
    appliesTo: ['cinema'],
    values: {
      yes:  'All screenings are captioned',
      some: 'A few captioned screenings each week',
      no:   'No captioned screenings',
    },
    needs: {
      deaf: { w: 10, rate: { yes: 1, some: 0.45, no: 0 }, gate: ['no'] },
      hoh:  { w: 8,  rate: { yes: 1, some: 0.55, no: 0.1 } },
    },
  },
  {
    id: 'audio_description', group: 'Communication & service', label: 'Audio description',
    appliesTo: ['cinema', 'museum'],
    values: {
      yes: 'Audio description available throughout',
      no:  'No audio description',
    },
    needs: {
      blind:     { w: 9, rate: { yes: 1, no: 0.15 } },
      lowvision: { w: 6, rate: { yes: 1, no: 0.4 } },
    },
  },
  {
    id: 'braille_signage', group: 'Communication & service', label: 'Braille & tactile signs',
    values: {
      yes: 'Braille and raised lettering on key signs',
      no:  'Printed signs only',
    },
    needs: {
      blind:     { w: 7, rate: { yes: 1, no: 0.3 } },
      lowvision: { w: 3, rate: { yes: 1, no: 0.6 } },
    },
  },
  {
    id: 'guide_dog', group: 'Communication & service', label: 'Assistance dogs',
    values: {
      welcome:    'Assistance dogs welcome, water bowl offered',
      restricted: 'Assistance dogs are turned away',
    },
    needs: {
      blind:     { w: 9, rate: { welcome: 1, restricted: 0 }, gate: ['restricted'] },
      lowvision: { w: 4, rate: { welcome: 1, restricted: 0.3 } },
    },
  },
  {
    id: 'noise', group: 'Sensory environment', label: 'Noise level',
    values: {
      quiet:    'Calm and quiet',
      moderate: 'Background noise, but conversation is easy',
      loud:     'Loud — music, echo and crowd noise',
    },
    needs: {
      sensory:   { w: 9, rate: { quiet: 1, moderate: 0.55, loud: 0.05 } },
      hoh:       { w: 7, rate: { quiet: 1, moderate: 0.5, loud: 0.1 } },
      cognitive: { w: 5, rate: { quiet: 1, moderate: 0.6, loud: 0.2 } },
      blind:     { w: 4, rate: { quiet: 1, moderate: 0.65, loud: 0.25 } },
    },
  },
  {
    id: 'lighting', group: 'Sensory environment', label: 'Lighting',
    values: {
      soft:     'Soft, dimmed lighting',
      standard: 'Bright, even, steady lighting',
      harsh:    'Harsh or flickering strip lighting',
    },
    // Inverted on purpose: dim light soothes a sensory-sensitive visitor and
    // disables a low-vision one.
    needs: {
      sensory:   { w: 7, rate: { soft: 1, standard: 0.6, harsh: 0.1 } },
      lowvision: { w: 6, rate: { soft: 0.45, standard: 1, harsh: 0.35 } },
      cognitive: { w: 3, rate: { soft: 0.8, standard: 1, harsh: 0.3 } },
    },
  },
  {
    id: 'quiet_space', group: 'Sensory environment', label: 'Quiet space to retreat to',
    values: {
      yes: 'A quiet room or low-stimulation corner is available',
      no:  'Nowhere quieter to go',
    },
    needs: {
      sensory:   { w: 8, rate: { yes: 1, no: 0.3 } },
      cognitive: { w: 4, rate: { yes: 1, no: 0.5 } },
    },
  },
  {
    id: 'clear_signage', group: 'Sensory environment', label: 'Signage & wayfinding',
    values: {
      pictorial: 'Clear signs with symbols as well as words',
      text:      'Text-only signs',
      poor:      'Confusing or missing signage',
    },
    needs: {
      cognitive: { w: 8, rate: { pictorial: 1, text: 0.6, poor: 0.15 } },
      lowvision: { w: 5, rate: { pictorial: 0.9, text: 0.7, poor: 0.2 } },
      sensory:   { w: 4, rate: { pictorial: 1, text: 0.7, poor: 0.25 } },
    },
  },
  {
    id: 'accessible_parking', group: 'Arrival & parking', label: 'Accessible parking',
    values: {
      onsite: 'Blue badge bays on site',
      nearby: 'Blue badge bays within 200m',
      none:   'No accessible parking nearby',
    },
    needs: {
      wheelchair: { w: 7, rate: { onsite: 1, nearby: 0.55, none: 0.15 } },
      mobility:   { w: 7, rate: { onsite: 1, nearby: 0.5, none: 0.1 } },
    },
  },
  {
    id: 'dropped_kerb', group: 'Arrival & parking', label: 'Dropped kerb outside',
    values: {
      yes: 'Dropped kerb right outside',
      no:  'No dropped kerb — high kerb to cross',
    },
    needs: {
      wheelchair: { w: 5, rate: { yes: 1, no: 0.2 } },
      mobility:   { w: 3, rate: { yes: 1, no: 0.5 } },
    },
  },
];

export const ATTR_BY_ID = Object.fromEntries(ATTRIBUTES.map(a => [a.id, a]));

/** Does this attribute make sense for this kind of venue? */
export const appliesToVenue = (attr, venue) =>
  !attr.appliesTo || attr.appliesTo.includes(venue.category);
