// Screen rendering.

import { NEEDS, NEED_BY_ID, needLabel } from './data/needs.js';
import { CATEGORIES, FEATURE_KINDS } from './data/venues.js';
import { ATTR_BY_ID } from './data/attributes.js';
import { reviewsFor, sortReviewsForProfile } from './data/reviews.js';
import * as store from './store.js';
import { createMap } from './map.js';
import { scoreVenue, STATUS_META, formatVerified, sourceLabel, weakestNeed } from './scoring.js';
import { APP_NAME, DISTRICT } from './config.js';

// ---- tiny DOM helper -----------------------------------------------------
export function h(tag, props = {}, kids = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === false || v === null || v === undefined) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of [].concat(kids)) {
    if (kid === null || kid === undefined || kid === false) continue;
    node.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return node;
}

const $ = sel => document.querySelector(sel);

/**
 * The app has no name yet. Until APP_NAME is filled in (js/config.js) the header
 * shows a dashed, clearly-empty slot rather than inventing a placeholder name.
 */
export function renderBrand() {
  const name = APP_NAME.trim();
  const slot = $('#brand-name');
  const sub = $('#brand-sub');

  slot.className = name ? 'brand__name' : 'brand__name brand__name--empty';
  slot.textContent = name || 'Your app name';
  slot.title = name ? '' : 'Set APP_NAME in js/config.js';
  sub.textContent = DISTRICT;
  document.title = name ? `${name} — ${DISTRICT}` : `Accessibility map — ${DISTRICT}`;
}

// ---- shared bits ---------------------------------------------------------

function stars(value) {
  const pct = value === null ? 0 : (value / 5) * 100;
  return h('span', { class: 'stars', role: 'img', 'aria-label': value === null ? 'Not rated' : `${value} out of 5` }, [
    h('span', { class: 'stars__bg', 'aria-hidden': 'true', text: '★★★★★' }),
    h('span', { class: 'stars__fg', 'aria-hidden': 'true', style: `width:${pct}%`, text: '★★★★★' }),
  ]);
}

const statusBadge = status =>
  h('span', { class: `badge badge--${status}`, text: STATUS_META[status].label });

const needChips = (ids, extra = '') =>
  h('span', { class: 'need-chips' }, ids.map(id =>
    h('span', { class: `need-chip ${extra}`, text: needLabel(id) })));

// ---- onboarding ----------------------------------------------------------

export function renderOnboarding(root) {
  let picked = new Set();

  const chipRow = h('div', { class: 'chip-grid' }, NEEDS.map(n => {
    const btn = h('button', {
      class: 'chip', type: 'button', 'aria-pressed': 'false',
      onclick: () => {
        picked.has(n.id) ? picked.delete(n.id) : picked.add(n.id);
        btn.setAttribute('aria-pressed', String(picked.has(n.id)));
        btn.classList.toggle('is-on', picked.has(n.id));
      },
    }, [h('span', { class: 'chip__icon', 'aria-hidden': 'true', text: n.icon }), n.label]);
    return btn;
  }));

  const name = h('input', {
    class: 'field', id: 'name-input', type: 'text',
    placeholder: 'e.g. Maya', autocomplete: 'given-name',
  });

  root.replaceChildren(
    h('div', { class: 'onboarding' }, [
      h('p', { class: 'eyebrow', text: DISTRICT }),
      h('h1', { text: 'Accessibility is not one number.' }),
      h('p', { class: 'lede', text: 'A café with a ramp can still be unusable if you are blind, and a touchscreen that shuts one person out is the reason another can order at all. So tell us how you get around, and every place in the district will be scored for you — not for an average person who does not exist.' }),

      h('label', { class: 'label', for: 'name-input', text: 'What should we call you?' }),
      name,

      h('p', { class: 'label', text: 'How do you get around?' }),
      h('p', { class: 'hint', text: 'Pick everything that applies. You can change this at any time, and nobody else sees it.' }),
      chipRow,

      h('div', { class: 'onboarding__actions' }, [
        h('button', {
          class: 'btn btn--primary', type: 'button', text: 'Create my profile',
          onclick: () => store.signIn(name.value, [...picked]),
        }),
        h('button', {
          class: 'btn btn--ghost', type: 'button', text: 'Look around without a profile',
          onclick: () => store.signIn('Guest', []),
        }),
      ]),
    ]),
  );
}

// ---- map screen ----------------------------------------------------------

let mapInstance = null;
let onlyWorkingForMe = false;

export function renderMapScreen(root, { onOpenVenue }) {
  const needs = store.getNeeds();
  const venues = store.allVenues();
  const score = v => scoreVenue(v, needs);

  if (!root.dataset.built) {
    root.replaceChildren(
      h('div', { class: 'map-wrap' }, [
        h('div', { id: 'map', class: 'map', role: 'application', 'aria-label': `Map of ${DISTRICT}` }),
        h('button', { class: 'map-reset', type: 'button', text: 'Reset view', onclick: () => mapInstance.reset() }),
        h('div', { class: 'map-legend' }, Object.entries(STATUS_META)
          .filter(([k]) => k !== 'sparse')
          .map(([k, m]) => h('span', { class: 'legend-item' }, [
            h('i', { style: `background:${m.pin}` }), m.label,
          ]))),
      ]),
      h('div', { class: 'list-pane', id: 'venue-list' }),
    );
    // The SVG element is replaced above, so build the map against the live node.
    mapInstance = createMap(root.querySelector('#map'), {
      onSelectVenue: id => onOpenVenue(id),
    });
    root.dataset.built = '1';
  }

  mapInstance.render(venues, score);

  const scored = venues.map(v => ({ v, r: score(v) }))
    .sort((a, b) => rank(b.r) - rank(a.r));

  const shown = onlyWorkingForMe
    ? scored.filter(({ r }) => r.status === 'good' || r.status === 'ok')
    : scored;

  const list = root.querySelector('#venue-list');
  list.replaceChildren(
    h('div', { class: 'list-head' }, [
      h('div', {}, [
        h('h2', { text: `${venues.length} places in ${DISTRICT}` }),
        h('p', { class: 'hint', text: needs.length
          ? `Scored for ${needs.map(needLabel).join(', ').toLowerCase()}`
          : 'No profile set — showing an average across every access need' }),
      ]),
      h('label', { class: 'switch' }, [
        h('input', {
          type: 'checkbox', checked: onlyWorkingForMe,
          onchange: e => { onlyWorkingForMe = e.target.checked; renderMapScreen(root, { onOpenVenue }); },
        }),
        h('span', { text: 'Only places that work for me' }),
      ]),
    ]),
    ...shown.map(({ v, r }) => venueCard(v, r, onOpenVenue)),
    shown.length === 0 ? h('p', { class: 'empty', text: 'Nothing here fully works for your profile yet. That is the point of the filter — it makes the gap visible.' }) : null,
  );
}

const rank = r => (r.status === 'blocked' ? -1 : r.stars ?? -0.5);

function venueCard(v, r, onOpenVenue) {
  return h('button', {
    class: 'vcard', type: 'button',
    onclick: () => onOpenVenue(v.id),
    onmouseenter: () => mapInstance?.setSelected(v.id),
    onfocus: () => mapInstance?.setSelected(v.id),
  }, [
    h('span', { class: 'vcard__icon', 'aria-hidden': 'true', text: CATEGORIES[v.category].icon }),
    h('span', { class: 'vcard__body' }, [
      h('span', { class: 'vcard__name', text: v.name }),
      h('span', { class: 'vcard__meta', text: `${CATEGORIES[v.category].label} · ${v.address}` }),
      h('span', { class: 'vcard__score' }, [
        r.stars !== null ? stars(r.stars) : null,
        r.stars !== null ? h('b', { text: r.stars.toFixed(1) }) : null,
        statusBadge(r.status),
      ]),
      r.stars === null ? h('span', { class: 'vcard__why', text: r.blocked
        ? r.blockers.map(b => b.text).join(' · ')
        : `Only ${r.coverage.known} of ${r.coverage.total} things are known — not enough to rate` }) : null,
    ]),
  ]);
}

// ---- venue detail --------------------------------------------------------

let detailMap = null;

export function renderVenueScreen(root, venueId, { onBack, rerender }) {
  const venue = store.venueById(venueId);
  if (!venue) { onBack(); return; }

  const needs = store.getNeeds();
  const r = scoreVenue(venue, needs);
  const cat = CATEGORIES[venue.category];

  const mapBox = h('div', { class: 'map map--detail', role: 'application', 'aria-label': `Map of ${venue.name} and its accessible features` });

  root.replaceChildren(
    h('div', { class: 'detail' }, [
      h('button', { class: 'btn btn--back', type: 'button', text: '← All places', onclick: onBack }),

      h('header', { class: 'detail__head' }, [
        h('p', { class: 'eyebrow', text: `${cat.icon} ${cat.label} · ${venue.address}` }),
        h('h1', { text: venue.name }),
        h('p', { class: 'lede', text: venue.blurb }),
      ]),

      scoreCard(r, needs),
      r.blocked ? blockerPanel(r) : null,

      section('Where exactly to go', [
        h('p', { class: 'hint', text: 'Tap a pin or a row to see precisely where it is. Entrances, toilets and lifts each have their own location — because “the building is accessible” is not directions.' }),
        h('div', { class: 'detail-map' }, [mapBox]),
        h('ul', { class: 'features' }, venue.features.map(f => featureRow(venue, f))),
      ]),

      staleSection(venue, r, rerender),
      section(`What matters to you${needs.length ? '' : ' (all needs)'}`, [
        h('p', { class: 'hint', text: 'Sorted by how much each one affects you. Things that are irrelevant to your profile are tucked away at the bottom.' }),
        h('ul', { class: 'rows' }, r.rows.filter(row => row.value).map(row => detailRow(row))),
      ]),

      gapsSection(venue, r, rerender),

      r.otherRows.length ? h('details', { class: 'other' }, [
        h('summary', { text: `Other details (${r.otherRows.length}) — not relevant to your profile` }),
        h('ul', { class: 'rows' }, r.otherRows.map(row => detailRow(row, true))),
      ]) : null,

      reviewsSection(venue, needs),
    ]),
  );

  detailMap?.destroy();
  detailMap = createMap(mapBox, {
    onSelectVenue: () => {},
    onSelectFeature: (_v, f) => focusFeature(f),
  });
  detailMap.render([venue], () => r);
  detailMap.setFocus(venue);
  // Open framed on the building AND all of its features, so the step-free
  // entrance around the corner is on screen from the start.
  detailMap.fitTo([venue, ...venue.features], 70);

  root.scrollTop = 0;
  window.scrollTo(0, 0);
}

function section(title, kids) {
  return h('section', { class: 'block' }, [h('h2', { text: title }), ...[].concat(kids)]);
}

function scoreCard(r, needs) {
  const worst = weakestNeed(r);
  return h('div', { class: `score-card score-card--${r.status}`, 'aria-live': 'polite' }, [
    h('div', { class: 'score-card__main' }, [
      h('div', { class: 'score-card__number' }, [
        r.stars === null ? h('span', { class: 'score-card__dash', text: '—' })
          : h('span', { class: 'score-card__value', text: r.stars.toFixed(1) }),
        h('span', { class: 'score-card__outof', text: '/ 5' }),
      ]),
      h('div', {}, [
        r.stars === null ? null : stars(r.stars),
        h('p', { class: 'score-card__label', text: r.blocked ? "You can't get in" : STATUS_META[r.status].label }),
        h('p', { class: 'score-card__for', text: needs.length
          ? `for ${needs.map(needLabel).join(' · ').toLowerCase()}`
          : 'averaged across every access need — set a profile for your own score' }),
      ]),
    ]),
    h('div', { class: 'coverage' }, [
      h('div', { class: 'coverage__bar' }, [
        h('span', { style: `width:${r.coverage.pct}%` }),
      ]),
      h('p', { class: 'coverage__text', text: `We know ${r.coverage.known} of ${r.coverage.total} things that matter to you (${r.coverage.pct}% covered). Anything unknown is counted as unknown, never as fine.` }),
    ]),
    worst && !r.blocked && worst.score < 0.6
      ? h('p', { class: 'score-card__note', text: `Weakest for you: ${needLabel(worst.id).toLowerCase()}.` })
      : null,
  ]);
}

function blockerPanel(r) {
  return h('div', { class: 'blockers' }, [
    h('h2', { text: r.blockers.length === 1 ? 'One thing stops you here' : `${r.blockers.length} things stop you here` }),
    h('p', { class: 'blockers__why', text: 'These are not low scores — they are hard stops, so no star rating is worth showing on its own.' }),
    h('ul', {}, r.blockers.map(b => h('li', {}, [
      h('b', { text: b.label + ': ' }), b.text,
      h('span', { class: 'need-chip need-chip--warn', text: `blocks ${needLabel(b.needId).toLowerCase()}` }),
    ]))),
  ]);
}

function focusFeature(f) {
  detailMap?.flyTo(f.lng, f.lat, 19);
  detailMap?.highlightFeature(f.name);
  document.querySelector('.detail-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function featureRow(venue, f) {
  const meta = FEATURE_KINDS[f.kind] ?? { label: f.kind, icon: '📍' };
  return h('li', { class: 'feature' }, [
    h('button', {
      class: 'feature__btn', type: 'button',
      onclick: () => focusFeature(f),
    }, [
      h('span', { class: 'feature__icon', 'aria-hidden': 'true', text: meta.icon }),
      h('span', {}, [
        h('span', { class: 'feature__name', text: f.name }),
        h('span', { class: 'feature__kind', text: meta.label }),
        h('span', { class: 'feature__detail', text: f.detail }),
        h('span', { class: 'feature__locate', text: 'Show me where ↗' }),
      ]),
    ]),
  ]);
}

function detailRow(row, muted = false) {
  return h('li', { class: `row row--${row.tone}${muted ? ' row--muted' : ''}` }, [
    h('span', { class: 'row__dot', 'aria-hidden': 'true' }),
    h('span', { class: 'row__body' }, [
      h('span', { class: 'row__label', text: row.label }),
      h('span', { class: 'row__value', text: row.text ?? 'Not known yet' }),
      h('span', { class: 'row__foot' }, [
        row.needs.length ? needChips(row.needs.map(n => n.id)) : null,
        row.verified ? h('span', { class: `row__verified${row.stale ? ' is-stale' : ''}`,
          text: `${sourceLabel(row.source)} · ${formatVerified(row.verified)}` }) : null,
      ]),
    ]),
  ]);
}

function staleSection(venue, r, rerender) {
  const stale = r.rows.filter(row => row.stale && row.value);
  if (!stale.length) return null;
  return h('div', { class: 'stale' }, [
    h('h2', { text: 'Is this still true?' }),
    h('p', { class: 'hint', text: 'Accessibility data rots. Lifts break, ramps get removed in refits. These facts have not been checked in over a year — if you are here, you can settle it in one tap.' }),
    ...stale.map(row => h('div', { class: 'stale__item' }, [
      h('p', {}, [h('b', { text: row.label + ': ' }), row.text]),
      h('p', { class: 'hint', text: formatVerified(row.verified) }),
      store.hasContributed(venue.id, row.attrId)
        ? h('p', { class: 'thanks', text: '✓ Thanks — re-confirmed just now.' })
        : h('div', { class: 'stale__actions' }, [
          h('button', { class: 'btn btn--small', type: 'button', text: 'Yes, still true',
            onclick: () => { store.confirm(venue.id, row.attrId); rerender(); } }),
          h('button', { class: 'btn btn--small btn--ghost', type: 'button', text: "No, it's changed",
            onclick: () => { document.querySelector('#gaps')?.scrollIntoView({ behavior: 'smooth' }); } }),
        ]),
    ])),
  ]);
}

function gapsSection(venue, r, rerender) {
  const gaps = r.rows.filter(row => !row.value).slice(0, 4);
  // Questions the user has already answered stay on screen as a receipt, rather
  // than silently vanishing the moment they are tapped.
  const answered = r.rows.filter(row => row.value && store.hasContributed(venue.id, row.attrId));
  if (!gaps.length && !answered.length) return null;

  return h('div', { class: 'gaps', id: 'gaps' }, [
    h('h2', { text: gaps.length ? 'Fill a gap in 5 seconds' : 'Thanks for filling the gaps' }),
    gaps.length ? h('p', { class: 'hint', text: 'One question, one tap. These are the unknowns that affect your profile most — answering changes your score immediately.' }) : null,
    ...answered.map(row => h('div', { class: 'gap' }, [
      h('p', { class: 'thanks', text: `✓ Thanks — you added “${ATTR_BY_ID[row.attrId].label}”.` }),
      h('p', { class: 'hint', text: row.text }),
    ])),
    ...gaps.map(row => {
      const attr = ATTR_BY_ID[row.attrId];
      return h('div', { class: 'gap' }, [
        h('p', { class: 'gap__q', text: attr.label + '?' }),
        h('div', { class: 'gap__opts' }, Object.entries(attr.values).map(([value, text]) =>
          h('button', {
            class: 'btn btn--small btn--outline', type: 'button', text,
            onclick: () => { store.contribute(venue.id, row.attrId, value); rerender(); },
          }))),
      ]);
    }),
  ]);
}

function reviewsSection(venue, needs) {
  const all = sortReviewsForProfile(reviewsFor(venue.id), needs);
  const mine = new Set(needs);

  return section(`Reviews (${all.length})`, [
    all.length
      ? h('p', { class: 'hint', text: 'Every review says who wrote it. Reviews from people who share your access needs are shown first — four stars means nothing until you know whose four stars it is.' })
      : h('p', { class: 'hint', text: 'No reviews yet.' }),
    h('ul', { class: 'reviews' }, all.map(rev => {
      const shared = rev.needs.filter(n => mine.has(n));
      return h('li', { class: `review${shared.length ? ' review--match' : ''}` }, [
        h('div', { class: 'review__head' }, [
          h('div', {}, [
            h('b', { text: rev.author }),
            needChips(rev.needs),
          ]),
          stars(rev.stars),
        ]),
        shared.length ? h('p', { class: 'review__match', text: `Shares your ${shared.map(needLabel).join(' and ').toLowerCase()}` }) : null,
        h('p', { class: 'review__body', text: rev.body }),
      ]);
    })),
  ]);
}

// ---- profile dialog ------------------------------------------------------

export function openProfileDialog() {
  const dlg = $('#profile-dialog');
  const account = store.getAccount();
  let picked = new Set(account?.needs ?? []);

  dlg.replaceChildren(
    h('form', { method: 'dialog', class: 'dialog' }, [
      h('h2', { text: 'Your access profile' }),
      h('p', { class: 'hint', text: 'Change this and every score on the map is recalculated for the new you. Same places, different map.' }),
      h('div', { class: 'chip-grid' }, NEEDS.map(n => {
        const btn = h('button', {
          class: `chip${picked.has(n.id) ? ' is-on' : ''}`, type: 'button',
          'aria-pressed': String(picked.has(n.id)),
          onclick: () => {
            picked.has(n.id) ? picked.delete(n.id) : picked.add(n.id);
            btn.setAttribute('aria-pressed', String(picked.has(n.id)));
            btn.classList.toggle('is-on', picked.has(n.id));
          },
        }, [h('span', { class: 'chip__icon', 'aria-hidden': 'true', text: n.icon }), n.label]);
        return btn;
      })),
      h('div', { class: 'dialog__actions' }, [
        h('button', { class: 'btn btn--ghost', type: 'button', text: 'Sign out',
          onclick: () => { dlg.close(); store.signOut(); } }),
        h('button', { class: 'btn btn--primary', type: 'button', text: 'Save profile',
          onclick: () => { store.setNeeds([...picked]); dlg.close(); } }),
      ]),
    ]),
  );
  dlg.showModal();
}

export function renderTopbar() {
  const account = store.getAccount();
  const btn = $('#profile-btn');
  if (!account) { btn.hidden = true; return; }
  btn.hidden = false;
  btn.replaceChildren(
    h('span', { class: 'avatar', 'aria-hidden': 'true', text: (account.name[0] ?? '?').toUpperCase() }),
    h('span', { class: 'profile-btn__text' }, [
      h('b', { text: account.name }),
      h('span', { text: account.needs.length ? account.needs.map(needLabel).join(' · ') : 'No needs set' }),
    ]),
    h('span', { 'aria-hidden': 'true', text: '▾' }),
  );
  btn.setAttribute('aria-label', `Your profile: ${account.name}. ${account.needs.map(n => NEED_BY_ID[n].label).join(', ') || 'No access needs set'}. Change profile.`);
}
