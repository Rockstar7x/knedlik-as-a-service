function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseIsoDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00`);
}

export function getWeekStart(date: Date): string {
  const monday = new Date(date);
  const daysSinceMonday = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - daysSinceMonday);
  return toIsoDate(monday);
}

export function addDays(isoDate: string, days: number): string {
  const date = parseIsoDate(isoDate);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

export function addWeeks(weekStart: string, weeks: number): string {
  return addDays(weekStart, weeks * 7);
}

function formatShortDate(date: Date): string {
  return `${date.getDate()}. ${date.getMonth() + 1}.`;
}

export function formatWeek(weekStart: string): string {
  const monday = parseIsoDate(weekStart);
  const sunday = parseIsoDate(addDays(weekStart, 6));
  return `${formatShortDate(monday)} – ${formatShortDate(sunday)}`;
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function formatDay(isoDate: string): string {
  const date = parseIsoDate(isoDate);
  return `${DAY_NAMES[date.getDay()]} ${formatShortDate(date)}`;
}
