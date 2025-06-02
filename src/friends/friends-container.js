import './friends-action-menu.js';
import './friends-search-bar.ts';

class FriendsContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <main class="flex">
        <div
          class="page-container flex-1"
          hx-get="src/friends/mock_data/friends.html"
          hx-trigger="load"
          hx-target=".friends-list"
        >
          <header class="space-y-4 my-4 sm:flex">
            <div class="prose flex-1 mb-4">
              <h1 x-text="capitalize(page)"></h1>
            </div>
            <friends-search-bar class="max-w-full"></friends-search-bar>
          </header>
          <section class="friends-list"></section>
        </div>
        <friends-action-menu class="action-menu-side-component" src="src/mock_data/action_menu/friends.html" class="hidden xl:block"></friends-action-menu>
      </main>
    `;
    }
}

customElements.define('friends-container', FriendsContainer);
