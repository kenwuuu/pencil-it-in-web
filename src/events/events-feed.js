class EventsFeed extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div class="events-agenda not-prose flex-1" x-show="!is_creating_new_event">
              <div x-show="events.length > 0">
                <template x-for="event in events" :key="event.id">
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
                              <span class="host-user btn btn-md btn-outline btn-info mb-2" x-text="'Host: ' + (event.host && event.host[0] ? event.host[0].first_name : 'Unknown')"></span>
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
              <div x-show="!events" class="text-center py-8">
                <p class="text-gray-500">No events to display</p>
              </div>
            </div>
        `;
  }
}

customElements.define('events-feed', EventsFeed);
