import './friends-action-menu.js';
import './friend-search-component.js';

class FriendsContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <main class="flex" x-data=" { is_searching_for_friends: false }">
        <div
          class="page-container"
          hx-get="src/friends/mock_data/friends.html"
          hx-trigger="load"
          hx-target=".friends-list"
        >
          <header class="prose mb-6">
            <h1 x-text="capitalize(page)"></h1>
          </header>
          <section class="friends-list not-prose" x-show="!is_searching_for_friends"></section>
          <friend-search-component x-show="is_searching_for_friends"></friend-search-component>
        </div>
        <friends-action-menu src="src/mock_data/action_menu/friends.html"></friends-action-menu>
      </main>
    `;
    }
}

customElements.define('friends-container', FriendsContainer);
