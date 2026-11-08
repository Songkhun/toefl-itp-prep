import { buildReminderIcs } from '../../src/settings/ics';

describe('buildReminderIcs', () => {
  const ics = buildReminderIcs(new Date(2026, 10, 9, 12, 0));
  it('has two daily repeating events at 07:00 and 16:30 local', () => {
    expect(ics.match(/RRULE:FREQ=DAILY/g)).toHaveLength(2);
    expect(ics).toMatch(/DTSTART:20261110T070000\r\n/);
    expect(ics).toMatch(/DTSTART:20261109T163000\r\n/);
    expect(ics).toContain('SUMMARY:TOEFL morning session');
    expect(ics).toContain('SUMMARY:TOEFL afternoon session');
    expect(ics.match(/BEGIN:VALARM/g)).toHaveLength(2);
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
  });
});
