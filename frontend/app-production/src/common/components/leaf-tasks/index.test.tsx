import { AppProductionTestWrapper, mockBasePath } from '@plentyag/app-production/src/common/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { render } from '@testing-library/react';
import { Duration } from 'luxon';

import { dataTestIdsAccordionTaskList } from '..';
import { WorkbinInstance } from '../../../common/types';
import { mockLeafTasks, toggleAccordion } from '../../test-helpers';
import { taskDuration, taskRunningTime } from '../../utils';

import { dataTestIdsLeafTasks as dataTestIds, LeafTasks, TASK_TIMEOUT_WARNING_MINUTES } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-run-action-periodically-when-visible');

jest.mock('../../utils/task-running-time');
const mockTaskRunningTime = taskRunningTime as jest.Mock;
const mockRunningTime = '00:00:05';
mockTaskRunningTime.mockReturnValue(mockRunningTime);

jest.mock('../../utils/task-duration');
const mockTaskDuration = taskDuration as jest.Mock;
const mockDuration = Duration.fromObject({ minutes: 5 });

const mockTaskId = 'e4fd222c-1ff9-45d9-8d3a-f12f84d02580';

const mockWorkspacesBasePath = `${mockBasePath}/workspaces`;
const mockReactorsAndTasksBasePath = `${mockBasePath}/reactors-and-tasks/detail`;

describe('LeafTasks', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockReturnValue({
      data: mockLeafTasks,
      isValidating: false,
      revalidate: () => {},
    });

    mockTaskDuration.mockReturnValue(mockDuration);
  });

  function renderLeafTasks() {
    return render(<LeafTasks taskId={mockTaskId} />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('renders list of tasks', () => {
    const { queryByTestId, queryAllByTestId } = renderLeafTasks();

    toggleAccordion(queryByTestId(dataTestIdsAccordionTaskList.root));

    const listItems = queryAllByTestId(dataTestIds.taskListItem);
    expect(listItems).toHaveLength(3);

    listItems.forEach((listItem, index) => {
      expect(listItem.children[0]).toHaveTextContent(mockLeafTasks[index].taskInstance.displayTitle);
      expect(listItem.children[1]).toHaveTextContent(`running time: ${mockRunningTime}`);
      expect(listItem.children[2]).toHaveTextContent(`status: ${mockLeafTasks[index].taskStatus}`);
    });
  });

  it('shows hyperlink on task items', () => {
    const { queryByTestId, queryAllByTestId } = renderLeafTasks();

    toggleAccordion(queryByTestId(dataTestIdsAccordionTaskList.root));

    const listItems = queryAllByTestId(dataTestIds.taskListItem);
    expect(listItems).toHaveLength(3);

    // first and second items in mockLeafTask should have hyperlink to reactorsAndTasks page with taskId in query parameter.
    expect(listItems[0].getElementsByTagName('a')[0].href).toEqual(
      expect.stringContaining(
        `${mockReactorsAndTasksBasePath}/${mockLeafTasks[0].executingReactorPath}?taskId=${mockLeafTasks[0].taskInstance.id}`
      )
    );
    expect(listItems[1].getElementsByTagName('a')[0].href).toEqual(
      expect.stringContaining(
        `${mockReactorsAndTasksBasePath}/${mockLeafTasks[1].executingReactorPath}?taskId=${mockLeafTasks[1].taskInstance.id}`
      )
    );

    // third item in mockLeafTasks should be a workbin item with hyperlink to workspace page.
    const workbinItem = listItems[2];
    const linkTags = workbinItem.getElementsByTagName('a');
    expect(linkTags).toHaveLength(1);
    const workbin = (mockLeafTasks[2].taskInstance as WorkbinInstance).taskDetails.workbin;
    expect(linkTags[0].href).toEqual(expect.stringContaining(`${mockWorkspacesBasePath}/${workbin}`));
  });

  it('shows icon when task item was created after warning timeout', () => {
    const mockDuration6Mins = Duration.fromObject({ minutes: TASK_TIMEOUT_WARNING_MINUTES + 1 });
    mockTaskDuration.mockReturnValue(mockDuration6Mins);

    const { queryByTestId } = renderLeafTasks();

    expect(queryByTestId(dataTestIds.longRunningTaskIcon)).toBeInTheDocument();
  });

  it('shows no icon when task item was created before timeout', () => {
    const mockDurationFourMins = Duration.fromObject({ minutes: TASK_TIMEOUT_WARNING_MINUTES - 1 });
    mockTaskDuration.mockReturnValue(mockDurationFourMins);

    const { queryByTestId } = renderLeafTasks();

    expect(queryByTestId(dataTestIds.longRunningTaskIcon)).not.toBeInTheDocument();
  });

  it('shows icon when task list has workbin item', () => {
    const { queryByTestId } = renderLeafTasks();

    expect(queryByTestId(dataTestIds.workbinTaskIcon)).toBeInTheDocument();
  });

  it('shows no icon when task list has no workbin item', () => {
    mockUseSwrAxios.mockReturnValue({
      data: [mockLeafTasks[0], mockLeafTasks[1]],
      isValidating: false,
      revalidate: () => {},
    });

    const { queryByTestId } = renderLeafTasks();

    expect(queryByTestId(dataTestIds.workbinTaskIcon)).not.toBeInTheDocument();
  });
});
