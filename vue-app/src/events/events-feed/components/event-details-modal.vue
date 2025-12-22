<template>
  <div v-if="show" id="event-details-modal" class="modal modal-open">
    <div class="modal-box max-h-[75%] max-w-2xl">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-bold text-2xl">{{ event?.title }}</h3>
        <div class="dropdown dropdown-end">
          <button class="btn btn-sm btn-ghost text-xl" tabindex="0">
            <iconify-icon icon="mdi:dots-horizontal"></iconify-icon>
          </button>
          <ul
            class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
            tabindex="0"
          >
            <li>
              <button @click="$emit('openReportModal')">Report</button>
            </li>
          </ul>
        </div>
      </div>
      <p class="text-sm mb-1">Location: {{ event?.location }}</p>
      <p class="text-sm mb-3">Date: {{ formatDate(event?.start_time || '') }}</p>
      <p class="text-sm mb-1">Start: {{ formatTime(event?.start_time || '') }}</p>
      <p v-if="event?.end_time" class="text-sm mb-4">End: {{ formatTime(event.end_time) }}</p>
      <p class="mb-4">{{ event?.description || 'No description provided.' }}</p>
      <div class="flex gap-4">
        <DeleteEventButton
          v-if="event?.host && event.host.user_id === currentUserId"
          :event="event"
          class="ml-auto"
        />
        <button class="btn" @click="$emit('close')">Close</button>
      </div>
    </div>
    <div class="modal-backdrop" @click="$emit('close')"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { format, parseISO } from 'date-fns'
import { supabase } from '../../../../../src/supabase-client/supabase-client.ts'
import DeleteEventButton from './delete-event-button.vue'
import type { Event } from '@/events/types.ts'

interface Props {
  show: boolean
  event: Event | null
}

interface Emits {
  (e: 'close'): void

  (e: 'openReportModal'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const currentUserId = ref('')

function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = parseISO(dateString)
  return format(date, 'MMMM do, yyyy')
}

function formatTime(dateString: string): string {
  if (!dateString) return ''
  const date = parseISO(dateString)
  return format(date, 'h:mmaaa').toLowerCase()
}

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  if (data.user) {
    currentUserId.value = data.user.id
  }
})
</script>
