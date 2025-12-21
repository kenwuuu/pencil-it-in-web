import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Participant {
  user_id: string
  profile_photo_url?: string
  first_name?: string
  last_name?: string
  username?: string
  attendance_answer?: 'yes' | 'maybe' | 'no' | 'invited'
}

export interface Event {
  id: string
  title: string
  description?: string
  location: string
  start_time: string
  end_time?: string
  host?: {
    first_name: string
    user_id?: string
  }
  participants?: Participant[]
  attendance_yes_count?: number
  attendance_maybe_count?: number
  attendance_no_count?: number
  attendance_invited_count?: number
}

export const useEventStore = defineStore('events', () => {
  // State
  const events = ref<Event[]>([])
  const isCreatingNewEvent = ref(false)
  const showEventDetailsModal = ref(false)
  const showParticipantsModal = ref(false)
  const selectedEvent = ref<Event | null>(null)
  const activeParticipantTab = ref<'all' | 'yes' | 'maybe' | 'no' | 'invited'>('all')
  const showToast = ref(false)
  const toastMessage = ref('')
  const toastType = ref<'success' | 'error' | 'info'>('success')
  const showReportModal = ref(false)
  const reportText = ref('')

  // Actions
  function setEvents(newEvents: Event[]) {
    events.value = newEvents
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

  function openReportModal() {
    showReportModal.value = true
  }

  function closeReportModal() {
    showReportModal.value = false
    reportText.value = ''
  }

  function showToastNotification(message: string, type: 'success' | 'error' | 'info' = 'success') {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true

    setTimeout(() => {
      showToast.value = false
    }, 4000)
  }

  return {
    // State
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
    // Actions
    setEvents,
    openEventDetailsModal,
    closeEventDetailsModal,
    openParticipantsModal,
    closeParticipantsModal,
    openReportModal,
    closeReportModal,
    showToastNotification,
  }
})
