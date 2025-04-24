import './page-components/action-menu.js';

class EventsContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="flex">
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
          <div class="events-agenda not-prose"></div>
        </div>
        <action-menu></action-menu>
      </div>
    `;
  }
}

customElements.define('events-container', EventsContainer);
