class EventsContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <div id="events-container" class="prose mt-10 mx-auto max-w-[60rem]">
        <h1>
            Upcoming Events
            <button
                hx-get="src/mocks/events_data.html"
                hx-trigger="click"
                hx-target=".events-agenda"
                class="btn btn-primary ml-6"
            >
                Get Events
            </button>
        </h1>
        <div class="events-agenda not-prose"></div>
      </div>
    `;
    }
}

customElements.define('events-container', EventsContainer);
