import './friends-action-menu.js';
import './friends-search-bar.ts';
import {getUserFriends} from '@/friends/services/get-friends.js';
import {removeFriendship as apiRemoveFriendship} from "@/friends/services/remove-friend.js";

class FriendsContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <main class="flex">
            <div class="page-container flex-1">
                <header class="space-y-4 my-4 sm:flex">
                    <div class="prose flex-1 mb-4">
                        <h1 x-text="capitalize(page)"></h1>
                    </div>
                    <friends-search-bar class="max-w-full"></friends-search-bar>
                </header>

                <div x-data="friendsData()"> 
                    <ul id="friends-list" class="list bg-base-100 rounded-box shadow-md mt-4">
                        <li class="flex p-4 pb-2 text-xs opacity-60 tracking-wide">
                            Friends within 30 miles of you
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
                                        <span x-on:click="removeFriendship(friend.friend_id)" class="iconify text-error text-2xl" data-icon="mdi-close-box"></span>
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
        async init() {
            await this.loadFriends();
        }
    };
}

window.getCurrentDateTime = getCurrentDateTime;
window.friendsData = friendsData;

customElements.define('friends-container', FriendsContainer);
