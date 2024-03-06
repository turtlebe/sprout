import { CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { hasLabTestResult } from '../../../utils/has-lab-event';

import { DeleteDialog } from './delete-dialog';
import { deleteTests } from './utils/delete-tests';

/**
 * Displays dialog flow for deleting lab tests...
 *
 * if any of selected samples have results then give message:
 * "Samples with results cannot be deleted, please remove samples from your selection and try again"
 * showing dialog with ok button and Cancel
 *
 * if no sample have results then show confirmation dialog with message:
 * "This operation will delete all samples selected.  Are you sure you want to delete these samples?"
 * showing dialog iwth buttons: Yes, delete or Cancel
 *
 * @param itemsToDelete  Array of items to potentially be deleted.
 * @param setDeleteStatus  Provides access to setting state of delete dialog.
 * @param onDeleteSuccess  Should be called when delete was successful.
 */
export function deleteFlow(
  itemsToDelete: LT.SampleResult[],
  setDeleteStatus: (value: React.SetStateAction<DeleteDialog>) => void,
  onDeleteSuccess: () => void
) {
  function closeDialog() {
    setDeleteStatus({ open: false });
  }

  function onDeleteFail(err: string) {
    setDeleteStatus({
      open: true,
      statusTitle: 'Error: delete failed',
      status: (
        <>
          <p>Deleting tests failed with error: {err}.</p>
          <p>Try again or cancel?</p>
        </>
      ),
      onCancel: closeDialog,
      onAction: () => deleteFlow(itemsToDelete, setDeleteStatus, onDeleteSuccess),
      actionTitle: 'Try again',
    });
  }

  const hasResult = itemsToDelete.some(sample => {
    return sample.labTestEvents.some(event => hasLabTestResult(event));
  });

  if (hasResult) {
    // some tests have results - do not allow deleting.
    setDeleteStatus({
      open: true,
      statusTitle: 'Error: Cannot delete',
      status: (
        <>
          <p>Tests with results cannot be deleted.</p>
          <p>Please remove tests with results from selection and try again.</p>
        </>
      ),
      onCancel: closeDialog,
      onAction: closeDialog,
      actionTitle: 'Ok',
    });
  } else {
    // all tests have no results, allow delete, but give confirmation.
    const statusTitle = 'Warning: Confirm delete';
    const status = (
      <>
        <p>
          This operation will delete {itemsToDelete.length > 1 ? itemsToDelete.length : 'the'} selected test
          {itemsToDelete.length > 1 ? 's' : ''}.
        </p>
        <p>
          Are you sure you want to delete {itemsToDelete.length > 1 ? 'these' : 'this'} test
          {itemsToDelete.length > 1 ? 's' : ''}?
        </p>
      </>
    );
    const actionTitle = 'Yes, delete';
    setDeleteStatus({
      open: true,
      statusTitle,
      status,
      onCancel: closeDialog,
      onAction: () => {
        setDeleteStatus({
          open: true,
          statusTitle,
          status,
          buttonsDisabled: true,
          actionEndIcon: <CircularProgress size={10} />,
          actionTitle,
        });
        deleteTests(itemsToDelete, onDeleteSuccess, onDeleteFail);
      },
      actionTitle,
    });
  }
}
