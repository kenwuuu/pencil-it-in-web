import '../events/agenda_page/events-container.js';
import '../events/event_details_page/event-details-container.js';
import '../friends/friends-container.js';
import '../profile/profile-container.js';
import '../settings/settings-container.js';

class MainContentContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <events-container x-show="page === 'events'"></events-container>
      <event-details-container x-show="page === 'event-details'"></event-details-container>
      <friends-container x-show="page === 'friends'"></friends-container>
      <profile-container x-show="page === 'profile'"></profile-container>
      <settings-container x-show="page === 'settings'"></settings-container>
    `;
    }
}

customElements.define('main-content-container', MainContentContainer);
