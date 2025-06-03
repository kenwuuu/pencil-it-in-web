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
        <ul class="action-menu"
        x-data="{ current_page: window.location.pathname }">
            <li x-on:click=" is_creating_new_event = true ">
                <a class="sidebar-menu-item">
                    <span class="iconify" data-icon="mdi-plus"></span>
                    Create Event
                </a>
            </li>
        </ul>
    </div>
    
    `;
    }
}

customElements.define('events-action-menu', EventsActionMenu);
