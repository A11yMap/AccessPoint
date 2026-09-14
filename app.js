// App shell: hash routing, and re-rendering whenever the profile changes.

import * as store from './store.js';
import {
  renderOnboarding, renderMapScreen, renderVenueScreen,
  renderTopbar, renderBrand, openProfileDialog,
} from './views.js';

const screens = {
  onboarding: document.querySelector('#screen-onboarding'),
  map: document.querySelector('#screen-map'),
  venue: document.querySelector('#screen-venue'),
};

document.querySelector('#profile-btn').addEventListener('click', openProfileDialog);

const goto = hash => { location.hash = hash; };
const show = name => {
  for (const [key, node] of Object.entries(screens)) node.hidden = key !== name;
};

function render() {
  renderBrand();
  renderTopbar();

  if (!store.isSignedIn()) {
    show('onboarding');
    renderOnboarding(screens.onboarding);
    return;
  }

  const match = location.hash.match(/^#\/v\/(.+)$/);
  if (match) {
    show('venue');
    renderVenueScreen(screens.venue, decodeURIComponent(match[1]), {
      onBack: () => goto('#/'),
      rerender: render,
    });
    return;
  }

  show('map');
  renderMapScreen(screens.map, {
    onOpenVenue: id => goto(`#/v/${encodeURIComponent(id)}`),
  });
}

window.addEventListener('hashchange', render);
store.subscribe(render);
render();
