import {supabase} from "../supabase-client/supabase-client.js";

class EventCreationComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="page-container flex">
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
    if (localStorage.getItem('eventCreated') === 'true') {
        // Show the toast
        showToast("success");

        // Remove the flag so it doesn't show again on future reloads
        localStorage.removeItem('eventCreated');
    }

    document.querySelector('.container').addEventListener('submit', async (event) => {
        const eventForm = event.target;
        if (!eventForm.matches('#eventForm')) return;

        event.preventDefault();

        const title = eventForm.querySelector('#title').value;
        const startTime = eventForm.querySelector('#start_time').value;
        const endTime = eventForm.querySelector('#end_time').value;

        try {
            console.log("THIS code IS running")
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !sessionData.session) {
                console.error('Session error:', sessionError);
                return;
            }

            const userId = sessionData.session.user.id;

            const { data, error } = await supabase.from('events').insert([
                {
                    title: title,
                    user_id: userId,
                    start_time: startTime,
                    end_time: endTime
                }
            ]);

            if (error) {
                console.error('Error creating event:', error);
                showToast("error");
            } else {
                console.log('Event created successfully:', data);

                // Set flag to show toast popup after reload
                localStorage.setItem('eventCreated', 'true');

                // Reload
                location.reload();

            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    });
});

function showToast(status) {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast toast-end fixed bottom-4 right-4 z-50';
    let message = (status == "success" ? "Event Created!" : "Error");

    const alert = document.createElement('div');
    status == "success" ? alert.className = `alert alert-success` : alert.className = `alert alert-error`;
    alert.innerHTML = `<span>${message}</span>`;

    toastContainer.appendChild(alert);
    document.body.appendChild(toastContainer);

    // Auto remove after 2 seconds
    setTimeout(() => {
        toastContainer.classList.add('fade-out');

        toastContainer.addEventListener('animationend', () => {
            toastContainer.remove();
        });
    }, 2000);
}

customElements.define('event-creation-component', EventCreationComponent);
