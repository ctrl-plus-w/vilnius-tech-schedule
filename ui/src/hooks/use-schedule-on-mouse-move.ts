import { MouseEventHandler } from 'react';

import { useSchedule } from '@/context/schedule-context';

import { copyTime } from '@/util/date';
import { getDateFromPos } from '@/util/schedule';

const useScheduleOnMouseMove = () => {
  const { eventSizeRef, interval, currentEvent, setCurrentEvent } = useSchedule();

  const onMouseMove: MouseEventHandler = (event) => {
    if (!currentEvent || !currentEvent.from.getTime()) return;

    const to = getDateFromPos(event.clientX, event.clientY, eventSizeRef, interval);
    if (!to) return;

    if (to === currentEvent.from) {
      setCurrentEvent({ ...currentEvent, from: currentEvent.from, to });
      return;
    }

    if (currentEvent.from.getDate() !== to.getDate()) {
      const from = copyTime(new Date(to), currentEvent.from);
      if (currentEvent.from.getTime() !== from.getTime()) setCurrentEvent({ ...currentEvent, from, to });

      return;
    }

    if (currentEvent.to.getTime() !== to.getTime()) {
      setCurrentEvent({ ...currentEvent, from: currentEvent.from, to });
    }
  };

  return onMouseMove;
};

export default useScheduleOnMouseMove;
