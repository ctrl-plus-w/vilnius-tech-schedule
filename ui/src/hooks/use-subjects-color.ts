import { SetStateAction, useLayoutEffect, useMemo } from 'react';

import { useSubjectsColorContext } from '@/context/subjects-color-context';

import { accentColors, Colors, getLeastUsedColors } from '@/util/colors';

export type SubjectsColors = Record<string, Colors>;

const isColor = (value: string): value is (typeof accentColors)[number] => {
  return accentColors.includes(value as any);
};

const sanitizeColors = (colors: Record<string, unknown>): SubjectsColors => {
  const res: SubjectsColors = {};

  for (const [key, value] of Object.entries(colors)) {
    if (typeof value !== 'string') continue;
    if (!isColor(value)) continue;

    res[key] = value;
  }

  return res;
};

const useSubjectsColor = () => {
  const { isLoading, setIsLoading, colors, setColors: setColorsState } = useSubjectsColorContext();

  useLayoutEffect(() => {
    setIsLoading(true);

    const _colors = localStorage.getItem('subjects-colors');
    if (_colors) setColorsState(sanitizeColors(JSON.parse(_colors)));

    setIsLoading(false);
  }, []);

  const setColors = (valueOrFn: SetStateAction<SubjectsColors>) => {
    setColorsState((prev) => {
      const value = typeof valueOrFn === 'function' ? valueOrFn(prev) : valueOrFn;
      localStorage.setItem('subjects-colors', JSON.stringify(value));
      return value;
    });
  };

  return useMemo(
    () => (subjectId: string) => {
      if (isLoading) return null;

      const color = colors[subjectId];
      if (color) return color;

      const leastUsedColors = getLeastUsedColors(colors);
      const randomColor = leastUsedColors[Math.floor(Math.random() * leastUsedColors.length)];

      setColors((prev) => ({ ...prev, [subjectId]: randomColor }));

      return randomColor;
    },
    [colors, setColors],
  );
};

export default useSubjectsColor;
