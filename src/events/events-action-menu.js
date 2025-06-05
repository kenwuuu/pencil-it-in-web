class EventsActionMenu extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <div class="block xl:hidden">
        <button class="btn btn-md"
        x-on:click=" is_creating_new_event = true ">
          Create Event
        </button>
    </div>
    <div class="hidden xl:block">
        <ul class="action-menu">
            <li x-on:click=" is_creating_new_event = true ">
                <a class="sidebar-menu-item">
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
