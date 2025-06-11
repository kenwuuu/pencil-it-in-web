class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header id="header" class="z-50">
        <div id="header-menu">
          <div class="navbar-start"></div>
          <div @click="page = 'events'" id="website-logo-container">
            <a  id="navbar-logo">pencil it in</a>
          </div>
          <div @click="page = 'profile'" id="navbar-user-icon" class="mr-4">
            <div
              tabindex="0"
              role="button"
              class="btn btn-ghost btn-circle avatar"
            >
              <div class="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  :src="$store.profile_photo.url"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('site-header', SiteHeader);
