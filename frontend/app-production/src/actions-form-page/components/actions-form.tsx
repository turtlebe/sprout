import { useHasProductionPermissions } from '@plentyag/app-production/src/common/hooks';
import { CreateUpdateBaseForm, dataTestIdsBaseForm } from '@plentyag/brand-ui/src/components';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { PermissionLevels } from '@plentyag/core/src/core-store/types';
import React from 'react';

import { useGenerateFormGenConfigFromActionModel, useGetActionModel, useHandleActionSubmit } from '../hooks';

import { useStyles } from './styles';

export const dataTestIds = {
  submit: dataTestIdsBaseForm.submit,
  noArgsMsg: 'actions-form-no-arguments-message',
};

export { dataTestIds as actionsFormTestIds };

interface ActionsForm {
  operation: ProdActions.Operation;
  disableSubmitAfterSuccess: boolean;
  error?: string;
  onIsSubmittingChange?: (isSubmitting: boolean) => void;
}

export const ActionsForm: React.FC<ActionsForm> = props => {
  const hasPermissionToSubmit = useHasProductionPermissions(PermissionLevels.EDIT);

  const snackbar = useGlobalSnackbar();

  React.useEffect(() => {
    if (props.error) {
      snackbar.errorSnackbar({ message: props.error });
    }
  }, [props.error]);

  React.useEffect(() => {
    snackbar.closeSnackbar();
  }, []);

  const { isLoadingAction, action, actionError: actionLoadingError } = useGetActionModel(props.operation);

  const formGenConfig = useGenerateFormGenConfigFromActionModel({ action, operation: props.operation });

  const { handleSuccess, hasSubmitted, handleError } = useHandleActionSubmit();

  const classes = useStyles();

  return (
    <Box className={classes.container} height="100%" display="flex" flexDirection="column">
      {!actionLoadingError && !isLoadingAction && action.fields.length === 0 && (
        <Box mt={2}>
          <Typography data-testid={dataTestIds.noArgsMsg} align="center">
            No Arguments required for this action
          </Typography>
        </Box>
      )}
      <CreateUpdateBaseForm
        formGenConfig={formGenConfig}
        isUpdating={false}
        renderSubmitTextHelper
        onSuccess={handleSuccess}
        onError={handleError}
        onIsSubmittingChange={props.onIsSubmittingChange}
        isSubmitDisabled={!hasPermissionToSubmit || (hasSubmitted && props.disableSubmitAfterSuccess)}
      />
    </Box>
  );
};
