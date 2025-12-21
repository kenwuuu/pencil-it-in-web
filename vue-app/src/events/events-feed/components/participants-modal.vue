<template>
  <div v-if="show" class="modal modal-open">
    <div class="modal-box h-[75%] max-w-2xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-3xl">Invitees</h3>
        <button class="btn btn-sm btn-circle btn-ghost" @click="$emit('close')">✕</button>
      </div>

      <!-- Filter Dropdown -->
      <div class="dropdown mb-4 min-w-[45%]">
        <div class="btn btn-outline w-full justify-between" role="button" tabindex="0">
          <span>{{ dropdownLabel }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 9l-7 7-7-7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
          </svg>
        </div>
        <ul
          class="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow"
          tabindex="0"
        >
          <li>
            <a @click="changeTab('all')">All ({{ event?.participants?.length || 0 }})</a>
          </li>
          <li>
            <a @click="changeTab('yes')">Yes ({{ getParticipantsByStatus('yes').length }})</a>
          </li>
          <li>
            <a @click="changeTab('maybe')">Maybe ({{ getParticipantsByStatus('maybe').length }})</a>
          </li>
          <li>
            <a @click="changeTab('no')">No ({{ getParticipantsByStatus('no').length }})</a>
          </li>
          <li>
            <a @click="changeTab('invited')"
              >Invited ({{ getParticipantsByStatus('invited').length }})</a
            >
          </li>
        </ul>
      </div>

      <!-- Participants List -->
      <div class="h-[75%] sm:h-[80%] overflow-y-auto">
        <ul class="list bg-base-100 rounded-box">
          <li
            v-for="participant in filteredParticipants"
            :key="participant.user_id"
            class="list-row"
          >
            <div>
              <img
                :src="
                  participant.profile_photo_url ||
                  'https://img.daisyui.com/images/profile/demo/batperson@192.webp'
                "
                class="size-10 md:size-12 rounded-box"
              />
            </div>
            <div>
              <div class="text-sm md:text-lg">
                {{ participant.first_name }} {{ participant.last_name }}
              </div>
              <div class="text-xs font-semibold opacity-60">
                {{ participant.username || 'No username' }}
              </div>
            </div>
            <div class="flex items-center justify-center h-full">
              <div
                :class="{
                  'badge-success': participant.attendance_answer === 'yes',
                  'badge-warning': participant.attendance_answer === 'maybe',
                  'badge-error': participant.attendance_answer === 'no',
                  'badge-neutral':
                    participant.attendance_answer === 'invited' || !participant.attendance_answer,
                }"
                class="badge badge-sm"
              >
                {{ participant.attendance_answer || 'invited' }}
              </div>
            </div>
          </li>
          <li
            v-if="filteredParticipants.length === 0"
            class="flex p-4 text-sm opacity-60 justify-center"
          >
            No participants in this category
          </li>
        </ul>
      </div>
    </div>
    <div class="modal-backdrop" @click="$emit('close')"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Participant {
  user_id: string
  profile_photo_url?: string
  first_name?: string
  last_name?: string
  username?: string
  attendance_answer?: 'yes' | 'maybe' | 'no' | 'invited'
}

interface Event {
  id: string
  participants?: Participant[]
}

interface Props {
  show: boolean
  event: Event | null
  activeTab: 'all' | 'yes' | 'maybe' | 'no' | 'invited'
}

interface Emits {
  (e: 'close'): void

  (e: 'changeTab', tab: 'all' | 'yes' | 'maybe' | 'no' | 'invited'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const dropdownLabel = computed(() => {
  if (!props.event) return 'All'

  switch (props.activeTab) {
    case 'all':
      return `All (${props.event.participants?.length || 0})`
    case 'yes':
      return `Yes (${getParticipantsByStatus('yes').length})`
    case 'maybe':
      return `Maybe (${getParticipantsByStatus('maybe').length})`
    case 'no':
      return `No (${getParticipantsByStatus('no').length})`
    case 'invited':
      return `Invited (${getParticipantsByStatus('invited').length})`
    default:
      return 'All'
  }
})

const filteredParticipants = computed(() => {
  if (!props.event || !props.event.participants) {
    return []
  }

  let participants: Participant[]
  if (props.activeTab === 'all') {
    participants = props.event.participants
  } else {
    participants = props.event.participants.filter((participant) => {
      const attendanceStatus = participant.attendance_answer || 'invited'
      return attendanceStatus === props.activeTab
    })
  }

  return participants.sort((a, b) => {
    const nameA = (a.first_name || '').toLowerCase()
    const nameB = (b.first_name || '').toLowerCase()
    return nameA.localeCompare(nameB)
  })
})

function getParticipantsByStatus(status: 'yes' | 'maybe' | 'no' | 'invited'): Participant[] {
  if (!props.event || !props.event.participants) {
    return []
  }

  return props.event.participants.filter((participant) => {
    const attendanceStatus = participant.attendance_answer || 'invited'
    return attendanceStatus === status
  })
}

function changeTab(tab: 'all' | 'yes' | 'maybe' | 'no' | 'invited') {
  emit('changeTab', tab)
}
</script>
