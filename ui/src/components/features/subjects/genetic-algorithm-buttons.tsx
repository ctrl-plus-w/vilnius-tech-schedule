import { Dispatch, SetStateAction, useCallback, useRef } from 'react';

import { GearIcon } from '@radix-ui/react-icons';
import { Button, Flex, FlexProps, Text } from '@radix-ui/themes';
import useLocalStorageState from 'use-local-storage-state';

import GeneticAlgorithmSettingsSheet from '@/feature/subjects/genetic-algorithm-settings-sheet';

import { ScheduleGenetic } from '@/util/genetic';

import { Subject } from '@/type/subjects';

export interface GeneticAlgorithmButtonsProps {
  subjects: Subject[];
  setSelectedSubjects: Dispatch<SetStateAction<Record<string, string>>>;
}

const GeneticAlgorithmButtons = ({
  subjects,
  setSelectedSubjects,
  ...props
}: GeneticAlgorithmButtonsProps & FlexProps) => {
  const [population, setPopulation] = useLocalStorageState('genetic-algorithm-population', { defaultValue: 500 });
  const [credits, setCredits] = useLocalStorageState('genetic-algorithm-credits', { defaultValue: 30 });
  const [iterations, setIterations] = useLocalStorageState('genetic-algorithm-iterations', { defaultValue: 30 });

  const modalContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const generate = useCallback(() => {
    const genetic = new ScheduleGenetic(subjects, population, credits);
    genetic.iterate(iterations);

    const best = genetic.getBest();

    const selectedSubjects = Object.fromEntries(best.subjects.map((subject) => [subject.id, subject.group]));
    setSelectedSubjects(selectedSubjects);
  }, [population, credits, iterations]);

  return (
    <Flex gap="2" {...props}>
      <Flex
        ref={modalContainerRef}
        justify="center"
        align="center"
        position="fixed"
        inset="0"
        className="invisible z-50 bg-blackA-5"
        p="6"
      >
        <Flex width="100%" height="100%" className="rounded-4 bg-whiteA-12" p="3" justify="center" align="center">
          <Text ref={textRef}>content</Text>
        </Flex>
      </Flex>

      <GeneticAlgorithmSettingsSheet
        {...{
          population,
          setPopulation,

          credits,
          setCredits,

          iterations,
          setIterations,
        }}
      >
        <Button variant="soft">
          <GearIcon />
          Settings
        </Button>
      </GeneticAlgorithmSettingsSheet>

      <Button onClick={generate}>Generate the schedule</Button>
    </Flex>
  );
};

export default GeneticAlgorithmButtons;
