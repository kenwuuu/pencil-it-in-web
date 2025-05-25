class EventsActionMenu extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <div class="block xl:hidden">
        <button class="btn">Create Event</button>
    </div>
    <div class="hidden xl:block">
        <ul class="menu menu-xl w-80 bg-base-200 menu-vertical rounded-box"
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
