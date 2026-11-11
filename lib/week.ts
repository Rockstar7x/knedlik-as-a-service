function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getWeekStart(date: Date): string {
  const monday = new Date(date);
  const daysSinceMonday = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - daysSinceMonday);
  return toIsoDate(monday);
}

export function addWeeks(weekStart: string, weeks: number): string {
  const date = new Date(`${weekStart}T00:00:00`);
  date.setDate(date.getDate() + weeks * 7);
  return toIsoDate(date);
}

export function formatWeek(weekStart: string): string {
  const monday = new Date(`${weekStart}T00:00:00`);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const format = (date: Date) => `${date.getDate()}. ${date.getMonth() + 1}.`;
  return `${format(monday)} – ${format(sunday)}`;
}
