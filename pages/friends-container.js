import './page-components/action-menu/friends.js';

class FriendsContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <div class="flex">
        <div
          class="page-container"
          hx-get="mock_data/friends.html"
          hx-trigger="load"
          hx-target=".friends-list"
        >
          <div class="prose mb-6">
            <h1 x-text="capitalize(page)"></h1>
          </div>
          <div class="friends-list not-prose"></div>
        </div>
        <friends-action-menu src="mock_data/action_menu/friends.html"></friends-action-menu>
      </div>
    `;
    }
}

customElements.define('friends-container', FriendsContainer);
