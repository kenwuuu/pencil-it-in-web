import 'iconify-icon';

class BottomMenu extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div class="dock">
          <button
            x-on:click="page = 'events'"
            id="bottom-menu-item-events" 
            x-bind:class="page === 'events' ? 'dock-active' : ''"
            >
          <iconify-icon icon="mdi:calendar"></iconify-icon>
          Events
          </button>
          <button
            x-on:click="page = 'friends'"
            id="bottom-menu-item-friends" 
            x-bind:class="page === 'friends' ? 'dock-active' : ''"
            >
          <iconify-icon icon="mdi:account-group"></iconify-icon>
          Friends
          </button>
          <button
            x-on:click="page = 'profile'"
            id="bottom-menu-item-profile" 
            x-bind:class="page === 'profile' ? 'dock-active' : ''"
            >
          <iconify-icon icon="mdi:user"></iconify-icon>
          Profile
          </button>
        </div>
    `;
  }
}

customElements.define('bottom-menu', BottomMenu);
