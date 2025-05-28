import '../events/events-container.js';
import '../friends/friends-container.js';
import '../profile/profile-container.js';
import '../settings/settings-container.js';
import '../../style.css'

class MainContentContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <p>another hello</p>
      <events-container class="flex-1" x-show="page === 'events'"></events-container>
      <friends-container class="flex-1" x-show="page === 'friends'"></friends-container>
      <profile-container class="flex-1" x-show="page === 'profile'"></profile-container>
      <settings-container class="flex-1" x-show="page === 'settings'"></settings-container>
    `;
    }
}

customElements.define('main-content-container', MainContentContainer);
