import { render } from '@testing-library/react';
import React from 'react';

import { mockLeafTasks, toggleAccordion } from '../../test-helpers';

import { AccordionTaskList, dataTestIdsAccordionTaskList as dataTestIds, EMPTY_LIST_MESSAGE, LOADING_MESSAGE } from '.';

const mockTaskListItemDataTestId = 'task-list-item';
const mockRenderTaskListItem: AccordionTaskList['renderTaskListItem'] = task => {
  return <div data-testid={mockTaskListItemDataTestId}>{task.taskInstance.displayTitle}</div>;
};

describe('AccordionTaskList', () => {
  function renderAccordionTaskList(isLoading: boolean, mockTasks = mockLeafTasks) {
    const mockOnAccordionChange = jest.fn();
    const result = render(
      <AccordionTaskList
        isLoading={isLoading}
        title={'mockTitle'}
        onAccordionChange={mockOnAccordionChange}
        tasks={mockTasks}
        taskIcon={null}
        renderTaskListItem={mockRenderTaskListItem}
      />
    );
    return { ...result, mockOnAccordionChange };
  }

  it('invokes callback "onAccordionChange" when accordion is expanded/collapsed', () => {
    const { queryByTestId, mockOnAccordionChange } = renderAccordionTaskList(false);

    toggleAccordion(queryByTestId(dataTestIds.root));

    expect(mockOnAccordionChange).toHaveBeenCalled();

    expect(queryByTestId(dataTestIds.progress)).not.toBeInTheDocument();
  });

  it('renders a list of tasks', () => {
    const { queryByTestId, queryAllByTestId } = renderAccordionTaskList(false);

    expect(queryAllByTestId(mockTaskListItemDataTestId)).toHaveLength(0);

    toggleAccordion(queryByTestId(dataTestIds.root));

    const listItems = queryAllByTestId(mockTaskListItemDataTestId);
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveTextContent(mockLeafTasks[0].taskInstance.displayTitle);
    expect(listItems[1]).toHaveTextContent(mockLeafTasks[1].taskInstance.displayTitle);
    expect(listItems[2]).toHaveTextContent(mockLeafTasks[2].taskInstance.displayTitle);

    expect(queryByTestId(dataTestIds.emptyListMessage)).not.toBeInTheDocument();
  });

  it('renders message when list of tasks is empty', () => {
    const { queryByTestId } = renderAccordionTaskList(false, []);

    toggleAccordion(queryByTestId(dataTestIds.root));

    expect(queryByTestId(dataTestIds.emptyListMessage)).toHaveTextContent(EMPTY_LIST_MESSAGE);
  });

  it('displays progress when "isLoading" is true and displays loading message', () => {
    const { queryByTestId } = renderAccordionTaskList(true, []);

    toggleAccordion(queryByTestId(dataTestIds.root));

    expect(queryByTestId(dataTestIds.progress)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.emptyListMessage)).toHaveTextContent(LOADING_MESSAGE);
  });

  it('is not expanded by default', () => {
    const { queryByTestId } = render(
      <AccordionTaskList
        isLoading={false}
        title={'mockTitle'}
        tasks={mockLeafTasks}
        taskIcon={null}
        renderTaskListItem={mockRenderTaskListItem}
      />
    );

    expect(queryByTestId(dataTestIds.list)).not.toBeInTheDocument();
  });

  it('is expanded by default', () => {
    const { queryByTestId } = render(
      <AccordionTaskList
        isLoading={false}
        isTaskListDefaultExpanded
        title={'mockTitle'}
        tasks={mockLeafTasks}
        taskIcon={null}
        renderTaskListItem={mockRenderTaskListItem}
      />
    );

    expect(queryByTestId(dataTestIds.list)).toBeInTheDocument();
  });
});
