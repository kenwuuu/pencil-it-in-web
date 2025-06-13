import { supabase } from '../supabase-client/supabase-client.js';

class EventCreationComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <div class="sm:page-container mt-4" x-data="eventCreationData()">
<!--            Back button    -->
                <button class="btn btn-lg mb-4"
                        x-on:click="cancelCreation()">
                    <iconify-icon icon="mdi:arrow-left-thick"></iconify-icon>
                </button>
                <div class="card mx-auto p-4 sm:p-6 outline-base-200 outline-3 rounded-md max-w-96">
                    <h2 class="text-2xl font-semibold mb-4 dark:text-white">Create New Event</h2>
                    <form x-on:submit.prevent="createEvent()">
                        <div class="mb-4">
                            <label class="floating-label">
                                <span class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Add Title</span>
                                <input class="w-full input input-md shadow appearance-none py-2 px-3 rounded-sm text-gray-700 dark:text-gray-300"
                                    type="text"
                                    x-model="formData.title"
                                    placeholder="Title"
                                    id="title" name="title"
                                    required
                                />
                            </label>
                        </div>
                        <div class="mb-4">
                            <label class="floating-label">
                                <span class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Location</span>
                                <input class="w-full input input-md shadow appearance-none py-2 px-3 rounded-sm text-gray-700 dark:text-gray-300"
                                    type="text"
                                    x-model="formData.location"
                                    placeholder="Location"
                                    id="location" name="location"
                                    required
                                />
                            </label>
                        </div>
                        <div class="mb-4">
                            <label class="floating-label">
                                <span class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Description</span>
                                <input class="w-full input input-md shadow appearance-none py-2 px-3 rounded-sm text-gray-700 dark:text-gray-300"
                                    type="text"
                                    x-model="formData.description"
                                    placeholder="Description"
                                    id="description" name="description"
                                    required
                                />
                            </label>
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="start_time">Start Time:</label>
                            <input class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline input input-bordered"
                                   x-model="formData.startTime"
                                   id="start_time" name="start_time"
                                   required
                                   type="datetime-local">
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="end_time">End Time:</label>
                            <input class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline input input-bordered"
                                   x-model="formData.endTime"
                                   id="end_time" name="end_time"
                                   required
                                   type="datetime-local">
                        </div>
                        <div class="flex items-center justify-center">
                            <button class="btn btn-primary"
                                    type="submit"
                                    :disabled="isCreating"
                                    :class="{ 'loading': isCreating }">
                                <span x-show="!isCreating">Create Event</span>
                                <span x-show="isCreating">Creating...</span>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Toast Container -->
                <div class="toast mb-16" x-show="showToast" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0 transform translate-x-full" x-transition:enter-end="opacity-100 transform translate-x-0" x-transition:leave="transition ease-in duration-200" x-transition:leave-start="opacity-100 transform translate-x-0" x-transition:leave-end="opacity-0 transform translate-x-full">
                    <div class="alert alert-soft" :class="toastType === 'success' ? 'alert-success' : 'alert-error'">
                        <iconify-icon :icon="toastType === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'" class="text-lg"></iconify-icon>
                        <span x-text="toastMessage"></span>
                        <button class="btn btn-sm btn-ghost" x-on:click="hideToast()">
                            <iconify-icon icon="mdi:close"></iconify-icon>
                        </button>
                    </div>
                </div>
            </div>
    `;

    // Re-init Alpine for dynamically injected content
    queueMicrotask(() => Alpine.initTree(this));
  }

  setDatetimeValue(offsetMinutes = 0) {
    const now = new Date();
    const local = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000 + offsetMinutes * 60000,
    );
    return local.toISOString().slice(0, 16);
  }
}

// Alpine.js data function
function eventCreationData() {
  return {
    formData: {
      title: '',
      description: '',
      location: '',
      startTime: '',
      endTime: '',
    },
    isCreating: false,
    showToast: false,
    toastMessage: '',
    toastType: 'success', // 'success' or 'error'
    toastTimeout: null,

    init() {
      // Set default datetime values
      this.formData.startTime = this.setDatetimeValue(0);
      this.formData.endTime = this.setDatetimeValue(60);
    },

    setDatetimeValue(offsetMinutes = 0) {
      const now = new Date();
      const local = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000 + offsetMinutes * 60000,
      );
      return local.toISOString().slice(0, 16);
    },

    showToastNotification(message, type = 'success') {
      // Clear any existing timeout
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }

      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;

      // Auto-hide after 5 seconds
      this.toastTimeout = setTimeout(() => {
        this.hideToast();
      }, 2000);
    },

    hideToast() {
      this.showToast = false;
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
        this.toastTimeout = null;
      }
    },

    cancelCreation() {
      // Dispatch event to parent EventsContainer to hide creation form
      this.$el.dispatchEvent(
        new CustomEvent('cancel-event-creation', {
          bubbles: true,
          detail: {},
        }),
      );
    },

    async createEvent() {
      if (this.isCreating) return;

      this.isCreating = true;

      try {
        // Convert local datetime strings to UTC ISO strings
        const startTimeUTC = new Date(this.formData.startTime).toISOString();
        const endTimeUTC = new Date(this.formData.endTime).toISOString();

        const session = await supabase.auth.getSession();
        const response = await fetch(
          'https://mpounklnfrcfpkefidfn.supabase.co/functions/v1/create-event',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.data.session.access_token}`,
            },
            body: JSON.stringify({
              title: this.formData.title,
              description: this.formData.description,
              location: this.formData.location,
              start_time: startTimeUTC,
              end_time: endTimeUTC,
            }),
          },
        );

        const responseData = await response.json();

        if (responseData.message === 'Event created successfully') {
          console.log('Event created successfully:', responseData);

          // Show success toast
          this.showToastNotification(`Event created successfully!`, 'success');

          // Reset form
          this.resetForm();

          // Dispatch success event to parent EventsContainer after a short delay
          setTimeout(() => {
            this.$el.dispatchEvent(
              new CustomEvent('event-created-successfully', {
                bubbles: true,
                detail: { event: responseData },
              }),
            );
          }, 1500);
        } else {
          console.error('Error creating event:', responseData);

          // Show error toast with specific message or generic fallback
          const errorMessage =
            responseData.error ||
            responseData.message ||
            'Failed to create event. Please try again.';
          this.showToastNotification(errorMessage, 'error');
        }
      } catch (error) {
        console.error('There was an error sending the request:', error);

        // Show error toast for network/request errors
        this.showToastNotification(
          'Network error occurred. Please check your connection and try again.',
          'error',
        );
      } finally {
        this.isCreating = false;
      }
    },

    resetForm() {
      this.formData = {
        title: '',
        description: '',
        location: '',
        startTime: this.setDatetimeValue(0),
        endTime: this.setDatetimeValue(60),
      };
    },
  };
}

// Make the function globally available for Alpine
window.eventCreationData = eventCreationData;

customElements.define('event-creation-component', EventCreationComponent);
