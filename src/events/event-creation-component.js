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
                <div class="container mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md max-w-96">
                    <h2 class="text-2xl font-semibold mb-4">Create New Event</h2>
                    <form x-on:submit.prevent="createEvent()">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="title">Title:</label>
                            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered"
                                   x-model="formData.title"
                                   id="title" name="title"
                                   required
                                   type="text">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="location">Location:</label>
                            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered"
                                   x-model="formData.location"
                                   id="location" name="location"
                                   required
                                   type="text">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="description">Description:</label>
                            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered"
                                   x-model="formData.description"
                                   id="description" name="description"
                                   required
                                   type="text">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="start_time">Start Time:</label>
                            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered"
                                   x-model="formData.startTime"
                                   id="start_time" name="start_time"
                                   required
                                   type="datetime-local">
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="end_time">End Time:</label>
                            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered"
                                   x-model="formData.endTime"
                                   id="end_time" name="end_time"
                                   required
                                   type="datetime-local">
                        </div>
                        <div class="flex items-center justify-between">
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline btn btn-primary"
                                    type="submit"
                                    :disabled="isCreating"
                                    :class="{ 'loading': isCreating }">
                                <span x-show="!isCreating">Create Event</span>
                                <span x-show="isCreating">Creating...</span>
                            </button>
                        </div>
                    </form>
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

          // Reset form
          this.resetForm();

          // Dispatch success event to parent EventsContainer
          this.$el.dispatchEvent(
            new CustomEvent('event-created-successfully', {
              bubbles: true,
              detail: { event: responseData },
            }),
          );
        } else {
          console.error('Error creating event:', responseData);
          // Could dispatch an error event or show user feedback here
        }
      } catch (error) {
        console.error('There was an error sending the request:', error);
        // Could dispatch an error event or show user feedback here
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
