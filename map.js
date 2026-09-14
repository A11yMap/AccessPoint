// Real map: Leaflet over OpenStreetMap tiles.
//
// Deliberately raster + DOM tiles rather than a WebGL vector map. Tiles are
// plain <img> elements, so the map paints on any machine and in any embed with
// no GPU requirement — a blank map in front of an audience is not a risk worth
// taking for slightly crisper labels.
//
// Venue pins are coloured by how the place scores FOR THE CURRENT USER, so
// changing your access profile visibly repaints the neighbourhood.
//
// Feature pins (entrances, toilets, lifts, parking) sit at their own real
// coordinates — that is what lets the app point at the step-free door rather
// than at the middle of the building.

import { STATUS_META } from './scoring.js';
import { CATEGORIES, FEATURE_KINDS } from './data/venues.js';
import { BASEMAP, MAP_VIEW } from './config.js';

export function createMap(container, { onSelectVenue, onSelectFeature, interactive = true } = {}) {
  const L = window.L;
  if (!L) {
    container.innerHTML = '<p class="map-error">Map library did not load. Check your connection and reload.</p>';
    return stub();
  }

  const map = L.map(container, {
    center: [MAP_VIEW.center[1], MAP_VIEW.center[0]],
    zoom: Math.round(MAP_VIEW.zoom),
    minZoom: MAP_VIEW.minZoom,
    maxZoom: MAP_VIEW.maxZoom,
    zoomControl: false,
    dragging: interactive,
    scrollWheelZoom: interactive,
  });

  if (interactive) L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer(BASEMAP.tiles, {
    attribution: BASEMAP.attribution,
    maxZoom: MAP_VIEW.maxZoom,
    // detectRetina doubles the tile count; OSM throttles, so keep requests lean.
    detectRetina: false,
  }).addTo(map);

  // Leaflet measures its container on creation; if it has not been laid out yet
  // (or the pane is resized later) the tile grid is wrong, so keep them in step.
  const ro = new ResizeObserver(() => map.invalidateSize());
  ro.observe(container);
  // Layout can settle after creation (web fonts, late grid sizing, a hidden tab
  // becoming visible). Without this the tile grid is computed for the wrong box
  // and the map paints as a half-loaded strip.
  const nudges = [0, 120, 400, 1000].map(t => setTimeout(() => map.invalidateSize(), t));
  map.whenReady(() => map.invalidateSize());

  let venueMarkers = new Map();
  let featureMarkers = [];
  let selectedId = null;

  function pinIcon({ icon, colour, kind }) {
    const size = kind === 'venue' ? [34, 42] : [28, 34];
    return L.divIcon({
      className: '',
      html: `<span class="pin pin--${kind}" style="--pin-colour:${colour}">
               <span class="pin__dot"><span class="pin__icon">${icon}</span></span>
             </span>`,
      iconSize: size,
      iconAnchor: [size[0] / 2, size[1]],
    });
  }

  function clearFeatures() {
    for (const m of featureMarkers) m.remove();
    featureMarkers = [];
  }

  return {
    map,

    render(venues, scoreFn) {
      for (const m of venueMarkers.values()) m.remove();
      venueMarkers = new Map();

      for (const v of venues) {
        const { status } = scoreFn(v);
        const meta = STATUS_META[status];
        const marker = L.marker([v.lat, v.lng], {
          icon: pinIcon({ icon: CATEGORIES[v.category]?.icon ?? '\u{1F4CD}', colour: meta.pin, kind: 'venue' }),
          keyboard: true,
          title: `${v.name} — ${meta.label}`,
          alt: `${v.name} — ${meta.label}`,
          riseOnHover: true,
        }).addTo(map);
        marker.on('click', () => onSelectVenue?.(v.id));
        marker.on('keypress', e => {
          if (e.originalEvent?.key === 'Enter') onSelectVenue?.(v.id);
        });
        if (v.id === selectedId) marker.getElement()?.classList.add('is-selected');
        venueMarkers.set(v.id, marker);
      }
    },

    setSelected(id) {
      selectedId = id;
      for (const [vid, marker] of venueMarkers) {
        marker.getElement()?.classList.toggle('is-selected', vid === id);
      }
    },

    /** Drop a pin on every located feature of this venue. */
    setFocus(venue) {
      clearFeatures();
      if (!venue) return;
      for (const f of venue.features) {
        const meta = FEATURE_KINDS[f.kind] ?? { label: f.kind, icon: '\u{1F4CD}' };
        const marker = L.marker([f.lat, f.lng], {
          icon: pinIcon({ icon: meta.icon, colour: 'var(--feature-pin)', kind: 'feature' }),
          title: `${f.name} — ${venue.name}`,
          alt: `${f.name} — ${venue.name}`,
        }).addTo(map);
        marker.bindTooltip(f.name, { direction: 'top', offset: [0, -34] });
        marker.on('click', () => onSelectFeature?.(venue, f));
        marker.featureName = f.name;
        featureMarkers.push(marker);
      }
    },

    highlightFeature(name) {
      for (const m of featureMarkers) {
        const on = m.featureName === name;
        m.getElement()?.classList.toggle('is-selected', on);
        if (on) m.openTooltip();
      }
    },

    flyTo(lng, lat, zoom = 19) {
      map.flyTo([lat, lng], Math.min(zoom, MAP_VIEW.maxZoom), { duration: 0.9 });
    },

    fitTo(points, padding = 60) {
      if (!points.length) return;
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [padding, padding], maxZoom: 18, animate: false });
    },

    reset() {
      map.flyTo([MAP_VIEW.center[1], MAP_VIEW.center[0]], Math.round(MAP_VIEW.zoom), { duration: 0.9 });
    },
    resize() { map.invalidateSize(); },
    destroy() {
      clearFeatures();
      ro.disconnect();
      for (const id of nudges) clearTimeout(id);
      map.remove();
    },
  };
}

const noop = () => {};
const stub = () => ({
  render: noop, setSelected: noop, setFocus: noop, highlightFeature: noop,
  flyTo: noop, fitTo: noop, reset: noop, resize: noop, destroy: noop,
});
