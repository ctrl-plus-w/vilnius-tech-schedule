export const accentColors = [
  'gray',
  'gold',
  'bronze',
  'brown',
  'yellow',
  'amber',
  'orange',
  'tomato',
  'red',
  'ruby',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'iris',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'jade',
  'green',
  'grass',
  'lime',
  'mint',
  'sky',
] as const;

export type Colors = (typeof accentColors)[number];

export const getLeastUsedColors = (colors: Record<string, Colors>) => {
  const countedColors: Partial<Record<Colors, number>> = {};

  for (const color of accentColors) {
    countedColors[color] = Object.values(colors).filter((v) => v === color).length;
  }

  const leastUsedColors: Colors[] = [];
  const minColorUsage = Math.min(...Object.values(countedColors));

  for (const color of accentColors) {
    if (countedColors[color] === minColorUsage) leastUsedColors.push(color);
  }

  return leastUsedColors;
};
