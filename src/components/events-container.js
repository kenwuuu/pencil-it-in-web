class EventsContainer extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'Default Title';

    this.innerHTML = `
      <div
        id="events-container"
        class="prose"
        hx-get="src/mocks/events_data.html"
        hx-trigger="load"
        hx-target=".events-agenda"
      >
        <h1>${title}</h1>
        <div class="events-agenda not-prose"></div>
      </div>;
    `;
  }
}

customElements.define('events-container', EventsContainer);
