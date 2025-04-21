class EventsContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="events-agenda not-prose"></div>
    `;
  }
}

customElements.define('events-container', EventsContainer);
