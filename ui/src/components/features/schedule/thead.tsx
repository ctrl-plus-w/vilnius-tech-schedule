import { ElementRef, forwardRef, HTMLAttributes } from 'react';

import { eachDayOfInterval, format, isSameDay } from 'date-fns';

import { useSchedule } from '@/context/schedule-context';

import { cn } from '@/util/style';

const ScheduleTHead = forwardRef<ElementRef<'table'>, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => {
    const { interval } = useSchedule();

    return (
      <table className={cn('w-full table-fixed', className)} ref={ref} {...props}>
        <thead className="border-b border-gray-5">
          <tr>
            <th className="w-12 text-left"></th>

            {eachDayOfInterval(interval).map((day) => {
              return (
                <th
                  key={day.toISOString()}
                  className={cn('text-2 font-medium', isSameDay(new Date(), day) && 'text-red-11')}
                >
                  {format(day, 'EEE d')}
                </th>
              );
            })}
          </tr>
          <tr>
            <th className="h-2 w-12 text-left"></th>

            {eachDayOfInterval(interval).map((day) => {
              return <th key={day.toISOString()} className="border-l border-gray-5"></th>;
            })}
          </tr>
        </thead>
      </table>
    );
  },
);
ScheduleTHead.displayName = 'ScheduleTHead';

export default ScheduleTHead;
