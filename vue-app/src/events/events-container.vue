<template>
  <div class="flex">
    <div class="page-container flex-1">
      <header v-show="!isCreatingNewEvent" class="space-y-4 my-4">
        <!-- title row -->
        <div class="flex">
          <div class="prose">
            <h1>{{ capitalize(page) }}</h1>
          </div>
          <div class="ml-auto flex gap-2">
            <button class="btn text-2xl" @click="loadEvents">
              <iconify-icon icon="mdi:refresh"></iconify-icon>
            </button>
            <EventsActionMenu
              class="action-menu-header-component"
              @create-event="isCreatingNewEvent = true"
            />
          </div>
        </div>
        <!-- filter row -->
        <div class="join mb-4 w-full">
          <button class="btn join-item flex-1">All Events</button>
          <button class="btn join-item flex-1">My Events</button>
        </div>
      </header>

      <EventsFeed
        :events="events"
        :is-creating-new-event="isCreatingNewEvent"
        @open-event-details="openEventDetailsModal"
        @open-participants="openParticipantsModal"
        @download-calendar="downloadCalendar"
        @update-attendance="updateAttendanceStatus"
      />

      <EventCreationComponent
        v-show="isCreatingNewEvent"
        class="flex-1"
        @cancel-event-creation="isCreatingNewEvent = false"
        @event-created-successfully="handleEventCreated"
      />
    </div>

    <EventsActionMenu
      class="action-menu-side-component"
      @create-event="isCreatingNewEvent = true"
    />

    <!-- Modals -->
    <EventDetailsModal
      :event="selectedEvent"
      :show="showEventDetailsModal"
      @close="closeEventDetailsModal"
      @open-report-modal="showReportModal = true"
    />
    <ParticipantsModal
      :active-tab="activeParticipantTab"
      :event="selectedEvent"
      :show="showParticipantsModal"
      @close="closeParticipantsModal"
      @change-tab="activeParticipantTab = $event"
    />

    <!-- Toast Notification -->
    <div v-if="showToast" class="toast toast-top toast-center">
      <div :class="['alert', `alert-${toastType}`]">
        <span>{{ toastMessage }}</span>
      </div>
    </div>

    <!-- Report Modal -->
    <dialog :open="showReportModal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Report Event</h3>
        <textarea
          v-model="reportText"
          class="textarea textarea-bordered w-full mt-4"
          placeholder="Enter your report..."
        ></textarea>
        <div class="modal-action">
          <button class="btn" @click="showReportModal = false">Cancel</button>
          <button class="btn btn-primary" @click="submitReport">Submit</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { format, parseISO } from 'date-fns'
import EventsFeed from './events-feed/components/events-feed.vue'
import ParticipantsModal from './events-feed/components/participants-modal.vue'
import EventDetailsModal from './events-feed/components/event-details-modal.vue'
import EventsActionMenu from './events-action-menu.vue'
import EventCreationComponent from './event-creator/event-creation-component.vue'
import type { Event, Participant } from './stores/event-store'
import { useEventStore } from './stores/event-store'
import { getUpcomingEvents } from '../../../src/events/events-feed/services/get-upcoming-events.js'
import { downloadICS } from '../../../src/events/events-feed/services/calendar.js'
import { updateAttendanceStatus as updateAttendanceStatusAPI } from '../../../src/events/events-feed/services/update-attendance-status.js'
import { supabase } from '../../../src/supabase-client/supabase-client.ts'

// Use Pinia store
const eventStore = useEventStore()
const {
  events,
  isCreatingNewEvent,
  showEventDetailsModal,
  showParticipantsModal,
  selectedEvent,
  activeParticipantTab,
  showToast,
  toastMessage,
  toastType,
  showReportModal,
  reportText,
} = storeToRefs(eventStore)

// Local state
const page = ref('events')
const toastTimeout = ref<number | null>(null)

// Methods
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

async function loadEvents() {
  try {
    const data = await getUpcomingEvents()
    events.value = data
  } catch (error) {
    console.error('Error fetching events:', error)
    showToastNotification('Failed to load events. Please refresh the page.', 'error')
  }
}

function showToastNotification(message: string, type: 'success' | 'error' | 'info' = 'success') {
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value)
  }

  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  toastTimeout.value = window.setTimeout(() => {
    hideToast()
  }, 4000)
}

function hideToast() {
  showToast.value = false
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value)
    toastTimeout.value = null
  }
}

function openEventDetailsModal(event: Event) {
  selectedEvent.value = event
  showEventDetailsModal.value = true
}

function closeEventDetailsModal() {
  selectedEvent.value = null
  showEventDetailsModal.value = false
}

function openParticipantsModal(event: Event) {
  selectedEvent.value = event
  showParticipantsModal.value = true
  activeParticipantTab.value = 'all'
}

function closeParticipantsModal() {
  selectedEvent.value = null
  showParticipantsModal.value = false
}

function getDropdownLabel(): string {
  if (!selectedEvent.value) return 'All'

  switch (activeParticipantTab.value) {
    case 'all':
      return `All (${selectedEvent.value.participants?.length || 0})`
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
}

function getFilteredParticipants(): Participant[] {
  if (!selectedEvent.value || !selectedEvent.value.participants) {
    return []
  }

  let participants: Participant[]
  if (activeParticipantTab.value === 'all') {
    participants = selectedEvent.value.participants
  } else {
    participants = selectedEvent.value.participants.filter((participant) => {
      const attendanceStatus = participant.attendance_answer || 'invited'
      return attendanceStatus === activeParticipantTab.value
    })
  }

  return participants.sort((a, b) => {
    const nameA = (a.first_name || '').toLowerCase()
    const nameB = (b.first_name || '').toLowerCase()
    return nameA.localeCompare(nameB)
  })
}

function getParticipantsByStatus(status: 'yes' | 'maybe' | 'no' | 'invited'): Participant[] {
  if (!selectedEvent.value || !selectedEvent.value.participants) {
    return []
  }

  return selectedEvent.value.participants.filter((participant) => {
    const attendanceStatus = participant.attendance_answer || 'invited'
    return attendanceStatus === status
  })
}

async function updateAttendanceStatus(eventId: string, attendanceStatus: 'yes' | 'maybe' | 'no') {
  const event = events.value.find((e) => e.id === eventId)
  if (!event) return

  const currentUserId = (await supabase.auth.getUser()).data.user?.id
  if (!currentUserId) return

  const currentUserParticipant = event.participants?.find((p) => p.user_id === currentUserId)
  const currentStatus = currentUserParticipant?.attendance_answer || 'invited'

  if (currentStatus === attendanceStatus) return

  const originalCounts = {
    yes: event.attendance_yes_count || 0,
    maybe: event.attendance_maybe_count || 0,
    no: event.attendance_no_count || 0,
    invited: event.attendance_invited_count || 0,
  }

  updateCountsOptimistically(event, currentStatus, attendanceStatus)

  if (currentUserParticipant) {
    currentUserParticipant.attendance_answer = attendanceStatus
  }

  try {
    await updateAttendanceStatusAPI(eventId, attendanceStatus)
  } catch (error) {
    console.error('Error updating attendance status:', error)

    event.attendance_yes_count = originalCounts.yes
    event.attendance_maybe_count = originalCounts.maybe
    event.attendance_no_count = originalCounts.no
    event.attendance_invited_count = originalCounts.invited

    if (currentUserParticipant) {
      currentUserParticipant.attendance_answer = currentStatus
    }
  }
}

function updateCountsOptimistically(
  event: Event,
  oldStatus: string,
  newStatus: 'yes' | 'maybe' | 'no',
) {
  if (oldStatus === 'yes')
    event.attendance_yes_count = Math.max(0, (event.attendance_yes_count || 0) - 1)
  if (oldStatus === 'maybe')
    event.attendance_maybe_count = Math.max(0, (event.attendance_maybe_count || 0) - 1)
  if (oldStatus === 'no')
    event.attendance_no_count = Math.max(0, (event.attendance_no_count || 0) - 1)
  if (oldStatus === 'invited')
    event.attendance_invited_count = Math.max(0, (event.attendance_invited_count || 0) - 1)

  if (newStatus === 'yes') event.attendance_yes_count = (event.attendance_yes_count || 0) + 1
  if (newStatus === 'maybe') event.attendance_maybe_count = (event.attendance_maybe_count || 0) + 1
  if (newStatus === 'no') event.attendance_no_count = (event.attendance_no_count || 0) + 1
}

function formatDate(dateString: string): string {
  const date = parseISO(dateString)
  return format(date, 'MMMM do, yyyy')
}

function formatTime(dateString: string): string {
  const date = parseISO(dateString)
  return format(date, 'h:mmaaa').toLowerCase()
}

function downloadCalendar(event: Event) {
  downloadICS(event)
}

function submitReport() {
  if (!reportText.value.trim()) {
    showToastNotification('Please enter a report message.', 'error')
    return
  }

  alert('Report submitted.')
  console.log('Report submitted.', selectedEvent.value?.id, reportText.value)

  showToastNotification('Thank you for your report.', 'success')
  reportText.value = ''
  showReportModal.value = false
}

async function handleEventCreated() {
  isCreatingNewEvent.value = false
  await loadEvents()
}

function handleFriendListChanged() {
  loadEvents()
}

// Lifecycle
onMounted(() => {
  loadEvents()
  window.addEventListener('friend-list-changed', handleFriendListChanged)
})

onUnmounted(() => {
  window.removeEventListener('friend-list-changed', handleFriendListChanged)
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value)
  }
})
</script>
