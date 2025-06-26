import './delete-event-button.js';

class EventDetailsModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="modal" :class="{ 'modal-open': showEventDetailsModal }" x-show="showEventDetailsModal">
        <div class="modal-box max-h-[75%] max-w-2xl">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-2xl" x-text="selectedEvent.title"></h3>
            <div class="dropdown dropdown-end">
              <button tabindex="0" class="btn btn-sm btn-ghost text-xl">
                <iconify-icon icon="mdi:dots-horizontal"></iconify-icon>
              </button>
              <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
                <li><button @click="showReportModal = true">Report</button></li>
              </ul>
            </div>
          </div>
          <p class="text-sm mb-2" x-text="'Location: ' + selectedEvent.location"></p>
          <p class="text-sm mb-1" x-text="'Date: ' + formatDate(selectedEvent.start_time)"></p>
          <p class="text-sm mb-4" x-text="'Time: ' + formatTime(selectedEvent.start_time)"></p>
          <p class="mb-4" x-text="selectedEvent.description || 'No description provided.'"></p>
          <div class="flex gap-4">
            <delete-event-button class="ml-auto" x-show="selectedEvent?.host && selectedEvent.host.user_id === $store.userId"></delete-event-button>
            <button class="btn" x-on:click="closeEventDetailsModal()">Close</button>
          </div>
        </div>
        <div class="modal-backdrop" x-on:click="closeEventDetailsModal()"></div>
      </div>

      <!-- Report Modal -->
      <div class="modal" :class="{ 'modal-open': showReportModal }" x-show="showReportModal">
        <div class="modal-box max-w-md">
          <h3 class="font-bold text-lg mb-2">Report Event</h3>
          <textarea class="textarea textarea-bordered w-full mb-4" rows="4"
            placeholder="Describe the issue..." x-model="reportText"></textarea>
          <div class="flex justify-end gap-2">
            <button class="btn btn-outline" @click="showReportModal = false">Cancel</button>
            <button class="btn btn-error" @click="submitReport()">Submit</button>
          </div>
        </div>
        <div class="modal-backdrop" @click="showReportModal = false"></div>
      </div>
    `;
  }
}

customElements.define('event-details-modal', EventDetailsModal);
