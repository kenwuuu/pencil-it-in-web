class EventsActionMenu extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <ul class="menu menu-xl w-80 bg-base-200 lg:menu-vertical rounded-box"
    x-data="{ current_page: window.location.pathname }">
        <li x-on:click=" is_creating_new_event = true ">
            <a class="sidebar-menu-item">
                <span class="iconify" data-icon="mdi-plus"></span>
                Create Event
            </a>
        </li>
    </ul>
    `;
    }
}

customElements.define('events-action-menu', EventsActionMenu);
