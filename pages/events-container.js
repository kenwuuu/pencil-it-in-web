import './page-components/action-menu/events.js';
import './create-event.js'

class EventsContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <div class="flex" 
      x-data=" { is_creating_new_event: false  }">
        <div
          class="prose page-container"
          hx-get="mocks/events_data.html"
          hx-trigger="load"
          hx-target=".events-agenda"
        >
          <div id="page-header" class="flex">
            <h1 x-text="capitalize(page)" class="flex-1"></h1>
            <div class="join">
              <button class="btn join-item">All Events</button>
              <button class="btn join-item">My Events</button>
            </div>
          </div>
          <div class="events-agenda not-prose" x-show="!is_creating_new_event"></div>
          <create-event x-show="is_creating_new_event"></create-event>
        </div>
        <events-action-menu 
            ></events-action-menu>
      </div>
    `;
    }
}

customElements.define('events-container', EventsContainer);
