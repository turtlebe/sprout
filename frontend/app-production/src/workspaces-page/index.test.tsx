import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route, Router } from 'react-router-dom';

import { WorkspacesPage } from '.';

import { WorkbinInstancesTable, WorkbinTasks, WorkcenterPlanProgress } from './components';

jest.mock('./components/workbin-instances-table');
const mockWorkbinInstancesTable = WorkbinInstancesTable as jest.Mock;
mockWorkbinInstancesTable.mockReturnValue(<div />);

jest.mock('./components/workcenter-plan-progress');
const mockWorkcenterPlanProgress = WorkcenterPlanProgress as jest.Mock;
mockWorkcenterPlanProgress.mockReturnValue(<div />);

jest.mock('./components/workbin-tasks');
const mockWorkbinTasks = WorkbinTasks as jest.Mock;
const mockTestId = 'mock-wokbin-task';
mockWorkbinTasks.mockImplementation(props => {
  function handleClick() {
    props.onTaskCompleted();
  }
  return (
    <button data-testid={mockTestId} onClick={handleClick}>
      Fake Button
    </button>
  );
});

describe('WorkspacesPage', () => {
  it('Completing a workbin task refreshes tasks list on workbin instance table', () => {
    const path = '/production/workspaces/Grower';
    const history = createMemoryHistory({ initialEntries: [path] });

    const { queryByTestId } = render(
      <Router history={history}>
        <Route path={'/production/workspaces/:name'} component={WorkspacesPage} />
      </Router>
    );

    queryByTestId(mockTestId).click();
    expect(mockWorkbinInstancesTable).toHaveBeenCalledWith(
      expect.objectContaining({
        refresh: 1,
      }),
      expect.anything()
    );

    //refresh should be updated
    queryByTestId(mockTestId).click();
    expect(mockWorkbinInstancesTable).toHaveBeenCalledWith(
      expect.objectContaining({
        refresh: 2,
      }),
      expect.anything()
    );
  });
});
