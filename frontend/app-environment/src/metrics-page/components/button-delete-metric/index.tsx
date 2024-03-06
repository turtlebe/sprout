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
import { Metric } from '@plentyag/core/src/types/environment';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import React from 'react';

const dataTestIds = {
  button: 'button-delete-metric',
  dialog: dataTestIdsDialogConfirmation,
};

export { dataTestIds as dataTestIdsButtonDeleteMetric };

export interface ButtonDeleteMetric {
  metrics: Metric[];
  onSuccess: () => void;
}

/**
 * Button gated by permissions to open a confirmation dialog and delete a list of Metrics.
 */
export const ButtonDeleteMetric: React.FC<ButtonDeleteMetric> = ({ metrics = [], onSuccess }) => {
  const snackbar = useGlobalSnackbar();
  const [open, setOpen] = React.useState<boolean>(false);
  const deletedByHeader = useDeletedByHeader();

  const handleConfirm: DialogConfirmation['onConfirm'] = () => {
    void Promise.all(
      metrics.map(async metric =>
        axiosRequest({
          method: 'DELETE',
          headers: deletedByHeader,
          url: EVS_URLS.metrics.deleteUrl(metric),
        })
      )
    )
      .then(() => snackbar.successSnackbar('Metric(s) successfully deleted.'))
      .then(onSuccess)
      .catch(() => snackbar.errorSnackbar({ message: 'Something went wrong when deleting the selected Metrics.' }))
      .finally(() => setOpen(false));
  };

  return (
    <Can resource={Resources.HYP_ENVIRONMENT_V2} level={PermissionLevels.FULL} disableSnackbar>
      <Button
        variant="contained"
        color="secondary"
        disabled={metrics.length === 0}
        onClick={() => setOpen(true)}
        data-testid={dataTestIds.button}
      >
        Delete Metric ({metrics.length})
      </Button>
      <DialogConfirmation
        title="Are you sure you would like to delete the selected Metrics?"
        open={open}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </Can>
  );
};
