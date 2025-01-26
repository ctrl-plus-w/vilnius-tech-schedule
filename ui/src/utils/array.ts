/**
 * Stringify an array by putting "," and a "and" between each element.
 * @param arr The array to stringify
 * @returns A stringified version of the array
 */
export const arrayToString = (arr: string[]): string => {
  if (arr.length === 1) return arr[0];
  return `${arr.slice(0, arr.length - 1).join(', ')} and ${arr[arr.length - 1]}`;
};

export const getRandomElement = <T>(arr: T[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const retrieveRandomElement = <T>(arr: T[]) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  const element = arr[randomIndex];
  arr.splice(randomIndex, 1);
  return element;
};

export const unique = <T>(arr: T[]) => {
  return Array.from(new Set(arr));
};

export const count = <T>(arr: T[], predicate: (value: T) => boolean = Boolean) => {
  return arr.reduce((acc, value) => (predicate(value) ? acc + 1 : acc), 0);
};
