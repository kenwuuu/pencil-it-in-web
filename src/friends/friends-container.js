import './friends-action-menu.js';
import './friend-search-component.js';

class FriendsContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <main class="flex" x-data=" { is_searching_for_friends: false }">
        <div
          class="page-container flex-1"
          hx-get="src/friends/mock_data/friends.html"
          hx-trigger="load"
          hx-target=".friends-list"
        >
          <header class="my-4">
            <div class="flex">
              <div class="prose">
                <h1 x-text="capitalize(page)"></h1>
              </div>
              <friends-action-menu class="action-menu-header-component"></friends-action-menu>
            </div>
          </header>
          <section class="friends-list" x-show="!is_searching_for_friends"></section>
          <friend-search-component x-show="is_searching_for_friends"></friend-search-component>
        </div>
        <friends-action-menu class="action-menu-side-component" src="src/mock_data/action_menu/friends.html"></friends-action-menu>
      </main>
    `;
    }
}

customElements.define('friends-container', FriendsContainer);
