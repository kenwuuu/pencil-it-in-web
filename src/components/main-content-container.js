import '../events/events-container.js';
import '../friends/friends-container.js';
import '../profile/profile-container.js';

/** @customElement main-content-container */
class MainContentContainer extends HTMLElement {
  // noinspection JSUnusedGlobalSymbols
  connectedCallback() {
    this.innerHTML = `
      <events-container class="flex-1" x-show="page === 'events'"></events-container>
      <friends-container class="flex-1" x-show="page === 'friends'"></friends-container>
      <profile-container class="flex-1" x-show="page === 'profile'"></profile-container>
    `;
  }
}

customElements.define('main-content-container', MainContentContainer);
