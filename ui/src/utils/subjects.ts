import STUDY_PROGRAMS from '@/constant/study-programs';

import { Subject } from '@/type/subjects';

export const getGroups = (subject: Subject) => {
  const groups = subject.courses.map(({ group }) => group);
  return Array.from(new Set(groups));
};

export const getCoursesWithMergedWeeks = <T extends Subject>(subject: T) => {
  const courses = subject.courses.filter((course1, index) => {
    return (
      index ===
      subject.courses.findIndex((course2) => {
        return (
          course1.day === course2.day &&
          course1.group === course2.group &&
          course1.lecture === course2.lecture &&
          course1.interval.start === course2.interval.start &&
          course1.interval.end === course2.interval.end
        );
      })
    );
  });

  return { ...subject, courses } as T;
};

export const filterSubjectsByStudyProgramFilter = (filter: Record<string, string[]>, subjects: Subject[]) => {
  const subjectsId = Object.keys(filter)
    .map((studyProgramName) => {
      const studyProgram = STUDY_PROGRAMS.find(({ name }) => name === studyProgramName);
      if (!studyProgram) return [];

      const specializations = studyProgram.specializations.filter(({ name }) =>
        filter[studyProgramName].includes(name),
      );
      return specializations.map(({ modules }) => modules.map(({ id }) => id)).flat();
    })
    .flat();

  return subjects.filter(({ id }) => subjectsId.includes(id));
};

export const filterSubjectsGroups = (subjects: Subject[], groupFilter: string) => {
  if (groupFilter === '') return subjects;

  return subjects.map(({ courses, ...subject }) => ({
    ...subject,
    courses: courses.filter(({ group }) => group.includes(groupFilter)),
  }));
};
