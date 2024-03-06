import { AppProductionTestWrapper, mockBasePath } from '@plentyag/app-production/src/common/test-helpers';
import { actAndAwaitRender } from '@plentyag/core/src/test-helpers';
import { waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route } from 'react-router-dom';

import { dataTestIdsReactorsAndTasks as dataTestIds, ReactorsAndTasksDetailPage, TASK_ID_QUERY_PARAMETER } from '.';

import { ReactorState, TaskProgress, TaskState } from './components';
import { useGetReactorPaths } from './hooks';

const mockReactorPaths = ['sites/SSF2/areas/VerticalGrow', 'sites/SSF2/areas/Germination'];
jest.mock('./hooks/use-get-reactor-paths');
const mockUseGetReactorPaths = useGetReactorPaths as jest.Mock;
mockUseGetReactorPaths.mockReturnValue({ isLoading: false, reactorPaths: mockReactorPaths });

jest.mock('./components/reactor-state');
const mockReactorState = ReactorState as jest.Mock;
const mockReactorStateDataTestId = 'mock-reactor-state-view';
mockReactorState.mockReturnValue(<div data-testid={mockReactorStateDataTestId} />);

jest.mock('./components/task-state');
const mockTaskState = TaskState as jest.Mock;
const mockTaskStateDataTestId = 'mock-task-state-view';
mockTaskState.mockReturnValue(<div data-testid={mockTaskStateDataTestId} />);

jest.mock('./components/task-progress');
const mockTaskProgress = TaskProgress as jest.Mock;
const mockTaskProgressDataTestId = 'mock-task-progress';
mockTaskProgress.mockReturnValue(<div data-testid={mockTaskProgressDataTestId} />);

const reactorsAndTaskBasePath = `${mockBasePath}/reactors-and-tasks/detail`;

const mockTaskId = 'e1dfce81-8d4d-4f10-b75c-42738f1e744e';

describe('ReactorsAndTasksDetailPage', () => {
  afterEach(() => {
    mockReactorState.mockClear();
  });

  async function renderReactorsAndTasksDetailPage(initialReactorPath: string, initialSearch = '') {
    const viewPath = `${reactorsAndTaskBasePath}/${initialReactorPath}${initialSearch}`;
    const history = createMemoryHistory({ initialEntries: [viewPath] });
    const result = await actAndAwaitRender(
      <AppProductionTestWrapper history={history}>
        <Route
          path={`${reactorsAndTaskBasePath}/:reactorPath*`}
          render={renderProps => <ReactorsAndTasksDetailPage {...renderProps} />}
        />
      </AppProductionTestWrapper>
    );
    return { history, ...result };
  }

  it('sets selection from url path parameter', async () => {
    const urlReactorPath = mockReactorPaths[0];
    const { queryByTestId } = await renderReactorsAndTasksDetailPage(urlReactorPath);

    expect(queryByTestId(dataTestIds.autocomplete).querySelector('.MuiInputBase-input')).toHaveValue(urlReactorPath);
  });

  it('sets selection to null if loaded reactorPaths does not include selectedReactorPath', async () => {
    const reactPathNotInSSF2 = 'sites/LAX1';
    const { queryByTestId } = await renderReactorsAndTasksDetailPage(reactPathNotInSSF2);

    await waitFor(() =>
      expect(queryByTestId(dataTestIds.autocomplete).querySelector('.MuiInputBase-input')).toHaveValue('')
    );
  });

  async function expectReactorPathChange(history, queryByTestId, queryByRole) {
    // get list of reactor paths from autocomplete.
    const openButton = queryByTestId(dataTestIds.autocomplete).querySelector('[title="Open"]button');
    openButton.click();

    // now change the reactor path, from the 1st (initial) to the 2nd item in the list.
    const options = queryByRole('presentation').querySelectorAll('[role="option"]li');
    expect(options).toHaveLength(2);
    options[1].click();

    await waitFor(() => {
      expect(queryByTestId(dataTestIds.autocomplete).querySelector('.MuiInputBase-input')).toHaveValue(
        mockReactorPaths[1]
      );
    });

    expect(history.location.pathname).toBe(`${reactorsAndTaskBasePath}/${mockReactorPaths[1]}`);
  }

  it('updates url path after user selects a path', async () => {
    const urlReactorPath = mockReactorPaths[0];

    const { history, queryByTestId, queryByRole } = await renderReactorsAndTasksDetailPage(urlReactorPath);

    await expectReactorPathChange(history, queryByTestId, queryByRole);
  });

  it('removes the query parameter "taskId" and defaults to tab "reactor-state" when the user changes the selected reactor path', async () => {
    const urlReactorPath = mockReactorPaths[0];

    const taskId = 'abc';

    const { history, queryByTestId, queryByRole } = await renderReactorsAndTasksDetailPage(
      urlReactorPath,
      `?${TASK_ID_QUERY_PARAMETER}=${taskId}`
    );

    // has initial taskId.
    expect(history.location.search).toBe(`?${TASK_ID_QUERY_PARAMETER}=${taskId}&tab=task-progress`);

    await expectReactorPathChange(history, queryByTestId, queryByRole);

    // no taskId in search as it was removed, defaults to 'reactor-state' tab
    expect(history.location.search).toBe('?tab=reactor-state');
  });

  it('updates selection if url path changes', async () => {
    const urlReactorPath = mockReactorPaths[0];
    const { history, queryByTestId } = await renderReactorsAndTasksDetailPage(urlReactorPath);

    expect(queryByTestId(dataTestIds.autocomplete).querySelector('.MuiInputBase-input')).toHaveValue(urlReactorPath);

    // change url path
    history.push(`${reactorsAndTaskBasePath}/${mockReactorPaths[1]}`);

    await waitFor(() => {
      expect(queryByTestId(dataTestIds.autocomplete).querySelector('.MuiInputBase-input')).toHaveValue(
        mockReactorPaths[1]
      );
    });
  });

  it('renders ReactState component with currently selected reactor path', async () => {
    const urlReactorPath = mockReactorPaths[0];
    await renderReactorsAndTasksDetailPage(urlReactorPath);
    expect(mockReactorState).toHaveBeenCalledWith(
      {
        reactorPath: urlReactorPath,
      },
      expect.anything()
    );
  });

  it('shows "Task State Details" and "Task Progress" tabs when taskId is provided in query parameters', async () => {
    const urlReactorPath = mockReactorPaths[0];
    const { queryByTestId } = await renderReactorsAndTasksDetailPage(urlReactorPath, `?taskId=${mockTaskId}`);

    expect(queryByTestId(dataTestIds.taskStateTab)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.taskProgressTab)).toBeInTheDocument();
  });

  it('does not show "Task State Details" or "Task Progress" tabs when taskId is not provided', async () => {
    const urlReactorPath = mockReactorPaths[0];
    const { queryByTestId } = await renderReactorsAndTasksDetailPage(urlReactorPath);

    expect(queryByTestId(dataTestIds.taskStateTab)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.taskProgressTab)).not.toBeInTheDocument();
  });

  it('defaults to "Reactor State" when no taskId is provided and "tab" query parameter is set to "task-progress" (which requires a taskId)', async () => {
    const urlReactorPath = mockReactorPaths[0];
    const { queryByTestId } = await renderReactorsAndTasksDetailPage(urlReactorPath, '?tab=task-progress');

    expect(queryByTestId(mockTaskProgressDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(mockReactorStateDataTestId)).toBeInTheDocument();
    expect(queryByTestId(mockTaskStateDataTestId)).not.toBeInTheDocument();
  });

  it('shows tab views when clicked', async () => {
    const urlReactorPath = mockReactorPaths[0];
    const { queryByTestId } = await renderReactorsAndTasksDetailPage(urlReactorPath, `?taskId=${mockTaskId}`);

    // by default should show task progress tab when task id is provided.
    expect(queryByTestId(mockTaskProgressDataTestId)).toBeInTheDocument();
    expect(queryByTestId(mockReactorStateDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(mockTaskStateDataTestId)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.taskStateTab).click();
    expect(queryByTestId(mockTaskProgressDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(mockReactorStateDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(mockTaskStateDataTestId)).toBeInTheDocument();

    queryByTestId(dataTestIds.reactorStateTab).click();
    expect(queryByTestId(mockTaskProgressDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(mockReactorStateDataTestId)).toBeInTheDocument();
    expect(queryByTestId(mockTaskStateDataTestId)).not.toBeInTheDocument();
  });

  it('shows "Reactor State" as default tab when taskId is not provided', async () => {
    const urlReactorPath = mockReactorPaths[0];
    const { queryByTestId } = await renderReactorsAndTasksDetailPage(urlReactorPath);

    expect(queryByTestId(mockReactorStateDataTestId)).toBeInTheDocument();
  });
});
