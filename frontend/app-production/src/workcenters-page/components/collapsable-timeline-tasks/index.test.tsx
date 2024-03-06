import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { TaskIcon, TimelineTask } from '..';
import { TaskStatus } from '../../../common/types';

import { CollapsableTimelineTasks, dataTestIdsCollapsableTimelineTasks as dataTestIds } from '.';

describe('CollapsableTimelineTasks', () => {
  function renderCollapsableTimelineTasks(showChildren = true) {
    const defaultTimelineIcon = <TaskIcon taskStatus={TaskStatus.COMPLETED} />;
    const children = showChildren
      ? ['task1', 'task2', 'task3'].map(task => (
          <TimelineTask key={task} taskIcon={defaultTimelineIcon}>
            {task}
          </TimelineTask>
        ))
      : [];
    return render(
      <CollapsableTimelineTasks title="Completed Tasks" defaultTimelineIconColor="red" children={children} />
    );
  }

  it('renders a list of TimelineTask items when expanded', () => {
    const { queryByTestId } = renderCollapsableTimelineTasks();

    // should be expanded by default, so should be visible
    expect(queryByTestId(dataTestIds.timelineTaskItems)).toBeVisible();

    expect(queryByTestId(dataTestIds.headerTaskItem)).toHaveTextContent('Completed Tasks');
  });

  it('hides a list of TimelineTask items when collapsed', async () => {
    const { queryByTestId } = renderCollapsableTimelineTasks();

    // should be expanded by default, so should be visible
    expect(queryByTestId(dataTestIds.timelineTaskItems)).toBeVisible();

    queryByTestId(dataTestIds.toggleExpandedButton).click();

    await waitFor(() => expect(queryByTestId(dataTestIds.timelineTaskItems)).not.toBeVisible());

    queryByTestId(dataTestIds.toggleExpandedButton).click();

    await waitFor(() => expect(queryByTestId(dataTestIds.timelineTaskItems)).toBeVisible());
  });
});
