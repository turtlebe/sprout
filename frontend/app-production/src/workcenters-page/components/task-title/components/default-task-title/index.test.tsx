import { mockPackWorkcenterPlan } from '@plentyag/app-production/src/workcenters-page/test-helpers';
import { render } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import React from 'react';

import { dataTestIdsDefaultTaskTitle as dataTestIds, DefaultTaskTitle } from '.';

const mockBlendPackageAndPalletizeSkuTask = mockPackWorkcenterPlan.detailsOfTasksFromPlan[0];
const mockBlendPackageAndPalletizeSkuTaskWithNoTitle = mockPackWorkcenterPlan.detailsOfTasksFromPlan[1];

describe('DefaultTaskTitle', () => {
  it('shows task title', () => {
    const { queryByTestId } = render(<DefaultTaskTitle task={mockBlendPackageAndPalletizeSkuTask} />);

    expect(queryByTestId(dataTestIds.title)).toHaveTextContent(mockBlendPackageAndPalletizeSkuTask.taskDetails.title);
  });

  it('shows task name in title - when no task title is provide', () => {
    const { queryByTestId } = render(<DefaultTaskTitle task={mockBlendPackageAndPalletizeSkuTaskWithNoTitle} />);

    expect(queryByTestId(dataTestIds.title)).toHaveTextContent('BlendPackageAndPalletizeSku');
  });

  it('shows "???" when taskPath can not be determined', () => {
    const _mockTask = cloneDeep(mockBlendPackageAndPalletizeSkuTaskWithNoTitle);

    // remove taskpath for testing purposes
    delete _mockTask.taskDetails.taskPath;

    const { queryByTestId } = render(<DefaultTaskTitle task={_mockTask} />);

    expect(queryByTestId(dataTestIds.title)).toHaveTextContent('???');
  });
});
