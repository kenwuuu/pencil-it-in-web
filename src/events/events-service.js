// import {createEvent, deleteEvent, getEvents, updateEvent} from './eventService.js';


export class EventsService {
    constructor() {
        this.events = [];

        // this.fetchAll();
    }

    // used for testing
    loadMockData(data) {
        this.events = data.map(e => new Event(e));
    }

    async fetchAll() {
        const apiEvents = await getEvents();
        this.events = apiEvents.map(e => new Event(e));
        return this.events;
    }

    async create(eventData) {
        const createdApiEvent = await createEvent(eventData);
        const newEvent = new Event(createdApiEvent);
        this.events.push(newEvent);
        return newEvent;
    }

    async delete(eventId) {
        await deleteEvent(eventId);
        this.events = this.events.filter(e => e.id !== eventId);
    }

    async update(eventId, updates) {
        const updatedApiEvent = await updateEvent(eventId, updates);
        const updatedEvent = new Event(updatedApiEvent);
        const index = this.events.findIndex(e => e.id === eventId);
        if (index !== -1) {
            this.events[index] = updatedEvent;
        } else {
            // Optionally push it if you want to handle cases where it was not in the list
            this.events.push(updatedEvent);
        }
        return updatedEvent;
    }

    getAll() {
        return this.events;
    }

    getById(eventId) {
        return this.events.find(e => e.id === eventId) || null;
    }
}
