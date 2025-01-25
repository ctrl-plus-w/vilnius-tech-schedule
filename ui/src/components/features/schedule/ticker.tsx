'use client';

import React, { useState } from 'react';

import { isWithinInterval } from 'date-fns';

import { useSchedule } from '@/context/schedule-context';

import useOnResize from '@/hook/use-on-resize';

import { getPosFromDate } from '@/util/schedule';
import { cn } from '@/util/style';

const ScheduleTicker = () => {
  const { interval, eventSizeRef, headerRef } = useSchedule();

  const [width, setWidth] = useState(0);

  const coordinates = getPosFromDate(new Date(), interval, eventSizeRef, headerRef);

  useOnResize(() => {
    if (!eventSizeRef.current) return;
    setWidth(eventSizeRef.current.getBoundingClientRect().width);
  }, true);

  if (!coordinates.x || !coordinates.y) return <></>;

  return (
    <div
      className={cn(
        'pointer-events-none absolute z-[99] -translate-y-[4px] transform',
        isWithinInterval(new Date(), interval) ? 'block' : 'hidden',
      )}
      style={{
        left: `${coordinates.x}px`,
        top: `${coordinates.y}px`,
        width: `${width}px`,
      }}
    >
      <div className="size-2.5 -translate-x-[5px] transform rounded-full bg-accent-10" />
      <div className="h-px -translate-y-[6px] transform bg-accent-10" />
    </div>
  );
};

export default ScheduleTicker;
