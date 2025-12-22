<template>
  <div>
    <!-- Delete Button -->
    <button class="btn btn-outline btn-error" @click="openModal">Delete Event</button>

    <!-- DaisyUI Modal -->
    <dialog ref="modalRef" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Are you sure you want to delete this event?</h3>
        <div class="flex justify-end gap-4">
          <button class="btn" @click="closeModal">No</button>
          <button class="btn btn-error" @click="handleDelete">Yes</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { deleteEvent } from '../../../../../src/events/events-feed/services/delete-event.js'
import type { Event } from '@/events/types.ts'

interface Props {
  event: Event
}

const props = defineProps<Props>()

const modalRef = ref<HTMLDialogElement | null>(null)

function openModal() {
  modalRef.value?.showModal()
}

function closeModal() {
  modalRef.value?.close()
}

async function handleDelete() {
  try {
    await deleteEvent(props.event.id)
    closeModal()
    window.location.reload() // refresh events
  } catch (error) {
    alert('Failed to delete event. Please try again.')
    console.error(error)
  }
}
</script>
