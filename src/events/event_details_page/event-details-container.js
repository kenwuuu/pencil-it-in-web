import '../agenda_page/events-action-menu.js';

class EventDetailsContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="flex" 
          x-data=" { is_creating_new_event: false  }">
          <div
            class="prose page-container"
            hx-trigger="load"
            hx-target=".events-agenda"
            >
            <div id="page-header" class="flex">
              <h1 x-text="capitalize(page)" class="flex-1"></h1>
            </div>

            <create-event x-show="is_creating_new_event"></create-event>
          </div>
          <events-action-menu></events-action-menu>
        </div>
    `;
    }
}


customElements.define('event-details-container', EventDetailsContainer);
