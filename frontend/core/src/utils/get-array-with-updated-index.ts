export function getArrayWithUpdatedIndex<T>(array: T[], newElement: T, index: number): T[] {
  return [...array.slice(0, index), newElement, ...array.slice(index + 1)];
}

export function getArrayWithoutIndex<T>(array: T[], index: number): T[] {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}
