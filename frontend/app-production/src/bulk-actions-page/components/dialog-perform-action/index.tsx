import { Close } from '@material-ui/icons';
import { BaseForm, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { axiosRequest, parseErrorMessage } from '@plentyag/core/src/utils';
import { cloneDeep } from 'lodash';
import React from 'react';

import { useGenerateFormGenConfigForBulkAction } from '../../hooks';
import { ActionStatus, Container, ContainerActionResult } from '../../types';

import { useStyles } from './styles';

const dataTestIds = {
  close: 'dialog-perform-action-close-button',
};

export { dataTestIds as dataTestIdsDialogPerformAction };

interface DialogPerformAction {
  operation: ProdActions.Operation;
  containers: Container[];
  onClose: () => void;
  onActionComplete: (response: ContainerActionResult[]) => void;
}

export const DialogPerformAction: React.FC<DialogPerformAction> = ({
  operation,
  containers,
  onClose,
  onActionComplete,
}) => {
  const classes = useStyles({});
  const snackbar = useGlobalSnackbar();

  const [submitProgress, setSubmitProgress] = React.useState<number>(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function handleClose() {
    onClose();
  }

  const formGenConfig = useGenerateFormGenConfigForBulkAction(operation);

  const handleSubmit: BaseForm['onSubmit'] = (values: any) => {
    const submitValues = formGenConfig.serialize(values);

    setSubmitProgress(0);
    setIsSubmitting(true);

    let numCompleted = 0;
    Promise.all(
      containers.map<Promise<ContainerActionResult>>(async container => {
        const bulkOperationFieldName = operation.bulkFieldName;

        // for each bulk action, replace the bulk action field with corresponding serial number.
        const data = cloneDeep(submitValues);
        if (data[bulkOperationFieldName] && data[bulkOperationFieldName]['value']) {
          data[bulkOperationFieldName]['value'] = container.serial;
        }

        try {
          await axiosRequest({ url: formGenConfig.createEndpoint, method: 'POST', data });
          return {
            ...container,
            status: ActionStatus.success,
          };
        } catch (err) {
          return {
            ...container,
            status: ActionStatus.fail,
            message: parseErrorMessage(err),
          };
        } finally {
          numCompleted++;
          const newProgress = 100 * (numCompleted / containers.length);
          setSubmitProgress(newProgress);
        }
      })
    )
      .then(results => onActionComplete(results))
      .catch(error => snackbar.errorSnackbar({ message: parseErrorMessage(error) }))
      .finally(() => {
        setIsSubmitting(false);
        setSubmitProgress(0);
      });
  };

  return (
    <Dialog
      classes={{ paper: classes.paper, scrollPaper: classes.scrollPaper }}
      disableEscapeKeyDown={true}
      fullWidth={true}
      maxWidth="lg"
      open={true}
      onClose={handleClose}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{formGenConfig.title}</Typography>
          <IconButton
            data-testid={dataTestIds.close}
            color="default"
            icon={Close}
            aria-label="close"
            disabled={isSubmitting}
            onClick={handleClose}
          />
        </Box>
      </DialogTitle>
      <DialogContent classes={{ root: classes.containerRoot }}>
        <BaseForm
          isUpdating={false}
          isLoading={isSubmitting}
          loadingProgress={submitProgress}
          onSubmit={handleSubmit}
          formGenConfig={formGenConfig}
          renderSubmitTextHelper={true}
          isSubmitDisabled={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
