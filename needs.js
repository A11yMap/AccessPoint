// The access needs a person can have on their profile.
// Everything in the app is scored relative to whichever of these are switched on.

export const NEEDS = [
  { id: 'wheelchair', label: 'Wheelchair user',      short: 'Wheelchair',   icon: '♿' },
  { id: 'mobility',   label: 'Limited mobility / fatigue', short: 'Mobility', icon: '🦯' },
  { id: 'blind',      label: 'Blind',                short: 'Blind',        icon: '👁' },
  { id: 'lowvision',  label: 'Low vision',           short: 'Low vision',   icon: '🔍' },
  { id: 'deaf',       label: 'Deaf',                 short: 'Deaf',         icon: '🤟' },
  { id: 'hoh',        label: 'Hard of hearing',      short: 'Hard of hearing', icon: '👂' },
  { id: 'mute',       label: 'Non-speaking',         short: 'Non-speaking', icon: '💬' },
  { id: 'sensory',    label: 'Autistic / sensory sensitivity', short: 'Sensory', icon: '🌊' },
  { id: 'cognitive',  label: 'Learning disability',  short: 'Cognitive',    icon: '🧠' },
];

export const NEED_BY_ID = Object.fromEntries(NEEDS.map(n => [n.id, n]));

export const needLabel = id => NEED_BY_ID[id]?.short ?? id;
