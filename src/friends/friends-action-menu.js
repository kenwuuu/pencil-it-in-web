class FriendsActionMenu extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <ul
      class="menu menu-xl w-80 bg-base-200 lg:menu-vertical rounded-box"
      x-data="{ current_page: window.location.pathname }"
    >
      <li>
        <a class="sidebar-menu-item">
          <span class="iconify" data-icon="mdi-calendar-plus"></span>
          Create Event
        </a>
      </li>
      <li>
        <a class="sidebar-menu-item">
          <span class="iconify" data-icon="mdi-chat-plus"></span>
          Create Chat
        </a>
      </li>
      <li>
        <a class="sidebar-menu-item">
          <span class="iconify" data-icon="mdi-account-plus"></span>
          New Requests
        </a>
      </li>
      <li x-on:click=" is_searching_for_friends = true ">
        <a class="sidebar-menu-item">
          <span class="iconify" data-icon="mdi-search"></span>
          Search
        </a>
      </li>
    </ul>
    `;
    }
}

customElements.define('friends-action-menu', FriendsActionMenu);
