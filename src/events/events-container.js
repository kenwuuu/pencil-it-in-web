import './events-action-menu.js';
import './event-creation-component.js';
import './services/get-upcoming-events.js';
import { format, parseISO } from 'date-fns';
import { getUpcomingEvents } from './services/get-upcoming-events.js';
import { downloadICS } from './services/calendar.js';
import { updateAttendanceStatus as updateAttendanceStatusAPI } from '@/events/services/update-attendance-status.js';
import { supabase } from '@/supabase-client/supabase-client.js';

class EventsContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div class="flex" x-data="eventsData()">
          <div class="page-container flex-1">
            <header class="space-y-4 my-4">
              <div class="flex">
                <div class="prose">
                  <h1 x-text="capitalize(page)"></h1>
                </div>
                <events-action-menu class="action-menu-header-component"></events-action-menu>
              </div>
              <div class="join mb-4 w-full">
                <button class="btn join-item flex-1">All Events</button>
                <button class="btn join-item flex-1">My Events</button>
              </div>
            </header>
            
            <div class="events-agenda not-prose flex-1" x-show="!is_creating_new_event">
              <template x-for="event in events" :key="event.id">
                <div class="card bg-base-100 mb-5 outline-base-300 outline-3 dark:outline-slate-700">
                  <div class="card-body">
                    <div class="event-datetime flex justify-between">
                      <h2 class="event-date sm:text-3xl text-xl" x-text="formatDate(event.start_time)"></h2>
                      <span class="event-time badge badge-soft badge-lg sm:badge-xl badge-success" x-text="formatTime(event.start_time)"></span>
                    </div>
                    <div class="title-container flex">
                      <h2 class="title text-xl sm:text-xl font-bold" x-text="event.title"></h2>
                    </div>
                    <div class="event-description line-clamp-4 text-sm mb-2" x-text="event.description || ''"></div>
                    <div class="participants sm:flex justify-between">
                      <div class="flex justify-between">
                        <span class="host-user btn btn-md btn-outline btn-info mb-2 md:mb-0" x-text="'Host: ' + (event.host && event.host[0] ? event.host[0].first_name : 'Unknown')"></span>
                        <button class="download-calendar-btn btn btn-ghost p-1 block sm:hidden" x-on:click="downloadCalendar(event)">
                          <iconify-icon class="text-3xl sm:text-2xl" icon="mdi:calendar-export"></iconify-icon>
                        </button>
                      </div>
                      <div class="attendance join flex">
                        <button class="yes-button btn flex-1/4 sm:flex-none btn-md btn-outline btn-success join-item" 
                                x-text="'Yes: ' + (event.attendance_yes_count || 0)"
                                x-on:click="updateAttendanceStatus(event.id, 'yes')"
                                data-testid="yes-count"></button>
                        <button class="maybe-button btn flex-1/3 sm:flex-none btn-md btn-outline btn-warning join-item" 
                                x-text="'Maybe: ' + (event.attendance_maybe_count || 0)"
                                x-on:click="updateAttendanceStatus(event.id, 'maybe')"></button>
                        <button class="no-button flex-1/4 sm:flex-none block btn btn-md btn-outline btn-error join-item" 
                                x-text="'No: ' + (event.attendance_no_count || 0)"
                                x-on:click="updateAttendanceStatus(event.id, 'no')"></button>
                      </div>
                      <button class="download-calendar-btn btn btn-ghost p-1 hidden sm:block" x-on:click="downloadCalendar(event)">
                        <iconify-icon class="text-3xl sm:text-2xl" icon="mdi:calendar-export"></iconify-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            
            <event-creation-component class="flex-1" x-show="is_creating_new_event"></event-creation-component>
          </div>
          <events-action-menu class="action-menu-side-component"></events-action-menu>
        </div>
    `;

    // Re-init Alpine for dynamically injected content
    queueMicrotask(() => Alpine.initTree(this));
  }
}

// Alpine.js data function
function eventsData() {
  return {
    events: [],
    is_creating_new_event: false, // moved from x-data attribute to Alpine data

    async init() {
      await this.loadEvents();
    },

    async loadEvents() {
      try {
        const data = await getUpcomingEvents();
        this.events = data;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
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
