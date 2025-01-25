import { MouseEvent } from 'react';

import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { Button, Flex, FlexProps, IconButton } from '@radix-ui/themes';
import { format } from 'date-fns';

import { useSchedule } from '@/context/schedule-context';

interface IProps {
  prev: (event: MouseEvent<HTMLButtonElement>) => void;
  next: (event: MouseEvent<HTMLButtonElement>) => void;
  curr: (event: MouseEvent<HTMLButtonElement>) => void;
}

const ScheduleControls = ({ prev, next, curr, ...props }: IProps & FlexProps) => {
  const { interval } = useSchedule();

  return (
    <Flex gap="2" {...props}>
      <IconButton type="button" onClick={prev}>
        <ArrowLeftIcon />
      </IconButton>

      <Button type="button" variant="soft" onClick={curr}>
        {format(interval.start, 'd MMM')} - {format(interval.end, 'd MMM')}
      </Button>

      <IconButton type="button" onClick={next}>
        <ArrowRightIcon />
      </IconButton>
    </Flex>
  );
};

export default ScheduleControls;
