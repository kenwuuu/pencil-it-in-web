import './friends-action-menu.js';
import './friend-search-component.js';
import './friends-search-bar.ts';

class FriendsContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <main class="flex" x-data=" { is_searching_for_friends: false }">
        <div
          class="page-container flex-1"
          hx-get="./mock_data/friends.html"
          hx-trigger="load"
          hx-target=".friends-list"
        >
          <header class="mb-6 sm:flex">
            <div class="prose flex-1 mb-4">
              <h1 x-text="capitalize(page)"></h1>
            </div>
            <friends-search-bar class="max-w-full"></friends-search-bar>
          </header>
          <section class="friends-list" x-show="!is_searching_for_friends"></section>
          <friend-search-component x-show="is_searching_for_friends"></friend-search-component>
        </div>
        <friends-action-menu src="src/mock_data/action_menu/friends.html" class="hidden xl:block"></friends-action-menu>
      </main>
    `;
  }
}

customElements.define('friends-container', FriendsContainer);
