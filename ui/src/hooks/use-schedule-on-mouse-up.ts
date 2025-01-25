import { MouseEventHandler } from 'react';

import { addHours } from 'date-fns';

import { useSchedule } from '@/context/schedule-context';

import { isSameTime } from '@/util/date';
import { getDateFromPos } from '@/util/schedule';

const useScheduleOnMouseUp = () => {
  const { onRequestAdd, eventSizeRef, interval, currentEvent, setCurrentEvent } = useSchedule();

  const onMouseUp: MouseEventHandler = (event) => {
    if (!currentEvent || !currentEvent.from.getTime()) return;

    const tmp = { from: currentEvent.from, to: getDateFromPos(event.clientX, event.clientY, eventSizeRef, interval) };
    if (!tmp.to) return;

    if (!tmp.to || isSameTime(tmp.from, tmp.to)) tmp.to = addHours(currentEvent.from, 1);

    if (tmp.from > tmp.to) {
      const d = tmp.from;
      tmp.from = tmp.to;
      tmp.to = d;
    }

    onRequestAdd({ id: '', name: '', isCurrent: false, from: tmp.from, to: tmp.to, color: 'gray' });
    setCurrentEvent(undefined);
  };

  return onMouseUp;
};

export default useScheduleOnMouseUp;
