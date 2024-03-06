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
import { Dashboard } from '@plentyag/core/src/types/environment';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import React from 'react';

const dataTestIds = {
  button: 'button-delete-dashboard',
  dialog: dataTestIdsDialogConfirmation,
};

export { dataTestIds as dataTestIdsButtonDeleteDashboard };

export interface ButtonDeleteDashboard {
  dashboards: Dashboard[];
  onSuccess: () => void;
}

/**
 * Button gated by permissions to open a confirmation dialog and delete a list of Dashboards.
 */
export const ButtonDeleteDashboard: React.FC<ButtonDeleteDashboard> = ({ dashboards = [], onSuccess }) => {
  const snackbar = useGlobalSnackbar();
  const [open, setOpen] = React.useState<boolean>(false);
  const deletedByHeader = useDeletedByHeader();

  const handleConfirm: DialogConfirmation['onConfirm'] = () => {
    void Promise.all(
      dashboards.map(async dashboard =>
        axiosRequest({
          method: 'DELETE',
          headers: deletedByHeader,
          url: EVS_URLS.dashboards.deleteUrl(dashboard),
        })
      )
    )
      .then(() => snackbar.successSnackbar('Dashboard(s) successfully deleted.'))
      .then(onSuccess)
      .catch(() => snackbar.errorSnackbar({ message: 'Something went wrong when deleting the selected Dashboards.' }))
      .finally(() => setOpen(false));
  };

  return (
    <Can resource={Resources.HYP_ENVIRONMENT_V2} level={PermissionLevels.FULL} disableSnackbar>
      <Button
        variant="contained"
        color="secondary"
        disabled={dashboards.length === 0}
        onClick={() => setOpen(true)}
        data-testid={dataTestIds.button}
      >
        Delete Dashboard ({dashboards.length})
      </Button>
      <DialogConfirmation
        title="Are you sure you would like to delete the selected Dashboards?"
        open={open}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </Can>
  );
};
