import {
  mockContainerLocationRefWithLabels,
  mockMapsStateWithLabels,
  testLabels,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';

import { filterMapsStateForLabels } from '.';

describe('filterMapsStateForLabels', () => {
  it('returns all maps state when labels filter is empty', () => {
    expect(filterMapsStateForLabels(mockMapsStateWithLabels, [])).toEqual(mockMapsStateWithLabels);
    expect(filterMapsStateForLabels(mockMapsStateWithLabels, undefined)).toEqual(mockMapsStateWithLabels);
    expect(filterMapsStateForLabels(mockMapsStateWithLabels, null)).toEqual(mockMapsStateWithLabels);
  });

  it('returns only maps state with matching labels', () => {
    expect(filterMapsStateForLabels(mockMapsStateWithLabels, testLabels)).toEqual({
      [mockContainerLocationRefWithLabels]: mockMapsStateWithLabels[mockContainerLocationRefWithLabels],
    });
  });

  it('returns no maps state when no labels match', () => {
    expect(filterMapsStateForLabels(mockMapsStateWithLabels, ['label_that_does_not_exist'])).toEqual({});
  });
});
