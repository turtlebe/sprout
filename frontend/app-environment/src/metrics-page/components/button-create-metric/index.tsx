import { Add } from '@material-ui/icons';
import {
  dataTestIdLinkToMetricPage,
  useMetricErrorHandler,
  useMetricFormGenConfig,
} from '@plentyag/app-environment/src/common/hooks';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import React from 'react';

const dataTestIds = {
  button: 'button-create-metric',
  dialog: 'button-create-metric-dialog',
  linkToMetricPage: dataTestIdLinkToMetricPage,
};

export { dataTestIds as dataTestIdsButtonCreateMetric };

export interface ButtonCreateMetric {
  onSuccess: DialogBaseForm['onSuccess'];
}

/**
 * Button gated by permissions to open a dialog and create a new Metric.
 */
export const ButtonCreateMetric: React.FC<ButtonCreateMetric> = ({ onSuccess }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [coreStore] = useCoreStore();
  const formGenConfig = useMetricFormGenConfig({ username: coreStore.currentUser?.username });
  const { handleCreated, handleError } = useMetricErrorHandler();

  const handleSuccess = response => {
    setOpen(false);
    handleCreated(response);
    void onSuccess(response);
  };

  return (
    <Can resource={Resources.HYP_ENVIRONMENT_V2} level={PermissionLevels.EDIT} disableSnackbar>
      <Button data-testid={dataTestIds.button} variant="contained" onClick={() => setOpen(true)} startIcon={<Add />}>
        Create Metric
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
        maxWidth="lg"
      />
    </Can>
  );
};
