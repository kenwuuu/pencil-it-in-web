import 'iconify-icon';

class BottomMenu extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div class="dock">
          <button
            aria-label="events"
            x-on:click="page = 'events'"
            id="bottom-menu-item-events" 
            x-bind:class="page === 'events' ? 'dock-active' : ''"
            >
          <iconify-icon class="text-2xl" icon="mdi:calendar"></iconify-icon>
          </button>
          <button
            aria-label="friends"
            x-on:click="page = 'friends'"
            id="bottom-menu-item-friends" 
            x-bind:class="page === 'friends' ? 'dock-active' : ''"
            >
          <iconify-icon class="text-2xl" icon="mdi:account-group"></iconify-icon>
          </button>
          <button
            aria-label="profile"
            x-on:click="page = 'profile'"
            id="bottom-menu-item-profile" 
            x-bind:class="page === 'profile' ? 'dock-active' : ''"
            >
          <iconify-icon class="text-2xl" icon="mdi:user"></iconify-icon>
          </button>
        </div>
    `;
  }
}

customElements.define('bottom-menu', BottomMenu);
