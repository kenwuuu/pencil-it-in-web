import { createEvent } from 'ics';

export function downloadICS(event) {
  const start = new Date(event.start_time);

  const icsEvent = {
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
    url: event.url || '',
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    organizer: { 
      name: `${event.host?.[0]?.first_name ?? ''} ${event.host?.[0]?.last_name ?? ''}`.trim() || 'Pencil It In',
      email: 'noreply@pencil-it-in.com' 
    },
    productId: 'PencilItIn/Calendar'
  };

  const { error, value } = createEvent(icsEvent);
  
  if (error) {
    console.error('ICS Generation Error:', error);
    alert('Failed to generate calendar file');
    return;
  }

  const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
