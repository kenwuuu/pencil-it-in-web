class FriendSearchComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="page-container flex">
                <button class="btn btn-lg mr-4"
                        x-on:click=" is_searching_for_friends = !is_searching_for_friends ">
                    <iconify-icon icon="mdi:arrow-left-thick"></iconify-icon>
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

customElements.define('friend-search-component', FriendSearchComponent);
