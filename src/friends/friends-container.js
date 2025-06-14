import './friends-action-menu.js';
import { getUserFriends } from '@/friends/services/get-friends.js';
import { removeFriendship as apiRemoveFriendship } from '@/friends/services/remove-friend.js';
import { insertFriendship } from '@/friends/services/add-friend.js';

class FriendsContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <main class="flex">
            <div class="page-container flex-1" x-data="friendsData()">
                <header class="space-y-4 my-4 sm:flex">
                    <div class="prose flex-1 mb-4">
                        <h1 x-text="capitalize(page)"></h1>
                    </div>
                    <!--   Start Friend Search Bar   -->
                    <div class="max-w-full">
                        <div class="join min-w-full">
                          <input id="friend-input" x-ref="friendInput" x-on:keydown.enter="addFriend($refs.friendInput)" class="input input-md join-item" style="font-size: 16px" :disabled="isAddingFriend" placeholder="@xXdemonSlayerXx" autocomplete="first-name" />
                          <button id="add-friend-btn" x-on:click="addFriend($refs.friendInput)" class="btn btn-md join-item" :disabled="isAddingFriend">
                            <span x-show="!isAddingFriend">Add Friend</span>
                            <span x-show="isAddingFriend" class="flex items-center gap-2">
                              <span class="loading loading-spinner loading-sm"></span>
                              Adding...
                            </span>
                          </button>
                        </div>
                    </div>
                    <!--   End Friend Search Bar   -->
                </header>

                <div> 
                    <ul id="friends-list" class="list bg-base-100 rounded-box mt-4 outline-3 outline-base-300 dark:outline-slate-700">
                        <li class="flex p-4 pb-2 text-xs opacity-60 tracking-wide">
                            Friends within 30 miles of you
                        </li>

                        <li>
                          <hr class="border-t border-base-300 dark:border-slate-700 mx-4 my-2" />
                        </li>


                        <template x-for="friend in friends" :key="friend.friend_id">
                            <li class="list-row friend-row">
                                <div>
                                    <img class="size-10 md:size-12 rounded-box" :src="friend.profile_photo_url" />
                                </div>
                                <div>
                                    <div class="friend-name md:text-lg" x-text="friend.first_name + ' ' + friend.last_name"></div>
                                    <div class="friend-status text-xs font-semibold uppercase text-green-500"
                                        x-show="new Date(friend.wants_to_hang_end_time) > getCurrentDateTime()">
                                        Wants to hang!
                                    </div>
                                    <div class="friend-name text-xs font-semibold opacity-60" 
                                        x-show="!(new Date(friend.wants_to_hang_end_time) > getCurrentDateTime())"
                                        x-text="friend.username">
                                    </div>
                                </div>
                                <div class="flex items-center justify-center h-full">
                                  <div>
                                    <iconify-icon x-on:click="removeFriendship(friend.friend_id)" class="text-error text-2xl" icon="mdi:close-box"></iconify-icon>
                                  </div>
                                </div>
                            </li>
                        </template>
                    </ul>
                </div>
            </div>
            <friends-action-menu class="action-menu-side-component hidden xl:block" src="src/mock_data/action_menu/friends.html"></friends-action-menu>
        </main>
        `;

    // Re-init Alpine for dynamically injected content
    queueMicrotask(() => Alpine.initTree(this));
  }
}

function getCurrentDateTime() {
  const now = new Date();
  const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localNow;
}

// Alpine.js data function
function friendsData() {
  return {
    friends: [],
    isAddingFriend: false,
    async init() {
      await this.loadFriends();
    },
    async loadFriends() {
      try {
        const response = await getUserFriends();
        this.friends = response;
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    },
    async removeFriendship(friendId) {
      try {
        await apiRemoveFriendship(friendId);
        await this.loadFriends();
      } catch (err) {
        console.error('Error in AlpineJS removeFriendship:', err);
      }
    },
    async addFriend(input) {
      let username = input.value.trim();
      if (!username || this.isAddingFriend) return;

      this.isAddingFriend = true;

      try {
        await insertFriendship(username);
        input.value = '';
        await this.loadFriends();
      } catch (err) {
        console.error('Failed to add friend:', err);
        // Optionally show an error message to the user
      } finally {
        this.isAddingFriend = false;
      }
    },
  };
}

window.getCurrentDateTime = getCurrentDateTime;
window.friendsData = friendsData;

customElements.define('friends-container', FriendsContainer);
