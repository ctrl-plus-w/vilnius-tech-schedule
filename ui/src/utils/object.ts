export const mapValues = <T, R>(obj: Record<string, T>, map: (value: T) => R) => {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, map(value)]));
};
