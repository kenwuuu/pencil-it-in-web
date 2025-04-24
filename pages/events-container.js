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
          <h1 x-text="capitalize(page)"></h1>
          <div class="events-agenda not-prose"></div>
        </div>
        <action-menu></action-menu>
      </div>
    `;
  }
}

customElements.define('events-container', EventsContainer);
