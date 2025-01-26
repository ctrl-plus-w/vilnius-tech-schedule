import { count, getRandomElement, retrieveRandomElement, unique } from '@/util/array';
import { standardVariation } from '@/util/math';
import { getCoursesWithMergedWeeks, getGroups } from '@/util/subjects';

import { Day, Subject } from '@/type/subjects';

export type SubjectWithSelectedGroup = Subject & { group: string };

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

  constructor(subjects: SubjectWithSelectedGroup[] = []) {
    this.subjects = subjects;
  }

  clone() {
    return new Schedule([...this.subjects]);
  }

  getTotalCredits() {
    return this.subjects.reduce((acc, { credits }) => acc + credits, 0);
  }

  fitness(credits: number) {
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
    const daysWithLecturesScore = (5 - count(daysWithLectures)) * 10;

    const closenessScore = standardVariation(daysWithLectures.map((day, i) => (day ? i + 1 : 0)).filter((v) => v > 0));

    return daysWithLecturesScore + closenessScore;
  }

  mutate() {
    const mutateSubjectChange = 0.005;
    const mutateGroupChange = 0.1;

    for (let i = 0; i < this.subjects.length; i++) {
      if (Math.random() < mutateSubjectChange) {
        this.subjects[i] = getRandomSubject(this.subjects);
      } else if (Math.random() < mutateGroupChange) {
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

  iterations: number;

  constructor(courses: Subject[], population: number, credits: number) {
    this.subjects = courses;
    this.schedules = [];

    this.credits = credits;
    this.population = population;

    this.iterations = 0;

    this.seed(population);
  }

  seed(population: number) {
    for (let i = 0; i < population; i++) {
      this.schedules.push(Schedule.generate(this.subjects, this.credits));
    }
  }

  iterate(iterations: number) {
    for (let i = 0; i < iterations; i++) this.evolve();
  }

  evolve() {
    const top50 = this.getTop50();
    const top50Copy = top50.map((schedule) => schedule.clone());

    for (const schedule of top50Copy) schedule.mutate();

    this.iterations++;

    this.schedules = [...top50, ...top50Copy];
  }

  getTop50() {
    return this.schedules
      .sort((a, b) => b.fitness(this.credits) - a.fitness(this.credits))
      .slice(0, this.population / 2);
  }

  getBest() {
    return this.getTop50()[0];
  }
}
