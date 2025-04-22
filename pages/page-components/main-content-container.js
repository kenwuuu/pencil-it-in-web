import '../events-container.js';
import '../friends-container.js';
import '../profile-container.js';
import '../settings-container.js';

class MainContentContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <events-container x-show="page === 'events'" class="prose"></events-container>
      <friends-container x-show="page === 'friends'"></friends-container>
      <profile-container x-show="page === 'profile'"></profile-container>
      <settings-container x-show="page === 'settings'"></settings-container>
    `;
  }
}

customElements.define('main-content-container', MainContentContainer);
