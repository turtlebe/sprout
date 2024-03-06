import { Add } from '@material-ui/icons';
import { useWidgetFormGenConfig } from '@plentyag/app-environment/src/common/hooks';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import React from 'react';

const dataTestIds = {
  button: 'button-create-widget',
  dialog: 'button-create-widget-dialog',
};

export { dataTestIds as dataTestIdsButtonCreateWidget };

export interface ButtonCreateWidget {
  dashboardId: string;
  onSuccess: DialogBaseForm['onSuccess'];
}

/**
 * Button gated by permissions to open a dialog and create a new Widget.
 */
export const ButtonCreateWidget: React.FC<ButtonCreateWidget> = ({ dashboardId, onSuccess }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const formGenConfig = useWidgetFormGenConfig({ dashboardId });

  const handleSuccess = response => {
    setOpen(false);
    void onSuccess(response);
  };

  return (
    <Can resource={Resources.HYP_ENVIRONMENT_V2} level={PermissionLevels.EDIT} disableSnackbar>
      <Button data-testid={dataTestIds.button} variant="contained" onClick={() => setOpen(true)} startIcon={<Add />}>
        Create Widget
      </Button>
      <DialogBaseForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
        formGenConfig={formGenConfig}
        data-testid={dataTestIds.dialog}
      />
    </Can>
  );
};
