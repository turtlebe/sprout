import { render } from '@testing-library/react';
import React from 'react';

import { mockUploadBulkCreateTasks } from '../../test-helpers/mock-workcenter-tasks';

import { ConfirmStep, dataTestIdsConfirmStep as dataTestIds } from '.';

describe('ConfirmStep', () => {
  let mockGoBack, mockOnConfirm;

  beforeEach(() => {
    mockGoBack = jest.fn();
    mockOnConfirm = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderConfirmStep() {
    return render(
      <ConfirmStep uploadBulkCreateTasks={mockUploadBulkCreateTasks} onGoBack={mockGoBack} onConfirm={mockOnConfirm} />
    );
  }

  it('renders and show the workcenter tasks to be created', () => {
    // ACT
    const { queryByTestId } = renderConfirmStep();

    // ASSERT
    // -- show component
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();

    // -- amount of rows
    expect(queryByTestId(dataTestIds.root).querySelectorAll('tbody > tr')).toHaveLength(6);

    // -- sample one row
    const rowEl = queryByTestId(dataTestIds.taskDetails('2042-07-21 00:00:00_Seed_SeedTraysAndLoadTableToGerm'));
    expect(rowEl.querySelectorAll('td')[0].textContent).toEqual('7/21/2042');
    expect(rowEl.querySelectorAll('td')[1].textContent).toEqual('Seed');
    expect(rowEl.querySelectorAll('td')[2].textContent).toEqual('SeedTraysAndLoadTableToGerm');
    expect(rowEl.querySelectorAll('td')[3].textContent).toEqual('2');
  });
});
