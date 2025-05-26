import './events-action-menu.js';
import './event-creation-component.js'
import './services/get-upcoming-events.js'
import {supabase} from "../supabase-client/supabase-client.js";
import {format, parseISO} from 'date-fns';
import {getUpcomingEvents} from "./services/get-upcoming-events.js";
import {downloadICS} from './services/calendar.js';

class EventsContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="flex"
          x-data=" { is_creating_new_event: false  }">
          <div
            class="page-container flex-1"
            hx-trigger="load"
            hx-target=".events-agenda"
            >
            <header class="space-y-4 my-4">
              <div class="flex">
                <div class="prose">
                  <h1 x-text="capitalize(page)"></h1>
                </div>
                <events-action-menu class="ml-auto block xl:hidden"></events-action-menu>
              </div>
              <div class="join mb-4 w-full">
                <button class="btn join-item flex-1">All Events</button>
                <button class="btn join-item flex-1">My Events</button>
              </div>
            </header>
            <div class="events-agenda not-prose flex-1" x-show="!is_creating_new_event"></div>
            <template class="event-card-template">
              <div class="card bg-base-100 shadow-sm mb-5">
                <div class="card-body">
                  <div class="event-datetime flex justify-between">
                    <h2 class="event-date sm:text-3xl text-xl">April 20th, 2025</h2>
                    <span class="event-time badge badge-soft badge-lg sm:badge-xl badge-success"
                      >4:00pm</span
                      >
                  </div>
                  <div class="title-container flex">
                    <h2 class="title text-xl sm:text-xl font-bold">
                      an obnoxiously long title because people suck and try to make my life
                      hard
                    </h2>
                  </div>
                  <div class="event-description text-sm mb-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat
                  </div>
                  <div class="participants sm:flex justify-between">
                    <span class="host-user btn btn-md btn-outline btn-info mb-2 md:mb-0">
                      Host: Francesca
                    </span>
                    <div class="attendance join flex">
                      <button class="yes-button btn flex-1/4 sm:flex-none btn-md btn-outline btn-success join-item">
                      Yes: 12
                      </button>
                      <button
                        class="maybe-button btn flex-1/3 sm:flex-none btn-md btn-outline btn-warning join-item"
                        >
                      Maybe: 22
                      </button>
                      <button class="no-button flex-1/4 sm:flex-none block btn btn-md btn-outline btn-error join-item">
                      No: 2
                      </button>
                    </div>
                    <button class="download-calendar-btn btn btn-ghost p-1">
                      <span class="iconify text-3xl sm:text-2xl" data-icon="mdi-calendar-export"></span>
                    </button>
                  </div>
                </div>
              </div>
            </template>
            <event-creation-component class="flex-1" x-show="is_creating_new_event"></event-creation-component>
          </div>
          <events-action-menu class="hidden xl:block"></events-action-menu>
        </div>
    `;
    }
}

async function signIn() {
    const {data: signInData, error: signInError} = await supabase.auth.signInWithPassword({
        email: 'kenqiwu@gmail.com',
        password: 'adsihn9',
    });

    if (signInError) {
        console.error('Sign-in error:', signInError);
    }
}

function selectEventElements() {
    const template = document.querySelector('.event-card-template');
    const agenda = document.querySelector('.events-agenda');
    return {template, agenda};
}

function populateEventElementsWithData(template, event, agenda) {
    const templateClone = template.content.cloneNode(true);

    const date = parseISO(event['start_time']);
    const startDate = format(date, "MMMM do, yyyy"); // e.g., April 20th, 2025
    const startTime = format(date, "h:mmaaa").toLowerCase(); // e.g., 11:00pm

    const titleElem = templateClone.querySelector('.title');
    if (titleElem) {
        titleElem.textContent = event.title;
    }

    const hostElem = templateClone.querySelector('.host-user');
    if (hostElem) {
        hostElem.textContent = `Host: ${event.host[0].first_name}`;
    }

    const descElem = templateClone.querySelector('.event-description');
    if (descElem) {
        descElem.textContent = event.description || '';
    }

    const startTimeElem = templateClone.querySelector('.event-time');
    if (startTimeElem) {
        startTimeElem.textContent = startTime;
    }

    const startDateElem = templateClone.querySelector('.event-date');
    if (startDateElem) {
        startDateElem.textContent = startDate;
    }

    const yesButtonElem = templateClone.querySelector('.yes-button');
    if (yesButtonElem) {
        yesButtonElem.textContent = `Yes: ${event.attendance_yes_count}` || 'Yes: 0';
    }

    const maybeButtonElem = templateClone.querySelector('.maybe-button');
    if (maybeButtonElem) {
        maybeButtonElem.textContent = `Maybe: ${event.attendance_maybe_count}` || 'Maybe: 0';
    }

    const noButtonElem = templateClone.querySelector('.no-button');
    if (noButtonElem) {
        noButtonElem.textContent = `No: ${event.attendance_no_count}` || 'No: 0';
    }

    const downloadBtn = templateClone.querySelector('.download-calendar-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => downloadICS(event));
    }

    agenda.appendChild(templateClone);
}

function mockGetUpcomingEvents() {
    return [
        {
            "id": "ff005eee-81d1-46f4-93bf-75966030fbf8",
            "title": "an obnoxiously long title because people suck and try to make my life hard",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
            "start_time": "2025-05-17T06:15:00+00:00",
            "end_time": "2025-05-30T06:15:00+00:00",
            "host": [
                {
                    "user_id": "584850d8-59d1-4f48-b83d-85d97bd4dee6",
                    "first_name": "Francesca"
                }
            ],
            "created_at": "2025-04-26T13:15:36.138078+00:00",
            "cohosts": [
                null
            ],
            "participants": [
                {
                    "user_id": "f18d6f00-b861-45bd-bad9-2d3c1b772323",
                    "first_name": "f1",
                    "attendance_answer": "yes"
                }
            ],
            "attendance_yes_count": 12,
            "attendance_maybe_count": 31,
            "attendance_no_count": 9
        },
        {
            "id": "c5fc677f-f021-40a7-81e4-da7ad8a46fa1",
            "created_at": "2025-04-25T15:28:31.200507+00:00",
            "title": "picnic",
            "description": null,
            "start_time": "2025-06-22T19:10:25+00:00",
            "end_time": "2025-06-22T22:10:25+00:00",
            "host": [
                {
                    "user_id": "f18d6f00-b861-45bd-bad9-2d3c1b772323",
                    "first_name": "Francesca"
                }
            ],
            "cohosts": [
                null
            ],
            "participants": [
                {
                    "user_id": null,
                    "first_name": null,
                    "attendance_answer": null
                }
            ],
            "attendance_yes_count": 0,
            "attendance_maybe_count": 0,
            "attendance_no_count": 0
        },
        {
            "id": "d02afaa9-64ad-4abb-9151-7a35c0dadd19",
            "title": "anotherrr",
            "description": null,
            "start_time": "2025-07-10T09:45:00+00:00",
            "end_time": "2025-07-26T09:45:00+00:00",
            "host": [
                {
                    "user_id": "584850d8-59d1-4f48-b83d-85d97bd4dee6",
                    "first_name": "58"
                }
            ],
            "created_at": "2025-04-25T16:52:46.177964+00:00",
            "cohosts": [
                null
            ],
            "participants": [
                {
                    "user_id": "f18d6f00-b861-45bd-bad9-2d3c1b772323",
                    "first_name": "f1",
                    "attendance_answer": "no"
                }
            ],
            "attendance_yes_count": 0,
            "attendance_maybe_count": 0,
            "attendance_no_count": 1
        }
    ];
}

// on load: retrieves events from server and populates events agenda
document.addEventListener('DOMContentLoaded', async () => {
    let data = await getUpcomingEvents();

    const {template, agenda} = selectEventElements();

    data.forEach(event => {
        populateEventElementsWithData(template, event, agenda);
    });
});


customElements.define('events-container', EventsContainer);
