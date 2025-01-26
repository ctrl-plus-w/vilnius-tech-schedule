export const standardVariation = (arr: number[]) => {
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  return Math.sqrt(arr.reduce((acc, val) => acc + (val - mean) ** 2, 0) / arr.length);
};
