class BottomMenu extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="dock" x-data="{ current_page: window.location.pathname }">
          <button
            x-on:click="page = 'events'"
            id="bottom-menu-item-events" 
            x-bind:class="page === 'events' ? 'dock-active' : ''"
            >
          <span id="iconify-icon" class="iconify" data-icon="mdi-calendar"></span>
          Events
          </button>
          <button
            x-on:click="page = 'friends'"
            id="bottom-menu-item-friends" 
            x-bind:class="page === 'friends' ? 'dock-active' : ''"
            >
          <span id="iconify-icon" class="iconify" data-icon="mdi-account-group"></span>
          Friends
          </button>
          <button
            x-on:click="page = 'profile'"
            id="bottom-menu-item-profile" 
            x-bind:class="page === 'profile' ? 'dock-active' : ''"
            >
          <span id="iconify-icon" class="iconify" data-icon="mdi-user"></span>
          Profile
          </button>
          <button
            x-on:click="page = 'settings'"
            id="bottom-menu-item-settings" 
            x-bind:class="page === 'settings' ? 'dock-active' : ''"
            >
          <span id="iconify-icon" class="iconify" data-icon="mdi-settings"></span>
          Settings
          </button>
        </div>
    `;
    }
}

customElements.define('bottom-menu', BottomMenu);
