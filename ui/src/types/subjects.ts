export const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
export type Day = (typeof days)[number];

export interface Course {
  interval: { start: string; end: string };
  day: Day;
  lecture: number;
  group: string;
  time: string;
  week: string;
  auditorium: string;
  type: string;
}

export interface Subject {
  name: string;
  id: string;
  courses: Course[];
  credits: number;
}
