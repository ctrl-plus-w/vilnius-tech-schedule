import React from 'react';

import {
  addDays,
  areIntervalsOverlapping,
  eachDayOfInterval,
  Interval,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';

import { getNthDayInInterval, resetIntervalEnd, resetIntervalStart } from '@/util/date';
import { Schedule } from '@/util/genetic';

import { EventKind, IEventDaysEvent, TScheduleEvent } from '@/type/schedule';

export const getDateFromPos = (
  x: number,
  y: number,
  eventSizeRef: React.MutableRefObject<HTMLTableCellElement | null>,
  interval: Interval,
) => {
  const eventSizeElement = eventSizeRef.current;
  if (!eventSizeElement) return null;

  const rect = eventSizeElement.getBoundingClientRect();

  const xMod = Math.floor((x - rect.x) / rect.width);
  const yMod = Math.floor((y - rect.y) / rect.height);

  if (xMod < 0 || yMod < 0) return null;

  const yMinOrigin = (((y - rect.y) % rect.height) / rect.height) * 60;
  const yMin = Math.floor(yMinOrigin / 15) * 15;

  return setSeconds(setMinutes(setHours(addDays(new Date(interval.start), xMod), yMod), yMin), 0);
};

export const getPosFromDate = (
  date: Date,
  interval: Interval,
  eventSizeRef: React.MutableRefObject<HTMLTableCellElement | null>,
  headerRef: React.MutableRefObject<HTMLTableCellElement | null>,
) => {
  if (!eventSizeRef.current || !headerRef.current) return { x: 0, y: 0 };

  const rect = eventSizeRef.current.getBoundingClientRect();
  const header = headerRef.current.getBoundingClientRect();

  const day = getNthDayInInterval(date, interval);
  if (day === undefined) return { x: 0, y: 0 };

  const x: number = day * rect.width + header.width;
  const y: number = date.getHours() * rect.height + (date.getMinutes() / 60) * rect.height + header.height;

  if (Number.isNaN(x) || Number.isNaN(y)) return { x: 0, y: 0 };

  return { x, y };
};

export const getOverlappingEvents = (event: TScheduleEvent, events: TScheduleEvent[]) => {
  return events.filter((_event) => {
    return areIntervalsOverlapping({ start: _event.from, end: _event.to }, { start: event.from, end: event.to });
  });
};

export const sortByFrom = (events: TScheduleEvent[]) => {
  return events.toSorted((a, b) => a.from.getTime() - b.from.getTime());
};
export const getEventDaysEvents = (originalEvent: TScheduleEvent): IEventDaysEvent[] => {
  const eventDays = eachDayOfInterval({ start: originalEvent.from, end: originalEvent.to });
  if (eventDays.length === 1) return [{ event: originalEvent, originalEvent: originalEvent, kind: EventKind.SINGLE }];

  const middle = eventDays.slice(1, eventDays.length - 1);

  const startEvent = { ...originalEvent, from: originalEvent.from, to: resetIntervalEnd(originalEvent.from) };
  const endEvent = { ...originalEvent, from: resetIntervalStart(originalEvent.to), to: originalEvent.to };
  const middleEvents = middle.map((d) => ({ ...originalEvent, from: resetIntervalStart(d), to: resetIntervalEnd(d) }));

  return [
    { event: startEvent, kind: EventKind.START },
    ...middleEvents.map((event) => ({ event, kind: EventKind.MIDDLE })),
    { event: endEvent, kind: EventKind.END },
  ].map((event) => ({ ...event, originalEvent }));
};

export const getUnique = (schedules: Schedule[]) => {
  return schedules.filter((schedule, index, self) => self.findIndex((s) => s.eq(schedule)) === index);
};
