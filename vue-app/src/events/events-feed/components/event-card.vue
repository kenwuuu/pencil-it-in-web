<template>
  <div class="card-wrapper mb-5 cursor-pointer" @click="handleCardClick">
    <div class="card bg-base-100 mb-5 outline-base-300 outline-3 dark:outline-slate-700">
      <div class="card-body">
        <div class="event-datetime flex justify-between">
          <h2 class="event-date sm:text-3xl text-xl">{{ formatDate(event.start_time) }}</h2>
          <span class="event-time badge badge-soft badge-lg sm:badge-xl badge-success">
            {{ formatTime(event.start_time) }}
          </span>
        </div>
        <div class="title-container flex">
          <h2 class="title text-xl sm:text-xl font-bold">{{ event.title }}</h2>
        </div>
        <div class="title-container flex">
          <h2 class="title text-sm text-slate-500 font-bold">@ {{ event.location }}</h2>
        </div>
        <div class="event-description line-clamp-4 text-sm mb-2">{{ event.description || '' }}</div>
        <div class="participants justify-between">
          <div class="flex justify-between">
            <span class="host-user btn btn-md btn-outline btn-info mb-2">
              Host: {{ event.host ? event.host.first_name : 'Unknown' }}
            </span>
            <!-- start participants component -->
            <!-- using these two participant divs is the only way we can replace the third avatar
                 with an avatar-placeholder when we have more than 3 invitees -->
            <div v-if="event.participants && event.participants.length > 3">
              <div
                class="avatar-group -space-x-6 cursor-pointer"
                @click.stop="handleParticipantsClick"
              >
                <div
                  v-for="participant in event.participants.slice(0, 2)"
                  :key="participant.user_id"
                  class="avatar"
                >
                  <div class="w-8">
                    <img
                      :src="
                        participant.profile_photo_url ||
                        'https://img.daisyui.com/images/profile/demo/batperson@192.webp'
                      "
                    />
                  </div>
                </div>
                <div class="avatar avatar-placeholder">
                  <div class="bg-neutral text-neutral-content w-8">
                    <span>+{{ event.participants.length - 2 }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="event.participants && event.participants.length <= 3">
              <div
                class="avatar-group -space-x-6 cursor-pointer"
                @click.stop="handleParticipantsClick"
              >
                <div
                  v-for="participant in event.participants.slice(0, 3)"
                  :key="participant.user_id"
                  class="avatar"
                >
                  <div class="w-8">
                    <img
                      :src="
                        participant.profile_photo_url ||
                        'https://img.daisyui.com/images/profile/demo/batperson@192.webp'
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- end participants component -->
            <button
              class="download-calendar-btn btn btn-ghost p-1 block"
              @click.stop="handleDownloadCalendar"
            >
              <iconify-icon class="text-3xl sm:text-2xl" icon="mdi:calendar-export"></iconify-icon>
            </button>
          </div>
          <div class="attendance join flex">
            <button
              class="yes-button btn flex-1/4 btn-md btn-outline btn-success join-item"
              data-testid="yes-count"
              @click.stop="handleAttendanceUpdate('yes')"
            >
              Yes: {{ event.attendance_yes_count || 0 }}
            </button>
            <button
              class="maybe-button btn flex-1/3 btn-md btn-outline btn-warning join-item"
              @click.stop="handleAttendanceUpdate('maybe')"
            >
              Maybe: {{ event.attendance_maybe_count || 0 }}
            </button>
            <button
              class="no-button flex-1/4 btn btn-md btn-outline btn-error join-item"
              @click.stop="handleAttendanceUpdate('no')"
            >
              No: {{ event.attendance_no_count || 0 }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Participant {
  user_id: string
  profile_photo_url?: string
}

interface Host {
  first_name: string
}

interface Event {
  id: string
  title: string
  description?: string
  location: string
  start_time: string
  host?: Host
  participants?: Participant[]
  attendance_yes_count?: number
  attendance_maybe_count?: number
  attendance_no_count?: number
}

interface Props {
  event: Event
  formatDate: (date: string) => string
  formatTime: (date: string) => string
}

interface Emits {
  (e: 'openEventDetails', event: Event): void

  (e: 'openParticipants', event: Event): void

  (e: 'downloadCalendar', event: Event): void

  (e: 'updateAttendance', eventId: string, status: 'yes' | 'maybe' | 'no'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleCardClick() {
  emit('openEventDetails', props.event)
}

function handleParticipantsClick() {
  emit('openParticipants', props.event)
}

function handleDownloadCalendar() {
  emit('downloadCalendar', props.event)
}

function handleAttendanceUpdate(status: 'yes' | 'maybe' | 'no') {
  emit('updateAttendance', props.event.id, status)
}
</script>
