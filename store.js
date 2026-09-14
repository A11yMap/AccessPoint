// Account, access preferences and user contributions.
// Prototype: everything lives in localStorage, no server, no real auth.

import { VENUES } from './data/venues.js';

const KEY = 'calderquay.v1';

const DEFAULT_STATE = {
  account: null,          // { name, needs: [] }
  contributions: {},      // { [venueId]: { [attrId]: value } }
  confirmations: {},      // { [venueId]: { [attrId]: 'YYYY-MM-DD' } }
};

let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch { /* corrupt or blocked storage — fall through to defaults */ }
  return structuredClone(DEFAULT_STATE);
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch { /* private browsing — the app still works, it just won't persist */ }
}

function emit() {
  save();
  for (const fn of listeners) fn(state);
}

export const subscribe = fn => { listeners.add(fn); return () => listeners.delete(fn); };

export const getState = () => state;
export const getAccount = () => state.account;
export const getNeeds = () => state.account?.needs ?? [];
export const isSignedIn = () => Boolean(state.account);

export function signIn(name, needs) {
  state.account = { name: name.trim() || 'Guest', needs: [...needs] };
  emit();
}

export function signOut() {
  state = structuredClone(DEFAULT_STATE);
  emit();
}

export function setNeeds(needs) {
  if (!state.account) return;
  state.account.needs = [...needs];
  emit();
}

/** Record a fact a user contributed from the venue page. */
export function contribute(venueId, attrId, value) {
  state.contributions[venueId] ??= {};
  state.contributions[venueId][attrId] = value;
  emit();
}

/** Re-confirm an existing fact that had gone stale. */
export function confirm(venueId, attrId) {
  state.confirmations[venueId] ??= {};
  state.confirmations[venueId][attrId] = today();
  emit();
}

export const hasContributed = (venueId, attrId) =>
  Boolean(state.contributions[venueId]?.[attrId] || state.confirmations[venueId]?.[attrId]);

export const contributionCount = () =>
  Object.values(state.contributions).reduce((n, o) => n + Object.keys(o).length, 0) +
  Object.values(state.confirmations).reduce((n, o) => n + Object.keys(o).length, 0);

const today = () => new Date().toISOString().slice(0, 10);

/**
 * A venue with this user's contributions merged in, so a fact they add on the
 * venue page immediately changes their score.
 */
export function withContributions(venue) {
  const added = state.contributions[venue.id];
  const confirmed = state.confirmations[venue.id];
  if (!added && !confirmed) return venue;

  const attrs = { ...venue.attrs };
  for (const [attrId, value] of Object.entries(added ?? {})) {
    attrs[attrId] = [value, today(), 'community'];
  }
  for (const attrId of Object.keys(confirmed ?? {})) {
    const raw = attrs[attrId];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value !== undefined) attrs[attrId] = [value, confirmed[attrId], 'community'];
  }
  return { ...venue, attrs };
}

export const allVenues = () => VENUES.map(withContributions);
export const venueById = id => {
  const v = VENUES.find(x => x.id === id);
  return v ? withContributions(v) : null;
};
