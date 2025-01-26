import { Dispatch, SetStateAction, useMemo } from 'react';

import { Code, Flex, Switch, Text } from '@radix-ui/themes';
import useLocalStorageState from 'use-local-storage-state';

import CoursesTable from '@/feature/subjects/courses-table';

import * as Sheet from '@/element/sheet';
import { SheetRootProps } from '@/element/sheet';

import { Subject } from '@/type/subjects';

export interface SelectCoursesSheetProps extends SheetRootProps {
  subjects: Subject[];

  selectedSubjects: Record<string, string>;
  setSelectedSubjects: Dispatch<SetStateAction<Record<string, string>>>;
}

const SelectCoursesSheet = ({
  subjects,
  setSelectedSubjects,
  selectedSubjects,
  children,
  ...props
}: SelectCoursesSheetProps) => {
  const [onlyFu, setOnlyFu] = useLocalStorageState('only-fu', { defaultValue: false });

  const filteredSubjects = useMemo(() => {
    if (!onlyFu) return subjects;

    return subjects.map(({ courses, ...subject }) => ({
      ...subject,
      courses: courses.filter(({ group }) => group.includes('fu')),
    }));
  }, [subjects, onlyFu]);

  return (
    <Sheet.Root {...props}>
      <Sheet.Trigger>{children}</Sheet.Trigger>

      <Sheet.Content className="max-w-3xl">
        <Sheet.Close />

        <Sheet.Title>Select the courses</Sheet.Title>
        <Sheet.Description></Sheet.Description>

        <Flex align="center" gap="1" my="2" asChild>
          <label htmlFor="only-fu">
            <Switch id="only-fu" checked={onlyFu} onCheckedChange={setOnlyFu} />
            <Text>
              Only show <Code>fu</Code> groups
            </Text>
          </label>
        </Flex>

        <CoursesTable {...{ subjects: filteredSubjects, selectedSubjects, setSelectedSubjects }} />
      </Sheet.Content>
    </Sheet.Root>
  );
};

export default SelectCoursesSheet;
