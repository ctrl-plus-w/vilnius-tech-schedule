import { SetStateAction, useEffect, useState } from 'react';

import { SelectProps } from '@radix-ui/react-select';
import { Select } from '@radix-ui/themes';

import { useSchedule } from '@/context/schedule-context';

export interface IZoomLevel {
  label: string;
  cellHeight: number;
}

interface IProps {
  zoomLevels?: IZoomLevel[];
  defaultZoomLevel?: IZoomLevel;
}

export const ZOOM_LEVELS = [
  {
    label: 'x1',
    cellHeight: 48,
  },
  {
    label: 'x2',
    cellHeight: 72,
  },
  {
    label: 'x3',
    cellHeight: 108,
  },
] satisfies IZoomLevel[];

const ScheduleZoomControls = ({
  zoomLevels = ZOOM_LEVELS,
  defaultZoomLevel = zoomLevels[0],
  ...props
}: IProps & SelectProps) => {
  const { setCellHeight } = useSchedule();

  const getDefaultZoomLevel = () => {
    if (typeof localStorage === 'undefined') return defaultZoomLevel;

    const cachedZoomLevel = localStorage.getItem('zoom-level');
    if (!cachedZoomLevel) return defaultZoomLevel;

    const parsedCachedZoomLevel = JSON.parse(cachedZoomLevel);
    return zoomLevels.find(({ label }) => label === parsedCachedZoomLevel?.label) ?? defaultZoomLevel;
  };

  const [zoomLevel, setZoomLevelState] = useState(getDefaultZoomLevel());

  const setZoomLevel = (valueOrFn: SetStateAction<IZoomLevel>) => {
    setZoomLevelState((prev) => {
      const value = typeof valueOrFn === 'function' ? valueOrFn(prev) : valueOrFn;
      localStorage.setItem('zoom-level', JSON.stringify(value));
      return value;
    });
  };

  const onValueChange = (label: string) => {
    const selectedZoomLevel = zoomLevels.find(({ label: _label }) => _label === label);
    if (selectedZoomLevel) setZoomLevel(selectedZoomLevel);
  };

  useEffect(() => {
    setCellHeight(zoomLevel.cellHeight);
  }, [zoomLevel]);

  return (
    <Select.Root {...props} value={zoomLevel.label} onValueChange={onValueChange}>
      <Select.Trigger variant="soft" />

      <Select.Content>
        {zoomLevels.map(({ label }) => (
          <Select.Item key={label} value={label}>
            {label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default ScheduleZoomControls;
