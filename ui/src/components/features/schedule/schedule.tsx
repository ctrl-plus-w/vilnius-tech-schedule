'use client';

import React, { ElementRef, forwardRef, useCallback, useEffect, useRef } from 'react';

import { Box, BoxProps, ScrollArea } from '@radix-ui/themes';

import Table from '@/feature/schedule/table';

import { useSchedule } from '@/context/schedule-context';

import useOnResize from '@/hook/use-on-resize';

import { getPosFromDate } from '@/util/schedule';

const ScheduleSchedule = forwardRef<ElementRef<'div'>, BoxProps>(({ children, ...props }, ref) => {
  const { interval, headerRef, eventSizeRef, setHasResized, cellHeight } = useSchedule();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useOnResize(
    useCallback(() => {
      setHasResized(Math.random());
    }, []),
    true,
  );

  useEffect(() => {
    setHasResized(Math.random());
  }, [cellHeight]);

  useEffect(() => {
    if (!scrollAreaRef.current) return;
    if (!eventSizeRef.current) return;

    const { y } = getPosFromDate(new Date(), interval, eventSizeRef, headerRef);
    scrollAreaRef.current.scrollTo(0, y);
  }, []);

  return (
    <Box minHeight="0" {...props} ref={ref}>
      <ScrollArea ref={scrollAreaRef}>
        <div className="relative select-none" tabIndex={0}>
          <Table />
          {children}
        </div>
      </ScrollArea>
    </Box>
  );
});
ScheduleSchedule.displayName = 'ScheduleSchedule';

export default ScheduleSchedule;
