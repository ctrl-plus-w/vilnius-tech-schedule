'use client';

import React, { createContext, Dispatch, MutableRefObject, SetStateAction, useContext, useRef, useState } from 'react';

import { Interval } from 'date-fns';

import { TScheduleEvent } from '@/type/schedule';

interface IContext {
  events: TScheduleEvent[];
  editable: boolean;

  onRequestAdd: (evt: TScheduleEvent) => void;
  onRequestEdit: (evt: TScheduleEvent) => void;

  currentEvent?: TScheduleEvent;
  setCurrentEvent: Dispatch<SetStateAction<TScheduleEvent | undefined>>;

  interval: Interval;

  cellHeight: number;
  setCellHeight: Dispatch<SetStateAction<number>>;

  hasResized: number;
  setHasResized: Dispatch<SetStateAction<number>>;

  eventSizeRef: MutableRefObject<HTMLTableCellElement | null>;
  headerRef: MutableRefObject<HTMLTableCellElement | null>;
}

const defaultContext = {
  events: [],
  editable: false,

  onRequestAdd: () => null,
  onRequestEdit: () => null,

  currentEvent: undefined,
  setCurrentEvent: () => null,

  cellHeight: 48,
  setCellHeight: () => null,

  hasResized: 0,
  setHasResized: () => null,

  interval: { start: new Date(0), end: new Date(0) },

  eventSizeRef: { current: null },
  headerRef: { current: null },
} satisfies IContext;

export const ScheduleContext = createContext<IContext>(defaultContext);

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error('Schedule elements must be placed inside a <ScheduleProvider /> element.');
  return context;
};

interface IProps extends IPropsWithChildren {
  events: TScheduleEvent[];
  editable?: boolean;

  interval: Interval;

  onRequestAdd: (evt: TScheduleEvent) => void;
  onRequestEdit: (evt: TScheduleEvent) => void;
}

const ScheduleProvider = ({
  interval,
  //
  events,
  editable,
  //
  onRequestEdit,
  onRequestAdd,
  //
  children,
}: IProps) => {
  const [currentEvent, setCurrentEvent] = useState<TScheduleEvent | undefined>(defaultContext.currentEvent);

  const [hasResized, setHasResized] = useState<number>(defaultContext.hasResized);

  const [cellHeight, setCellHeight] = useState(defaultContext.cellHeight);

  const eventSizeRef = useRef<HTMLTableCellElement | null>(null);
  const headerRef = useRef<HTMLTableCellElement | null>(null);

  return (
    <ScheduleContext.Provider
      value={{
        events,
        editable: editable ?? defaultContext.editable,

        onRequestAdd,
        onRequestEdit,

        currentEvent,
        setCurrentEvent,

        interval,

        cellHeight,
        setCellHeight,

        hasResized,
        setHasResized,

        eventSizeRef,
        headerRef,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export default ScheduleProvider;
