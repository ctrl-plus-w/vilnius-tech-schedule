'use client';

import { useMemo } from 'react';

import { isWithinInterval } from 'date-fns';

import ScheduleEvent from '@/feature/schedule/event';

import { useSchedule } from '@/context/schedule-context';

import { getRelativeDateInInterval } from '@/util/date';
import { sortByFrom } from '@/util/schedule';

export const Events = () => {
  const { events, currentEvent, interval } = useSchedule();

  // TODO: Make week 1 and week 2 work

  const intervalEvents = useMemo(
    () => events.filter((event) => isWithinInterval(event.from, interval)),
    [events, interval],
  );

  const relativeIntervalEvents = useMemo(() => {
    const recurringEvents = events.filter((event) => event.recurring);

    return recurringEvents
      .map((event) => ({
        ...event,
        from: getRelativeDateInInterval(event.from, interval),
        to: getRelativeDateInInterval(event.to, interval),
      }))
      .filter((event) => {
        if (intervalEvents.some(({ id }) => id === event.id)) return false;
        if (!event.recurring?.from || !event.recurring?.to) return false;

        return (
          isWithinInterval(event.from, { start: event.recurring.from, end: event.recurring.to }) &&
          isWithinInterval(event.from, interval)
        );
      });
  }, [intervalEvents, events, interval]);

  const combinedEvents = useMemo(
    () => sortByFrom([...intervalEvents, ...relativeIntervalEvents]),
    [intervalEvents, relativeIntervalEvents],
  );

  return (
    <>
      {combinedEvents.map((event) => (
        <ScheduleEvent event={event} key={event.id} />
      ))}

      {currentEvent && <ScheduleEvent event={currentEvent} />}
    </>
  );
};

export default Events;
