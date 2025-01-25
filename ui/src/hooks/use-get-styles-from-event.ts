import { CSSProperties } from 'react';

import { useSchedule } from '@/context/schedule-context';

import { difference, HOUR_IN_MS } from '@/util/date';
import { getEventDaysEvents, getOverlappingEvents, getPosFromDate, sortByFrom } from '@/util/schedule';

import { TScheduleEvent } from '@/type/schedule';

const useGetStylesFromEvent = () => {
  const { events, interval, eventSizeRef, headerRef } = useSchedule();

  return (event: TScheduleEvent): CSSProperties => {
    let { from, to }: TScheduleEvent = event;

    const { isCurrent } = event;

    if (!from || !to) return {};

    if (from > to) {
      const tmp = from;
      from = to;
      to = tmp;
    }

    const eventSizeElement = eventSizeRef.current;
    if (!eventSizeElement) return {};

    const rect = eventSizeElement.getBoundingClientRect();

    const pos = getPosFromDate(from, interval, eventSizeRef, headerRef);
    const dif = difference(to, from);
    if (dif === 0) return {};

    const out: CSSProperties = {
      top: `${pos.y}px`,
      height: `${Math.floor((dif / HOUR_IN_MS) * rect.height)}px`,
    };

    // do not compute overlapping elements if this is the current event
    if (isCurrent) {
      out.left = `${pos.x}px`;
      out.width = `${rect.width}px`;
      out.zIndex = 99;

      return out;
    }

    // Compute overlapping elements to determine element width
    //   (Logic mostly copied from observations about Google Calendar,
    //   with a few tweaks)
    let x: number = pos.x + rect.width * 0.05;
    let w: number = 0.9 * rect.width;

    const eventsDaysEvents = events
      .map(getEventDaysEvents)
      .flat()
      .map(({ event }) => event);

    const overlaps = getOverlappingEvents(event, eventsDaysEvents);

    if (overlaps.length > 0) {
      const sortedOverlaps = sortByFrom(overlaps);

      for (let i = 0; i < sortedOverlaps.length; i++) {
        const prevOverlap = sortedOverlaps[i - 1];
        const overlap = sortedOverlaps[i];

        if (prevOverlap) {
          const diff = Math.abs(difference(prevOverlap.from, overlap.from));

          // in case the difference lower than 30mins, we divide the styling element width by 2
          // otherwise, we just slide it off by 5px
          if (diff <= HOUR_IN_MS / 2) {
            w /= 2;
            x += w;
          } else {
            w -= 5;
            x += 5;
          }
        }

        // set the zIndex and exit the loop in case the overlap element is the styling element
        if (overlap.id === event.id && event.id !== '') {
          out.zIndex = i;
          break;
        }
      }
    }

    out.left = `${x}px`;
    out.width = `${w}px`;

    return out;
  };
};

export default useGetStylesFromEvent;
