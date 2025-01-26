import { Dispatch, SetStateAction, useCallback } from 'react';

import { GearIcon, RulerSquareIcon } from '@radix-ui/react-icons';
import { Text, Button, Dialog, Flex, FlexProps } from '@radix-ui/themes';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import useLocalStorageState from 'use-local-storage-state';

import GeneticAlgorithmSettingsSheet from '@/feature/subjects/genetic-algorithm-settings-sheet';

import { ScheduleGenetic } from '@/util/genetic';

import { Subject } from '@/type/subjects';

export interface GeneticAlgorithmButtonsProps {
  subjects: Subject[];
  setSelectedSubjects: Dispatch<SetStateAction<Record<string, string>>>;
}

type Stat = { iteration: number; fitnessMean: number };

const GeneticAlgorithmButtons = ({
  subjects,
  setSelectedSubjects,
  ...props
}: GeneticAlgorithmButtonsProps & FlexProps) => {
  const [population, setPopulation] = useLocalStorageState('genetic-algorithm-population', { defaultValue: 500 });
  const [credits, setCredits] = useLocalStorageState('genetic-algorithm-credits', { defaultValue: 30 });
  const [iterations, setIterations] = useLocalStorageState('genetic-algorithm-iterations', { defaultValue: 30 });

  const [showStatsDialog, setShowStatsDialog] = useLocalStorageState('show-stats-dialog', { defaultValue: false });
  const [stats, setStats] = useLocalStorageState<Stat[]>('genetic-algorithm-stats', { defaultValue: [] });

  const generate = useCallback(() => {
    const genetic = new ScheduleGenetic(subjects, population, credits);

    const _stats = genetic.iterate(iterations);
    setStats(_stats);

    const best = genetic.getBest();

    const selectedSubjects = Object.fromEntries(best.subjects.map((subject) => [subject.id, subject.group]));
    setSelectedSubjects(selectedSubjects);
    setShowStatsDialog(true);
  }, [population, credits, iterations]);

  return (
    <Flex gap="2" {...props}>
      <Dialog.Root open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <Dialog.Content maxWidth="600px">
          <Dialog.Title>Stats</Dialog.Title>
          <Dialog.Description></Dialog.Description>

          <Flex width="100%" direction="column" gap="4">
            <Text weight="bold">Iterations / fitness mean</Text>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats} margin={{ right: 48 }}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="fitnessMean" stroke="#8884d8" />
                <XAxis dataKey="iteration" />
                <YAxis />
              </LineChart>
            </ResponsiveContainer>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Button onClick={() => setShowStatsDialog(true)} disabled={!stats.length} variant="soft">
        <RulerSquareIcon />
        Show stats
      </Button>

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
