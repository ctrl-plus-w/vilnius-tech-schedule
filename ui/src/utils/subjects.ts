import { Subject } from '@/type/subjects';

export const getGroups = (subject: Subject) => {
  const groups = subject.courses.map(({ group }) => group);
  return Array.from(new Set(groups));
};
