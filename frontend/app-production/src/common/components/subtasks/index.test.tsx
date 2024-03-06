import { AppProductionTestWrapper, mockBasePath } from '@plentyag/app-production/src/common/test-helpers';
import { usePageVisibility, usePostRequest } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsAccordionTaskList } from '..';
import { WORKCENTER_REFRESH_PERIOD } from '../../../constants';
import { mockSubtasks, toggleAccordion } from '../../test-helpers';

import { dataTestIdsSubtasks as dataTestIds, Subtasks } from '.';

jest.mock('@plentyag/core/src/hooks/use-page-visibility');
const mockUsePageVisibility = usePageVisibility as jest.Mock;
mockUsePageVisibility.mockReturnValue('visible');

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUsePostRequest = usePostRequest as jest.Mock;
const mockMakeRequest = jest.fn().mockImplementation(({ onSuccess }) => {
  onSuccess(mockSubtasks);
});
mockUsePostRequest.mockReturnValue({
  isLoading: false,
  makeRequest: mockMakeRequest,
});

const mockSubTaskIds = mockSubtasks.map(subtask => subtask.taskInstance.id);
const mockReactorsAndTasksBasePath = `${mockBasePath}/reactors-and-tasks/detail`;

describe('Subtasks', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    mockMakeRequest.mockClear();
    jest.useRealTimers();
  });

  function renderSubtasks({
    subTaskIds = mockSubTaskIds,
    isTaskListDefaultExpanded = false,
  }: { subTaskIds?: string[]; isTaskListDefaultExpanded?: boolean } = {}) {
    return render(<Subtasks isTaskListDefaultExpanded={isTaskListDefaultExpanded} subTaskIds={subTaskIds} />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  function expectToRenderListOfSubtasks(listOfSubtaskElements: HTMLElement[]) {
    expect(listOfSubtaskElements).toHaveLength(2);

    listOfSubtaskElements.forEach((listItem, index) => {
      expect(listItem.children[0]).toHaveTextContent(mockSubtasks[index].taskInstance.displayTitle);
      const linkTags = listItem.children[0].getElementsByTagName('a');
      expect(linkTags).toHaveLength(1);
      expect(linkTags[0].href).toEqual(
        expect.stringContaining(
          `${mockReactorsAndTasksBasePath}/${mockSubtasks[index].executingReactorPath}?taskId=${mockSubtasks[index].taskInstance.id}`
        )
      );
      expect(listItem.children[1]).toHaveTextContent(mockSubtasks[index].taskStatus);
      expect(listItem.children[2]).toHaveTextContent(mockSubtasks[index].summary[0].description);
    });

    expect(mockMakeRequest).toHaveBeenCalled();
  }

  it('renders task details for given subTaskIds', () => {
    const { queryAllByTestId, queryByTestId } = renderSubtasks();

    toggleAccordion(queryByTestId(dataTestIdsAccordionTaskList.root));

    expectToRenderListOfSubtasks(queryAllByTestId(dataTestIds.taskListItem));
  });

  it('renders tasks when is expanded by default', () => {
    const { queryAllByTestId } = renderSubtasks({ isTaskListDefaultExpanded: true });

    expectToRenderListOfSubtasks(queryAllByTestId(dataTestIds.taskListItem));
  });

  it('does not load or display list when accordion is not expanded', () => {
    const { queryAllByTestId } = renderSubtasks();

    const listItems = queryAllByTestId(dataTestIds.taskListItem);
    expect(listItems).toHaveLength(0);

    expect(mockMakeRequest).not.toHaveBeenCalled();
  });

  it('does not try to load if given empty list of task ids', () => {
    const { queryByTestId } = renderSubtasks({ subTaskIds: [] });

    toggleAccordion(queryByTestId(dataTestIdsAccordionTaskList.root));

    expect(mockMakeRequest).not.toHaveBeenCalled();
  });

  it('does not make request to get task id data if given the same list (deep compare) of task ids', () => {
    const { queryByTestId, rerender } = renderSubtasks();

    toggleAccordion(queryByTestId(dataTestIdsAccordionTaskList.root));

    expect(mockMakeRequest).toHaveBeenCalled();
    mockMakeRequest.mockClear();

    // pass same list of mock task ids as initial render
    rerender(<Subtasks subTaskIds={mockSubTaskIds} />);

    expect(mockMakeRequest).not.toHaveBeenCalled();
  });

  it('makes new request to get task id data when new set of taskIds is given', () => {
    const { queryByTestId, rerender } = renderSubtasks();

    toggleAccordion(queryByTestId(dataTestIdsAccordionTaskList.root));

    expect(mockMakeRequest).toHaveBeenCalled();
    mockMakeRequest.mockClear();

    // pass different list of mock task ids: only single item
    rerender(<Subtasks subTaskIds={[mockSubTaskIds[0]]} />);

    expect(mockMakeRequest).toHaveBeenCalled();
  });

  it('periodically refreshes the task data', () => {
    const { queryByTestId } = renderSubtasks();

    toggleAccordion(queryByTestId(dataTestIdsAccordionTaskList.root));

    // initial call after expanding
    expect(mockMakeRequest).toHaveBeenCalled();
    mockMakeRequest.mockClear();

    // advance to time right before next refresh period and should not make request
    jest.advanceTimersByTime(WORKCENTER_REFRESH_PERIOD - 1);
    expect(mockMakeRequest).not.toHaveBeenCalled();

    // now advance time pass period and should make request
    jest.advanceTimersByTime(10);
    expect(mockMakeRequest).toHaveBeenCalled();
  });

  it('does not periodically reload if list is not expanded', () => {
    const { queryByTestId } = renderSubtasks();

    // expand
    toggleAccordion(queryByTestId(dataTestIdsAccordionTaskList.root));

    // initial call after expand
    expect(mockMakeRequest).toHaveBeenCalled();
    mockMakeRequest.mockClear();

    // collapse
    toggleAccordion(queryByTestId(dataTestIdsAccordionTaskList.root));

    // should not make call when timer advances past next period
    jest.advanceTimersByTime(WORKCENTER_REFRESH_PERIOD + 1);
    expect(mockMakeRequest).not.toHaveBeenCalled();
  });
});
