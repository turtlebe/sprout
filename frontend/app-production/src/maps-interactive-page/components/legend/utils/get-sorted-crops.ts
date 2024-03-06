import { EMPTY_CONTAINER } from '../types';

export function getSortedCrops(crops: string[]) {
  // alphabetically order crops with 'Empty' always being first item.
  crops.sort((a, b) => {
    if (a === EMPTY_CONTAINER) {
      return -1;
    }
    if (b === EMPTY_CONTAINER) {
      return 1;
    }
    return a.localeCompare(b);
  });

  return crops;
}
