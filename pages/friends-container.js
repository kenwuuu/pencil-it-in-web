class FriendsContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="prose">
      FRIENDS
      </div>
    `;
  }
}

customElements.define('friends-container', FriendsContainer);
