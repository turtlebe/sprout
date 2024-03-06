import { Delete } from '@material-ui/icons';
import { DialogConfirmation } from '@plentyag/brand-ui/src/components';
import { IconButton, Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useDeleteRequest, useLogAxiosErrorInSnackbar } from '@plentyag/core/src/hooks';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    delete: 'delete',
  },
  'delete-task-button'
);

export { dataTestIds as dataTestIdsIrrigationActions };

export interface DeleteTaskButton {
  taskId: string;
  onRefreshIrrigationTasks: () => void;
}

export const DeleteTaskButton: React.FC<DeleteTaskButton> = ({ taskId, onRefreshIrrigationTasks }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

  const {
    makeRequest: makeDeleteRequest,
    isLoading: isDeleting,
    error,
  } = useDeleteRequest({
    url: `/api/plentyservice/executive-service/delete-irrigation-task/${taskId}`,
  });

  useLogAxiosErrorInSnackbar(error, 'Error deleting irrigation task');

  function handleConfirm() {
    makeDeleteRequest({
      onSuccess: () => {
        void onRefreshIrrigationTasks();
        setIsDialogOpen(false);
      },
    });
  }

  return (
    <>
      <Tooltip arrow title={<Typography>Delete irrigation task</Typography>}>
        <IconButton
          data-testid={dataTestIds.delete}
          color="default"
          size="small"
          icon={Delete}
          onClick={() => setIsDialogOpen(true)}
        />
      </Tooltip>
      <DialogConfirmation
        open={isDialogOpen}
        title="Delete Task"
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={handleConfirm}
        isConfirmInProgress={isDeleting}
        confirmLabel="Confirm"
      >
        Press confirm to delete this task.
      </DialogConfirmation>
    </>
  );
};
