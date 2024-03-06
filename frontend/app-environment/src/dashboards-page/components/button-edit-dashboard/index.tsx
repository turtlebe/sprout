import { Edit } from '@material-ui/icons';
import { useDashboardFormGenConfig, useDashboardHandler } from '@plentyag/app-environment/src/common/hooks';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { Dashboard } from '@plentyag/core/src/types/environment';
import React from 'react';

const dataTestIds = {
  button: 'button-edit-dashboard',
  dialog: 'button-edit-dashboard-dialog',
};

export { dataTestIds as dataTestIdsButtonEditDashboard };

export interface ButtonEditDashboard {
  dashboard: Dashboard;
  onSuccess: DialogBaseForm['onSuccess'];
  disabled: boolean;
}

/**
 * Button gated by permissions to open a dialog and edit an existing Dashboard.
 */
export const ButtonEditDashboard: React.FC<ButtonEditDashboard> = ({ dashboard, onSuccess, disabled }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [coreStore] = useCoreStore();
  const { handleUpdated } = useDashboardHandler();
  const formGenConfig = useDashboardFormGenConfig({ dashboard, username: coreStore.currentUser?.username });

  const handleSuccess = response => {
    setOpen(false);
    handleUpdated(response);
    void onSuccess(response);
  };

  return (
    <Can resource={Resources.HYP_ENVIRONMENT_V2} level={PermissionLevels.FULL} disableSnackbar>
      <Button
        data-testid={dataTestIds.button}
        variant="contained"
        onClick={() => setOpen(true)}
        startIcon={<Edit />}
        disabled={disabled}
        color="default"
      >
        Edit Dashboard
      </Button>
      <DialogBaseForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
        disableDefaultOnSuccessHandler
        formGenConfig={formGenConfig}
        data-testid={dataTestIds.dialog}
        isUpdating={true}
        initialValues={dashboard}
      />
    </Can>
  );
};
