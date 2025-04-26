import './page-components/action-menu/events.js';

class FriendsContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <div class="flex">
        <div
          class="page-container"
          hx-get="mocks/friends.html"
          hx-trigger="load"
          hx-target=".friends-list"
        >
          <div class="prose mb-6">
            <h1 x-text="capitalize(page)"></h1>
          </div>
          <div class="friends-list not-prose"></div>
        </div>
        <action-menu src="mocks/action_menu/friends.html"></action-menu>
      </div>
    `;
    }
}

customElements.define('friends-container', FriendsContainer);
