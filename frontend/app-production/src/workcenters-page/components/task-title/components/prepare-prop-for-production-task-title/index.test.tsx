import { mockPropUnloadWorkcenterPlan } from '@plentyag/app-production/src/workcenters-page/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsPreparePropForProductionTaskTitle as dataTestIds, PreparePropForProductionTaskTitle } from '.';

const mockPreparePropForProductionTask = mockPropUnloadWorkcenterPlan.detailsOfTasksFromPlan[0];

describe('PreparePropForProductionTaskTitle', () => {
  function renderPreparePropForProductionTaskTitle() {
    return render(<PreparePropForProductionTaskTitle task={mockPreparePropForProductionTask} />);
  }

  it('shows shuffle title', () => {
    const { queryByTestId } = renderPreparePropForProductionTaskTitle();

    // should have past tense since task is completed
    expect(queryByTestId(dataTestIds.shuffleTitle)).toHaveTextContent('Shuffled');
  });

  it('shows number of tables prepared for propagation rack1 and rack2', () => {
    const { queryByTestId } = renderPreparePropForProductionTaskTitle();

    const racks = queryByTestId(dataTestIds.tables);
    expect(racks.children).toHaveLength(2);
    expect(racks.children[0]).toHaveTextContent('2 tables in Prop Rack 1');
    expect(racks.children[1]).toHaveTextContent('1 tables in Prop Rack 2');
  });
});
