import { Add } from '@material-ui/icons';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import React from 'react';

import { useBaseObservationDefinitionFormGenConfig, useBaseObservationDefinitionHandler } from '../../hooks';

const dataTestIds = {
  button: 'button-create-base-observation-definition',
  dialog: 'button-create-base-observation-definition-dialog',
};

export { dataTestIds as dataTestIdsButtonCreateBaseObservationDefinition };

export interface ButtonCreateBaseObservationDefinition {
  onSuccess: DialogBaseForm['onSuccess'];
}

/**
 * Button gated by permissions to open a dialog and create a BaseObservationDefinition.
 */
export const ButtonCreateBaseObservationDefinition: React.FC<ButtonCreateBaseObservationDefinition> = ({
  onSuccess,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [coreStore] = useCoreStore();
  const { handleCreated } = useBaseObservationDefinitionHandler();
  const formGenConfig = useBaseObservationDefinitionFormGenConfig({ username: coreStore.currentUser.username });

  const handleSuccess = response => {
    setOpen(false);
    handleCreated(response);
    void onSuccess(response);
  };

  return (
    <Can resource={Resources.HYP_DERIVED_OBSERVATIONS} level={PermissionLevels.EDIT} disableSnackbar>
      <Button data-testid={dataTestIds.button} variant="contained" onClick={() => setOpen(true)} startIcon={<Add />}>
        Create Base Observation Definition
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
