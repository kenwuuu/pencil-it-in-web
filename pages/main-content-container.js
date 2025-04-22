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
      >
        <h1>${title}</h1>
        <events-container x-show="page === 'events'"></events-container>
        <friends-container x-show="page === 'friends'"></friends-container>
        <profile-container x-show="page === 'profile'"></profile-container>
        <settings-container x-show="page === 'settings'"></settings-container>
      </div>
    `;
  }
}

customElements.define('main-content-container', MainContentContainer);
