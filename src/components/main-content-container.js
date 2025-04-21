import './events-container.js';
import './friends-container.js';
import './profile-container.js';
import './settings-container.js';

class MainContentContainer extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'Default Title';

    this.innerHTML = `
      <div
        id="events-container"
        class="prose"
        hx-get="src/mocks/events_data.html"
        hx-trigger="load"
        hx-target=".events-agenda"
        x-data="{ path: window.location.pathname }"
      >
        <h1>${title}</h1>
        <events-container x-show="path === '/events.html'"></events-container>
        <friends-container x-show="path === '/friends.html'"></friends-container>
        <profile-container x-show="path === '/profile.html'"></profile-container>
        <settings-container x-show="path === '/settings.html'"></settings-container>
      </div>
    `;
  }
}

customElements.define('main-content-container', MainContentContainer);
