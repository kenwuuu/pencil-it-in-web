import {insertFriendship} from '@/friends/services/add-friend.js';

class FriendsSearchBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div class="join min-w-full">
      <input id="friend-input" class="input input-md join-item" placeholder="@xXdemonSlayerXx" autocomplete="first-name" />
      <button id="add-friend-btn" class="btn btn-md join-item">Add Friend</button>
    </div>
  `;

    const input = this.querySelector('#friend-input')! as HTMLInputElement;
    const button = this.querySelector('#add-friend-btn')! as HTMLButtonElement;

    button.addEventListener('click', () => {
      const username = input.value.trim();
      if (!username) return;

      insertFriendship(username)
        .then(() => {
          input.value = '';
          input.focus();
        })
        .catch((err: unknown) => {
          console.error('Failed to add friend:', err);
        });
    });
  }
}

customElements.define('friends-search-bar', FriendsSearchBar);
