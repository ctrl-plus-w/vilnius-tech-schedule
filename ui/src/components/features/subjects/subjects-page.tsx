'use client';

import { useMemo } from 'react';

import { Button, Flex } from '@radix-ui/themes';
import { setHours, setMinutes } from 'date-fns';
import useLocalStorageState from 'use-local-storage-state';

import SelectCoursesSheet from '@/feature/subjects/select-courses-sheet';

import SubjectsSchedule from '@/module/subjects-schedule';

import useSubjectsColor from '@/hook/use-subjects-color';

import { getNextDay } from '@/util/date';

import { TScheduleEvent } from '@/type/schedule';
import { Subject } from '@/type/subjects';

export interface SubjectsPageProps {
  subjects: Subject[];
}

const SubjectsPage = ({ subjects }: SubjectsPageProps) => {
  const getColor = useSubjectsColor();

  const [selectedSubjects, setSelectedSubjects] = useLocalStorageState<Record<string, string>>('selected-subjects', {
    defaultValue: {},
  });

  const subjectsAsEvents = useMemo(() => {
    return subjects
      .filter(({ id }) => id in selectedSubjects)
      .map(({ id, name, courses }) => {
        const events: TScheduleEvent[] = [];

        for (const course of courses) {
          const date = getNextDay(course.interval.start, course.day);

          if (course.group !== selectedSubjects[id]) continue;
          const [startTime, endTime] = course.time.split('-');

          const [startHours, startMinutes] = startTime.split(':').map((v) => parseInt(v));
          const [endHours, endMinutes] = endTime.split(':').map((v) => parseInt(v));

          const eventId =
            `${course.interval.start}-${course.interval.end}-${course.day}-${course.lecture}-${course.type}-${course.group}-${course.time}`
              .toLowerCase()
              .replaceAll(' ', '-');

          events.push({
            id: eventId,
            from: setHours(setMinutes(date, startMinutes), startHours),
            to: setHours(setMinutes(date, endMinutes), endHours),
            color: getColor(id) ?? 'gray',
            name: `${name.split('AY')[0].trim()} (${course.group})`,
            isCurrent: false,
            recurring: course.interval,
          });
        }

        return events;
      })
      .flat();
  }, [getColor, subjects, selectedSubjects]);

  return (
    <Flex direction="column" p="6" gap="3" align="start" className="h-screen w-screen">
      <SelectCoursesSheet defaultOpen={true} {...{ subjects, selectedSubjects, setSelectedSubjects }}>
        <Button>Select the courses</Button>
      </SelectCoursesSheet>

      <SubjectsSchedule events={subjectsAsEvents} />
    </Flex>
  );
};

export default SubjectsPage;
