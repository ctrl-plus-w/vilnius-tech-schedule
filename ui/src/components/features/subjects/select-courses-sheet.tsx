import { Dispatch, SetStateAction } from 'react';

import { Button, Checkbox, Code, Table } from '@radix-ui/themes';

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
  return (
    <Sheet.Root {...props}>
      <Sheet.Trigger>{children}</Sheet.Trigger>

      <Sheet.Content className="max-w-3xl">
        <Sheet.Close />

        <Sheet.Title>Select the courses</Sheet.Title>
        <Sheet.Description></Sheet.Description>

        <CoursesTable {...{ subjects, selectedSubjects, setSelectedSubjects }} />
      </Sheet.Content>
    </Sheet.Root>
  );
};

export default SelectCoursesSheet;
