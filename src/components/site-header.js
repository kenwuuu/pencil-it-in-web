class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header id="header" class="z-50">
        <div id="header-menu">
          <div class="navbar-start"></div>
            <div @click="page = 'events'" id="website-logo-container">
              <a  id="navbar-logo">pencil it in</a>
            </div>
          <div class="mr-4 navbar-end">          
            <button class="btn mr-4" @click="window.location.replace('https://docs.google.com/forms/d/e/1FAIpQLSfjnL6Ho4kDSq3jjgtBZA0FJ1WmdAFMflnj7mvOfcKAfTA1zA/viewform')">
              <iconify-icon class="text-2xl" icon="mdi:spider" alt="Submit a bug report or feature request" title="Submit a bug report or feature request"></iconify-icon>
            </button>
            <div
              tabindex="0"
              role="button"
              class="btn btn-ghost btn-circle avatar"
              @click="page = 'profile'"
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
