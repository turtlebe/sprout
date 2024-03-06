import { dataTestIdsDialogConfirmation, DialogEdit } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { dataTestIdsEditButton, EditButton } from '.';

jest.mock('@plentyag/brand-ui/src/components/dialog-edit');
const mockDialogEdit = DialogEdit as jest.Mock;

mockDialogEdit.mockImplementation(({ onClose, onSuccess, open }) => {
  if (!open) {
    return null;
  }
  return (
    <div data-testid="fake-dialog">
      <button data-testid="fake-success" onClick={() => onSuccess({ name: 'B11' })}>
        fake success
      </button>
      <button data-testid="fake-close" onClick={() => onClose()}>
        fake close
      </button>
    </div>
  );
});

const mockFormGenConfig = {
  title: 'edit',
  permissions: {
    create: {
      resource: Resources.HYP_CROPS,
      level: PermissionLevels.FULL,
    },
    update: {
      resource: Resources.HYP_CROPS,
      level: PermissionLevels.FULL,
    },
  },
};

describe('EditButton', () => {
  it('invokes "onSuccess" callback if edit was successful and closes dialog', () => {
    const mockOnSuccess = jest.fn();
    const { queryByTestId } = render(
      <EditButton formGenConfig={mockFormGenConfig} isUpdating onSuccess={mockOnSuccess} />
    );

    expect(queryByTestId('fake-dialog')).not.toBeInTheDocument();

    queryByTestId(dataTestIdsEditButton.editButton(mockFormGenConfig.title)).click();

    expect(queryByTestId('fake-dialog')).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument();

    queryByTestId('fake-success').click();

    expect(mockOnSuccess).toHaveBeenCalledWith(true, 'B11');

    expect(queryByTestId('fake-dialog')).not.toBeInTheDocument();
  });

  it('does not invoke "onSuccess" callback if dialog was closed without successful submit', () => {
    const mockOnSuccess = jest.fn();
    const { queryByTestId } = render(
      <EditButton formGenConfig={mockFormGenConfig} isUpdating onSuccess={mockOnSuccess} />
    );

    queryByTestId(dataTestIdsEditButton.editButton(mockFormGenConfig.title)).click();

    queryByTestId('fake-close').click();

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('shows confirmation dialog when button clicked and confirmationMessage is provided', () => {
    const { queryByTestId } = render(
      <EditButton
        formGenConfig={mockFormGenConfig}
        isUpdating
        onSuccess={() => {}}
        confirmationMessage="Test Confirmation"
      />
    );

    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument();

    queryByTestId(dataTestIdsEditButton.editButton(mockFormGenConfig.title)).click();

    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeInTheDocument();
  });

  it('hides confirmation dialog when canceling', async () => {
    const { queryByTestId } = render(
      <EditButton
        formGenConfig={mockFormGenConfig}
        isUpdating
        onSuccess={() => {}}
        confirmationMessage="Test Confirmation"
      />
    );

    queryByTestId(dataTestIdsEditButton.editButton(mockFormGenConfig.title)).click();

    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeInTheDocument();

    queryByTestId(dataTestIdsDialogConfirmation.cancel).click();

    await waitFor(() => expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument());
  });

  it('shows edit dialog after providing confirmation', async () => {
    const { queryByTestId } = render(
      <EditButton
        formGenConfig={mockFormGenConfig}
        isUpdating
        onSuccess={() => {}}
        confirmationMessage="Test Confirmation"
      />
    );

    queryByTestId(dataTestIdsEditButton.editButton(mockFormGenConfig.title)).click();

    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeInTheDocument();
    expect(queryByTestId('fake-dialog')).not.toBeInTheDocument();

    queryByTestId(dataTestIdsDialogConfirmation.confirm).click();

    await waitFor(() => expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument());
    await waitFor(() => expect(queryByTestId('fake-dialog')).toBeInTheDocument());
  });

  it('supports a custom button component', async () => {
    const { queryByTestId } = render(
      <EditButton
        formGenConfig={mockFormGenConfig}
        isUpdating
        onSuccess={() => {}}
        confirmationMessage="Test Confirmation"
        buttonComponent={({ handleClick, title, dataTestId }) => (
          <Button variant="outlined" color="secondary" data-testid={dataTestId} onClick={handleClick}>
            Custom Title: {title}
          </Button>
        )}
      />
    );

    expect(queryByTestId(dataTestIdsEditButton.editButton(mockFormGenConfig.title))).toHaveTextContent(
      'Custom Title: edit'
    );

    queryByTestId(dataTestIdsEditButton.editButton(mockFormGenConfig.title)).click();

    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeInTheDocument();

    queryByTestId(dataTestIdsDialogConfirmation.cancel).click();

    await waitFor(() => expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument());
  });
});
