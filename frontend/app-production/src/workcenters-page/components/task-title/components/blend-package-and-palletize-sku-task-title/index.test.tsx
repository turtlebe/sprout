import { mockPackWorkcenterPlan } from '@plentyag/app-production/src/workcenters-page/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import {
  BlendPackageAndPalletizeSkuTaskTitle,
  dataTestIdsBlendPackageAndPalletizeSkuTaskTitle as dataTestIds,
} from '.';

const mockBlendPackageAndPalletizeSkuTask = mockPackWorkcenterPlan.detailsOfTasksFromPlan[0];

describe('BlendPackageAndPalletizeSkuTaskTitle', () => {
  function renderBlendPackageAndPalletizeSkuTaskTitle() {
    return render(<BlendPackageAndPalletizeSkuTaskTitle task={mockBlendPackageAndPalletizeSkuTask} />);
  }

  it('shows the process title in correct tense', () => {
    const { queryByTestId } = renderBlendPackageAndPalletizeSkuTaskTitle();

    // future tense since task is pending
    expect(queryByTestId(dataTestIds.processTitle)).toHaveTextContent('Blend and Palletize');
  });

  it('shows number of cases', () => {
    const { queryByTestId } = renderBlendPackageAndPalletizeSkuTaskTitle();

    expect(queryByTestId(dataTestIds.numberOfCases)).toHaveTextContent('10 cases');
  });

  it('shows SKU value', () => {
    const { queryByTestId } = renderBlendPackageAndPalletizeSkuTaskTitle();

    expect(queryByTestId(dataTestIds.sku)).toHaveTextContent('KC1Clamshell4o5oz');
  });
});
