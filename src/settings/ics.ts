const p = (n: number) => String(n).padStart(2, '0');
const stamp = (d: Date) => `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;

/** Next local occurrence of hh:mm at or after `now`. */
function nextAt(now: Date, h: number, m: number): Date {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  if (d.getTime() < now.getTime()) d.setDate(d.getDate() + 1);
  return d;
}

function event(uid: string, start: Date, summary: string, now: Date): string[] {
  return [
    'BEGIN:VEVENT',
    `UID:${uid}@itp-prep`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(start)}`,
    'DURATION:PT60M',
    'RRULE:FREQ=DAILY',
    `SUMMARY:${summary}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${summary}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
  ];
}

/** Calendar file with daily reminders at 07:00 and 16:30 (floating local time). */
export function buildReminderIcs(now: Date): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ITP Prep//Reminders//EN',
    'CALSCALE:GREGORIAN',
    ...event('morning', nextAt(now, 7, 0), 'TOEFL morning session', now),
    ...event('afternoon', nextAt(now, 16, 30), 'TOEFL afternoon session', now),
    'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}
