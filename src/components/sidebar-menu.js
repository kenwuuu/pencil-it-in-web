class SidebarMenu extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <ul class="menu menu-xl w-80 bg-base-200 lg:menu-vertical rounded-box" x-data="{ current_page: window.location.pathname }">
        <li>
          <a 
          @click="page = 'events'"
          id="menu-item-events" 
          class="sidebar-menu-item"
          :class="page === 'events' ? 'menu-active' : ''"
          >
            <span id="iconify-icon" class="iconify" data-icon="mdi-calendar"></span>
            Events
            <span class="badge badge-xs badge-info">2</span>
            <span class="badge badge-xs badge-warning">23</span>
          </a>
        </li>
        <li>
          <a 
          @click="page = 'friends'"
          data-testid="friends-menu-item"
          id="menu-item-friends" 
          class="sidebar-menu-item"
          :class="page === 'friends' ? 'menu-active' : ''"
          >
            <span id="iconify-icon" class="iconify" data-icon="mdi-account-group"></span>
            Friends
            <span class="badge badge-xs badge-warning">NEW REQUEST</span>
          </a>
        </li>
        <li>
          <a 
          @click="page = 'profile'"
          id="menu-item-profile" 
          class="sidebar-menu-item"
          :class="page === 'profile' ? 'menu-active' : ''"
          >
            <span id="iconify-icon" class="iconify" data-icon="mdi-user"></span>
            Profile
          </a>
        </li>
        <li>
          <a 
          @click="page = 'settings'"
          id="menu-item-settings" 
          class="sidebar-menu-item"
          :class="page === 'settings' ? 'menu-active' : ''"
          >
            <span id="iconify-icon" class="iconify" data-icon="mdi-settings"></span>
            Settings
          </a>
        </li>
      </ul>
    `;
  }
}

customElements.define('sidebar-menu', SidebarMenu);
