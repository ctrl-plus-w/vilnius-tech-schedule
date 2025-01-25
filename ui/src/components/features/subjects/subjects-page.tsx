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
import { Day, Subject } from '@/type/subjects';

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
      .map(({ id, name, courseDays }) => {
        const events: TScheduleEvent[] = [];

        for (const interval in courseDays) {
          const [intervalStart, intervalEnd] = interval.split(' — ').map((d) => new Date(d));

          for (const [day, courses] of Object.entries(courseDays[interval])) {
            const date = getNextDay(intervalStart, day as Day);

            for (const course of courses) {
              if (course.group !== selectedSubjects[id]) continue;
              const [startTime, endTime] = course.time.split('-');

              const [startHours, startMinutes] = startTime.split(':').map((v) => parseInt(v));
              const [endHours, endMinutes] = endTime.split(':').map((v) => parseInt(v));

              events.push({
                id: `${interval}-${day}-${course.lecture}-${course.type}-${course.group}-${course.time}`
                  .toLowerCase()
                  .replaceAll(' ', '-'),
                from: setHours(setMinutes(date, startMinutes), startHours),
                to: setHours(setMinutes(date, endMinutes), endHours),
                color: getColor(id) ?? 'gray',
                name: `${name.split('AY')[0].trim()} (${course.group})`,
                isCurrent: false,
                recurring: { from: intervalStart, to: intervalEnd },
              });
            }
          }
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
