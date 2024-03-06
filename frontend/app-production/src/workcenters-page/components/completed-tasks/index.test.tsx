import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsCollapsableTimelineTasks } from '..';
import { WorkcenterTaskDetailsResponse } from '../../../common/types';
import { mockPropLoadPausedPlan, mockSeedCreatedPlan } from '../../test-helpers';

import { CompletedTasks, dataTestIdsCompletedTasks as dataTestIds } from '.';

describe('CompletedTasks', () => {
  function renderCompletedTasks(mockTasks: WorkcenterTaskDetailsResponse[]) {
    return render(<CompletedTasks tasks={mockTasks} />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('shows tasks with status COMPLETED or FAILED', () => {
    const mockTasks: WorkcenterTaskDetailsResponse[] = mockPropLoadPausedPlan.detailsOfTasksFromPlan;
    const { queryByTestId } = renderCompletedTasks(mockTasks);

    // there are two tasks: one completed and one failed.
    expect(queryByTestId(dataTestIdsCollapsableTimelineTasks.timelineTaskItems).children).toHaveLength(2);
  });

  it('shows no tasks - since none are COMPLETED or FAILED', () => {
    const mockTasks: WorkcenterTaskDetailsResponse[] = mockSeedCreatedPlan.detailsOfTasksFromPlan;
    const { queryByTestId } = renderCompletedTasks(mockTasks);

    expect(queryByTestId(dataTestIdsCollapsableTimelineTasks.timelineTaskItems).children).toHaveLength(0);
  });

  it('shows a reactors and task link for each completed task', () => {
    const mockTasks: WorkcenterTaskDetailsResponse[] = mockPropLoadPausedPlan.detailsOfTasksFromPlan;
    const { queryAllByTestId } = renderCompletedTasks(mockTasks);

    const links = queryAllByTestId(dataTestIds.reactorsAndTasksLink);
    expect(links).toHaveLength(2); // since there are two completed tasks in the mock.
  });
});
