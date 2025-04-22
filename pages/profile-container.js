class ProfileContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div
        class="prose"
      >
        <h1 x-text="capitalize(page)"></h1>
      </div>
    `;
  }
}

customElements.define('profile-container', ProfileContainer);
