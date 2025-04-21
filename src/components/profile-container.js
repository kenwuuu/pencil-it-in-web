class ProfileContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="prose">
      PROFILE
      </div>
    `;
  }
}

customElements.define('profile-container', ProfileContainer);
