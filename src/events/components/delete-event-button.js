import { deleteEvent } from '@/events/services/delete-event.js';

class DeleteEventButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <button class="btn btn-outline btn-error" x-on:click="await window.deleteEventHandler(selectedEvent)">
          Delete Event
        </button>
      </div>
    `;
    queueMicrotask(() => Alpine.initTree(this));
  }
}

// Global event handler
window.deleteEventHandler = async function (eventId) {
  console.log(eventId);
  try {
    await deleteEvent(eventId);
  } catch (error) {
    alert('Failed to delete event. Please try again.');
  }
};

customElements.define('delete-event-button', DeleteEventButton);
