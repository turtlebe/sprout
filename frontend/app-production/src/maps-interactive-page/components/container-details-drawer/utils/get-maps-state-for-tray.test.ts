import { mocksChildResources } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';

import { getMapsStateForTray } from './get-maps-state-for-tray';

describe('getMapsStateForTray', () => {
  it('should return MapState from ContainerData', () => {
    // ARRANGE
    const [mockResourceState] = mocksChildResources;
    const mockContainerData = {
      positionInParent: 'C1',
      resourceState: mockResourceState,
    };

    // ACT
    const result = getMapsStateForTray(mockContainerData);

    // ASSERT
    expect(result).toEqual({
      C1: {
        resourceState: mockResourceState,
      },
    });
  });
});
