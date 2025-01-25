'use client';

import { Flex } from '@radix-ui/themes';

import * as Schedule from '@/feature/schedule';

import useBreakpointIntervalKind from '@/hook/use-breakpoint-interval-kind';
import useSchedulerInterval from '@/hook/use-schedule-interval';

import { TScheduleEvent } from '@/type/schedule';

export interface SubjectsScheduleProps {
  events: TScheduleEvent[];
}

const SubjectsSchedule = ({ events }: SubjectsScheduleProps) => {
  const intervalKind = useBreakpointIntervalKind();
  const { prev, curr, next, interval } = useSchedulerInterval(intervalKind);

  return (
    <Flex direction="column" minHeight="0">
      <Schedule.Root
        onRequestEdit={() => null}
        onRequestAdd={() => null}
        events={events}
        editable={true}
        interval={interval}
      >
        <Flex justify="between">
          <Schedule.DateControls {...{ prev, curr, next }} />
          <Schedule.ZoomControl />
        </Flex>

        <Schedule.THead className="mt-4" />

        <Schedule.Schedule>
          <Schedule.Events />
          <Schedule.Ticker />
        </Schedule.Schedule>
      </Schedule.Root>
    </Flex>
  );
};

export default SubjectsSchedule;
