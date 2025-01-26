import { Dispatch, SetStateAction } from 'react';

import { Code, Flex, Select, Slider, Text, TextField } from '@radix-ui/themes';

import * as Sheet from '@/element/sheet';

import { FitnessMode } from '@/util/genetic';

export interface GenerateScheduleSheetProps extends Sheet.SheetRootProps {
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
  return (
    <Sheet.Root {...props}>
      <Sheet.Trigger>{children}</Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Close />
        <Sheet.Title>Generate your schedule</Sheet.Title>
        <Sheet.Description>Choose the genetic algorithm parameters and run it to see the result.</Sheet.Description>

        <Flex direction="column" mt="6" gap="2">
          <Flex direction="column" gap="1">
            <Text weight="bold">Group filter</Text>
            <Text color="gray">
              Filter the groups you want to include in the genetic algorithm. By default, all groups are included. The
              group must contains the string you enter in the input.
            </Text>

            <TextField.Root value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} />
          </Flex>

          <Flex direction="column" gap="1">
            <Text weight="bold">Fitness mode</Text>
            <Text color="gray">
              Select the fitness mode for the genetic algorithm.
              <ul className="ml-2 list-inside list-disc">
                <li>
                  <Code>days_with_lecture</Code> : The fitness score is based on the count of days with lecture in the
                  week.
                </li>
                <li>
                  <Code>standard_variation</Code> : The fitness score is based on the standard variation of the days in
                  the week. The more the days are close by, the greater the fitness score.
                </li>
                <li>
                  <Code>days_with_lecture * standard_variation</Code> : This parameter is the multiplication of the two
                  previous fitness scores.
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
              selected, reproduced, and modified through genetic operators to improve overall fitness over successive
              generations.
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
      </Sheet.Content>
    </Sheet.Root>
  );
};

export default GeneticAlgorithmSettingsSheet;
