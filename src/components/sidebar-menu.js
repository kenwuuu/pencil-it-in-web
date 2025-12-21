import { PAGES } from '../constants/pages.ts';

class SidebarMenu extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <ul class="menu menu-xl w-80 bg-base-200 lg:menu-vertical rounded-box">
        <li>
          <a 
          @click="page = '${PAGES.EVENTS}'"
          id="menu-item-events" 
          class="sidebar-menu-item"
          :class="page === '${PAGES.EVENTS}' ? 'menu-active' : ''"
          >
            <iconify-icon icon="mdi:calendar"></iconify-icon>
            Events
            <span class="badge badge-xs badge-info">2</span>
            <span class="badge badge-xs badge-warning">23</span>
          </a>
        </li>
        <li>
          <a 
          @click="page = '${PAGES.FRIENDS}'"
          data-testid="friends-menu-item"
          id="menu-item-friends" 
          class="sidebar-menu-item"
          :class="page === '${PAGES.FRIENDS}' ? 'menu-active' : ''"
          >
            <iconify-icon icon="mdi:account-group"></iconify-icon>
            Friends
            <span class="badge badge-xs badge-warning">NEW REQUEST</span>
          </a>
        </li>
        <li>
          <a 
          @click="page = '${PAGES.PROFILE}'"
          id="menu-item-profile" 
          class="sidebar-menu-item"
          :class="page === '${PAGES.PROFILE}' ? 'menu-active' : ''"
          >
            <iconify-icon icon="mdi:user"></iconify-icon>
            Profile
          </a>
        </li>
      </ul>
    `;
  }
}

customElements.define('sidebar-menu', SidebarMenu);
