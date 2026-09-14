// ---------------------------------------------------------------------------
// APP NAME — not chosen yet. Type it between the quotes and it appears
// everywhere: the tab title, the header and the welcome screen.
// While it is empty the header shows a dashed "name goes here" placeholder.
// ---------------------------------------------------------------------------
export const APP_NAME = '';

/** The district the sample venues sit in. */
export const DISTRICT = 'Bristol Harbourside';

/** Where the map opens. */
export const MAP_VIEW = {
  center: [-2.5966, 51.4496], // [lng, lat]
  zoom: 16,
  minZoom: 13,
  maxZoom: 19,
};

/**
 * Basemap: standard OpenStreetMap tiles — open data, open source, no API key.
 * Swap `tiles` for any other XYZ tile URL (and update the attribution) if you
 * later want a different cartographic style.
 */
export const BASEMAP = {
  tiles: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};
