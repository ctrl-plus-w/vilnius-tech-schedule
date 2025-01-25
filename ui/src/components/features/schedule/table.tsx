import React from 'react';

import { eachDayOfInterval, format, setMinutes } from 'date-fns';

import { useSchedule } from '@/context/schedule-context';

import useScheduleOnMouseDown from '@/hook/use-schedule-on-mouse-down';
import useScheduleOnMouseMove from '@/hook/use-schedule-on-mouse-move';
import useScheduleOnMouseUp from '@/hook/use-schedule-on-mouse-up';

import { get24Hours } from '@/util/date';
import { cn } from '@/util/style';

const ScheduleTable = () => {
  const { eventSizeRef, headerRef, interval, cellHeight } = useSchedule();

  const onMouseDown = useScheduleOnMouseDown();
  const onMouseUp = useScheduleOnMouseUp();
  const onMouseMove = useScheduleOnMouseMove();

  return (
    <table
      role="presentation"
      className="w-full table-fixed"
      cellPadding={0}
      cellSpacing={0}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <thead>
        <tr>
          <th ref={headerRef} className="w-12 text-left"></th>
          {eachDayOfInterval(interval).map((day) => (
            <th key={day.toISOString()}></th>
          ))}
        </tr>
      </thead>

      <tbody>
        {get24Hours(setMinutes(new Date(), 0)).map((date, i) => (
          <tr key={i}>
            {i ? (
              <td className="group -translate-y-1/2 transform !border-none text-left text-1 text-gray-8">
                <div className="flex items-center justify-between gap-2">
                  <p>{format(date, 'HH:mm')}</p>
                  <span className="h-px w-full bg-gray-5"></span>
                </div>
              </td>
            ) : (
              <td></td>
            )}

            {eachDayOfInterval(interval).map((day, j) => (
              <td
                key={day.toISOString()}
                ref={i === 0 && j === 0 ? eventSizeRef : null}
                className={cn('border-l border-gray-5', i !== 23 && 'border-b')}
                style={{ height: `${cellHeight}px` }}
              ></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ScheduleTable;
