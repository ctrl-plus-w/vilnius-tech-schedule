export const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
export type Day = (typeof days)[number];

export interface Course {
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
  courseDays: Record<string, Partial<Record<Day, Course[]>>>;
}
