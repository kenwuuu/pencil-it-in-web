class ProfileContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <div
        class="page-container"
        hx-get="mock_data/profile/profile_data.html"
        hx-trigger="load"
        hx-target=".profile"
      >
      <div class="flex-1 flex">
        <div class="profile"></div>
      </div>
    `;
    }
}

customElements.define('profile-container', ProfileContainer);
