class EventsActionMenu extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div class="block xl:hidden">
        <button class="btn btn-md"
        x-on:click=" is_creating_new_event = true ">
          <a data-testid="create-event-button">
            Create Event
          </a>
        </button>
    </div>
    <div class="hidden xl:block">
        <ul class="action-menu">
            <li x-on:click=" is_creating_new_event = true ">
                <a class="sidebar-menu-item" data-testid="create-event-button">
                    <iconify-icon icon="mdi:plus"></iconify-icon>
                    Create Event
                </a>
            </li>
        </ul>
    </div>
    
    `;
  }
}

customElements.define('events-action-menu', EventsActionMenu);
