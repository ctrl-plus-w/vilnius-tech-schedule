import { Interval } from 'date-fns';

import { Colors } from '@/util/colors';

export enum IntervalKind {
  WEEK = 'WEEK',
  DAYS_3 = 'DAYS_3',
  DAY = 'DAY',
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface TScheduleEvent extends DateRange {
  id: string;
  name: string;
  isCurrent: boolean;
  color: Colors;
  isLive?: boolean;
  recurring?: Interval;
}

export enum EventKind {
  START = 'START',
  MIDDLE = 'MIDDLE',
  END = 'END',
  SINGLE = 'SINGLE',
}

export interface IEventDaysEvent {
  event: TScheduleEvent;
  originalEvent: TScheduleEvent;
  kind: EventKind;
}
