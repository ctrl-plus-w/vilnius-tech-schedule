import { useMemo, useState } from 'react';

import { addDays, addWeeks } from 'date-fns';

import { cleanIntervalTime, getWeekInterval } from '@/util/date';

import { IntervalKind } from '@/type/schedule';

const useSchedulerInterval = (intervalKind: IntervalKind, defaultSelected: Date = new Date()) => {
  const [selected, setSelected] = useState(defaultSelected);

  const interval = useMemo(() => {
    switch (intervalKind) {
      case IntervalKind.WEEK:
        return cleanIntervalTime(getWeekInterval(selected));
      case IntervalKind.DAYS_3:
        return cleanIntervalTime({ start: addDays(selected, -1), end: addDays(selected, 1) });
      case IntervalKind.DAY:
        return cleanIntervalTime({ start: selected, end: selected });
    }
  }, [selected, intervalKind]);

  const prev = () => {
    setSelected((prev) => {
      switch (intervalKind) {
        case IntervalKind.WEEK:
          return addWeeks(prev, -1);
        case IntervalKind.DAYS_3:
          return addDays(prev, -3);
        case IntervalKind.DAY:
          return addDays(prev, -1);
      }
    });
  };

  const curr = () => {
    setSelected(new Date());
  };

  const next = () => {
    setSelected((prev) => {
      switch (intervalKind) {
        case IntervalKind.WEEK:
          return addWeeks(prev, 1);
        case IntervalKind.DAYS_3:
          return addDays(prev, 3);
        case IntervalKind.DAY:
          return addDays(prev, 1);
      }
    });
  };

  return {
    intervalKind,

    selected,
    setSelected,

    prev,
    curr,
    next,

    interval,
  };
};

export default useSchedulerInterval;
