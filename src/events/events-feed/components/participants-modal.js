class ParticipantsModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
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
        `;
  }
}

customElements.define('participants-modal', ParticipantsModal);
