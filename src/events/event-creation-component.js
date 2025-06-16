import { supabase } from '../supabase-client/supabase-client.js';
import { uploadFile, validateFile } from '../utils/file-upload.js';

class EventCreationComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <div class="sm:page-container mt-4" x-data="eventCreationData()">
<!--            Back button    -->
                <button class="btn btn-lg mb-4"
                        x-on:click="cancelCreation()">
                    <iconify-icon icon="mdi:arrow-left-thick"></iconify-icon>
                </button>
                <div class="container mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md rounded-md max-w-96">
                    <h2 class="text-2xl font-semibold mb-4 dark:text-white">Create New Event</h2>
                    <form x-on:submit.prevent="createEvent()">
                        <!-- Cover Photo Upload -->
                        <div class="mb-4">
                            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="cover_photo">Cover Photo:</label>
                            <div class="flex flex-col items-center">
                                <!-- Preview area -->
                                <div 
                                    x-show="coverPhotoPreview" 
                                    class="w-full h-40 mb-3 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden relative">
                                    <img 
                                        x-bind:src="coverPhotoPreview" 
                                        class="w-full h-full object-cover" 
                                        alt="Cover photo preview">
                                    <button 
                                        type="button" 
                                        class="absolute top-2 right-2 btn btn-circle btn-sm btn-error" 
                                        x-on:click="removeCoverPhoto">
                                        <iconify-icon icon="mdi:close"></iconify-icon>
                                    </button>
                                </div>
                                
                                <!-- Upload button -->
                                <div x-show="!coverPhotoPreview" class="w-full">
                                    <label 
                                        for="cover_photo_input" 
                                        class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            <iconify-icon icon="mdi:cloud-upload" class="text-3xl text-gray-500 dark:text-gray-400"></iconify-icon>
                                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> a cover photo</p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or WebP (Max 5MB)</p>
                                        </div>
                                    </label>
                                </div>
                                <input 
                                    id="cover_photo_input" 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/webp" 
                                    class="hidden" 
                                    x-on:change="handleCoverPhotoChange($event)">
                                
                                <!-- Error message -->
                                <div x-show="fileError" class="text-error text-sm mt-1" x-text="fileError"></div>
                                
                                <!-- Upload progress -->
                                <div x-show="isUploading" class="w-full mt-2">
                                    <div class="flex justify-between mb-1">
                                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
                                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300" x-text="uploadProgress + '%'"></span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div class="bg-blue-600 h-2.5 rounded-full" x-bind:style="'width: ' + uploadProgress + '%'"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="title">Title:</label>
                            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered"
                                   x-model="formData.title"
                                   id="title" name="title"
                                   required
                                   type="text">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="location">Location:</label>
                            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered"
                                   x-model="formData.location"
                                   id="location" name="location"
                                   required
                                   type="text">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="description">Description:</label>
                            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered"
                                   x-model="formData.description"
                                   id="description" name="description"
                                   required
                                   type="text">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="start_time">Start Time:</label>
                            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered"
                                   x-model="formData.startTime"
                                   id="start_time" name="start_time"
                                   required
                                   type="datetime-local">
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="end_time">End Time:</label>
                            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered"
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
      coverPhotoUrl: null,
    },
    coverPhotoFile: null,
    coverPhotoPreview: null,
    isUploading: false,
    uploadProgress: 0,
    fileError: null,
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

    // Handle cover photo file selection
    async handleCoverPhotoChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Validate the file
      const validation = validateFile(file);
      if (!validation.isValid) {
        this.fileError = validation.message;
        return;
      }
      
      this.fileError = null;
      this.coverPhotoFile = file;
      
      // Create a preview URL
      this.coverPhotoPreview = URL.createObjectURL(file);
      
      // Upload the file immediately
      await this.uploadCoverPhoto();
    },
    
    // Upload the cover photo to Supabase Storage
    async uploadCoverPhoto() {
      if (!this.coverPhotoFile) return;
      
      try {
        this.isUploading = true;
        this.uploadProgress = 0;
        
        // Upload the file
        const result = await uploadFile(
          this.coverPhotoFile, 
          'event-photos',
          'covers',
          (progress) => {
            this.uploadProgress = progress;
          }
        );
        
        // Store the public URL
        this.formData.coverPhotoUrl = result.url;
        console.log('Cover photo uploaded successfully:', result.url);
      } catch (error) {
        console.error('Failed to upload cover photo:', error);
        this.fileError = 'Failed to upload cover photo. Please try again.';
        this.removeCoverPhoto();
      } finally {
        this.isUploading = false;
      }
    },
    
    // Remove the cover photo
    removeCoverPhoto() {
      this.coverPhotoFile = null;
      this.formData.coverPhotoUrl = null;
      
      // Revoke the object URL to prevent memory leaks
      if (this.coverPhotoPreview) {
        URL.revokeObjectURL(this.coverPhotoPreview);
      }
      
      this.coverPhotoPreview = null;
      this.fileError = null;
      
      // Reset the file input
      const fileInput = document.getElementById('cover_photo_input');
      if (fileInput) fileInput.value = '';
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
              cover_photo_url: this.formData.coverPhotoUrl,
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
        coverPhotoUrl: null,
      };
      
      // Reset cover photo state
      this.removeCoverPhoto();
    },
  };
}

// Make the function globally available for Alpine
window.eventCreationData = eventCreationData;

customElements.define('event-creation-component', EventCreationComponent);
