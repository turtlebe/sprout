import { mockTransplantWorkcenterPlan } from '@plentyag/app-production/src/workcenters-page/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import {
  dataTestIdsTransplantTowersAndLoadToVerticalGrowTaskTitle as dataTestIds,
  TransplantTowersAndLoadToVerticalGrowTaskTitle,
} from '.';

const mockTransplantTowersAndLoadToVerticalGrowTask = mockTransplantWorkcenterPlan.detailsOfTasksFromPlan[0];

describe('TransplantTowersAndLoadToVerticalGrowTaskTitle', () => {
  function renderTransplantTowersAndLoadToVerticalGrowTaskTitle() {
    return render(
      <TransplantTowersAndLoadToVerticalGrowTaskTitle task={mockTransplantTowersAndLoadToVerticalGrowTask} />
    );
  }

  it('shows transplate title with correct tense', () => {
    const { queryByTestId } = renderTransplantTowersAndLoadToVerticalGrowTaskTitle();

    // past tense since task is completed
    expect(queryByTestId(dataTestIds.transplantTitle)).toHaveTextContent('Transplanted');
  });

  it('shows tower count with crop', () => {
    const { queryByTestId } = renderTransplantTowersAndLoadToVerticalGrowTaskTitle();

    expect(queryByTestId(dataTestIds.towerCountWithCrop)).toHaveTextContent('10 WHC towers');
  });

  it('show destination grow room and line', () => {
    const { queryByTestId } = renderTransplantTowersAndLoadToVerticalGrowTaskTitle();

    expect(queryByTestId(dataTestIds.growPath)).toHaveTextContent('GrowRoom1, GrowLine1');
  });
});
