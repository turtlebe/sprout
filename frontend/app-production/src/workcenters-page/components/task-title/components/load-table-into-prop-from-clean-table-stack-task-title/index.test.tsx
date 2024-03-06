import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { mockPropLoadWorkcenterPlan } from '@plentyag/app-production/src/workcenters-page/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import {
  dataTestIdsLoadTableIntoPropFromCleanTableStackTaskTitle as dataTestIds,
  LoadTableIntoPropFromCleanTableStackTaskTitle,
} from '.';

const mockLoadTableIntoPropFromCleanTableStack = mockPropLoadWorkcenterPlan.detailsOfTasksFromPlan[2];

describe('LoadTableIntoPropFromCleanTableStackTaskTitle', () => {
  function renderLoadTableIntoPropFromCleanTableStackTaskTitle() {
    return render(<LoadTableIntoPropFromCleanTableStackTaskTitle task={mockLoadTableIntoPropFromCleanTableStack} />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('shows load title in correct tense', () => {
    const { queryByTestId } = renderLoadTableIntoPropFromCleanTableStackTaskTitle();

    // present tense since task is running
    expect(queryByTestId(dataTestIds.loadTitle)).toHaveTextContent('Loading');
  });

  it('shows table serial link', () => {
    const { queryByTestId } = renderLoadTableIntoPropFromCleanTableStackTaskTitle();

    expect(queryByTestId(dataTestIds.tableLink)).toHaveAttribute(
      'href',
      expect.stringContaining('P900-0008046A:RC9X-4R6D-CG')
    );
  });

  it('shows propagation rack and level', () => {
    const { queryByTestId } = renderLoadTableIntoPropFromCleanTableStackTaskTitle();

    expect(queryByTestId(dataTestIds.propPath)).toHaveTextContent('PropagationRack1, PropLevel1');
  });
});
