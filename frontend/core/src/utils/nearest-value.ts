// from https://stackoverflow.com/questions/8584902/get-the-closest-number-out-of-an-array
export const nearestValue = (array: number[], value: number) => {
  if (array.length === 0) {
    return null;
  }

  return array.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));
};
