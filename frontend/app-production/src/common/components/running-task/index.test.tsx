import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { LeafTasks, Subtasks } from '..';
import { mockSubtasks as mockSubtasksData } from '../../test-helpers';

import { dataTestIdsRunningTask as dataTestIds, RunningTask } from '.';

jest.mock('../leaf-tasks');
const mockLeakTasks = LeafTasks as jest.Mock;
mockLeakTasks.mockImplementation(() => {
  return <div>mock leaf tasks</div>;
});

jest.mock('../subtasks');
const mockSubtasks = Subtasks as jest.Mock;
const mockSubtasksDataTestId = 'mock-sub-tasks';
mockSubtasks.mockImplementation(() => {
  return <div data-testid={mockSubtasksDataTestId}>mock subtasks</div>;
});

const mockTask = mockSubtasksData[0];

interface RenderRunningTaskOptions {
  showSubTasks?: boolean;
  title?: string | JSX.Element;
  showDetailsLink?: boolean;
}

describe('RunningTask', () => {
  function renderRunningTask({
    showSubTasks = false,
    title = 'test',
    showDetailsLink = false,
  }: RenderRunningTaskOptions) {
    return render(
      <RunningTask task={mockTask} title={title} showSubTasks={showSubTasks} showDetailsLink={showDetailsLink} />,
      {
        wrapper: AppProductionTestWrapper,
      }
    );
  }

  it('does not show subtasks by default', () => {
    const { queryByTestId } = renderRunningTask({});

    expect(queryByTestId(mockSubtasksDataTestId)).not.toBeInTheDocument();
  });

  it('shows subtasks when prop "showSubTasks" is true', () => {
    const { queryByTestId } = renderRunningTask({ showSubTasks: true });

    expect(queryByTestId(mockSubtasksDataTestId)).toBeInTheDocument();
  });

  it('displays title by provided text string', () => {
    const mockTitle = 'test text title';
    const { queryByTestId } = renderRunningTask({ title: mockTitle });

    expect(queryByTestId(dataTestIds.title)).toHaveTextContent(mockTitle);
  });

  it('displays title by provided jsx element', () => {
    const mockTitleText = 'jsx-provided-title';
    const mockTitle = <p data-testid="jsx-provided-title">{mockTitleText}</p>;
    const { queryByTestId } = renderRunningTask({ title: mockTitle });

    expect(queryByTestId('jsx-provided-title')).toBeInTheDocument();
    expect(queryByTestId('jsx-provided-title')).toHaveTextContent(mockTitleText);
  });

  it('hides details link by default', () => {
    const { queryByTestId } = renderRunningTask({});

    expect(queryByTestId(dataTestIds.reactorsAndTasksLink)).not.toBeInTheDocument();
  });

  it('show details link', () => {
    const { queryByTestId } = renderRunningTask({ showDetailsLink: true });

    expect(queryByTestId(dataTestIds.reactorsAndTasksLink)).toBeInTheDocument();
  });
});
