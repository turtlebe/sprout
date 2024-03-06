import { mockHarvestWorkcenterPlan } from '@plentyag/app-production/src/workcenters-page/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import {
  dataTestIdsUnloadTowersFromVerticalGrowAndHarvestTaskTitle as dataTestIds,
  UnloadTowersFromVerticalGrowAndHarvestTaskTitle,
} from '.';

const mockUnloadTowersFromVerticalGrowAndHarvestTask = mockHarvestWorkcenterPlan.detailsOfTasksFromPlan[0];

describe('UnloadTowersFromVerticalGrowAndHarvestTaskTitle', () => {
  function renderUnloadTowersFromVerticalGrowAndHarvestTaskTitle() {
    return render(
      <UnloadTowersFromVerticalGrowAndHarvestTaskTitle task={mockUnloadTowersFromVerticalGrowAndHarvestTask} />
    );
  }

  it('shows load title with correct tense', () => {
    const { queryByTestId } = renderUnloadTowersFromVerticalGrowAndHarvestTaskTitle();

    // should have past tense since task is completed.
    expect(queryByTestId(dataTestIds.loadTitle)).toHaveTextContent('Unloaded and harvested');
  });

  it('shows tower count and crop', () => {
    const { queryByTestId } = renderUnloadTowersFromVerticalGrowAndHarvestTaskTitle();

    expect(queryByTestId(dataTestIds.towerCountAndCrop)).toHaveTextContent('10 WHC');
  });

  it('shows grow room and lane', () => {
    const { queryByTestId } = renderUnloadTowersFromVerticalGrowAndHarvestTaskTitle();

    expect(queryByTestId(dataTestIds.growPath)).toHaveTextContent('GrowRoom1, GrowLine1');
  });
});
