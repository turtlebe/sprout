import { DateTimeFormat } from '@plentyag/core/src/utils';
import { act, render } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';

import { mockWorkbinInstanceData } from '../../test-helpers';
import { WorkbinActionForm } from '../workbin-action-form';

jest.mock('../workbin-action-form');
const mockWorkbinActionForm = WorkbinActionForm as jest.Mock;
const mockCloseFormWhenSubmitSuccessful = 'mock-close-submit-success-workbin-action-form';
const mockCloseFormWhenSubmitFailsSuccessful = 'mock-close-submit-fail-workbin-action-form';
mockWorkbinActionForm.mockImplementation(({ onClose }: { onClose: WorkbinActionForm['onClose'] }) => {
  return (
    <div>
      <button data-testid={mockCloseFormWhenSubmitSuccessful} onClick={() => onClose(true)}>
        mock close workbin action form
      </button>
      ;
      <button data-testid={mockCloseFormWhenSubmitFailsSuccessful} onClick={() => onClose(false)}>
        mock close workbin action form
      </button>
      ;
    </div>
  );
});

const mockTitle = 'Test Title';
const mockWorkbin = 'GROWER';
import { CardItemTasks, dataTestIdsCardItemsTasks as dataTestIds } from '.';

describe('CardItemsTasks', () => {
  afterEach(() => {
    mockWorkbinActionForm.mockClear();
  });

  it('shows tasks in "instance" createdAt descending order', () => {
    const tasks = mockWorkbinInstanceData;
    const { queryByTestId, queryAllByTestId } = render(
      <CardItemTasks cardTitle={mockTitle} tasks={tasks} workbin={mockWorkbin} />
    );
    const instances = queryAllByTestId(dataTestIds.taskInstance);
    expect(instances).toHaveLength(3);

    expect(instances[0].querySelector(`[data-testid="${dataTestIds.taskInstanceTitle}"]`).innerHTML).toContain(
      mockWorkbinInstanceData[2].workbinTaskDefinition.title
    ); // because of the sorting this is the 3rd item shown
    expect(instances[1].querySelector(`[data-testid="${dataTestIds.taskInstanceTitle}"]`).innerHTML).toContain(
      mockWorkbinInstanceData[0].workbinTaskDefinition.title
    ); // because of the sorting this is the 1st item shown
    expect(instances[2].querySelector(`[data-testid="${dataTestIds.taskInstanceTitle}"]`).innerHTML).toContain(
      mockWorkbinInstanceData[1].workbinTaskDefinition.title
    ); // because of the sorting this is the 2nd item shown
    expect(queryByTestId(dataTestIds.noData)).not.toBeInTheDocument();
  });

  it('can show tasks with dates given "showCreatedAt" prop', () => {
    const tasks = mockWorkbinInstanceData;
    const { queryByTestId, queryAllByTestId } = render(
      <CardItemTasks cardTitle={mockTitle} tasks={tasks} workbin={mockWorkbin} showCreatedAt />
    );
    const instances = queryAllByTestId(dataTestIds.taskInstance);
    expect(instances).toHaveLength(3);

    const title0 = mockWorkbinInstanceData[0].workbinTaskDefinition.title;
    const date0 = DateTime.fromISO(mockWorkbinInstanceData[0].workbinTaskInstance.createdAt).toFormat(
      DateTimeFormat.US_DEFAULT
    );
    const title1 = mockWorkbinInstanceData[1].workbinTaskDefinition.title;
    const date1 = DateTime.fromISO(mockWorkbinInstanceData[1].workbinTaskInstance.createdAt).toFormat(
      DateTimeFormat.US_DEFAULT
    );
    const title2 = mockWorkbinInstanceData[2].workbinTaskDefinition.title;
    const date2 = DateTime.fromISO(mockWorkbinInstanceData[2].workbinTaskInstance.createdAt).toFormat(
      DateTimeFormat.US_DEFAULT
    );

    expect(instances[0].innerHTML).toContain(title2); // because of the sorting this is the 3rd item shown
    expect(instances[0].innerHTML).toContain(date2);
    expect(instances[1].innerHTML).toContain(title0); // because of the sorting this is the 1st item shown
    expect(instances[1].innerHTML).toContain(date0);
    expect(instances[2].innerHTML).toContain(title1); // because of the sorting this is the 2nd item shown
    expect(instances[2].innerHTML).toContain(date1);

    expect(queryByTestId(dataTestIds.noData)).not.toBeInTheDocument();
  });

  it('displays "None" when there are no task', () => {
    const { queryByTestId, queryAllByTestId } = render(
      <CardItemTasks cardTitle={mockTitle} tasks={[]} workbin={mockWorkbin} />
    );
    expect(queryAllByTestId(dataTestIds.taskInstance)).toHaveLength(0);
    expect(queryByTestId(dataTestIds.noData)).toBeInTheDocument();
  });

  it('selecting an task that contains defn and instance opens the WorkbinActionForm', () => {
    const tasks = mockWorkbinInstanceData.map(data => ({
      workbinTaskDefinition: data.workbinTaskDefinition,
      workbinTaskInstance: data.workbinTaskInstance,
    }));
    const { queryAllByTestId } = render(<CardItemTasks cardTitle={mockTitle} tasks={tasks} workbin={mockWorkbin} />);

    const instances = queryAllByTestId(dataTestIds.taskInstance);
    expect(instances).toHaveLength(3);

    act(() => instances[0].click());

    expect(mockWorkbinActionForm).toHaveBeenCalledWith(
      expect.objectContaining({
        workbinTaskDefinition: mockWorkbinInstanceData[2].workbinTaskDefinition, // because of the sorting this is the 3rd item shown
        workbinTaskInstance: mockWorkbinInstanceData[2].workbinTaskInstance, // because of the sorting this is the 3rd item shown
        workbin: mockWorkbin,
      }),
      expect.anything()
    );
  });

  it('selecting an task that contains only a defn (no instance) opens the WorkbinActionForm', () => {
    const tasks = mockWorkbinInstanceData.map(data => ({
      workbinTaskDefinition: data.workbinTaskDefinition,
    }));
    const { queryAllByTestId } = render(<CardItemTasks cardTitle={mockTitle} tasks={tasks} workbin={mockWorkbin} />);

    const instances = queryAllByTestId(dataTestIds.taskInstance);
    expect(instances).toHaveLength(3);

    act(() => instances[1].click());

    expect(mockWorkbinActionForm).toHaveBeenCalledWith(
      expect.objectContaining({
        workbinTaskDefinition: mockWorkbinInstanceData[1].workbinTaskDefinition,
        workbinTaskInstance: undefined,
        workbin: mockWorkbin,
      }),
      expect.anything()
    );
  });

  it('closing the WorkbinActionForm when task did not complete successfully, does not invoke callback: OnTaskCompleted', () => {
    const tasks = mockWorkbinInstanceData.map(data => ({
      workbinTaskDefinition: data.workbinTaskDefinition,
      workbinTaskInstance: data.workbinTaskInstance,
    }));
    const mockOnTaskCompleted = jest.fn();
    const { queryByTestId } = render(
      <CardItemTasks cardTitle={mockTitle} tasks={tasks} workbin={mockWorkbin} onTaskCompleted={mockOnTaskCompleted} />
    );

    queryByTestId(mockCloseFormWhenSubmitFailsSuccessful).click();

    expect(mockOnTaskCompleted).not.toHaveBeenCalled();
  });

  it('closing the WorkbinActionForm when the task completed successfully, invokes callback: OnTaskCompleted', () => {
    const tasks = mockWorkbinInstanceData.map(data => ({
      workbinTaskDefinition: data.workbinTaskDefinition,
      workbinTaskInstance: data.workbinTaskInstance,
    }));
    const mockOnTaskCompleted = jest.fn();
    const { queryByTestId } = render(
      <CardItemTasks cardTitle={mockTitle} tasks={tasks} workbin={mockWorkbin} onTaskCompleted={mockOnTaskCompleted} />
    );

    queryByTestId(mockCloseFormWhenSubmitSuccessful).click();

    expect(mockOnTaskCompleted).toHaveBeenCalled();
  });
});
