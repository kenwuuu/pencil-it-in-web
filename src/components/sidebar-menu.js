class SidebarMenu extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <ul class="menu menu-xl w-80 bg-base-200 lg:menu-vertical rounded-box">
        <li>
          <a 
          @click="page = 'events'"
          id="menu-item-events" 
          class="sidebar-menu-item"
          :class="page === 'events' ? 'menu-active' : ''"
          >
            <iconify-icon icon="mdi:calendar"></iconify-icon>
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
            <iconify-icon icon="mdi:account-group"></iconify-icon>
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
            <iconify-icon icon="mdi:user"></iconify-icon>
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
            <iconify-icon icon="mdi:settings"></iconify-icon>
            Settings
          </a>
        </li>
      </ul>
    `;
    }
}

customElements.define('sidebar-menu', SidebarMenu);
