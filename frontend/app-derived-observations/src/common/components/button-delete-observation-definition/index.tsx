import { Delete } from '@material-ui/icons';
import {
  dataTestIdsDialogConfirmation,
  DialogConfirmation,
  useGlobalSnackbar,
} from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { useDeletedByHeader } from '@plentyag/core/src/hooks';
import { BaseObservationDefinition, DerivedObservationDefinition } from '@plentyag/core/src/types/derived-observations';
import { isBaseObservationDefinition } from '@plentyag/core/src/types/derived-observations/type-guards';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import React from 'react';

export { dataTestIds as dataTestIdsButtonDeleteObservationDefinition };

export interface ButtonDeleteObservationDefinition {
  definitions: BaseObservationDefinition[] | DerivedObservationDefinition[];
  onSuccess: () => void;
}

const dataTestIds = {
  button: 'button-delete-derived-definition',
  dialog: dataTestIdsDialogConfirmation,
};

function getDefinitionType(definitions: ButtonDeleteObservationDefinition['definitions']): 'base' | 'derived' {
  if (definitions.length === 0 || isBaseObservationDefinition(definitions[0])) {
    return 'base';
  }

  return 'derived';
}

/**
 * Button gated by permissions to open a confirmation dialog and delete a list of Base or Derived ObservationDefinitions.
 */
export const ButtonDeleteObservationDefinition: React.FC<ButtonDeleteObservationDefinition> = ({
  definitions = [],
  onSuccess,
}) => {
  const snackbar = useGlobalSnackbar();
  const [open, setOpen] = React.useState<boolean>(false);
  const deletedByHeader = useDeletedByHeader();
  const type = getDefinitionType(definitions);
  const handleConfirm: DialogConfirmation['onConfirm'] = () => {
    void Promise.all(
      definitions.map(async definition =>
        axiosRequest({
          method: 'DELETE',
          headers: deletedByHeader,
          url: `/api/swagger/environment-service/derived-observation-definitions-api/delete-${type}-observation-definition/${definition.id}`,
        })
      )
    )
      .then(() => snackbar.successSnackbar('Definition(s) successfully deleted.'))
      .then(onSuccess)
      .catch(() => snackbar.errorSnackbar({ message: 'Something went wrong when deleting the selected Definitions.' }))
      .finally(() => setOpen(false));
  };

  return (
    <Can resource={Resources.HYP_DERIVED_OBSERVATIONS} level={PermissionLevels.FULL} disableSnackbar>
      <Button
        variant="contained"
        color="secondary"
        disabled={definitions.length === 0}
        onClick={() => setOpen(true)}
        data-testid={dataTestIds.button}
        startIcon={<Delete />}
      >
        Delete ({definitions.length})
      </Button>
      <DialogConfirmation
        title="Are you sure you would like to delete the selected Definitions?"
        open={open}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </Can>
  );
};
