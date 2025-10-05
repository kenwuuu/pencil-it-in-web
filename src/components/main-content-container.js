import '../events/events-container.js';
import '../friends/friends-container.js';
import { createApp } from 'vue';
import ProfileVue from '../../vue-app/src/views/profile/profile.vue';

/** @customElement main-content-container */
class MainContentContainer extends HTMLElement {
  // noinspection JSUnusedGlobalSymbols
  connectedCallback() {
    this.innerHTML = `
      <events-container class="flex-1" x-show="page === 'events'"></events-container>
      <friends-container class="flex-1" x-show="page === 'friends'"></friends-container>
      <div id="vue-profile" class="flex-1" x-show="page === 'profile'"></div>
    `;

    // Mount Profile component
    requestAnimationFrame(() => {
      const mountPoint = this.querySelector('#vue-profile');
      if (mountPoint) {
        createApp(ProfileVue).mount(mountPoint);
      }
    });
  }
}

customElements.define('main-content-container', MainContentContainer);
