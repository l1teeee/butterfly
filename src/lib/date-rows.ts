const WEEKDAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
] as const;

export function toDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function splitWord(word: string): string[] {
  if (word.length <= 4) {
    return [word];
  }
  if (word.length <= 6) {
    return [word.slice(0, 3), word.slice(3)];
  }
  return [
    word.slice(0, 3),
    word.slice(3, word.length - 3),
    word.slice(word.length - 3),
  ];
}

export function dateRows(dayKey: string): string[] {
  const [year, month, day] = dayKey.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
  const monthName = MONTHS[month - 1];
  return [
    ...splitWord(weekday),
    String(day),
    ...splitWord(monthName),
    String(year),
  ];
}

export function dateLabel(dayKey: string): string {
  const [year, month, day] = dayKey.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
  const monthName = MONTHS[month - 1];
  return `${weekday} ${day} ${monthName} ${year}`;
}
