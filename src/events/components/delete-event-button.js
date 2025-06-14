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
  const confirmed = confirm("Are you sure you want to delete this event?");
  if (!confirmed) return;

  const eventId = eventObj.id;
  console.log("Selected Event Object:", eventObj);
  console.log("Extracted Event ID:", eventId);

  try {
    await deleteEvent(eventId);
    alert('Event deleted successfully.');
    // Optionally close the modal here if needed
    const modal = document.querySelector("#eventDetailsModal");
    if (modal) modal.close();

    window.location.reload();
  } catch (error) {
    alert('Failed to delete event. Please try again.');
    console.error(error);
  }
};
customElements.define('delete-event-button', DeleteEventButton);