import { mockMapsState, mocksResourcesState } from '../../../test-helpers/mock-maps-state';
import { EMPTY_CONTAINER } from '../types';

import { getCropCount } from '.';

describe('getCropCount', () => {
  it('gets the proper count', () => {
    const count = getCropCount(mockMapsState);

    expect(count['BAC']).toEqual(2);
    expect(count['BAC,WHC']).toEqual(1);
    expect(count[EMPTY_CONTAINER]).toEqual(1);
  });

  it('returns empty map if no state is provided', () => {
    const count = getCropCount(undefined);

    expect(Object.keys(count)).toHaveLength(0);
  });

  it('gets the proper count even when there are conflicts', () => {
    const mockMapsStateWithConflicts = {
      ...mockMapsState,
      [mocksResourcesState[2].location.containerLocation.farmdefContainerLocationRef]: {
        resourceState: null,
        conflicts: [
          {
            resourceState: mocksResourcesState[2],
          },
          {
            resourceState: mocksResourcesState[2],
          },
        ],
      },
    };

    const count = getCropCount(mockMapsStateWithConflicts);

    expect(count['BAC']).toEqual(2);
    expect(count['BAC,WHC']).toBeUndefined();
    expect(count[EMPTY_CONTAINER]).toEqual(1);
  });
});
