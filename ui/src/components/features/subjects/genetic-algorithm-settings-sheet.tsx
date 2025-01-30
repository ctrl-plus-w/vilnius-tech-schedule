import { Dispatch, SetStateAction } from 'react';

import {
  Checkbox,
  Code,
  Flex,
  Heading,
  Select,
  Separator,
  Slider,
  Switch,
  Table,
  Tabs,
  Text,
  TextField,
} from '@radix-ui/themes';

import * as Sheet from '@/element/sheet';

import { FitnessMode } from '@/util/genetic';

import STUDY_PROGRAMS, { ProgramSpecialization, StudyProgram } from '@/constant/study-programs';

export interface GenerateScheduleSheetProps extends Sheet.SheetRootProps {
  selectedStudyProgramsSubjects: Record<string, string[]>;
  setSelectedStudyProgramsSubjects: Dispatch<SetStateAction<Record<string, string[]>>>;

  generateEveryIteration: boolean;
  setGenerateEveryIteration: Dispatch<SetStateAction<boolean>>;

  mutateSubjectChance: number;
  setMutateSubjectChance: Dispatch<SetStateAction<number>>;

  mutateGroupChance: number;
  setMutateGroupChance: Dispatch<SetStateAction<number>>;

  fitnessMode: FitnessMode;
  setFitnessMode: Dispatch<SetStateAction<FitnessMode>>;

  maxDays: number;
  setMaxDays: Dispatch<SetStateAction<number>>;

  groupFilter: string;
  setGroupFilter: Dispatch<SetStateAction<string>>;

  population: number;
  setPopulation: Dispatch<SetStateAction<number>>;

  credits: number;
  setCredits: Dispatch<SetStateAction<number>>;

  iterations: number;
  setIterations: Dispatch<SetStateAction<number>>;
}

const GeneticAlgorithmSettingsSheet = ({
  selectedStudyProgramsSubjects,
  setSelectedStudyProgramsSubjects,

  generateEveryIteration,
  setGenerateEveryIteration,

  mutateSubjectChance,
  setMutateSubjectChance,

  mutateGroupChance,
  setMutateGroupChance,

  fitnessMode,
  setFitnessMode,

  maxDays,
  setMaxDays,

  groupFilter,
  setGroupFilter,

  population,
  setPopulation,

  credits,
  setCredits,

  iterations,
  setIterations,
  children,
  ...props
}: GenerateScheduleSheetProps) => {
  const onCheckedChange = (studyProgram: StudyProgram, specialization: ProgramSpecialization) => (checked: boolean) => {
    setSelectedStudyProgramsSubjects((prev) => {
      const prevStudyProgramSelectedSubjects = prev[studyProgram.name] ?? [];

      const newSelectedSubjects = checked
        ? [...prevStudyProgramSelectedSubjects, specialization.name]
        : prevStudyProgramSelectedSubjects.filter((s) => s !== specialization.name);

      return { ...prev, [studyProgram.name]: newSelectedSubjects };
    });
  };

  return (
    <Sheet.Root {...props}>
      <Sheet.Trigger>{children}</Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Close />
        <Sheet.Title>Generate your schedule</Sheet.Title>
        <Sheet.Description>Choose the genetic algorithm parameters and run it to see the result.</Sheet.Description>

        <Tabs.Root defaultValue="global" mt="6">
          <Tabs.List mb="4">
            <Tabs.Trigger value="global">Global Settings</Tabs.Trigger>
            <Tabs.Trigger value="subjects">Subjects Settings</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="global">
            <Flex direction="column" gap="2">
              <Heading as="h2" size="4">
                Genetic Algorithm Settings
              </Heading>

              <Separator size="4" />

              <Flex direction="column" gap="1">
                <Text weight="bold">Population</Text>
                <Text color="gray">
                  In a genetic algorithm, the population is a set of candidate solutions (schedules), encoded as
                  chromosomes, which evolve through genetic operations to optimize the scheduling problem.
                </Text>

                <Flex align="center" gap="2">
                  <Slider
                    defaultValue={[population]}
                    onValueChange={([value]) => setPopulation(value)}
                    min={300}
                    max={10000}
                    step={100}
                  />
                  <Text>{population}</Text>
                </Flex>
              </Flex>

              <Flex direction="column" gap="1">
                <Text weight="bold">Iterations</Text>
                <Text color="gray">
                  In a genetic algorithm, iterations represent the cycles of population evolution, where solutions are
                  selected, reproduced, and modified through genetic operators to improve overall fitness over
                  successive generations.
                </Text>

                <Flex align="center" gap="2">
                  <Slider
                    defaultValue={[iterations]}
                    onValueChange={([value]) => setIterations(value)}
                    min={10}
                    max={1000}
                    step={10}
                  />
                  <Text>{iterations}</Text>
                </Flex>
              </Flex>

              <Flex gap="2">
                <Flex direction="column" gap="1" width="100%">
                  <Text weight="bold">Mutate subject chance</Text>
                  <Text color="gray">The chance rate to mutate a subject.</Text>

                  <Flex align="center" gap="2">
                    <Slider
                      defaultValue={[mutateSubjectChance]}
                      onValueChange={([value]) => setMutateSubjectChance(value)}
                      min={0}
                      max={1}
                      step={0.005}
                    />
                    <Text>{(mutateSubjectChance * 100).toFixed(1)}%</Text>
                  </Flex>
                </Flex>

                <Flex direction="column" gap="1" width="100%">
                  <Text weight="bold">Mutate group chance</Text>
                  <Text color="gray">The chance rate to mutate a subject group.</Text>

                  <Flex align="center" gap="2">
                    <Slider
                      defaultValue={[mutateGroupChance]}
                      onValueChange={([value]) => setMutateGroupChance(value)}
                      min={0}
                      max={1}
                      step={0.005}
                    />
                    <Text>{(mutateGroupChance * 100).toFixed(1)}%</Text>
                  </Flex>
                </Flex>
              </Flex>

              <Flex align="center" gap="2">
                <Switch checked={generateEveryIteration} onCheckedChange={setGenerateEveryIteration} />
                <Text>Add half of the population for every iteration.</Text>
              </Flex>

              <Heading as="h2" size="4" mt="6">
                Filtering & Fine-tuning Settings
              </Heading>

              <Separator size="4" />

              <Flex direction="column" gap="1">
                <Text weight="bold">Group filter</Text>
                <Text color="gray">
                  Filter the groups you want to include in the genetic algorithm. By default, all groups are included.
                  The group must contains the string you enter in the input.
                </Text>

                <TextField.Root value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} />
              </Flex>

              <Flex direction="column" gap="1">
                <Text weight="bold">Fitness mode</Text>
                <Text color="gray">
                  Select the fitness mode for the genetic algorithm.
                  <ul className="ml-2 list-inside list-disc">
                    <li>
                      <Code>days_with_lecture</Code> : The fitness score is based on the count of days with lecture in
                      the week.
                    </li>
                    <li>
                      <Code>standard_variation</Code> : The fitness score is based on the standard variation of the days
                      in the week. The more the days are close by, the greater the fitness score.
                    </li>
                    <li>
                      <Code>days_with_lecture * standard_variation</Code> : This parameter is the multiplication of the
                      two previous fitness scores.
                    </li>
                  </ul>
                </Text>

                <Select.Root value={fitnessMode} onValueChange={(value) => setFitnessMode(value as FitnessMode)}>
                  <Select.Trigger className="font-mono" />
                  <Select.Content className="font-mono">
                    <Select.Item value="days_with_lecture">days_with_lecture</Select.Item>
                    <Select.Item value="standard_variation">standard_variation</Select.Item>
                    <Select.Item value="days_with_lecture_*_standard_variation">
                      days_with_lecture * standard_variation
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction="column" gap="1">
                <Text weight="bold">Max days</Text>
                <Text color="gray">The maximum count of days where course are scheduled in the week.</Text>

                <Flex align="center" gap="2">
                  <Slider
                    defaultValue={[maxDays]}
                    onValueChange={([value]) => setMaxDays(value)}
                    min={1}
                    max={5}
                    step={1}
                  />
                  <Text>{maxDays}</Text>
                </Flex>
              </Flex>

              <Heading as="h2" size="4" mt="6">
                Other Settings
              </Heading>

              <Separator size="4" />

              <Flex direction="column" gap="1">
                <Text weight="bold">Credits</Text>
                <Text color="gray">The amount of ECTS credits required for your semester.</Text>

                <Flex align="center" gap="2">
                  <Slider
                    defaultValue={[credits]}
                    onValueChange={([value]) => setCredits(value)}
                    min={6}
                    max={60}
                    step={1}
                  />
                  <Text>{credits}</Text>
                </Flex>
              </Flex>
            </Flex>
          </Tabs.Content>

          <Tabs.Content value="subjects" tabIndex={-1}>
            <Flex direction="column" gap="6">
              {STUDY_PROGRAMS.map((studyProgram) => (
                <Flex direction="column" key={studyProgram.name}>
                  <Heading size="4">{studyProgram.name}</Heading>

                  <Table.Root>
                    <Table.Body>
                      {studyProgram.specializations.map((specialization) => {
                        const id = specialization.name.toLowerCase().replaceAll(' ', '-');

                        return (
                          <Table.Row key={specialization.name}>
                            <Table.Cell px="0">
                              <Flex px="3" width="100%" height="100%" justify="center" align="center" asChild>
                                <label htmlFor={`${id}-checkbox`} className="cursor-pointer">
                                  <Checkbox
                                    checked={selectedStudyProgramsSubjects[studyProgram.name]?.includes(
                                      specialization.name,
                                    )}
                                    onCheckedChange={onCheckedChange(studyProgram, specialization)}
                                    id={`${id}-checkbox`}
                                    className="cursor-pointer"
                                  />
                                </label>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell>
                              <Flex direction="column" gap="1">
                                <Text>{specialization.name}</Text>
                                <Text size="1" color="gray" className="whitespace-break-spaces">
                                  {specialization.modules.map(({ name }) => name).join(', ')}
                                </Text>
                              </Flex>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Root>
                </Flex>
              ))}
            </Flex>
          </Tabs.Content>
        </Tabs.Root>
      </Sheet.Content>
    </Sheet.Root>
  );
};

export default GeneticAlgorithmSettingsSheet;
