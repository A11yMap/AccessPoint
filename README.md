# Accessibility map — concept prototype

> **The app has no name yet.** Open `js/config.js`, put one in `APP_NAME`, and it
> appears in the header, the tab title and the welcome screen. Until then the
> header shows a dashed *"Your app name"* slot.

An accessibility map where **the score is calculated for you, not for the place.**

## The idea

Every existing accessibility app collapses access into one wheelchair icon. But a
café with a ramp and wide aisles can be unusable for an autistic visitor (loud,
bright) or a blind visitor (touchscreen-only ordering). A single "4.2★ accessible"
rating is noise.

So this app stores plain **facts** about places, and works out what each fact
means **for the person looking**. You set your access needs once; every place is
then scored out of 5 against *your* profile.

Café Luna, the same café, from the sample data:

| Your profile   | Score | Why |
|----------------|-------|-----|
| Wheelchair user| 4.6 / 5 | Level entrance, wide doors, real accessible toilet |
| Non-speaking   | 4.3 / 5 | You can order on the touchscreen without speaking |
| Blind          | 2.7 / 5 | That same touchscreen has no audio and no headphone jack |

One fact, opposite signs. That is the whole thesis, and it is why the details list
is **sorted by relevance to you** — what affects you is at the top, what does not
is collapsed at the bottom.

### Three other things it does differently

1. **Hard blockers, not low averages.** One 15cm step is not "92% accessible" to a
   wheelchair user — it is *cannot enter*. Places with a blocker show no star
   rating at all, just what stops you. See The Anchor Inn.
2. **Coverage is shown, never hidden.** "We know 6 of 22 things that matter to
   you." An unknown is counted as unknown, never quietly as a pass. Below 50%
   coverage no score is shown at all. See The Tin Whistle.
3. **Places are pins *plus located features*.** Every entrance, toilet, lift and
   parking bay has its own coordinates, so the app points at the step-free door
   round the side — not at the middle of the building. See Harbour Museum.

Reviews are stamped with the reviewer's own access needs, and reviews from people
who share your needs float to the top. "4 stars" means nothing until you know
whose 4 stars it is.

## Running it

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>. No build step, no npm, no backend.

To get one file you can upload anywhere:

```bash
python3 build.py
```

That writes `accessibility-map.html` — the whole app inlined into a single file.
It needs an internet connection for the map tiles and the Leaflet library.

## The data is sample data

The venues, their accessibility facts and the reviews are **invented**. The map,
the streets and the coordinates are real (Bristol Harbourside), so distances and
directions make sense — but the businesses do not exist. Positions are
approximate; this is a concept mockup.

The 12 sample places deliberately span the full range: two excellent, several
mixed, two blocked by their own front door, one with almost no data.

## Files

| File | What it does |
|------|--------------|
| `js/config.js` | **App name**, district, map centre, tile source |
| `js/data/attributes.js` | The registry: what each fact *means* per access need — weights, ratings, blockers. The core of the app. |
| `js/data/venues.js` | Sample venues, their facts, and their located features |
| `js/data/reviews.js` | Sample reviews, each with the reviewer's access needs |
| `js/scoring.js` | Blockers, profile-weighted score out of 5, coverage |
| `js/map.js` | Leaflet + OpenStreetMap; pins coloured by *your* score |
| `js/views.js` | Screens: welcome, map, venue detail, contribute, reviews |
| `js/store.js` | Profile and contributions (localStorage — no server) |
| `build.py` | Bundles everything into one publishable .html |

## Adding an access need or a fact

Both are data, not code. Add an entry to `NEEDS` in `js/data/needs.js`, then give
existing attributes a `needs` entry for it — a weight (0–10), a rating per possible
value, and optionally `gate` values that block. Scoring, filtering, the map
colours and the sorted detail list all pick it up automatically.

## Not built yet

Real accessibility data or an OpenStreetMap import; a backend, accounts or
moderation; photo upload; routing to the accessible entrance; the mobile app.
