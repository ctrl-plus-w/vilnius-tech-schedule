import { MouseEventHandler, useMemo } from 'react';

import { format } from 'date-fns';

import { useSchedule } from '@/context/schedule-context';

import useGetStylesFromEvent from '@/hook/use-get-styles-from-event';
import useScheduleOnMouseDown from '@/hook/use-schedule-on-mouse-down';
import useScheduleOnMouseMove from '@/hook/use-schedule-on-mouse-move';
import useScheduleOnMouseUp from '@/hook/use-schedule-on-mouse-up';

import { isSameTime } from '@/util/date';
import { getEventDaysEvents } from '@/util/schedule';
import { cn } from '@/util/style';

import { EventKind, TScheduleEvent } from '@/type/schedule';

interface IProps {
  event: TScheduleEvent;
}

const ScheduleEvent = ({ event }: IProps) => {
  const { currentEvent, setCurrentEvent, onRequestEdit } = useSchedule();

  const getStylesFromEvent = useGetStylesFromEvent();

  const onMouseDown = useScheduleOnMouseDown();
  const onMouseMove = useScheduleOnMouseMove();
  const onMouseUp = useScheduleOnMouseUp();

  const editableOnMouseUp = (scheduleEvent: TScheduleEvent): MouseEventHandler => {
    return (event) => {
      if (currentEvent && !isSameTime(currentEvent.from, currentEvent.to)) {
        return onMouseUp(event);
      }

      setCurrentEvent(undefined);
      onRequestEdit(scheduleEvent);
    };
  };

  const eventDaysEvents = useMemo(() => getEventDaysEvents(event), [event]);

  return (
    <>
      {eventDaysEvents.map(({ event: dayEvent, originalEvent, kind }) => (
        <div
          key={dayEvent.to.getTime() + dayEvent.from.getTime() + dayEvent.name}
          role="presentation"
          className={cn(
            'absolute z-[1] cursor-pointer overflow-hidden border border-transparent px-2 py-3 backdrop-blur-xl',
            'outline outline-1 outline-transparent transition-all duration-100 ease-in-out',
            kind === EventKind.START && 'rounded-t-2',
            kind === EventKind.END && 'rounded-b-2',
            kind === EventKind.SINGLE && 'rounded-2',
            originalEvent.isLive && 'rounded-b-[0] border border-dashed',
            originalEvent.color === 'gray' &&
              cn('bg-grayA-5 text-grayA-11 hover:outline-grayA-11', originalEvent.isLive && 'border-grayA-11'),
            originalEvent.color === 'gold' &&
              cn('bg-goldA-5 text-goldA-11 hover:outline-goldA-11', originalEvent.isLive && 'border-goldA-11'),
            originalEvent.color === 'bronze' &&
              cn('bg-bronzeA-5 text-bronzeA-11 hover:outline-bronzeA-11', originalEvent.isLive && 'border-bronzeA-11'),
            originalEvent.color === 'brown' &&
              cn('bg-brownA-5 text-brownA-11 hover:outline-brownA-11', originalEvent.isLive && 'border-brownA-11'),
            originalEvent.color === 'yellow' &&
              cn('bg-yellowA-5 text-yellowA-11 hover:outline-yellowA-11', originalEvent.isLive && 'border-yellowA-11'),
            originalEvent.color === 'amber' &&
              cn('bg-amberA-5 text-amberA-11 hover:outline-amberA-11', originalEvent.isLive && 'border-amberA-11'),
            originalEvent.color === 'orange' &&
              cn('bg-orangeA-5 text-orangeA-11 hover:outline-orangeA-11', originalEvent.isLive && 'border-orangeA-11'),
            originalEvent.color === 'tomato' &&
              cn('bg-tomatoA-5 text-tomatoA-11 hover:outline-tomatoA-11', originalEvent.isLive && 'border-tomatoA-11'),
            originalEvent.color === 'red' &&
              cn('bg-redA-5 text-redA-11 hover:outline-redA-11', originalEvent.isLive && 'border-redA-11'),
            originalEvent.color === 'ruby' &&
              cn('bg-rubyA-5 text-rubyA-11 hover:outline-rubyA-11', originalEvent.isLive && 'border-rubyA-11'),
            originalEvent.color === 'crimson' &&
              cn(
                'bg-crimsonA-5 text-crimsonA-11 hover:outline-crimsonA-11',
                originalEvent.isLive && 'border-crimsonA-11',
              ),
            originalEvent.color === 'pink' &&
              cn('bg-pinkA-5 text-pinkA-11 hover:outline-pinkA-11', originalEvent.isLive && 'border-pinkA-11'),
            originalEvent.color === 'plum' &&
              cn('bg-plumA-5 text-plumA-11 hover:outline-plumA-11', originalEvent.isLive && 'border-plumA-11'),
            originalEvent.color === 'purple' &&
              cn('bg-purpleA-5 text-purpleA-11 hover:outline-purpleA-11', originalEvent.isLive && 'border-purpleA-11'),
            originalEvent.color === 'violet' &&
              cn('bg-violetA-5 text-violetA-11 hover:outline-violetA-11', originalEvent.isLive && 'border-violetA-11'),
            originalEvent.color === 'iris' &&
              cn('bg-irisA-5 text-irisA-11 hover:outline-irisA-11', originalEvent.isLive && 'border-irisA-11'),
            originalEvent.color === 'indigo' &&
              cn('bg-indigoA-5 text-indigoA-11 hover:outline-indigoA-11', originalEvent.isLive && 'border-indigoA-11'),
            originalEvent.color === 'blue' &&
              cn('bg-blueA-5 text-blueA-11 hover:outline-blueA-11', originalEvent.isLive && 'border-blueA-11'),
            originalEvent.color === 'cyan' &&
              cn('bg-cyanA-5 text-cyanA-11 hover:outline-cyanA-11', originalEvent.isLive && 'border-cyanA-11'),
            originalEvent.color === 'teal' &&
              cn('bg-tealA-5 text-tealA-11 hover:outline-tealA-11', originalEvent.isLive && 'border-tealA-11'),
            originalEvent.color === 'jade' &&
              cn('bg-jadeA-5 text-jadeA-11 hover:outline-jadeA-11', originalEvent.isLive && 'border-jadeA-11'),
            originalEvent.color === 'green' &&
              cn('bg-greenA-5 text-greenA-11 hover:outline-greenA-11', originalEvent.isLive && 'border-greenA-11'),
            originalEvent.color === 'grass' &&
              cn('bg-grassA-5 text-grassA-11 hover:outline-grassA-11', originalEvent.isLive && 'border-grassA-11'),
            originalEvent.color === 'lime' &&
              cn('bg-limeA-5 text-limeA-11 hover:outline-limeA-11', originalEvent.isLive && 'border-limeA-11'),
            originalEvent.color === 'mint' &&
              cn('bg-mintA-5 text-mintA-11 hover:outline-mintA-11', originalEvent.isLive && 'border-mintA-11'),
            originalEvent.color === 'sky' &&
              cn('bg-skyA-5 text-skyA-11 hover:outline-skyA-11', originalEvent.isLive && 'border-skyA-11'),
          )}
          style={getStylesFromEvent(dayEvent)}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={editableOnMouseUp(originalEvent)}
          aria-label={`Event with title ${dayEvent.name}`}
        >
          {kind !== EventKind.MIDDLE && (
            <p className="text-1">
              {[EventKind.START, EventKind.SINGLE].includes(kind) ? format(dayEvent.from, 'HH:mm') : '...'} -{' '}
              {[EventKind.END, EventKind.SINGLE].includes(kind) ? format(dayEvent.to, 'HH:mm') : '...'}
            </p>
          )}
          <p className="text-1 font-bold">{dayEvent.name}</p>
        </div>
      ))}
    </>
  );
};

export default ScheduleEvent;
