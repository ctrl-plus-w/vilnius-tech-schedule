import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';

import { ChevronLeftIcon, ChevronRightIcon, GearIcon, RulerSquareIcon } from '@radix-ui/react-icons';
import { Button, Dialog, Flex, FlexProps, IconButton, Text } from '@radix-ui/themes';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useLocalStorageState from 'use-local-storage-state';

import GeneticAlgorithmSettingsSheet from '@/feature/subjects/genetic-algorithm-settings-sheet';

import { FitnessMode, Schedule, ScheduleGenetic } from '@/util/genetic';
import { getUnique } from '@/util/schedule';
import { filterSubjectsByStudyProgramFilter, filterSubjectsGroups } from '@/util/subjects';

import STUDY_PROGRAMS from '@/constant/study-programs';

import { Subject } from '@/type/subjects';

export interface GeneticAlgorithmButtonsProps {
  subjects: Subject[];
  setSelectedSubjects: Dispatch<SetStateAction<Record<string, string>>>;
}

export type Stat = { iteration: number; fitnessMean: number; best: number; population: number };

const GeneticAlgorithmButtons = ({
  subjects,
  setSelectedSubjects,
  ...props
}: GeneticAlgorithmButtonsProps & FlexProps) => {
  const [schedules, setSchedules] = useLocalStorageState<Schedule[]>('genetic-algorithm-schedules', {
    defaultValue: [],
  });
  const [schedulesIndex, setSchedulesIndex] = useLocalStorageState('genetic-algorithm-schedules-index', {
    defaultValue: 0,
  });

  const [fitnessMode, setFitnessMode] = useLocalStorageState<FitnessMode>('genetic-algorithm-fitness-mode', {
    defaultValue: 'days_with_lecture_*_standard_variation',
  });
  const [selectedStudyProgramsSubjects, setSelectedStudyProgramsSubjects] = useLocalStorageState<
    Record<string, string[]>
  >('genetic-algorithm-selected-study-programs-subjects', {
    defaultValue: Object.fromEntries(
      STUDY_PROGRAMS.map(({ name, specializations }) => [name, specializations.map(({ name }) => name)]),
    ),
  });

  const [generateEveryIteration, setGenerateEveryIteration] = useLocalStorageState(
    'genetic-algorithm-generate-every-iteration',
    { defaultValue: true },
  );
  const [maxDays, setMaxDays] = useLocalStorageState('genetic-algorithm-max-days', { defaultValue: 5 });
  const [groupFilter, setGroupFilter] = useLocalStorageState('genetic-algorithm-group-filter', { defaultValue: '' });
  const [population, setPopulation] = useLocalStorageState('genetic-algorithm-population', { defaultValue: 500 });
  const [credits, setCredits] = useLocalStorageState('genetic-algorithm-credits', { defaultValue: 30 });
  const [iterations, setIterations] = useLocalStorageState('genetic-algorithm-iterations', { defaultValue: 20 });

  const [mutateSubjectChance, setMutateSubjectChance] = useLocalStorageState(
    'genetic-algorithm-mutate-subject-chance',
    { defaultValue: 0.3 },
  );
  const [mutateGroupChance, setMutateGroupChance] = useLocalStorageState('genetic-algorithm-mutate-group-chance', {
    defaultValue: 0.1,
  });

  const [showStatsDialog, setShowStatsDialog] = useLocalStorageState('show-stats-dialog', { defaultValue: false });
  const [stats, setStats] = useLocalStorageState<Stat[]>('genetic-algorithm-stats', { defaultValue: [] });

  const generate = useCallback(() => {
    const filteredSubjects = filterSubjectsGroups(
      filterSubjectsByStudyProgramFilter(selectedStudyProgramsSubjects, subjects),
      groupFilter,
    );

    const genetic = new ScheduleGenetic(
      filteredSubjects,
      population,
      credits,
      maxDays,
      fitnessMode,
      mutateSubjectChance,
      mutateGroupChance,
      generateEveryIteration,
    );

    const _stats = genetic.iterate(iterations);
    setStats(_stats);

    const top50 = genetic.getTop50();
    const top50WithPositiveScore = top50.filter(({ cachedFitness }) => cachedFitness > 0);
    const uniqueTop50WithPositiveScore = getUnique(top50WithPositiveScore);

    setSchedules(uniqueTop50WithPositiveScore);
    setSchedulesIndex(0);

    setShowStatsDialog(true);
  }, [
    population,
    credits,
    iterations,
    groupFilter,
    maxDays,
    fitnessMode,
    selectedStudyProgramsSubjects,
    mutateSubjectChance,
    mutateGroupChance,
    generateEveryIteration,
  ]);

  useEffect(() => {
    const schedule = schedules[schedulesIndex];
    if (!schedule) return;

    const selectedSubjects = Object.fromEntries(schedule.subjects.map((subject) => [subject.id, subject.group]));
    setSelectedSubjects(selectedSubjects);
  }, [schedules, schedulesIndex]);

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

      <Flex gap="2" mr={{ initial: '0', md: '3' }} width={{ initial: '100%', md: 'auto' }}>
        <IconButton onClick={() => setSchedulesIndex((v) => Math.max(0, v - 1))}>
          <ChevronLeftIcon />
        </IconButton>
        <Button className="grow md:grow-0" disabled>
          {schedulesIndex + 1}/{schedules.length} ({schedules[schedulesIndex]?.cachedFitness.toFixed(2) ?? '-'})
        </Button>
        <IconButton onClick={() => setSchedulesIndex((v) => Math.min(Math.max(schedules.length - 1, 0), v + 1))}>
          <ChevronRightIcon />
        </IconButton>
      </Flex>

      <Button onClick={() => setShowStatsDialog(true)} disabled={!stats.length} variant="soft">
        <RulerSquareIcon />
        Show stats
      </Button>

      <GeneticAlgorithmSettingsSheet
        {...{
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
