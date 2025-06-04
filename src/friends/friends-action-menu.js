class FriendsActionMenu extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <div class="block xl:hidden">
        <button class="btn">Add Friend</button>
    </div>
    <div class="hidden xl:block">
        <ul class="action-menu">
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
    </div>
    
    `;
    }
}

customElements.define('friends-action-menu', FriendsActionMenu);
