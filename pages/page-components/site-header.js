class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header id="header" class="z-50">
        <!--  nav bar  -->
        <!--  todo turn this into a component -->
        <div id="header-menu">
          <div class="navbar-start"></div>
          <div id="website-logo-container">
            <a id="navbar-logo">pencil it in</a>
          </div>
          <div id="navbar-user-icon" class="mr-4">
            <div class="dropdown dropdown-end">
              <div
                tabindex="0"
                role="button"
                class="btn btn-ghost btn-circle avatar"
              >
                <div class="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabindex="0"
                class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a class="justify-between">
                    Profile
                    <span class="badge">New</span>
                  </a>
                </li>
                <li><a>Settings</a></li>
                <li><a>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('site-header', SiteHeader);
