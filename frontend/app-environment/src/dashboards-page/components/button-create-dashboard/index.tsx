import { Add } from '@material-ui/icons';
import {
  dataTestIdLinkToDashboardPage,
  useDashboardFormGenConfig,
  useDashboardHandler,
} from '@plentyag/app-environment/src/common/hooks';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import React from 'react';

const dataTestIds = {
  button: 'button-create-dashboard',
  dialog: 'button-create-dashboard-dialog',
  linkToDashboardPage: dataTestIdLinkToDashboardPage,
};

export { dataTestIds as dataTestIdsButtonCreateDashboard };

export interface ButtonCreateDashboard {
  onSuccess: DialogBaseForm['onSuccess'];
}

/**
 * Button gated by permissions to open a dialog and create a new Dashboard.
 */
export const ButtonCreateDashboard: React.FC<ButtonCreateDashboard> = ({ onSuccess }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [coreStore] = useCoreStore();
  const formGenConfig = useDashboardFormGenConfig({ username: coreStore.currentUser?.username });
  const { handleCreated } = useDashboardHandler();

  const handleSuccess = response => {
    setOpen(false);
    handleCreated(response);
    void onSuccess(response);
  };

  return (
    <Can resource={Resources.HYP_ENVIRONMENT_V2} level={PermissionLevels.EDIT} disableSnackbar>
      <Button data-testid={dataTestIds.button} variant="contained" onClick={() => setOpen(true)} startIcon={<Add />}>
        Create Dashboard
      </Button>
      <DialogBaseForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
        disableDefaultOnSuccessHandler
        formGenConfig={formGenConfig}
        data-testid={dataTestIds.dialog}
      />
    </Can>
  );
};
