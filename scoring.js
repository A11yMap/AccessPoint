// The scoring engine.
//
// A venue does not have an accessibility score. A venue + a person has a score.
// Everything here takes the viewer's access needs as an argument.

import { ATTRIBUTES, ATTR_BY_ID, appliesToVenue } from './data/attributes.js';
import { readAttr } from './data/venues.js';
import { NEEDS, needLabel } from './data/needs.js';

const ALL_NEED_IDS = NEEDS.map(n => n.id);
const STALE_AFTER_MONTHS = 18;

export function monthsSince(dateStr) {
  const then = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  return (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth());
}

export const isStale = dateStr => monthsSince(dateStr) >= STALE_AFTER_MONTHS;

export function formatVerified(dateStr) {
  const months = monthsSince(dateStr);
  if (months < 1) return 'checked this month';
  if (months === 1) return 'checked last month';
  if (months < 12) return `checked ${months} months ago`;
  const years = Math.floor(months / 12);
  return `checked over ${years} year${years > 1 ? 's' : ''} ago`;
}

const SOURCE_LABEL = {
  community: 'Reported by visitors',
  venue: 'Provided by the venue',
  audit: 'Independent access audit',
  osm: 'Imported from OpenStreetMap',
};
export const sourceLabel = s => SOURCE_LABEL[s] ?? s;

/**
 * Score a venue for one person's set of access needs.
 * An empty profile falls back to "everyone", which is the honest answer to
 * "how accessible is this in general" — an average over every need.
 */
export function scoreVenue(venue, needIds) {
  const active = needIds?.length ? needIds : ALL_NEED_IDS;

  const rows = [];      // relevant to this person, sorted by relevance below
  const otherRows = []; // known, but irrelevant to this person
  const blockers = [];
  let weighted = 0;
  let totalWeight = 0;
  let known = 0;
  let relevantCount = 0;

  for (const attr of ATTRIBUTES) {
    if (!appliesToVenue(attr, venue)) continue;

    const matched = active
      .filter(id => attr.needs[id])
      .map(id => ({ id, ...attr.needs[id] }));

    const fact = readAttr(venue, attr.id);

    if (matched.length === 0) {
      if (fact) {
        otherRows.push(buildRow(attr, fact, [], 0, null));
      }
      continue;
    }

    relevantCount++;

    if (!fact) {
      // An unknown is NOT a pass. It is counted against coverage and shown as a gap.
      rows.push(buildRow(attr, null, matched, Math.max(...matched.map(m => m.w)), null));
      continue;
    }

    known++;

    let attrWeighted = 0;
    let attrWeight = 0;
    const hitNeeds = [];

    for (const m of matched) {
      const rating = m.rate?.[fact.value] ?? 0.5;
      attrWeighted += m.w * rating;
      attrWeight += m.w;
      hitNeeds.push({ id: m.id, w: m.w, rating });

      if (m.gate?.includes(fact.value)) {
        blockers.push({
          attrId: attr.id,
          label: attr.label,
          text: attr.values[fact.value],
          needId: m.id,
          needLabel: needLabel(m.id),
        });
      }
    }

    weighted += attrWeighted;
    totalWeight += attrWeight;

    rows.push(buildRow(attr, fact, hitNeeds, Math.max(...hitNeeds.map(h => h.w)), attrWeighted / attrWeight));
  }

  // Most relevant first; within equal relevance, surface the problems.
  rows.sort((a, b) => b.relevance - a.relevance || (a.rating ?? 2) - (b.rating ?? 2));
  otherRows.sort((a, b) => a.group.localeCompare(b.group));

  const hasData = known > 0;
  const ratio = totalWeight > 0 ? weighted / totalWeight : null;
  const status = statusFor(blockers.length > 0, hasData, ratio, known, relevantCount);

  // Two cases where showing a number would be a lie:
  //  - Below half coverage. Four facts out of eleven is not "5.0", it is
  //    "we barely know anything about this place".
  //  - A gate is violated. "2.5 out of 5, and also you physically cannot get in"
  //    is incoherent; the blockers are the answer, not an average.
  const confident = hasData && status !== 'sparse' && blockers.length === 0;

  return {
    venue,
    needIds: active,
    usingFallbackProfile: !needIds?.length,
    blocked: blockers.length > 0,
    blockers,
    confident,
    stars: confident ? Math.round(ratio * 5 * 10) / 10 : null,
    coverage: {
      known,
      total: relevantCount,
      pct: relevantCount ? Math.round((known / relevantCount) * 100) : 0,
    },
    rows,
    otherRows,
    status,
  };
}

function buildRow(attr, fact, hitNeeds, relevance, rating) {
  return {
    attrId: attr.id,
    group: attr.group,
    label: attr.label,
    value: fact?.value ?? null,
    text: fact ? attr.values[fact.value] : null,
    verified: fact?.verified ?? null,
    source: fact?.source ?? null,
    stale: fact ? isStale(fact.verified) : false,
    relevance,
    rating,
    needs: hitNeeds,
    tone: toneFor(rating),
  };
}

function toneFor(rating) {
  if (rating === null || rating === undefined) return 'unknown';
  if (rating >= 0.75) return 'good';
  if (rating >= 0.45) return 'ok';
  return 'bad';
}

function statusFor(blocked, hasData, ratio, known, total) {
  if (blocked) return 'blocked';
  if (!hasData) return 'unknown';
  if (total > 0 && known / total < 0.5) return 'sparse';
  if (ratio >= 0.7) return 'good';
  if (ratio >= 0.45) return 'ok';
  return 'poor';
}

export const STATUS_META = {
  good:    { label: 'Works for you',      pin: '#1f8a5f' },
  ok:      { label: 'Partly works',       pin: '#c98211' },
  poor:    { label: 'Difficult for you',  pin: '#d2622e' },
  blocked: { label: "You can't get in",   pin: '#c2352f' },
  sparse:  { label: 'Barely any data',    pin: '#7a8091' },
  unknown: { label: 'No data yet',        pin: '#7a8091' },
};

/** Which of this person's needs does the venue serve worst? Used for the summary line. */
export function weakestNeed(result) {
  const byNeed = new Map();
  for (const row of result.rows) {
    if (row.rating === null) continue;
    for (const n of row.needs) {
      const cur = byNeed.get(n.id) ?? { sum: 0, w: 0 };
      cur.sum += n.w * n.rating;
      cur.w += n.w;
      byNeed.set(n.id, cur);
    }
  }
  let worst = null;
  for (const [id, { sum, w }] of byNeed) {
    if (!w) continue;
    const score = sum / w;
    if (!worst || score < worst.score) worst = { id, score };
  }
  return worst;
}
