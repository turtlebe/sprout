import { Edit } from '@material-ui/icons';
import { useMetricErrorHandler, useMetricFormGenConfig } from '@plentyag/app-environment/src/common/hooks';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { Metric } from '@plentyag/core/src/types/environment';
import React from 'react';

const dataTestIds = {
  button: 'button-edit-metric',
  dialog: 'button-edit-metric-dialog',
};

export { dataTestIds as dataTestIdsButtonEditMetric };

export interface ButtonEditMetric {
  metric: Metric;
  onSuccess: DialogBaseForm['onSuccess'];
  disabled: boolean;
}

/**
 * Button gated by permissions to open a dialog and edit an existing Metric.
 */
export const ButtonEditMetric: React.FC<ButtonEditMetric> = ({ metric, onSuccess, disabled }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [coreStore] = useCoreStore();
  const formGenConfig = useMetricFormGenConfig({ metric, username: coreStore.currentUser?.username });
  const { handleError, handleUpdated } = useMetricErrorHandler();

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
        Edit Metric
      </Button>
      <DialogBaseForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
        onError={handleError}
        disableDefaultOnSuccessHandler
        disableDefaultOnErrorHandler
        formGenConfig={formGenConfig}
        data-testid={dataTestIds.dialog}
        isUpdating={true}
        initialValues={metric}
        maxWidth="lg"
      />
    </Can>
  );
};
