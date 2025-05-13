import {EventsService} from "../../../events/events-service.js";

'../../repositories/events.js'

const mockEvents = [
    {
        "id": "d02afaa9-64ad-4abb-9151-7a35c0dadd19",
        "title": "anotherrr",
        "description": null,
        "start_time": "2025-07-10T09:45:00+00:00",
        "end_time": "2025-07-26T09:45:00+00:00",
        "user_id": "584850d8-59d1-4f48-b83d-85d97bd4dee6",
        "created_at": "2025-04-25T16:52:46.177964+00:00",
        "cohosts": [
            null
        ],
        "participants": [
            [
                {
                    "user_id": "f18d6f00-b861-45bd-bad9-2d3c1b772323",
                    "first_name": "f1",
                    "attendance_answer": "yes"
                }
            ]
        ],
        "first_name": "58",
        "attendance_yes_count": 0,
        "attendance_maybe_count": 0,
        "attendance_no_count": 1
    },
    {
        "id": "c5fc677f-f021-40a7-81e4-da7ad8a46fa1",
        "title": "picnic",
        "description": null,
        "start_time": "2025-06-22T19:10:25+00:00",
        "end_time": "2025-06-22T22:10:25+00:00",
        "user_id": "f18d6f00-b861-45bd-bad9-2d3c1b772323",
        "created_at": "2025-04-25T15:28:31.200507+00:00",
        "cohosts": [
            null
        ],
        "participants": [
            [
                {
                    "user_id": "f18d6f00-b861-45bd-bad9-2d3c1b772323",
                    "first_name": "f1",
                    "attendance_answer": "no"
                }
            ]
        ],
        "first_name": "f1",
        "attendance_yes_count": 0,
        "attendance_maybe_count": 0,
        "attendance_no_count": 0
    },
    {
        "id": "ff005eee-81d1-46f4-93bf-75966030fbf8",
        "title": "tfwa",
        "description": null,
        "start_time": "2025-05-17T06:15:00+00:00",
        "end_time": "2025-05-30T06:15:00+00:00",
        "user_id": "584850d8-59d1-4f48-b83d-85d97bd4dee6",
        "created_at": "2025-04-26T13:15:36.138078+00:00",
        "cohosts": [
            null
        ],
        "participants": [
            [
                {
                    "user_id": "f18d6f00-b861-45bd-bad9-2d3c1b772323",
                    "first_name": "f1",
                    "attendance_answer": "maybe"
                }
            ]
        ],
        "first_name": "58",
        "attendance_yes_count": 1,
        "attendance_maybe_count": 0,
        "attendance_no_count": 0
    }
]

export const events = new EventsService();

events.loadMockData(mockEvents);

console.log(events.getAll());