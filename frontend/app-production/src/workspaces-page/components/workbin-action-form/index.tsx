import { useHasProductionPermissions } from '@plentyag/app-production/src/common/hooks/use-has-production-permissions';
import { WorkbinTaskDefinition, WorkbinTaskInstance } from '@plentyag/app-production/src/common/types';
import { CreateUpdateBaseForm } from '@plentyag/brand-ui/src/components';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { Box, Drawer } from '@plentyag/brand-ui/src/material-ui/core';
import { PermissionLevels } from '@plentyag/core/src/core-store/types';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import React from 'react';

import { useGenerateFormGenConfigAdapter } from './hooks';
import { useStyles } from './styles';

const dataTestIds = {
  drawer: 'workbin-action-form-drawer',
};

export { dataTestIds as workbinActionFormTestIds };

export const SUCCESS_MESSAGE = 'Success submitting Workbin action';
export const FAIL_MESSAGE = 'Error submitting Workbin action';

export interface WorkbinActionForm {
  workbinTaskDefinition?: WorkbinTaskDefinition;
  workbinTaskInstance?: WorkbinTaskInstance;
  workbin: string;
  onClose?: (hasSubmittedSuccessfully: boolean) => void;
}

/**
 * Displays a form to create/update the fields of a workbin task definition.
 * Underlying it uses the action model to autogenerate the form-gen configuration
 * from the given fields.
 */
export const WorkbinActionForm: React.FC<WorkbinActionForm> = ({
  workbinTaskDefinition,
  workbinTaskInstance,
  workbin,
  onClose,
}) => {
  const hasPermissionToSubmit = useHasProductionPermissions(PermissionLevels.EDIT);
  const snackbar = useGlobalSnackbar();

  // if an existing instance is provided then we will be updating.
  const isUpdating = !!workbinTaskInstance;

  const formGenConfig = useGenerateFormGenConfigAdapter({
    workbinTaskDefinition,
    workbinTaskInstance,
    workbin,
    isUpdating,
  });

  const [hasSubmitted, setHasSubmitted] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function handleCloseActionForm() {
    // prevent closing while submission in progress.
    if (!isSubmitting) {
      onClose && onClose(hasSubmitted);
      setHasSubmitted(false);
      setIsSubmitting(false);
    }
  }

  function handleSuccess() {
    setHasSubmitted(true);
    snackbar.successSnackbar(SUCCESS_MESSAGE);
  }

  function handleError(err: any) {
    snackbar.errorSnackbar({ message: `${FAIL_MESSAGE}: ${parseErrorMessage(err)}` });
  }

  const classes = useStyles();

  const isOpen = !!workbinTaskDefinition;

  return (
    <Drawer data-testid={dataTestIds.drawer} anchor="right" open={isOpen} onClose={handleCloseActionForm}>
      <Box className={classes.container}>
        <CreateUpdateBaseForm
          formGenConfig={formGenConfig}
          isUpdating={isUpdating}
          renderSubmitTextHelper
          onSuccess={handleSuccess}
          onError={handleError}
          onIsSubmittingChange={isSubmitting => setIsSubmitting(isSubmitting)}
          isSubmitDisabled={!hasPermissionToSubmit || hasSubmitted}
        />
      </Box>
    </Drawer>
  );
};
