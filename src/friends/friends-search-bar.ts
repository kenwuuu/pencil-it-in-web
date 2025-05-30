class FriendsSearchBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="join">
        <input class="input input-lg sm:input-md join-item" placeholder="@xXdemonSlayerXx" autocomplete="first-name" />
        <button class="btn btn-lg sm:btn-md join-item ">Add Friend</button>
      </div>
    `;
  }
}

customElements.define('friends-search-bar', FriendsSearchBar);
