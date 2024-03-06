import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import {
  dataTestIdsDialogConfirmation,
  DialogConfirmation,
  useGlobalSnackbar,
} from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { useDeletedByHeader } from '@plentyag/core/src/hooks';
import { Schedule } from '@plentyag/core/src/types/environment';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import React from 'react';

const dataTestIds = {
  button: 'button-delete-schedule',
  dialog: dataTestIdsDialogConfirmation,
};

export { dataTestIds as dataTestIdsButtonDeleteSchedule };

export interface ButtonDeleteSchedule {
  schedules: Schedule[];
  onSuccess: () => void;
}

/**
 * Button gated by permissions to open a confirmation dialog and delete a list of Schedules.
 */
export const ButtonDeleteSchedule: React.FC<ButtonDeleteSchedule> = ({ schedules, onSuccess }) => {
  const snackbar = useGlobalSnackbar();
  const [open, setOpen] = React.useState<boolean>(false);
  const deletedByHeader = useDeletedByHeader();

  const handleConfirm: DialogConfirmation['onConfirm'] = () => {
    void Promise.all(
      schedules.map(async schedule =>
        axiosRequest({
          method: 'DELETE',
          headers: deletedByHeader,
          url: EVS_URLS.schedules.deleteUrl(schedule),
        })
      )
    )
      .then(() => snackbar.successSnackbar('Schedule(s) successfully deleted.'))
      .then(onSuccess)
      .catch(snackbar.errorSnackbar)
      .finally(() => setOpen(false));
  };

  return (
    <Can resource={Resources.HYP_ENVIRONMENT_V2} level={PermissionLevels.FULL} disableSnackbar>
      <Button
        variant="contained"
        color="secondary"
        disabled={schedules.length === 0}
        onClick={() => setOpen(true)}
        data-testid={dataTestIds.button}
      >
        Delete Schedules ({schedules.length})
      </Button>
      <DialogConfirmation
        title="Are you sure you would like to delete the selected Schedules?"
        open={open}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </Can>
  );
};
