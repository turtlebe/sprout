import { buildAutocompleteOptionsFromTree, buildTreeForObservationGroups } from '.';

import { observationGroups } from './test-mocks';

const treeObservationGroups = buildTreeForObservationGroups(observationGroups);

describe('buildAutocompleteOptionsFromTree', () => {
  it('returns an array of Options to choose a Path', () => {
    expect(buildAutocompleteOptionsFromTree(treeObservationGroups)).toEqual([
      { label: 'p1', value: 'p1', count: 10, lastObservedAt: undefined },
      { label: 'p2', value: 'p2', count: 10, lastObservedAt: undefined },
    ]);
  });

  it('returns an array of Options to choose a MeasurementTypes', () => {
    expect(buildAutocompleteOptionsFromTree(treeObservationGroups, ['p1'])).toEqual([
      { label: 'm1', value: 'm1', count: 3, lastObservedAt: undefined },
      { label: 'm2', value: 'm2', count: 3, lastObservedAt: undefined },
      { label: 'm3', value: 'm3', count: 4, lastObservedAt: undefined },
    ]);
  });

  it('returns an array of Options to choose an ObservationName', () => {
    expect(buildAutocompleteOptionsFromTree(treeObservationGroups, ['p1', 'm1'])).toEqual([
      { label: 'o1', value: 'o1', count: 1, lastObservedAt: '2022-01-01T00:00:00Z' },
      { label: 'o2', value: 'o2', count: 2, lastObservedAt: '2022-01-01T01:00:00Z' },
    ]);
  });

  it('returns null given an invalid path', () => {
    expect(buildAutocompleteOptionsFromTree(treeObservationGroups, ['p1', 'm1', 'unknown-key'])).toEqual([]);
  });
});
