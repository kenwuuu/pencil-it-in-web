import './friends-action-menu.js';
import './friends-search-bar.ts';
import {getUserFriends} from "@/friends/services/get-friends.js";

class FriendsContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <main class="flex">
        <div
          class="page-container flex-1"
        >
          <header class="space-y-4 my-4 sm:flex">
            <div class="prose flex-1 mb-4">
              <h1 x-text="capitalize(page)"></h1>
            </div>
            <friends-search-bar class="max-w-full"></friends-search-bar>
          </header>
<!-- todo add generated friend list -->
          
          <div x-data="{ friends: [] }" @htmx:afterOnLoad.window="friends = JSON.parse($event.detail.xhr.responseText)">          
            <ul id="friends-list" class="list bg-base-100 rounded-box shadow-md mt-4">
              <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">
                Friends within 30 miles of you
              </li>
          
              <template x-for="friend in friends" :key="friend.id">
                <li class="list-row friend_row">
                  <div>
                    <img class="size-10 md:size-12 rounded-box" :src="friend.avatar" />
                  </div>
                  <div>
                    <div class="md:text-lg" x-text="friend.name"></div>
                    <div class="text-xs text-green-500 uppercase font-semibold opacity-60" x-text="friend.status"></div>
                  </div>
                  <div class="friend-birthday badge badge-xs md:badge-lg badge-secondary" x-text="friend.birthday"></div>
                </li>
              </template>
            </ul>
          </div>

        </div>
        <friends-action-menu class="action-menu-side-component" src="src/mock_data/action_menu/friends.html" class="hidden xl:block"></friends-action-menu>
      </main>
    `;
    }
}

function selectFriendsListElements() {
    const friendsList = document.querySelector('#friends-list');
    const friendRow = document.querySelector('.friend-row');
    return {friendRow, friendsList};
}

function populateFriendsListWithFriends(friend, friendRowTemplate, friendsListTemplate) {

}

// on load: retrieves events from server and populates Agenda container with Event cards
document.addEventListener('DOMContentLoaded', async () => {
    let data = await getUserFriends();

    const {friendRow, friendsList} = selectFriendsListElements();

    data.forEach(friend => {
        populateFriendsListWithFriends(friend, friendRow, friendsList);
    });
});

customElements.define('friends-container', FriendsContainer);
