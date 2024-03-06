import {
  dataTestIdsDialogConfirmation,
  DialogConfirmation,
  useGlobalSnackbar,
} from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import React from 'react';

const dataTestIds = {
  button: 'button-commit',
  dialog: dataTestIdsDialogConfirmation,
};

export { dataTestIds as dataTestIdsButtonCommit };

export interface ButtonCommit {
  onSuccess: () => void;
}

/**
 * Button gated by permissions to commit tags to ignition ingest.
 * The commit invokes POST requests to ignition ingest service to update
 * its farm def caches where it stores the tags.
 * This way udt tag provider and tag path can be mapped to farm def path and
 * those mappings stored in memory for faster lookups.
 */
export const ButtonCommit: React.FC<ButtonCommit> = ({ onSuccess }) => {
  const snackbar = useGlobalSnackbar();
  const [open, setOpen] = React.useState<boolean>(false);

  const handleConfirm: DialogConfirmation['onConfirm'] = async () => {
    try {
      await axiosRequest({
        method: 'POST',
        url: '/api/swagger/ignition-ingest-service/ignition-ingest-api/invalidate-cache',
      });
      onSuccess();
    } catch (e) {
      snackbar.errorSnackbar({ message: 'Something went wrong when updating the ignition ingest service.' });
    } finally {
      setOpen(false);
    }
  };

  return (
    <Can resource={Resources.HYP_IGNITION_TAG_REGISTRY} level={PermissionLevels.FULL} disableSnackbar>
      <Button variant="contained" color="secondary" onClick={() => setOpen(true)} data-testid={dataTestIds.button}>
        Commit Tags
      </Button>
      <DialogConfirmation
        title="Are you sure you would like to update the ignition ingest service with tag changes?"
        open={open}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </Can>
  );
};
