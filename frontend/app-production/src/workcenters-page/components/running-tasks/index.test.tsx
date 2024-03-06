import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsCollapsableTimelineTasks } from '..';
import { RunningTask } from '../../../common/components';
import { mockPropLoadCompletedPlan, mockSeedInProgressPlan } from '../../test-helpers';

import { RunningTasks } from '.';

jest.mock('../../../common/components/running-task');
const mockrunningTask = RunningTask as jest.Mock;
mockrunningTask.mockImplementation(() => <div>mock running task</div>);

describe('RunningTasks', () => {
  it('shows tasks that have RUNNING status', () => {
    const mockTasks = mockSeedInProgressPlan.detailsOfTasksFromPlan;
    const { queryByTestId } = render(<RunningTasks tasks={mockTasks} />);

    // there are two RUNNING tasks.
    expect(queryByTestId(dataTestIdsCollapsableTimelineTasks.timelineTaskItems).children).toHaveLength(2);
  });

  it('shows no tasks - since none have RUNNING status', () => {
    const mockTasks = mockPropLoadCompletedPlan.detailsOfTasksFromPlan;
    const { queryByTestId } = render(<RunningTasks tasks={mockTasks} />);

    expect(queryByTestId(dataTestIdsCollapsableTimelineTasks.timelineTaskItems).children).toHaveLength(0);
  });
});
