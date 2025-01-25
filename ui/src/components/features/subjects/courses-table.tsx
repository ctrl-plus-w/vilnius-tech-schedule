import { Dispatch, SetStateAction } from 'react';

import { Badge, Code, Flex, Table, Text } from '@radix-ui/themes';

import useSubjectsColor from '@/hook/use-subjects-color';

import { getGroups } from '@/util/subjects';

import { Subject } from '@/type/subjects';

export interface CoursesTableProps {
  subjects: Subject[];

  selectedSubjects: Record<string, string>;
  setSelectedSubjects: Dispatch<SetStateAction<Record<string, string>>>;
}

const CoursesTable = ({ subjects, selectedSubjects, setSelectedSubjects }: CoursesTableProps) => {
  const getColor = useSubjectsColor();

  const toggleGroup = (subject: Subject, group: string) => {
    setSelectedSubjects((prev) => {
      const res = { ...prev, [subject.id]: group };
      if (subject.id in prev && prev[subject.id] === group) delete res[subject.id];
      return res;
    });
  };

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          {/*<Table.ColumnHeaderCell></Table.ColumnHeaderCell>*/}
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {subjects
          .toSorted((a, b) => a.id.localeCompare(b.id))
          .map((subject) => (
            <Table.Row key={subject.id}>
              {/*<Table.Cell className="px-0">*/}
              {/*  <Flex*/}
              {/*    width="100%"*/}
              {/*    height="100%"*/}
              {/*    justify="center"*/}
              {/*    align="center"*/}
              {/*    px="2"*/}
              {/*    className="cursor-pointer"*/}
              {/*    asChild*/}
              {/*  >*/}
              {/*    <label htmlFor={`${subject.id}-checkbox`}>*/}
              {/*      <Checkbox id={`${subject.id}-checkbox`} className="cursor-pointer" />*/}
              {/*    </label>*/}
              {/*  </Flex>*/}
              {/*</Table.Cell>*/}
              <Table.Cell>
                <Flex gap="1" align="center">
                  <Code color={selectedSubjects[subject.id] ? undefined : 'gray'}>{subject.id}</Code>
                  <Text>{subject.name.split('AY')[0].slice(0, -10).trim()}</Text>
                </Flex>

                <Flex gap="1" align="center" mt="2" wrap="wrap">
                  {getGroups(subject).map((group) => (
                    <Badge
                      key={group}
                      color={selectedSubjects[subject.id] === group ? getColor(subject.id) ?? 'purple' : 'gray'}
                      asChild
                    >
                      <button onClick={() => toggleGroup(subject, group)}>{group}</button>
                    </Badge>
                  ))}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
};

export default CoursesTable;
