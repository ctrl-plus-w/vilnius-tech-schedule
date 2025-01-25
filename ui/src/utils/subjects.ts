import { Subject } from '@/type/subjects';

export const getCourses = (subject: Subject) => {
  return Object.values(subject.courseDays)
    .map((courseDays) => Object.values(courseDays))
    .flat()
    .flat();
};

export const getGroups = (subject: Subject) => {
  const groups = getCourses(subject).map(({ group }) => group);
  return Array.from(new Set(groups));
};
