class EventsFeed extends HTMLElement {
  connectedCallback() {
    // Get props
    const filteredEvents = this.getAttribute('filtered-events') || '[]';
    const activeTab = this.getAttribute('active-tab') || 'all';
    const isLoading = this.getAttribute('is-loading') === 'true';
    
    this.innerHTML = `
      <div 
        x-data="{
          filteredEvents: ${filteredEvents},
          activeTab: '${activeTab}',
          isLoading: ${isLoading},
          openEventDetailsModal(event) {
            this.$dispatch('open-event-details-modal', event);
          },
          openParticipantsModal(event) {
            this.$dispatch('open-participants-modal', event);
          },
          updateAttendanceStatus(eventId, status) {
            this.$dispatch('update-attendance-status', { eventId, status });
          },
          downloadCalendar(event) {
            this.$dispatch('download-calendar', event);
          },
          formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            });
          },
          formatTime(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true
            });
          }
        }"
        x-init="() => {
          // Watch for attribute changes
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.attributeName === 'filtered-events') {
                this.filteredEvents = JSON.parse(this.getAttribute('filtered-events'));
              }
              if (mutation.attributeName === 'active-tab') {
                this.activeTab = this.getAttribute('active-tab');
              }
              if (mutation.attributeName === 'is-loading') {
                this.isLoading = this.getAttribute('is-loading') === 'true';
              }
            });
          });
          
          observer.observe(this, {
            attributes: true,
            attributeFilter: ['filtered-events', 'active-tab', 'is-loading']
          });
        }"
      >` + `
        <div class="events-agenda not-prose flex-1" x-show="!is_creating_new_event">
              <!-- Loading state -->
              <div x-show="isLoading" class="text-center py-8">
                <span class="loading loading-spinner loading-lg"></span>
                <p class="mt-2">Loading events...</p>
              </div>
              
              <!-- No events state -->
              <div x-show="!isLoading && filteredEvents.length === 0" class="text-center py-8">
                <p class="text-gray-500">
                  <span x-text="activeTab === 'all' ? 'No events to display' : 'No events match your criteria'"></span>
                </p>
              </div>
              
              <!-- Events list -->
              <div x-show="!isLoading && filteredEvents.length > 0">
                <template x-for="event in filteredEvents" :key="event.id">
                <div class="card-wrapper mb-5 cursor-pointer" x-on:click.stop="openEventDetailsModal(event)">
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
                          <div class="participants justify-between">
                            <div class="flex justify-between">
                              <span class="host-user btn btn-md btn-outline btn-info mb-2" x-text="'Host: ' + (event.host ? event.host.first_name : 'Unknown')"></span>
      <!--                        start participants component -->
      <!--                        using these two participant divs is the only way we can replace the third avatar
                                  with an avatar-placeholder when we have more than 3 invitees -->
                              <div x-show="event.participants && event.participants.length > 3">
                                <div class="avatar-group -space-x-6 cursor-pointer" x-on:click.stop="openParticipantsModal(event)">
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
                                <div class="avatar-group -space-x-6 cursor-pointer" x-on:click.stop="openParticipantsModal(event)">
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
                              <button class="download-calendar-btn btn btn-ghost p-1 block" x-on:click.stop="downloadCalendar(event)">
                                <iconify-icon class="text-3xl sm:text-2xl" icon="mdi:calendar-export"></iconify-icon>
                              </button>
                            </div>
                            <div class="attendance join flex">
                              <button class="yes-button btn flex-1/4 btn-md btn-outline btn-success join-item" 
                                      x-text="'Yes: ' + (event.attendance_yes_count || 0)"
                                      x-on:click.stop="updateAttendanceStatus(event.id, 'yes')"
                                      data-testid="yes-count"></button>
                              <button class="maybe-button btn flex-1/3 btn-md btn-outline btn-warning join-item" 
                                      x-text="'Maybe: ' + (event.attendance_maybe_count || 0)"
                                      x-on:click.stop="updateAttendanceStatus(event.id, 'maybe')"></button>
                              <button class="no-button flex-1/4 btn btn-md btn-outline btn-error join-item" 
                                      x-text="'No: ' + (event.attendance_no_count || 0)"
                                      x-on:click.stop="updateAttendanceStatus(event.id, 'no')"></button>
                            </div>
                          </div>
                        </div>
                      </div>
                </div>
                </template>
              </div>

            </div>
        `;
  }
}

customElements.define('events-feed', EventsFeed);
