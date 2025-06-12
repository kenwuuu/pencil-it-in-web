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
              <div x-show="events.length > 0">
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
  <!--                        start participants component -->
  <!--                        using these two participant divs is the only way we can replace the third avatar
                              with an avatar-placeholder when we have more than 3 invitees -->
                          <div x-show="event.participants && event.participants.length > 3">
                            <div class="avatar-group -space-x-6 cursor-pointer" x-on:click="openParticipantsModal(event)">
                              <template x-for="(participant, index) in event.participants.slice(0, event.participants.length > 3 ? 2 : 3)" :key="participant.user_id">
                                <div class="avatar">
                                  <div class="w-8">
  <!--                                  todo replace the placeholder with a better image-->
                                    <img :src="participant.profile_photo_url || 'https://img.daisyui.com/images/profile/demo/batperson@192.webp'" />
                                  </div>
                                </div>
                              </template>
                              <div class="avatar avatar-placeholder" x-show="event.participants.length > 3">
                                <div class="bg-neutral text-neutral-content w-8">
                                  <span x-text="'+' + (event.participants.length - 2)"></span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div x-show="event.participants && event.participants.length <= 3">
                            <div class="avatar-group -space-x-6 cursor-pointer" x-on:click="openParticipantsModal(event)">
                              <template x-for="(participant, index) in event.participants.slice(0, event.participants.length > 3 ? 2 : 3)" :key="participant.user_id">
                                <div class="avatar">
                                  <div class="w-8">
  <!--                                  todo replace the placeholder with a better image-->
                                    <img :src="participant.profile_photo_url || 'https://img.daisyui.com/images/profile/demo/batperson@192.webp'" />
                                  </div>
                                </div>
                              </template>
                             
                            </div>
                          </div>
  <!--                        end participants component -->
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
              <div x-show="!events" class="text-center py-8">
                <p class="text-gray-500">No events to display</p>
              </div>
            </div>
            <event-creation-component class="flex-1" x-show="is_creating_new_event"></event-creation-component>
          </div>
          <events-action-menu class="action-menu-side-component"></events-action-menu>

          <!-- Participants Modal -->
          <div class="modal" :class="{ 'modal-open': showParticipantsModal }" x-show="showParticipantsModal">
            <div class="modal-box h-[75%] max-w-2xl">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-3xl">Invitees</h3>
                <button class="btn btn-sm btn-circle btn-ghost" x-on:click="closeParticipantsModal()">✕</button>
              </div>
              
              <!-- Filter Dropdown -->
              <div class="dropdown mb-4 min-w-[45%]">
                <div tabindex="0" role="button" class="btn btn-outline w-full justify-between">
                  <span x-text="getDropdownLabel()"></span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow">
                  <li><a x-on:click="activeParticipantTab = 'all'" x-text="'All (' + (selectedEvent?.participants?.length || 0) + ')'"></a></li>
                  <li><a x-on:click="activeParticipantTab = 'yes'" x-text="'Yes (' + getParticipantsByStatus('yes').length + ')'"></a></li>
                  <li><a x-on:click="activeParticipantTab = 'maybe'" x-text="'Maybe (' + getParticipantsByStatus('maybe').length + ')'"></a></li>
                  <li><a x-on:click="activeParticipantTab = 'no'" x-text="'No (' + getParticipantsByStatus('no').length + ')'"></a></li>
                  <li><a x-on:click="activeParticipantTab = 'invited'" x-text="'Invited (' + getParticipantsByStatus('invited').length + ')'"></a></li>
                </ul>
              </div>

              <!-- Participants List -->
              <div class="h-[75%] sm:h-[80%] overflow-y-auto">
                <ul class="list bg-base-100 rounded-box">
                  <template x-for="participant in getFilteredParticipants()" :key="participant.user_id">
                    <li class="list-row">
                      <div>
                        <img class="size-10 md:size-12 rounded-box" :src="participant.profile_photo_url || 'https://img.daisyui.com/images/profile/demo/batperson@192.webp'" />
                      </div>
                      <div>
                        <div class="text-sm md:text-lg" x-text="participant.first_name + ' ' + participant.last_name"></div>
                        <div class="text-xs font-semibold opacity-60" x-text="participant.username || 'No username'"></div>
                      </div>
                      <div class="flex items-center justify-center h-full">
                        <div class="badge badge-sm" 
                             :class="{
                               'badge-success': participant.attendance_answer === 'yes',
                               'badge-warning': participant.attendance_answer === 'maybe', 
                               'badge-error': participant.attendance_answer === 'no',
                               'badge-neutral': participant.attendance_answer === 'invited'
                             }"
                             x-text="participant.attendance_answer || 'invited'">
                        </div>
                      </div>
                    </li>
                  </template>
                  <li x-show="getFilteredParticipants().length === 0" class="flex p-4 text-sm opacity-60 justify-center">
                    No participants in this category
                  </li>
                </ul>
              </div>
            </div>
            <div class="modal-backdrop" x-on:click="closeParticipantsModal()"></div>
          </div>
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
    is_creating_new_event: false,
    showParticipantsModal: false,
    selectedEvent: null,
    activeParticipantTab: 'all',

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

    openParticipantsModal(event) {
      this.selectedEvent = event;
      this.showParticipantsModal = true;
      this.activeParticipantTab = 'all';
    },

    closeParticipantsModal() {
      this.showParticipantsModal = false;
      this.selectedEvent = null;
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
