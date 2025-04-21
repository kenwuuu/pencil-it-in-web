class SidebarMenu extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <ul class="menu menu-xl w-80 bg-base-200 lg:menu-vertical rounded-box">
        <li>
          <a id="menu-item-events" class="sidebar-menu-item">
          <span id="iconify-icon" class="iconify" data-icon="mdi-calendar"></span>
            Events
            <span class="badge badge-xs">99+</span>
          </a>
        </li>
        <li>
          <a id="menu-item-friends" class="sidebar-menu-item">
          <span id="iconify-icon" class="iconify" data-icon="mdi-account-group"></span>
            Friends
            <span class="badge badge-xs badge-warning">NEW REQUEST</span>
          </a>
        </li>
        <li>
          <a id="menu-item-profile" class="sidebar-menu-item  menu-active">
          <span id="iconify-icon" class="iconify" data-icon="mdi-user"></span>
            Profile
          </a>
        </li>
        <li>
          <a id="menu-item-settings" class="sidebar-menu-item">
          <span id="iconify-icon" class="iconify" data-icon="mdi-settings"></span>
            Settings
          </a>
        </li>
      </ul>
    `;
  }
}

customElements.define('sidebar-menu', SidebarMenu);
