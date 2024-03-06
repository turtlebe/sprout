import { Edit } from '@material-ui/icons';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { BaseObservationDefinition } from '@plentyag/core/src/types/derived-observations';
import React from 'react';

import { useBaseObservationDefinitionFormGenConfig, useBaseObservationDefinitionHandler } from '../../hooks';

const dataTestIds = {
  button: 'button-edit-base-observation-definition',
  dialog: 'button-edit-base-observation-definition-dialog',
};

export { dataTestIds as dataTestIdsButtonEditBaseObservationDefinition };

export interface ButtonEditBaseObservationDefinition {
  definition: BaseObservationDefinition;
  onSuccess: DialogBaseForm['onSuccess'];
  disabled: boolean;
}

/**
 * Button gated by permissions to open a dialog and edit a BaseObservationDefinition.
 */
export const ButtonEditBaseObservationDefinition: React.FC<ButtonEditBaseObservationDefinition> = ({
  onSuccess,
  definition,
  disabled,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [coreStore] = useCoreStore();
  const { handleUpdated } = useBaseObservationDefinitionHandler();
  const formGenConfig = useBaseObservationDefinitionFormGenConfig({
    definition,
    username: coreStore.currentUser.username,
  });

  const handleSuccess = response => {
    setOpen(false);
    handleUpdated(response);
    void onSuccess(response);
  };

  return (
    <Can resource={Resources.HYP_DERIVED_OBSERVATIONS} level={PermissionLevels.FULL} disableSnackbar>
      <Button
        data-testid={dataTestIds.button}
        variant="contained"
        color="default"
        onClick={() => setOpen(true)}
        startIcon={<Edit />}
        disabled={disabled}
      >
        Edit Base Observation Definition
      </Button>
      <DialogBaseForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
        disableDefaultOnSuccessHandler
        formGenConfig={formGenConfig}
        data-testid={dataTestIds.dialog}
        isUpdating={true}
        initialValues={definition}
      />
    </Can>
  );
};
