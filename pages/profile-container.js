class ProfileContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div
        class="prose page-container"
        hx-get="mocks/profile_data.html"
        hx-trigger="load"
        hx-target=".profile"
      >
        <div class="profile"></div>
      </div>
    `;
  }
}

customElements.define('profile-container', ProfileContainer);
