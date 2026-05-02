export function getIsoWeek(date: Date): { year: number; week: number } {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  return { year: target.getUTCFullYear(), week };
}

export function getWeekRange(year: number, week: number): { start: Date; end: Date } {
  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const day = simple.getUTCDay() || 7;
  const start = new Date(simple);

  if (day <= 4) {
    start.setUTCDate(simple.getUTCDate() - day + 1);
  } else {
    start.setUTCDate(simple.getUTCDate() + 8 - day);
  }

  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  return { start, end };
}

export function toDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function toUnix(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}
