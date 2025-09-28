export function buildICS({
  uid,
  title,
  description,
  location,
  start,
  end,
  url,
}: {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end?: Date;
  url?: string;
}) {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dtstamp = fmt(new Date());
  const dtstart = fmt(start);
  const dtend = fmt(end ?? new Date(start.getTime() + 2 * 60 * 60 * 1000));
  const escape = (s?: string) => (s ? s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;') : '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MMABalkan//Event//SR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${escape(uid)}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${escape(title)}`,
    description ? `DESCRIPTION:${escape(description)}` : '',
    location ? `LOCATION:${escape(location)}` : '',
    url ? `URL:${escape(url)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);
  return lines.join('\r\n');
}

export function downloadICS(filename: string, content: string) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
