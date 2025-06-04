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
              <iconify-icon icon="mdi:calendar-plus"></iconify-icon>
              Create Event
            </a>
          </li>
          <li>
            <a class="sidebar-menu-item">
              <iconify-icon icon="mdi:chat-plus"></iconify-icon>
              Create Chat
            </a>
          </li>
          <li>
            <a class="sidebar-menu-item">
              <iconify-icon icon="mdi:account-plus"></iconify-icon>
              New Requests
            </a>
          </li>
          <li x-on:click=" is_searching_for_friends = true ">
            <a class="sidebar-menu-item">
              <iconify-icon icon="mdi:search"></iconify-icon>
              Search
            </a>
          </li>
        </ul>
    </div>
    
    `;
    }
}

customElements.define('friends-action-menu', FriendsActionMenu);
