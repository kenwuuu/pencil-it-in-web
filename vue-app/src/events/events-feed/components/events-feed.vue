<template>
  <div v-show="!isCreatingNewEvent" class="events-agenda not-prose flex-1">
    <div v-if="events && events.length > 0">
      <event-card
        v-for="event in events"
        :key="event.id"
        :event="event"
        :format-date="formatDate"
        :format-time="formatTime"
        @open-event-details="handleOpenEventDetails"
        @open-participants="handleOpenParticipants"
        @download-calendar="handleDownloadCalendar"
        @update-attendance="handleUpdateAttendance"
      />
    </div>
    <div v-if="!events || events.length === 0" class="text-center py-8">
      <p class="text-gray-500">No events to display</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EventCard from './event-card.vue'
import type { Event } from '@/events/types.ts'

interface Props {
  events: Event[]
  isCreatingNewEvent?: boolean
}

interface Emits {
  (e: 'openEventDetails', event: Event): void

  (e: 'openParticipants', event: Event): void

  (e: 'downloadCalendar', event: Event): void

  (e: 'updateAttendance', eventId: string, status: 'yes' | 'maybe' | 'no'): void
}

const props = withDefaults(defineProps<Props>(), {
  isCreatingNewEvent: false,
})

const emit = defineEmits<Emits>()

// Date formatting utilities
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// Event handlers that forward events to parent
function handleOpenEventDetails(event: Event) {
  emit('openEventDetails', event)
}

function handleOpenParticipants(event: Event) {
  emit('openParticipants', event)
}

function handleDownloadCalendar(event: Event) {
  emit('downloadCalendar', event)
}

function handleUpdateAttendance(eventId: string, status: 'yes' | 'maybe' | 'no') {
  emit('updateAttendance', eventId, status)
}
</script>
