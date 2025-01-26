import parse from 'node-html-parser';

import logger from './instances/logger';
import { StudyModule } from './constants/study-programs';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
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

export const parseSubjectCourses = (html: string, module: StudyModule) => {
  const root = parse(html).querySelector('div');
  if (!root) throw new Error('Failed to find the root element');

  const children = root.children;

  const isDay = (str: string): str is Day => days.includes(str as unknown as Day);

  const subject: Subject = {
    name: '',
    id: module.id,
    courses: [],
    credits: module.credits,
  };

  let interval: { start: string; end: string } | undefined;
  let day: Day | undefined;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (i === 0) {
      subject.name = child.text.trim();
      continue;
    }

    if (child.tagName === 'H3') {
      const content = child.text.trim();
      const [start, end] = content.split(' — ');
      interval = { start, end: end ?? start };
      continue;
    }

    if (child.classNames.includes('sub-title')) {
      const _day = child.text.toLowerCase().trim();
      if (!isDay(_day)) {
        logger.warn(`Day is not a day ("${_day}")`);
        continue;
      }
      day = _day;
      continue;
    }

    if (child.id === 'my-results-grid') {
      if (!interval || !day) {
        logger.warn('Found a table but the interval or day is not set');
        continue;
      }

      const rows = child.querySelectorAll('tbody > tr');

      for (const row of rows) {
        const lecture = row.querySelector('[data-title="Lecture"]');
        if (!lecture) {
          logger.warn('Failed to find the lecture');
          continue;
        }

        const group = row.querySelector('[data-title="Group"]');
        if (!group) {
          logger.warn('Failed to find the group');
          continue;
        }

        const groupTooltipSpan = group.querySelector('span');
        if (groupTooltipSpan) groupTooltipSpan.remove();

        const time = row.querySelector('[data-title="Time"]');
        if (!time) {
          logger.warn('Failed to find the time');
          continue;
        }

        const week = row.querySelector('[data-title="Week"]');
        if (!week) {
          logger.warn('Failed to find the week');
          continue;
        }

        const auditorium = row.querySelector('[data-title="Auditorium"]');
        if (!auditorium) {
          logger.warn('Failed to find the auditorium');
          continue;
        }

        const type = row.querySelector('[data-title="Type"]');
        if (!type) {
          logger.warn('Failed to find the type');
          continue;
        }

        if (!interval || !day) continue;

        subject.courses.push({
          interval: interval,
          day: day,
          lecture: Number(lecture.text.trim()),
          group: group.text.trim(),
          time: time.text.trim(),
          week: week.text.trim(),
          auditorium: auditorium.text.trim(),
          type: type.text.trim(),
        });
      }
    }
  }

  return subject;
};
