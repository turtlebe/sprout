import { BaseForm } from '@plentyag/brand-ui/src/components';
import { axiosRequest } from '@plentyag/core/src/utils';
import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { useGenerateFormGenConfigForBulkAction } from '../../hooks/use-generate-form-gen-config-for-bulk-action';
import { ActionStatus, Container, SerialStatus } from '../../types';

import { dataTestIdsDialogPerformAction as dataTestIds, DialogPerformAction } from '.';

jest.mock('../../hooks/use-generate-form-gen-config-for-bulk-action');
const mockUseGenerateFormGenConfigForBulkAction = useGenerateFormGenConfigForBulkAction as jest.Mock;
const mockSerials = ['P900-0008480B:SZSY-EVI3-6R', 'P900-0008046A:LK65-LM28-5Y'];
const mockContainers: Container[] = [
  { isSelected: true, serial: mockSerials[0], serialStatus: SerialStatus.valid, resourceState: undefined },
  { isSelected: true, serial: mockSerials[1], serialStatus: SerialStatus.valid, resourceState: undefined },
];
const mockAddLabelOperation: ProdActions.Operation = {
  path: 'sites/SSF2/interfaces/Traceability/methods/AddLabelGeneral',
  prefilledArgs: {
    id: {
      isDisabled: true,
      value: mockSerials,
    },
  },
  bulkFieldName: 'id',
};
const mockFormGenInputForAddLabel = {
  id: {
    value: mockSerials.join(','),
  },
  label: {
    value: 'Automatic Duplicate Barcode Detection',
  },
};
const mockFormGenConfig = {
  serialize: () => {
    return mockFormGenInputForAddLabel;
  },
  createEndPoint: 'mock-executive-service-action-url',
  title: 'Add Label',
};
mockUseGenerateFormGenConfigForBulkAction.mockReturnValue(mockFormGenConfig);

jest.mock('@plentyag/brand-ui/src/components/base-form');
const mockBaseForm = BaseForm as jest.Mock;
const mockSubmit = 'mock-submit';
mockBaseForm.mockImplementation(({ onSubmit }) => {
  return (
    <button data-testid={mockSubmit} onClick={() => onSubmit(mockFormGenInputForAddLabel)}>
      mock base form
    </button>
  );
});

jest.mock('@plentyag/core/src/utils/request');
const mockAxiosRequest = axiosRequest as jest.Mock;

describe('DialogPerformAction', () => {
  function renderDialogPerformAction() {
    const mockOnClose = jest.fn();
    const mockOnActionComplete = jest.fn();
    const renderResult = render(
      <DialogPerformAction
        operation={mockAddLabelOperation}
        containers={mockContainers}
        onClose={mockOnClose}
        onActionComplete={mockOnActionComplete}
      />
    );

    return { ...renderResult, mockOnClose, mockOnActionComplete };
  }

  it('closes dialog when close button clicked', () => {
    const { queryByTestId, mockOnClose } = renderDialogPerformAction();

    expect(mockOnClose).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.close).click();

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('executes action once for each container', async () => {
    mockAxiosRequest.mockResolvedValueOnce({ data: {} }).mockRejectedValueOnce('ouch');

    const { queryByTestId, mockOnActionComplete } = renderDialogPerformAction();

    queryByTestId(mockSubmit).click();

    await waitFor(() =>
      expect(mockOnActionComplete).toHaveBeenCalledWith([
        { ...mockContainers[0], status: ActionStatus.success },
        { ...mockContainers[1], status: ActionStatus.fail, message: 'ouch' },
      ])
    );
  });

  it('provides progress updates during submit', async () => {
    mockAxiosRequest.mockResolvedValue({ data: {} });

    const { queryByTestId, mockOnActionComplete } = renderDialogPerformAction();

    expect(mockBaseForm).toHaveBeenLastCalledWith(
      expect.objectContaining({
        loadingProgress: 0,
      }),
      expect.anything()
    );

    mockBaseForm.mockClear();
    queryByTestId(mockSubmit).click();

    await waitFor(() =>
      expect(mockOnActionComplete).toHaveBeenCalledWith([
        { ...mockContainers[0], status: ActionStatus.success },
        { ...mockContainers[1], status: ActionStatus.success },
      ])
    );

    expect(mockBaseForm).toHaveBeenCalledTimes(5);
    // note: last index is where it gets reset after submit is completed.
    const expectedLoadingProgress = [0, 50, 100, 100, 0];
    expectedLoadingProgress.forEach((expectedValue, index) =>
      expect(mockBaseForm).toHaveBeenNthCalledWith(
        index + 1,
        expect.objectContaining({
          loadingProgress: expectedValue,
        }),
        expect.anything()
      )
    );
  });
});
