import { Dispatch, SetStateAction } from 'react';

import { Flex, Slider, Text } from '@radix-ui/themes';

import * as Sheet from '@/element/sheet';

export interface GenerateScheduleSheetProps extends Sheet.SheetRootProps {
  population: number;
  setPopulation: Dispatch<SetStateAction<number>>;

  credits: number;
  setCredits: Dispatch<SetStateAction<number>>;

  iterations: number;
  setIterations: Dispatch<SetStateAction<number>>;
}

const GeneticAlgorithmSettingsSheet = ({
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
