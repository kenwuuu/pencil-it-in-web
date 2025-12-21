<template>
  <div class="sm:page-container mt-4">
    <!-- Back button -->
    <button class="btn btn-lg mb-4" @click="cancelCreation">
      <iconify-icon icon="mdi:arrow-left-thick"></iconify-icon>
    </button>

    <!-- Event Creation Component -->
    <div class="card mx-auto p-4 sm:p-6 outline-base-200 outline-3 rounded-md max-w-96">
      <h2 class="text-2xl font-semibold mb-4 dark:text-white">Create New Event</h2>
      <form @submit.prevent="createEvent">
        <div class="mb-4">
          <label class="floating-label">
            <span class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              >Add Title</span
            >
            <input
              id="title"
              v-model="formData.title"
              class="w-full input input-md shadow appearance-none py-2 px-3 rounded-sm text-gray-700 dark:text-gray-300"
              name="title"
              placeholder="Title"
              required
              type="text"
            />
          </label>
        </div>
        <div class="mb-4">
          <label class="floating-label">
            <span class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              >Location</span
            >
            <input
              id="location"
              v-model="formData.location"
              class="w-full input input-md shadow appearance-none py-2 px-3 rounded-sm text-gray-700 dark:text-gray-300"
              name="location"
              placeholder="Location"
              required
              type="text"
            />
          </label>
        </div>
        <div class="mb-4">
          <label class="floating-label">
            <span class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              >Description</span
            >
            <input
              id="description"
              v-model="formData.description"
              class="w-full input input-md shadow appearance-none py-2 px-3 rounded-sm text-gray-700 dark:text-gray-300"
              name="description"
              placeholder="Description"
              required
              type="text"
            />
          </label>
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            for="start_time"
            >Start Time:</label
          >
          <input
            id="start_time"
            v-model="formData.startTime"
            class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline input input-bordered"
            name="start_time"
            required
            type="datetime-local"
          />
        </div>
        <div class="mb-6">
          <label
            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            for="end_time"
            >End Time:</label
          >
          <input
            id="end_time"
            v-model="formData.endTime"
            class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline input input-bordered"
            name="end_time"
            required
            type="datetime-local"
          />
        </div>
        <div class="flex items-center justify-center">
          <button :disabled="isCreating" class="btn btn-primary" type="submit">
            <span v-if="!isCreating">Create Event</span>
            <span v-else>Creating </span>
            <span :class="{ loading: isCreating }"></span>
          </button>
        </div>
      </form>
    </div>

    <!-- Toast Notification for API Success/Error -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform translate-x-full"
      enter-to-class="opacity-100 transform translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 transform translate-x-0"
      leave-to-class="opacity-0 transform translate-x-full"
    >
      <div v-if="showToast" class="toast mb-16">
        <div
          :class="toastType === 'success' ? 'alert-success' : 'alert-error'"
          class="alert alert-soft"
        >
          <iconify-icon
            :icon="toastType === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'"
            class="text-lg"
          ></iconify-icon>
          <span>{{ toastMessage }}</span>
          <button class="btn btn-sm btn-ghost" @click="hideToast">
            <iconify-icon icon="mdi:close"></iconify-icon>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { createEventApiCall } from './services/event-creation-service'

interface FormData {
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
}

interface Emits {
  (e: 'cancelEventCreation'): void

  (e: 'eventCreatedSuccessfully'): void
}

const emit = defineEmits<Emits>()

const formData = ref<FormData>({
  title: '',
  description: '',
  location: '',
  startTime: '',
  endTime: '',
})

const isCreating = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const toastTimeout = ref<number | null>(null)

function setDatetimeValue(offsetMinutes: number = 0): string {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000 + offsetMinutes * 60000)
  return local.toISOString().slice(0, 16)
}

function watchStartTime(newStartTime: string) {
  if (!newStartTime) return
  const start = new Date(newStartTime)
  const end = new Date(start.getTime() + 60 * 60000 - start.getTimezoneOffset() * 60000)
  formData.value.endTime = end.toISOString().slice(0, 16)
}

function showToastNotification(message: string, type: 'success' | 'error' = 'success') {
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value)
  }

  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  toastTimeout.value = window.setTimeout(() => {
    hideToast()
  }, 2000)
}

function hideToast() {
  showToast.value = false
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value)
    toastTimeout.value = null
  }
}

function cancelCreation() {
  emit('cancelEventCreation')
}

async function createEvent() {
  await createEventApiCall({
    formData: formData.value,
    isCreating,
    showToastNotification,
    resetForm,
    onSuccess: () => emit('eventCreatedSuccessfully'),
  })
}

function resetForm() {
  formData.value = {
    title: '',
    description: '',
    location: '',
    startTime: setDatetimeValue(0),
    endTime: setDatetimeValue(60),
  }
}

// Watch for changes to startTime
watch(() => formData.value.startTime, watchStartTime)

// Initialize default datetime values
onMounted(() => {
  formData.value.startTime = setDatetimeValue(0)
  formData.value.endTime = setDatetimeValue(60)
})
</script>
