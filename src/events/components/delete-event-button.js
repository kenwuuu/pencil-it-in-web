class DeleteEventButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <button class="btn btn-outline btn-error" x-on:click="deleteEvent()">
        Delete Event
      </button>
    `;
    queueMicrotask(() => Alpine.initTree(this));
  }
}

// Alpine.js data function
function friendsData() {
  return {
    async deleteEvent(eventId) {
      try {
        // deleteEvent(eventId);
        console.log('eventid');
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    },
  };
}

window.friendsData = friendsData;

customElements.define('delete-event-button', DeleteEventButton);
