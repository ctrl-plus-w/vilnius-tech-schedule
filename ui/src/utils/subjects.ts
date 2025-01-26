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

export const filterSubjectsGroups = (subjects: Subject[], groupFilter: string) => {
  if (groupFilter === '') return subjects;

  return subjects.map(({ courses, ...subject }) => ({
    ...subject,
    courses: courses.filter(({ group }) => group.includes(groupFilter)),
  }));
};
