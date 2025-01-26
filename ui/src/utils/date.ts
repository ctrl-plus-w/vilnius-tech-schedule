import {
  addDays,
  addWeeks,
  differenceInWeeks,
  eachDayOfInterval,
  formatDuration,
  getDay,
  Interval,
  intervalToDuration,
  isSameDay,
  setDay,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from 'date-fns';

import { Day, days } from '@/type/subjects';

export const formatSecsDuration = (secs: number): string => {
  const duration = intervalToDuration({ start: new Date(0), end: new Date(secs * 1000) });

  if (duration.days) {
    duration.hours = (duration.hours ?? 0) + duration.days * 24;
    duration.days = 0;
  }

  if (duration.hours) duration.seconds = 0;

  return formatDuration(duration);
};

export const sortByCreatedAt = <T extends { created_at: string }>(arr: T[], asc?: boolean) => {
  return arr.toSorted((a, b) => {
    const [e1, e2] = asc ? [a, b] : [b, a];
    return new Date(e1.created_at).getTime() - new Date(e2.created_at).getTime();
  });
};

export const sortByUpdatedAt = <T extends { updated_at: string | null; created_at: string }>(
  arr: T[],
  asc?: boolean,
) => {
  return arr.toSorted((a, b) => {
    const [e1, e2] = asc ? [a, b] : [b, a];
    return new Date(e1.updated_at ?? e1.created_at).getTime() - new Date(e2.updated_at ?? e2.created_at).getTime();
  });
};

export const convertToDateTimeLocalString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const isSameTime = (a: Date, b: Date) => {
  return a.getHours() === b.getHours() && a.getMinutes() === b.getMinutes() && a.getSeconds() === b.getSeconds();
};

export const MINUTE_IN_MS = 60 * 1000;
export const HOUR_IN_MS = MINUTE_IN_MS * 60;

export const difference = (a: Date, b: Date) =>
  (a.getHours() - b.getHours()) * HOUR_IN_MS +
  (a.getMinutes() - b.getMinutes()) * MINUTE_IN_MS +
  (a.getSeconds() - b.getSeconds()) * 1000;

export const copyTime = (date: Date, time: Date) => {
  const tmp = new Date(time);
  const cpy = new Date(date);
  cpy.setHours(tmp.getHours());
  cpy.setMinutes(tmp.getMinutes());
  return cpy;
};

export const get24Hours = (date: Date) => {
  const dates: Date[] = [];

  for (let i = 0; i < 24; i++) {
    dates.push(setHours(date, i));
  }

  return dates;
};

export const getWeekInterval = (date: Date): Interval => {
  return {
    start: setDay(date, 1, { weekStartsOn: 1 }),
    end: setDay(date, 0, { weekStartsOn: 1 }),
  };
};

export const cleanIntervalTime = (interval: Interval) => {
  return { start: resetIntervalStart(interval.start), end: resetIntervalEnd(interval.end) };
};

export const resetIntervalStart = (date: Date | string | number) => {
  return setHours(setMinutes(setSeconds(setMilliseconds(date, 1), 0), 0), 0);
};

export const resetIntervalEnd = (date: Date | string | number) => {
  return setHours(setMinutes(setSeconds(setMilliseconds(date, 9999), 59), 59), 23);
};

export const getNthDayInInterval = (date: Date, interval: Interval) => {
  const daysInInterval = eachDayOfInterval(interval);

  for (let i = 0; i < daysInInterval.length; i++) {
    if (isSameDay(daysInInterval[i], date)) return i;
  }

  return undefined;
};

export const getNextDay = (date: string | number | Date, targetDay: Day): Date => {
  const currentDayIndex = getDay(date);
  console.log(currentDayIndex, date);
  const targetDayIndex = days.indexOf(targetDay);

  // Calculate days to add to reach the next occurrence of the target day
  const daysToAdd =
    targetDayIndex >= currentDayIndex ? targetDayIndex - currentDayIndex : 7 - currentDayIndex + targetDayIndex;

  return addDays(date, daysToAdd || 7);
};

export const getRelativeDateInInterval = (date: string | number | Date, interval: Interval) => {
  const weeksDiff = differenceInWeeks(date, interval.end);
  return addWeeks(date, -weeksDiff);
};
