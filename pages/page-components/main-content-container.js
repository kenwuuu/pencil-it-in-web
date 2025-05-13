import '../../src/events/events-container.js';
import '../../src/friends/friends-container.js';
import '../../src/profile/profile-container.js';
import '../../src/settings/settings-container.js';

class MainContentContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <events-container x-show="page === 'events'"></events-container>
      <friends-container x-show="page === 'friends'"></friends-container>
      <profile-container x-show="page === 'profile'"></profile-container>
      <settings-container x-show="page === 'settings'"></settings-container>
    `;
    }
}

customElements.define('main-content-container', MainContentContainer);
