export interface Observable {
  path: string;
  measurementType: string;
  observationName: string;
}

export const isObservableEqual = (a: Observable) => (b: Observable) => {
  return a.path === b.path && a.measurementType === b.measurementType && a.observationName === b.observationName;
};
