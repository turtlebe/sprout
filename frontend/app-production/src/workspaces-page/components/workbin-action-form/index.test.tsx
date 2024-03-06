import { WorkbinTaskDefinition, WorkbinTaskInstance } from '@plentyag/app-production/src/common/types';
import { CreateUpdateBaseForm } from '@plentyag/brand-ui/src/components';
import {
  errorSnackbar,
  mockGlobalSnackbar,
  successSnackbar,
} from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { mockWorkbinInstanceData, mockWorkbinTaskDefinitionData } from '../../test-helpers';

import { workbinActionFormTestIds as dataTestIds, FAIL_MESSAGE, SUCCESS_MESSAGE, WorkbinActionForm } from '.';

mockGlobalSnackbar();

const mockFormSubmit = 'mock-create-update-base-form-submit';
const mockFormSubmitFail = 'mock-create-update-base-form-submit-fail';
const mockFormStartSubmit = 'mock-create-update-base-form-start-submit';
jest.mock('@plentyag/brand-ui/src/components/create-update-base-form');
const mockCreateUpdateBaseForm = CreateUpdateBaseForm as jest.Mock;
mockCreateUpdateBaseForm.mockImplementation(({ onSuccess, onError, onIsSubmittingChange }) => {
  return (
    <div>
      <button data-testid={mockFormStartSubmit} onClick={() => onIsSubmittingChange(true)}>
        mock base form start submitting
      </button>
      <button data-testid={mockFormSubmit} onClick={onSuccess}>
        mock base form success
      </button>
      <button data-testid={mockFormSubmitFail} onClick={() => onError('ouch')}>
        mock base form failure
      </button>
    </div>
  );
});

function renderWorkbinActionForm({
  hasPermission = true,
  workbinTaskDefinition,
  workbinTaskInstance,
  onClose,
}: {
  hasPermission?: boolean;
  workbinTaskDefinition?: WorkbinTaskDefinition;
  workbinTaskInstance?: WorkbinTaskInstance;
  onClose?: WorkbinActionForm['onClose'];
} = {}) {
  mockCurrentUser({ permissions: { HYP_PRODUCTION: hasPermission ? 'EDIT' : 'READ_AND_LIST' } });
  return render(
    <WorkbinActionForm
      workbinTaskDefinition={workbinTaskDefinition}
      workbinTaskInstance={workbinTaskInstance}
      workbin="GROWER"
      onClose={onClose}
    />
  );
}

describe('WorkbinActionForm', () => {
  beforeEach(() => {
    mockCreateUpdateBaseForm.mockClear();
    successSnackbar.mockClear();
    errorSnackbar.mockClear();
  });

  it('displays no form when workbinTaskInstance and workbinTaskDefinition have not been provided', () => {
    const { queryByTestId } = renderWorkbinActionForm({ hasPermission: true });
    expect(queryByTestId(mockFormSubmit)).not.toBeInTheDocument();
  });

  it('displays form when workbinTaskInstance and workbinTaskDefinition has been provided', () => {
    const { queryByTestId } = renderWorkbinActionForm({
      hasPermission: true,
      workbinTaskDefinition: mockWorkbinTaskDefinitionData[0],
      workbinTaskInstance: mockWorkbinInstanceData[0].workbinTaskInstance,
    });
    expect(queryByTestId(mockFormSubmit)).toBeInTheDocument();
  });

  it('disables form submit button when user does not have proper permissions', () => {
    renderWorkbinActionForm({
      hasPermission: false,
      workbinTaskDefinition: mockWorkbinTaskDefinitionData[0],
      workbinTaskInstance: mockWorkbinInstanceData[0].workbinTaskInstance,
    });
    expect(mockCreateUpdateBaseForm).toHaveBeenLastCalledWith(
      expect.objectContaining({ isSubmitDisabled: true }),
      expect.anything()
    );
  });

  it('disables form after user has successfully submitted', () => {
    const { queryByTestId } = renderWorkbinActionForm({
      hasPermission: true,
      workbinTaskDefinition: mockWorkbinTaskDefinitionData[0],
      workbinTaskInstance: mockWorkbinInstanceData[0].workbinTaskInstance,
    });

    expect(mockCreateUpdateBaseForm).toHaveBeenLastCalledWith(
      expect.objectContaining({ isSubmitDisabled: false }),
      expect.anything()
    );

    const submitButton = queryByTestId(mockFormSubmit);
    submitButton.click();

    expect(mockCreateUpdateBaseForm).toHaveBeenLastCalledWith(
      expect.objectContaining({ isSubmitDisabled: true }),
      expect.anything()
    );
  });

  it('displays snackbar success when submit is successful', () => {
    const { queryByTestId } = renderWorkbinActionForm({
      hasPermission: true,
      workbinTaskDefinition: mockWorkbinTaskDefinitionData[0],
      workbinTaskInstance: mockWorkbinInstanceData[0].workbinTaskInstance,
    });

    expect(successSnackbar).not.toHaveBeenCalled();

    const submitButton = queryByTestId(mockFormSubmit);
    submitButton.click();

    expect(successSnackbar).toHaveBeenCalledWith(SUCCESS_MESSAGE);
    expect(errorSnackbar).not.toHaveBeenCalled();
  });

  it('displays snackbar error when submit fails', () => {
    const { queryByTestId } = renderWorkbinActionForm({
      hasPermission: true,
      workbinTaskDefinition: mockWorkbinTaskDefinitionData[0],
      workbinTaskInstance: mockWorkbinInstanceData[0].workbinTaskInstance,
    });

    const submitButton = queryByTestId(mockFormSubmitFail);
    submitButton.click();

    expect(successSnackbar).not.toHaveBeenCalled();
    expect(errorSnackbar).toHaveBeenCalledWith({ message: expect.stringContaining(FAIL_MESSAGE) });
  });

  it('prevents closing form when submit is in progress', () => {
    const mockOnClose = jest.fn();

    const { queryByTestId } = renderWorkbinActionForm({
      hasPermission: true,
      workbinTaskDefinition: mockWorkbinTaskDefinitionData[0],
      workbinTaskInstance: mockWorkbinInstanceData[0].workbinTaskInstance,
      onClose: mockOnClose,
    });

    const startSubmitButton = queryByTestId(mockFormStartSubmit);
    startSubmitButton.click();

    const drawerBackdrop = queryByTestId(dataTestIds.drawer).getElementsByClassName('MuiBackdrop-root');
    expect(drawerBackdrop).toHaveLength(1);
    fireEvent.click(drawerBackdrop[0]);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('allows closing form after submit is completed', () => {
    const mockOnClose = jest.fn();

    const { queryByTestId } = renderWorkbinActionForm({
      hasPermission: true,
      workbinTaskDefinition: mockWorkbinTaskDefinitionData[0],
      workbinTaskInstance: mockWorkbinInstanceData[0].workbinTaskInstance,
      onClose: mockOnClose,
    });

    const submitButton = queryByTestId(mockFormSubmit);
    submitButton.click();

    const drawerBackdrop = queryByTestId(dataTestIds.drawer).getElementsByClassName('MuiBackdrop-root');
    expect(drawerBackdrop).toHaveLength(1);
    fireEvent.click(drawerBackdrop[0]);

    expect(mockOnClose).toHaveBeenCalledWith(true);
  });
});
