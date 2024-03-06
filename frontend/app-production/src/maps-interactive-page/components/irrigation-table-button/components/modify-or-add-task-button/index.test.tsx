import { render } from '@testing-library/react';
import React from 'react';

import { buildIrrigationTask } from '../../test-helpers/build-irrigation-task';

import { dataTestIdsModifyOrAddTaskButton as dataTestIds, ModifyOrAddTaskButton } from '.';

describe('ModifyOrAddTaskButton', () => {
  it('renders the button for a "Modify" task', () => {
    const task = buildIrrigationTask({});
    const isModify = true;
    const { queryByTestId } = render(
      <ModifyOrAddTaskButton rowData={task} isModify={isModify} onRefreshIrrigationTasks={jest.fn()} />
    );

    expect(queryByTestId(dataTestIds.modifyOrAddTaskButton(isModify))).toBeInTheDocument();
  });

  it('renders the button for a "Add" task', () => {
    const task = buildIrrigationTask({});
    const isModify = false;
    const { queryByTestId } = render(
      <ModifyOrAddTaskButton rowData={task} isModify={isModify} onRefreshIrrigationTasks={jest.fn()} />
    );

    expect(queryByTestId(dataTestIds.modifyOrAddTaskButton(isModify))).toBeInTheDocument();
  });
});
