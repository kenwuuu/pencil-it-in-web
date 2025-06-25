import './events-action-menu.js';
import './event-creator/event-creation-component.js';
import '@/events/events-feed/services/get-upcoming-events.js';
import './events-feed/components/participants-modal.js';
import './events-feed/components/events-feed.js';
import './events-feed/components/event-details-modal.js';
import { format, parseISO } from 'date-fns';
import { getUpcomingEvents } from '@/events/events-feed/services/get-upcoming-events.js';
import { downloadICS } from '@/events/events-feed/services/calendar.js';
import { updateAttendanceStatus as updateAttendanceStatusAPI } from '@/events/events-feed/services/update-attendance-status.js';
import { supabase } from '@/supabase-client/supabase-client.js';

class EventsContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div class="flex" x-data="eventsData()">
          <div class="page-container flex-1">
            <header class="space-y-4 my-4" x-show="!is_creating_new_event">
<!--              title row -->
              <div class="flex">
                <div class="prose">
                  <h1 x-text="capitalize(page)"></h1>
                </div>
                <div class="ml-auto flex">
                  <button class="btn text-2xl mr-2" @click="loadEvents()">
                    <iconify-icon icon="mdi:refresh"></iconify-icon>
                  </button>
                  <events-action-menu class="action-menu-header-component"></events-action-menu>
                </div>
              </div>
<!--              filter row -->
              <div class="join mb-4 w-full">
                <button class="btn join-item flex-1">All Events</button>
                <button class="btn join-item flex-1">My Events</button>
              </div>
            </header>
            
            <events-feed></events-feed>
            <event-creation-component class="flex-1" x-show="is_creating_new_event"></event-creation-component>
          </div>
          <events-action-menu class="action-menu-side-component"></events-action-menu>

          <!-- Participants Modal -->
          <event-details-modal></event-details-modal>
          <participants-modal></participants-modal>
        </div>
    `;

    // Add event listeners for event creation
    this.addEventListener('cancel-event-creation', () => {
      // Access Alpine data and close creation form
      Alpine.store('eventsData')
        ? (Alpine.store('eventsData').is_creating_new_event = false)
        : null;
      // Or if using component-level data:
      this._x_dataStack &&
        this._x_dataStack[0] &&
        (this._x_dataStack[0].is_creating_new_event = false);
    });

    this.addEventListener('event-created-successfully', async event => {
      // Access Alpine data, reload events, and close creation form
      const alpineData = this._x_dataStack && this._x_dataStack[0];
      if (alpineData) {
        alpineData.is_creating_new_event = false;
        await alpineData.loadEvents();
      }
    });

    // Re-init Alpine for dynamically injected content
    queueMicrotask(() => Alpine.initTree(this));
  }
}

// Alpine.js data function
function eventsData() {
  return {
    events: [],
    is_creating_new_event: false,
    showEventDetailsModal: false,
    showParticipantsModal: false,
    selectedEvent: null,
    activeParticipantTab: 'all',
    showToast: false,
    toastMessage: '',
    toastType: 'success', // 'success', 'error', or 'info'
    toastTimeout: null,

    init() {
      this.loadEvents();

      // Listen for custom events
      this.$el.addEventListener('cancel-event-creation', () => {
        this.is_creating_new_event = false;
      });

      this.$el.addEventListener('event-created-successfully', async () => {
        this.is_creating_new_event = false;
        await this.loadEvents();
      });

      // Listen for the 'friend-added' event and refresh events
      window.addEventListener('friend-list-changed', async () => {
        await this.loadEvents();
      });
    },

    showToastNotification(message, type = 'success') {
      // Clear any existing timeout
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }

      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;

      // Auto-hide after 4 seconds
      this.toastTimeout = setTimeout(() => {
        this.hideToast();
      }, 4000);
    },

    hideToast() {
      this.showToast = false;
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
        this.toastTimeout = null;
      }
    },

    async loadEvents() {
      try {
        const data = await getUpcomingEvents();
        this.events = data;
      } catch (error) {
        console.error('Error fetching events:', error);
        this.showToastNotification(
          'Failed to load events. Please refresh the page.',
          'error',
        );
      }
    },

    openEventDetailsModal(event) {
      this.selectedEvent = event;
      this.showEventDetailsModal = true;
    },

    closeEventDetailsModal() {
      this.selectedEvent = null;
      this.showEventDetailsModal = false;
    },

    openParticipantsModal(event) {
      this.selectedEvent = event;
      this.showParticipantsModal = true;
      this.activeParticipantTab = 'all';
    },

    closeParticipantsModal() {
      this.selectedEvent = null;
      this.showParticipantsModal = false;
    },

    getDropdownLabel() {
      switch (this.activeParticipantTab) {
        case 'all':
          return `All (${this.selectedEvent?.participants?.length || 0})`;
        case 'yes':
          return `Yes (${this.getParticipantsByStatus('yes').length})`;
        case 'maybe':
          return `Maybe (${this.getParticipantsByStatus('maybe').length})`;
        case 'no':
          return `No (${this.getParticipantsByStatus('no').length})`;
        case 'invited':
          return `Invited (${this.getParticipantsByStatus('invited').length})`;
        default:
          return 'All';
      }
    },

    getFilteredParticipants() {
      if (!this.selectedEvent || !this.selectedEvent.participants) {
        return [];
      }

      let participants;
      if (this.activeParticipantTab === 'all') {
        participants = this.selectedEvent.participants;
      } else {
        participants = this.selectedEvent.participants.filter(participant => {
          const attendanceStatus = participant.attendance_answer || 'invited';
          return attendanceStatus === this.activeParticipantTab;
        });
      }

      // Sort alphabetically by first name
      return participants.sort((a, b) => {
        const nameA = (a.first_name || '').toLowerCase();
        const nameB = (b.first_name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    },

    getParticipantsByStatus(status) {
      if (!this.selectedEvent || !this.selectedEvent.participants) {
        return [];
      }

      return this.selectedEvent.participants.filter(participant => {
        const attendanceStatus = participant.attendance_answer || 'invited';
        return attendanceStatus === status;
      });
    },

    async updateAttendanceStatus(eventId, attendanceStatus) {
      const event = this.events.find(e => e.id === eventId);
      if (!event) return;

      const currentUserId = (await supabase.auth.getUser()).data.user.id; // Replace with actual current user ID

      // Find current user in participants
      const currentUserParticipant = event.participants?.find(
        p => p.user_id === currentUserId,
      );
      const currentStatus =
        currentUserParticipant?.attendance_answer || 'invited';

      // Don't do anything if clicking the same status
      if (currentStatus === attendanceStatus) return;

      // Store original counts for rollback
      const originalCounts = {
        yes: event.attendance_yes_count || 0,
        maybe: event.attendance_maybe_count || 0,
        no: event.attendance_no_count || 0,
        invited: event.attendance_invited_count || 0,
      };

      // Optimistically update counts
      this.updateCountsOptimistically(event, currentStatus, attendanceStatus);

      // Update participant's status optimistically
      if (currentUserParticipant) {
        currentUserParticipant.attendance_answer = attendanceStatus;
      }

      try {
        // Call updateAttendanceStatus API function
        await updateAttendanceStatusAPI(eventId, attendanceStatus);
      } catch (error) {
        console.error('Error updating attendance status:', error);

        // Rollback on failure
        event.attendance_yes_count = originalCounts.yes;
        event.attendance_maybe_count = originalCounts.maybe;
        event.attendance_no_count = originalCounts.no;
        event.attendance_invited_count = originalCounts.invited;

        // Rollback participant status
        if (currentUserParticipant) {
          currentUserParticipant.attendance_answer = currentStatus;
        }

        // Optionally show user feedback
        // this.showErrorMessage('Failed to update attendance. Please try again.');
      }
    },

    updateCountsOptimistically(event, oldStatus, newStatus) {
      // Remove from old status count
      if (oldStatus === 'yes')
        event.attendance_yes_count = Math.max(
          0,
          (event.attendance_yes_count || 0) - 1,
        );
      if (oldStatus === 'maybe')
        event.attendance_maybe_count = Math.max(
          0,
          (event.attendance_maybe_count || 0) - 1,
        );
      if (oldStatus === 'no')
        event.attendance_no_count = Math.max(
          0,
          (event.attendance_no_count || 0) - 1,
        );
      if (oldStatus === 'invited')
        event.attendance_invited_count = Math.max(
          0,
          (event.attendance_invited_count || 0) - 1,
        );

      // Add to new status count
      if (newStatus === 'yes')
        event.attendance_yes_count = (event.attendance_yes_count || 0) + 1;
      if (newStatus === 'maybe')
        event.attendance_maybe_count = (event.attendance_maybe_count || 0) + 1;
      if (newStatus === 'no')
        event.attendance_no_count = (event.attendance_no_count || 0) + 1;
      if (newStatus === 'invited')
        event.attendance_invited_count =
          (event.attendance_invited_count || 0) + 1;
    },

    formatDate(dateString) {
      const date = parseISO(dateString);
      return format(date, 'MMMM do, yyyy'); // e.g., April 20th, 2025
    },

    formatTime(dateString) {
      const date = parseISO(dateString);
      return format(date, 'h:mmaaa').toLowerCase(); // e.g., 11:00pm
    },

    downloadCalendar(event) {
      downloadICS(event);
    },
  };
}

// Make the function globally available for Alpine
window.eventsData = eventsData;

customElements.define('events-container', EventsContainer);
