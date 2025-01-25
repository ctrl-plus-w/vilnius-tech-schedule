import { useMemo } from 'react';

import useBreakpoint from 'use-breakpoint';

import { Breakpoint, BREAKPOINTS } from '@/util/style';

import { IntervalKind } from '@/type/schedule';

const useBreakpointIntervalKind = () => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS);

  return useMemo(() => {
    switch (breakpoint) {
      case Breakpoint.initial:
        return IntervalKind.DAY;
      case Breakpoint.xs:
      case Breakpoint.sm:
      case Breakpoint.md:
        return IntervalKind.DAYS_3;
      case Breakpoint.lg:
      case Breakpoint.xl:
        return IntervalKind.WEEK;
      default:
        return IntervalKind.WEEK;
    }
  }, [breakpoint]);
};

export default useBreakpointIntervalKind;
