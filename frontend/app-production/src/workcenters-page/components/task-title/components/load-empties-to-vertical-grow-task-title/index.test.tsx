import { mockTransplantWorkcenterPlan } from '@plentyag/app-production/src/workcenters-page/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsLoadEmptiesToVerticalGrowTaskTitle as dataTestIds, LoadEmptiesToVerticalGrowTaskTitle } from '.';

const mockLoadEmptiesToVerticalGrow = mockTransplantWorkcenterPlan.detailsOfTasksFromPlan[1];

describe('LoadEmptiesToVerticalGrowTaskTitle', () => {
  function renderLoadEmptiesToVerticalGrowTaskTitle() {
    return render(<LoadEmptiesToVerticalGrowTaskTitle task={mockLoadEmptiesToVerticalGrow} />);
  }

  it('shows load title in correct tense', () => {
    const { queryByTestId } = renderLoadEmptiesToVerticalGrowTaskTitle();

    // present tense since task is running
    expect(queryByTestId(dataTestIds.loadTitle)).toHaveTextContent('Loading');
  });

  it('shows the tower count', () => {
    const { queryByTestId } = renderLoadEmptiesToVerticalGrowTaskTitle();

    expect(queryByTestId(dataTestIds.towerCount)).toHaveTextContent('5 empty towers');
  });

  it('shows the grow room and lane', () => {
    const { queryByTestId } = renderLoadEmptiesToVerticalGrowTaskTitle();

    expect(queryByTestId(dataTestIds.growPath)).toHaveTextContent('GrowRoom1, GrowLine1');
  });
});
