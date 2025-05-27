import {createEvent} from 'ics';

function getEventUrl(event) {
    // test for valid url, returns itself if valid, returns nothing if invalid
    return /^https?:\/\//.test(event.url)
        ? event.url
        : undefined;
}

function getHostName(event) {
    // formats host name, uses Pencil It In as fallback
    const firstName = event.host?.[0]?.first_name ?? '';
    const lastName = event.host?.[0]?.last_name ?? '';
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || 'Pencil It In';
}

function buildIcsEventData(event) {
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);

    return {
        title: event.title,
        description: event.description || 'Event created via Pencil It In',
        start: [
            start.getUTCFullYear(),
            start.getUTCMonth() + 1,
            start.getUTCDate(),
            start.getUTCHours(),
            start.getUTCMinutes()
        ],
        end: [
            end.getUTCFullYear(),
            end.getUTCMonth() + 1,
            end.getUTCDate(),
            end.getUTCHours(),
            end.getUTCMinutes()
        ],
        location: event.location || '',
        url: getEventUrl(event),
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
        organizer: {
            name: getHostName(event),
            email: 'noreply@pencil-it-in.com'
        },
        productId: 'PencilItIn/Calendar'
    };
}

function startAutomaticDownload(url, event) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export function downloadICS(event) {
    const icsEvent = buildIcsEventData(event);

    const {error, value} = createEvent(icsEvent);

    if (error) {
        console.error('ICS Generation Error:', error);
        alert('Failed to generate calendar file');
        return;
    }

    const blob = new Blob([value], {type: 'text/calendar;charset=utf-8'});
    const url = URL.createObjectURL(blob);

    startAutomaticDownload(url, event);

    // Clean up object URL to prevent memory leaks
    setTimeout(() => URL.revokeObjectURL(url), 100);
}
