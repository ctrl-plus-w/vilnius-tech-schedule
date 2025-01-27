import { Stat } from '@/feature/subjects/genetic-algorithm-buttons';

import { count, getRandomElement, retrieveRandomElement, unique } from '@/util/array';
import { standardVariation } from '@/util/math';
import { getCoursesWithMergedWeeks, getGroups } from '@/util/subjects';

import { Day, Subject } from '@/type/subjects';

export type SubjectWithSelectedGroup = Subject & { group: string };
export type FitnessMode = 'days_with_lecture' | 'standard_variation' | 'days_with_lecture_*_standard_variation';

const getRandomGroup = (subject: Subject) => {
  const groups = unique(getGroups(subject));
  return getRandomElement(groups);
};

const getRandomSubject = (subjects: Subject[]) => {
  const subject = retrieveRandomElement(subjects);
  return { ...subject, group: getRandomGroup(subject) };
};

export class Schedule {
  subjects: SubjectWithSelectedGroup[];

  cachedFitness: number;

  constructor(subjects: SubjectWithSelectedGroup[] = []) {
    this.subjects = subjects;
    this.cachedFitness = -1;
  }

  clone() {
    return new Schedule([...this.subjects.map((subject) => structuredClone(subject))]);
  }

  getTotalCredits() {
    return this.subjects.reduce((acc, { credits }) => acc + credits, 0);
  }

  fitness(credits: number, maxDays: number, fitnessMode: FitnessMode): number {
    if (this.getTotalCredits() !== credits) return 0;

    const days: Record<Day, boolean[]> = {
      monday: new Array(7).fill(false),
      tuesday: new Array(7).fill(false),
      wednesday: new Array(7).fill(false),
      thursday: new Array(7).fill(false),
      friday: new Array(7).fill(false),
    };

    const subjectsWithMergedWeeks = this.subjects.map((c) => getCoursesWithMergedWeeks(c));

    for (const subject of subjectsWithMergedWeeks) {
      const courses = subject.courses.filter(({ group }) => group === subject.group);

      for (const course of courses) {
        if (days[course.day][course.lecture - 1]) return 0;
        days[course.day][course.lecture - 1] = true;
      }
    }

    const daysWithLectures = Object.values(days).map((day) => day.some(Boolean));
    if (count(daysWithLectures) > maxDays) return 0;

    const daysWithLecturesScore = 5 - count(daysWithLectures);

    const daysWithLecturesStandardVariation = standardVariation(
      daysWithLectures.map((day, i) => (day ? i + 1 : 0)).filter((v) => v > 0),
    );
    const closenessScore = 3 - daysWithLecturesStandardVariation;

    if (fitnessMode === 'standard_variation') return closenessScore;
    if (fitnessMode === 'days_with_lecture') return daysWithLecturesScore;
    if (fitnessMode === 'days_with_lecture_*_standard_variation') return daysWithLecturesScore * closenessScore;

    return daysWithLecturesScore;
  }

  mutate(mutateSubjectChance: number, mutateGroupChance: number) {
    for (let i = 0; i < this.subjects.length; i++) {
      if (Math.random() < mutateSubjectChance) {
        this.subjects[i] = getRandomSubject(this.subjects);
      } else if (Math.random() < mutateGroupChance) {
        const subject = this.subjects[i];
        this.subjects[i] = { ...subject, group: getRandomGroup(subject) };
      }
    }
  }

  static generate(subjects: Subject[], credits: number) {
    const remainingSubjects = [...subjects];
    const schedule = new Schedule();

    while (schedule.getTotalCredits() < credits) {
      if (!remainingSubjects.length) throw new Error('There is not enough subjects to fill the credits');

      schedule.subjects.push(getRandomSubject(remainingSubjects));
    }

    return schedule;
  }
}

export class ScheduleGenetic {
  subjects: Subject[];
  schedules: Schedule[];

  credits: number;
  population: number;
  maxDays: number;
  fitnessMode: FitnessMode;
  mutateSubjectChance: number;
  mutateGroupChance: number;

  iterations: number;

  constructor(
    courses: Subject[],
    population: number,
    credits: number,
    maxDays: number,
    fitnessMode: FitnessMode,
    mutateSubjectChance: number,
    mutateGroupChance: number,
  ) {
    this.subjects = courses;
    this.schedules = [];

    this.credits = credits;
    this.population = population;
    this.maxDays = maxDays;
    this.fitnessMode = fitnessMode;
    this.mutateSubjectChance = mutateSubjectChance;
    this.mutateGroupChance = mutateGroupChance;

    this.iterations = 0;

    this.seed(population);
  }

  seed(population: number) {
    for (let i = 0; i < population; i++) {
      this.schedules.push(Schedule.generate(this.subjects, this.credits));
    }
  }

  fitness(schedule: Schedule) {
    return schedule.fitness(this.credits, this.maxDays, this.fitnessMode);
  }

  iterate(iterations: number) {
    const logs: Stat[] = [];

    for (let i = 0; i < iterations; i++) {
      this.evolve();

      const fitness = this.schedules.map((schedule) => schedule.cachedFitness);

      const fitnessMean = fitness.reduce((acc, v) => acc + v, 0) / this.population;
      const best = Math.max(...fitness);

      logs.push({ iteration: i, fitnessMean, best });
    }

    return logs;
  }

  evolve() {
    const top50 = this.getTop50();
    const top50Copy = top50.map((schedule) => schedule.clone());

    for (const schedule of top50Copy) schedule.mutate(this.mutateSubjectChance, this.mutateGroupChance);

    this.iterations++;

    this.schedules = [...top50, ...top50Copy];
  }

  getTop50() {
    for (const schedule of this.schedules) schedule.cachedFitness = this.fitness(schedule);
    return this.schedules.toSorted((a, b) => b.cachedFitness - a.cachedFitness).slice(0, this.population / 2);
  }

  getBest() {
    return this.getTop50()[0];
  }
}
