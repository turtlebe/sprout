import { DialogConfirmation, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { useDeleteRequest } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = {
  deleteInProgress: 'dialog-delete-task-delete-in-progress',
};

export { dataTestIds as dataTestIdsDeleteTask };

export interface DialogDeleteTask {
  taskIdToDelete?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

/**
 * If given a task id, a confirmation dialog will be shown. If the user confirms
 * then the task is deleted from the plan, otherwise the user can abort.
 */
export const DialogDeleteTask: React.FC<DialogDeleteTask> = ({ taskIdToDelete, onCancel, onSuccess }) => {
  const snackbar = useGlobalSnackbar();

  const { makeRequest: deleteTask, isLoading: isDeletingTask } = useDeleteRequest({
    url: taskIdToDelete && `/api/plentyservice/executive-service/delete-workcenter-task-details/${taskIdToDelete}`,
  });

  function handleDeleteTask() {
    if (isDeletingTask) {
      return; // prevent double delete
    }
    deleteTask({
      onSuccess,
      onError: error => snackbar.errorSnackbar({ title: 'Error Deleting Task', message: parseErrorMessage(error) }),
    });
  }

  return (
    <DialogConfirmation
      open={!!taskIdToDelete}
      title="You are about to delete a task"
      confirmLabel={
        isDeletingTask ? (
          <>
            <CircularProgress data-testid={dataTestIds.deleteInProgress} color="inherit" size="1rem" />
            <Box paddingLeft="0.5rem" />
            Deleting...
          </>
        ) : (
          'Delete Task'
        )
      }
      onConfirm={handleDeleteTask}
      onCancel={onCancel}
    />
  );
};
