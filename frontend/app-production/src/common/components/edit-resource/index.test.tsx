import { render } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import React from 'react';

import { mockFarmStateContainer } from '../../test-helpers';

import { dataTestIdsEditResource as dataTestIds, EditResource } from '.';

describe('EditResource', () => {
  let mockOnClose;

  beforeEach(() => {
    mockOnClose = jest.fn();
  });

  function renderEditResource(resourceState) {
    return render(<EditResource resourceState={resourceState} onClose={mockOnClose} />);
  }

  describe('edit loaded at date', () => {
    it('renders buttons', () => {
      // ARRANGE
      const { resourceState } = mockFarmStateContainer;

      // ACT
      const { queryByTestId } = renderEditResource(resourceState);

      // ASSERT
      expect(queryByTestId(dataTestIds.loadedAtButton)).toBeInTheDocument();
    });

    it.each([
      ['TOWER', 'TowerAutomation'],
      ['TRAY', 'Propagation'],
    ])('should not show edit loaded at button if container is a %s in %s', (containerType, areaName) => {
      // ARRANGE
      const { resourceState } = mockFarmStateContainer;
      const ineligibleResourceState = cloneDeep(resourceState);
      ineligibleResourceState.location.machine.areaName = areaName;
      ineligibleResourceState.containerObj.containerType = containerType as any;

      // ACT
      const { queryByTestId } = renderEditResource(ineligibleResourceState);

      // ASSERT
      expect(queryByTestId(dataTestIds.loadedAtButton)).not.toBeInTheDocument();
    });
  });
});
