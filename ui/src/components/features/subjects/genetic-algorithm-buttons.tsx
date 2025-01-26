import { Dispatch, SetStateAction, useCallback } from 'react';

import { GearIcon, RulerSquareIcon } from '@radix-ui/react-icons';
import { Button, Dialog, Flex, FlexProps, Text } from '@radix-ui/themes';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useLocalStorageState from 'use-local-storage-state';

import GeneticAlgorithmSettingsSheet from '@/feature/subjects/genetic-algorithm-settings-sheet';

import { FitnessMode, ScheduleGenetic } from '@/util/genetic';
import { filterSubjectsGroups } from '@/util/subjects';

import { Subject } from '@/type/subjects';

export interface GeneticAlgorithmButtonsProps {
  subjects: Subject[];
  setSelectedSubjects: Dispatch<SetStateAction<Record<string, string>>>;
}

export type Stat = { iteration: number; fitnessMean: number; best: number };

const GeneticAlgorithmButtons = ({
  subjects,
  setSelectedSubjects,
  ...props
}: GeneticAlgorithmButtonsProps & FlexProps) => {
  const [fitnessMode, setFitnessMode] = useLocalStorageState<FitnessMode>('genetic-algorithm-fitness-mode', {
    defaultValue: 'days_with_lecture_*_standard_variation',
  });

  const [maxDays, setMaxDays] = useLocalStorageState('genetic-algorithm-max-days', { defaultValue: 5 });
  const [groupFilter, setGroupFilter] = useLocalStorageState('genetic-algorithm-group-filter', { defaultValue: '' });
  const [population, setPopulation] = useLocalStorageState('genetic-algorithm-population', { defaultValue: 500 });
  const [credits, setCredits] = useLocalStorageState('genetic-algorithm-credits', { defaultValue: 30 });
  const [iterations, setIterations] = useLocalStorageState('genetic-algorithm-iterations', { defaultValue: 30 });

  const [mutateSubjectChance, setMutateSubjectChance] = useLocalStorageState(
    'genetic-algorithm-mutate-subject-chance',
    { defaultValue: 0.05 },
  );
  const [mutateGroupChance, setMutateGroupChance] = useLocalStorageState('genetic-algorithm-mutate-group-chance', {
    defaultValue: 0.1,
  });

  const [showStatsDialog, setShowStatsDialog] = useLocalStorageState('show-stats-dialog', { defaultValue: false });
  const [stats, setStats] = useLocalStorageState<Stat[]>('genetic-algorithm-stats', { defaultValue: [] });

  const generate = useCallback(() => {
    const filteredSubjects = filterSubjectsGroups(subjects, groupFilter);

    const genetic = new ScheduleGenetic(
      filteredSubjects,
      population,
      credits,
      maxDays,
      fitnessMode,
      mutateSubjectChance,
      mutateGroupChance,
    );

    const _stats = genetic.iterate(iterations);
    setStats(_stats);

    const best = genetic.getBest();

    const selectedSubjects = Object.fromEntries(best.subjects.map((subject) => [subject.id, subject.group]));
    setSelectedSubjects(selectedSubjects);
    setShowStatsDialog(true);
  }, [population, credits, iterations, groupFilter, maxDays, fitnessMode, mutateSubjectChance, mutateGroupChance]);

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
                <Line type="monotone" dataKey="fitnessMean" name="Fitness mean" stroke="#8884d8" />
                <Line type="monotone" dataKey="best" name="Best score" stroke="#82ca9d" />
                <XAxis dataKey="iteration" />
                <YAxis />
                <Tooltip />
                <Legend />
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
