import { cloneDeep } from 'lodash';

import { mockMapsState, mocksResourcesState } from '../../../test-helpers/mock-maps-state';
import { MapsState } from '../../../types';

import { getContainerType } from '.';

describe('getContainerType', () => {
  it('returns the containerType', () => {
    expect(getContainerType(mockMapsState)).toBe('TABLE');
  });

  it('returns undefined when state no provided', () => {
    expect(getContainerType(undefined)).toBe(undefined);
  });

  it('returns undefined when no containerType is found', () => {
    const _mocksResourcesState = cloneDeep(mocksResourcesState);

    // for testing purposes remove the containerType fields.
    delete _mocksResourcesState[0].containerObj.containerType;
    delete _mocksResourcesState[1].containerObj.containerType;

    const _mockMapsState: MapsState = {
      [_mocksResourcesState[0].location.containerLocation.farmdefContainerLocationRef]: {
        resourceState: _mocksResourcesState[0],
      },
      [_mocksResourcesState[1].location.containerLocation.farmdefContainerLocationRef]: {
        resourceState: _mocksResourcesState[1],
      },
    };
    expect(getContainerType(_mockMapsState)).toBe(undefined);
  });
});
