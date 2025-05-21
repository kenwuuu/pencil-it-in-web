import {supabase} from "../supabase-client/supabase-client.js";

class EventCreationComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="page-container flex px-8 sm:px-16">
                <button class="btn btn-lg mr-4"
                        x-on:click=" is_creating_new_event = !is_creating_new_event ">
                    <span class="iconify" data-icon="mdi-arrow-left-thick"></span>
                </button>
                <div class="container mx-auto p-6 bg-white shadow-md rounded-md w-96">
                    <h2 class="text-2xl font-semibold mb-4">Create New Event</h2>
                    <form id="eventForm">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="title">Title:</label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered w-full"
                                   id="title" name="title"
                                   required
                                   type="text">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="start_time">Start Time:</label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered w-full"
                                   id="start_time" name="start_time"
                                   required
                                   type="datetime-local">
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="end_time">End Time:</label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input input-bordered w-full"
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
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.container').addEventListener('submit', async (event) => {
        const eventForm = event.target; // Get the specific form that was submitted
        if (!eventForm.matches('#eventForm')) {
            return; // Only process submissions from the eventForm
        }
        event.preventDefault();
        console.log('submit');

        const title = eventForm.querySelector('#title').value;
        const startTime = eventForm.querySelector('#start_time').value;
        const endTime = eventForm.querySelector('#end_time').value;
        const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wb3Vua2xuZnJjZnBrZWZpZGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxODE0OTcsImV4cCI6MjA1Nzc1NzQ5N30.wZlH6_dd0WtEVC-BtMXEzcTUgSAIlegqSPnr3dyvjyA';

        console.log(supabase.auth.getUser())

        try {
            const session = await supabase.auth.getSession()
            const response = await fetch('https://mpounklnfrcfpkefidfn.supabase.co/rest/v1/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apiKey,
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    title: title,
                    user_id: session.data.session.user.id,
                    start_time: startTime,
                    end_time: endTime
                })
            });

            const responseData = await response.json();

            if (responseData.ok) {
                console.log('Event created successfully:', responseData);
                // Optionally display a success message or redirect the user
            } else {
                console.error('Error creating event:', responseData);
                // Optionally display an error message to the user
            }
        } catch (error) {
            console.error('There was an error sending the request:', error);
            // Optionally display a network error message
        }
    });
});


customElements.define('event-creation-component', EventCreationComponent);
