import { deleteEvent } from '@/events/services/delete-event.js';

class DeleteEventButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <button class="btn btn-outline btn-error" x-on:click="await window.deleteEventHandler(selectedEvent)">
        Delete Event
      </button>
    `;
    queueMicrotask(() => Alpine.initTree(this));
  }
}

// Global event handler
window.deleteEventHandler = async function (eventObj) {
  const eventId = eventObj.id; // ✅ make sure this is the correct key (check console log below)
  console.log("Selected Event Object:", eventObj);
  console.log("Extracted Event ID:", eventId);

  try {
    await deleteEvent(eventId);
    // optionally close the modal or refresh event list here
    alert('Event deleted successfully.');
  } catch (error) {
    alert('Failed to delete event. Please try again.');
    console.error(error);
  }
};

customElements.define('delete-event-button', DeleteEventButton);
