import { deleteEvent } from '@/events/services/delete-event.js';

class DeleteEventButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div x-data>
        <!-- Delete Button -->
        <button class="btn btn-outline btn-error" @click="confirmDelete.showModal()">
          Delete Event
        </button>

        <!-- DaisyUI Modal -->
        <dialog id="confirmDelete" class="modal">
          <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">Are you sure you want to delete this event?</h3>
            <div class="flex justify-end gap-4">
              <form method="dialog">
                <button class="btn">No</button>
              </form>
              <form method="dialog">
                <button class="btn btn-error" @click="await window.deleteEventHandler(selectedEvent)">Yes</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    `;
    queueMicrotask(() => Alpine.initTree(this));
  }
}

window.deleteEventHandler = async function (eventObj) {
  const eventId = eventObj.id;

  try {
    await deleteEvent(eventId);
    window.location.reload(); // refresh events
  } catch (error) {
    alert('Failed to delete event. Please try again.');
    console.error(error);
  }
};

customElements.define('delete-event-button', DeleteEventButton);
