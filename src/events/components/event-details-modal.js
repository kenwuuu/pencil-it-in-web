import './delete-event-button.js';

class EventDetailsModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="modal" :class="{ 'modal-open': showEventDetailsModal }" x-show="showEventDetailsModal">
        <div class="modal-box max-h-[75%] max-w-2xl">
          <h3 class="font-bold text-2xl mb-2" x-text="selectedEvent.title"></h3>
          <p class="text-sm mb-1" x-text="'Date: ' + formatDate(selectedEvent.start_time)"></p>
          <p class="text-sm mb-4" x-text="'Time: ' + formatTime(selectedEvent.start_time)"></p>
          <p class="mb-4" x-text="selectedEvent.description || 'No description provided.'"></p>
          <delete-event-button x-show="selectedEvent.host[0].user_id === $store.userId"></delete-event-button>
          <button class="btn" x-on:click="closeEventDetailsModal()">Close</button>
        </div>
        <div class="modal-backdrop" x-on:click="closeEventDetailsModal()"></div>
      </div>
    `;
  }
}

customElements.define('event-details-modal', EventDetailsModal);
