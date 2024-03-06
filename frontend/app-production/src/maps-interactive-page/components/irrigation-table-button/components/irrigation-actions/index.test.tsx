import { InternalIrrigationStatus, IrrigationStatus } from '@plentyag/app-production/src/maps-interactive-page/types';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { render } from '@testing-library/react';
import { DateTime, Settings } from 'luxon';
import React from 'react';

import { buildIrrigationTask } from '../../test-helpers/build-irrigation-task';
import { IrrigationTaskTableRowData } from '../../types';
import { DeleteTaskButton } from '../delete-task-button';
import { ModifyOrAddTaskButton } from '../modify-or-add-task-button';

import { dataTestIdsIrrigationActions as dataTestIds, IrrigationActions } from '.';

jest.mock('../delete-task-button');
const mockDeleteTaskButton = DeleteTaskButton as jest.Mock;
const mockDeleteTaskButtonDataTestId = 'mock-delete-task-button';
const mockDeleteTaskRefreshButtonDataTestId = 'mock-delete-task-refresh-button';
mockDeleteTaskButton.mockImplementation(({ onRefreshIrrigationTasks }) => {
  return (
    <div data-testid={mockDeleteTaskButtonDataTestId}>
      mock delete task button
      <button data-testid={mockDeleteTaskRefreshButtonDataTestId} onClick={onRefreshIrrigationTasks}>
        refresh irrigation tasks
      </button>
    </div>
  );
});

jest.mock('../modify-or-add-task-button');
const mockModifyOrAddTaskButton = ModifyOrAddTaskButton as jest.Mock;
const mockModifyOrAddTaskButtonDataTestId = 'mock-modify-or-add-task-button';
const mockModifyOrAddTaskRefreshButtonDataTestId = 'mock-modify-or-add-task-refresh-button';
mockModifyOrAddTaskButton.mockImplementation(({ onRefreshIrrigationTasks }) => {
  return (
    <div data-testid={mockModifyOrAddTaskButtonDataTestId}>
      mock modify or add task button
      <button data-testid={mockModifyOrAddTaskRefreshButtonDataTestId} onClick={onRefreshIrrigationTasks}>
        refresh irrigation tasks
      </button>
    </div>
  );
});

describe('IrrigationActions', () => {
  beforeEach(() => {
    mockCurrentUser({ permissions: { HYP_PRODUCTION: 'FULL' } });
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.useFakeTimers();
    const mockNow = new Date('2023-02-01T12:00:00.000Z'); // 4am pst
    jest.setSystemTime(mockNow);
    Settings.defaultZone = 'America/Los_Angeles';
  });

  afterAll(() => {
    jest.useRealTimers();
    Settings.defaultZone = 'system';
  });

  function renderIrrigationActions(rowData: IrrigationTaskTableRowData) {
    const mockOnRefreshIrrigationTasks = jest.fn();
    const result = render(
      <IrrigationActions rowData={rowData} onRefreshIrrigationTasks={mockOnRefreshIrrigationTasks} />
    );
    return {
      ...result,
      mockOnRefreshIrrigationTasks,
    };
  }

  it('shows no actions when user does not have "ADMIN" permssion', () => {
    mockCurrentUser({ permissions: { HYP_PRODUCTION: 'EDIT' } });

    const { queryByTestId } = renderIrrigationActions(buildIrrigationTask({}));

    expect(queryByTestId(dataTestIds.root)).toBeNull();
  });

  it('shows no actions for tasks that occurred in the past', () => {
    const pastTaskRowData = buildIrrigationTask({ irrigationDate: DateTime.now().minus({ days: 1 }).toJSDate() });
    const { queryByTestId } = renderIrrigationActions(pastTaskRowData);

    expect(queryByTestId(dataTestIds.root)).toBeNull();
  });

  it('shows no actions for "ongoing" task', () => {
    const ongoingTaskRowData = buildIrrigationTask({ status: IrrigationStatus.ONGOING });
    const { queryByTestId } = renderIrrigationActions(ongoingTaskRowData);

    expect(queryByTestId(dataTestIds.root)).toBeNull();
  });

  it('shows no actions for "success" task', () => {
    const successTaskRowData = buildIrrigationTask({ status: IrrigationStatus.SUCCESS });
    const { queryByTestId } = renderIrrigationActions(successTaskRowData);

    expect(queryByTestId(dataTestIds.root)).toBeNull();
  });

  it('renders modify and delete buttons for future "created" task', () => {
    const futureCreatedTaskRowData = buildIrrigationTask({
      irrigationDate: DateTime.now().plus({ days: 1 }).toJSDate(),
    });
    const { queryByTestId } = renderIrrigationActions(futureCreatedTaskRowData);

    expect(queryByTestId(mockModifyOrAddTaskButtonDataTestId)).toBeInTheDocument();
    expect(mockModifyOrAddTaskButton).toHaveBeenCalledWith(
      expect.objectContaining({
        rowData: futureCreatedTaskRowData,
        isModify: true,
      }),
      {}
    );

    expect(queryByTestId(mockDeleteTaskButtonDataTestId)).toBeInTheDocument();
    expect(mockDeleteTaskButton).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: futureCreatedTaskRowData.id,
      }),
      {}
    );
  });

  it('renders modify and delete buttons for "created" task that is happening today', () => {
    const taskHappeningTodayRowData = buildIrrigationTask({});
    const { queryByTestId } = renderIrrigationActions(taskHappeningTodayRowData);

    expect(queryByTestId(mockModifyOrAddTaskButtonDataTestId)).toBeInTheDocument();
    expect(mockModifyOrAddTaskButton).toHaveBeenCalledWith(
      expect.objectContaining({
        rowData: taskHappeningTodayRowData,
        isModify: true,
      }),
      {}
    );

    expect(queryByTestId(mockDeleteTaskButtonDataTestId)).toBeInTheDocument();
  });

  it('renders add button for "unscheduled" task', () => {
    const unscheduledTaskRowData = buildIrrigationTask({ status: InternalIrrigationStatus.UNSCHEDULED });
    const { queryByTestId } = renderIrrigationActions(unscheduledTaskRowData);

    expect(queryByTestId(mockModifyOrAddTaskButtonDataTestId)).toBeInTheDocument();
    expect(mockModifyOrAddTaskButton).toHaveBeenCalledWith(
      expect.objectContaining({
        rowData: unscheduledTaskRowData,
        isModify: false,
      }),
      {}
    );

    expect(queryByTestId(mockDeleteTaskButtonDataTestId)).not.toBeInTheDocument();
  });

  it('renders add button for "failure" task that happened today', () => {
    const failedTaskRowData = buildIrrigationTask({ status: IrrigationStatus.FAILURE });
    const { queryByTestId } = renderIrrigationActions(failedTaskRowData);

    expect(queryByTestId(mockModifyOrAddTaskButtonDataTestId)).toBeInTheDocument();
    expect(mockModifyOrAddTaskButton).toHaveBeenCalledWith(
      expect.objectContaining({
        rowData: failedTaskRowData,
        isModify: false,
      }),
      {}
    );

    expect(queryByTestId(mockDeleteTaskButtonDataTestId)).not.toBeInTheDocument();
  });

  it('renders add button for "cancelled" task that happened today', () => {
    const cancelledTaskRowData = buildIrrigationTask({ status: IrrigationStatus.CANCELLED });
    const { queryByTestId } = renderIrrigationActions(cancelledTaskRowData);

    expect(queryByTestId(mockModifyOrAddTaskButtonDataTestId)).toBeInTheDocument();
    expect(mockModifyOrAddTaskButton).toHaveBeenCalledWith(
      expect.objectContaining({
        rowData: cancelledTaskRowData,
        isModify: false,
      }),
      {}
    );

    expect(queryByTestId(mockDeleteTaskButtonDataTestId)).not.toBeInTheDocument();
  });

  it('invokes "onRefreshIrrigationsTasks" callback when task is successful', () => {
    const taskHappeningTodayRowData = buildIrrigationTask({});
    const { queryByTestId, mockOnRefreshIrrigationTasks } = renderIrrigationActions(taskHappeningTodayRowData);

    expect(mockOnRefreshIrrigationTasks).not.toHaveBeenCalled();

    queryByTestId(mockModifyOrAddTaskRefreshButtonDataTestId).click();
    expect(mockOnRefreshIrrigationTasks).toHaveBeenCalledTimes(1);

    queryByTestId(mockDeleteTaskRefreshButtonDataTestId).click();
    expect(mockOnRefreshIrrigationTasks).toHaveBeenCalledTimes(2);
  });
});
