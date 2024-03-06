import { mockConsoleError } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { TaskStatus } from '../../../common/types';

import { dataTestIdsTaskIcon as dataTestIds, getTaskStatusMetaData, TaskIcon } from '.';

describe('TaskIcon', () => {
  function expectStatusColorToBe(status: TaskStatus, color: string, message: string) {
    const { queryByTestId } = render(<TaskIcon taskStatus={status} />);
    expect(queryByTestId(dataTestIds.timelineDot)).toHaveStyle(`backgroundColor: ${color}`);
    expect(getTaskStatusMetaData(status).message).toEqual(message);
  }

  it('shows CREATED status color and messsage', () => {
    expectStatusColorToBe(TaskStatus.CREATED, 'orange', 'Task has been created');
  });

  it('shows RUNNING status color and messsage', () => {
    expectStatusColorToBe(TaskStatus.RUNNING, 'green', 'Task is running');
  });

  it('shows COMPLETED status color and messsage', () => {
    expectStatusColorToBe(TaskStatus.COMPLETED, 'onavy', 'Task is completed');
  });

  it('shows FAILED status color and messsage', () => {
    expectStatusColorToBe(TaskStatus.FAILED, 'red', 'Task has failed');
  });

  it('shows undefined status color and empty message', () => {
    const consoleError = mockConsoleError();
    expectStatusColorToBe(undefined, 'grey', '');
    expect(consoleError).toHaveBeenCalled();
  });
});
