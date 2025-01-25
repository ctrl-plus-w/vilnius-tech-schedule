import { MouseEventHandler } from 'react';

import { useSchedule } from '@/context/schedule-context';

import { getDateFromPos } from '@/util/schedule';

const useScheduleOnMouseDown = () => {
  const { editable, headerRef, eventSizeRef, interval, setCurrentEvent } = useSchedule();

  const onMouseDown: MouseEventHandler = (event) => {
    if (!editable) return;

    const target = event.target as HTMLElement;
    if (target.tagName === 'TH' || target.className.indexOf('time') > -1) return;

    const header = headerRef.current;
    if (!header) return;

    const rect = header.getBoundingClientRect();
    if (event.clientY <= rect.y + rect.height) return;

    const from = getDateFromPos(event.clientX, event.clientY, eventSizeRef, interval);
    if (!from) return;

    setCurrentEvent(() => ({
      id: '',
      name: '(No title)',
      from: from,
      to: from,
      isCurrent: true,
      color: 'gray',
    }));
  };

  return onMouseDown;
};

export default useScheduleOnMouseDown;
