import { supabase } from '../supabase-client/supabase-client.js';

class EventCreationComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <div class="sm:page-container">
<!--            Back button    -->
                <button class="btn btn-lg mb-4"
                        x-on:click=" is_creating_new_event = !is_creating_new_event ">
                    <iconify-icon icon="mdi:arrow-left-thick"></iconify-icon>
                </button>
                <div class="container mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md max-w-96">
                    <h2 class="text-2xl font-semibold mb-4">Create New Event</h2>
                    <form id="eventForm"">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="title">Title:</label>
                            <input class="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered "
                                   id="title" name="title"
                                   required
                                   type="text">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="location">Location:</label>
                            <input class="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered "
                                   id="location" name="location"
                                   required
                                   type="text">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="description">Description:</label>
                            <input class="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered "
                                   id="description" name="description"
                                   required
                                   type="text">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="start_time">Start Time:</label>
                            <input class="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered "
                                   id="start_time" name="start_time"
                                   required
                                   type="datetime-local">
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="end_time">End Time:</label>
                            <input class="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered "
                                   id="end_time" name="end_time"
                                   required
                                   type="datetime-local">
                        </div>
                        <div class="flex items-center justify-between">
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline btn btn-primary"
                                    type="submit">
                                Create Event
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    `;
    this.setDatetimeValue('start_time');
    this.setDatetimeValue('end_time', 60);
  }

  setDatetimeValue(id, offsetMinutes = 0) {
    const now = new Date();
    const local = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000 + offsetMinutes * 60000,
    );
    const value = local.toISOString().slice(0, 16);
    document.getElementById(id).value = value;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelector('.container')
    .addEventListener('submit', async event => {
      const eventForm = event.target;
      if (!eventForm.matches('#eventForm')) {
        return;
      }
      event.preventDefault();

      const title = eventForm.querySelector('#title').value;
      const description = eventForm.querySelector('#description').value;
      const location = eventForm.querySelector('#location').value;
      const startTimeInput = eventForm.querySelector('#start_time').value;
      const endTimeInput = eventForm.querySelector('#end_time').value;

      // Convert local datetime strings to UTC ISO strings
      const startTimeUTC = new Date(startTimeInput).toISOString();
      const endTimeUTC = new Date(endTimeInput).toISOString();

      try {
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
              title: title,
              description: description,
              location: location,
              start_time: startTimeUTC,
              end_time: endTimeUTC,
            }),
          },
        );

        const responseData = await response.json();

        if (responseData.ok) {
          console.log('Event created successfully:', responseData);
        } else {
          console.error('Error creating event:', responseData);
        }
      } catch (error) {
        console.error('There was an error sending the request:', error);
      }
    });
});
customElements.define('event-creation-component', EventCreationComponent);
