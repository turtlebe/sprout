import { Close } from '@material-ui/icons';
import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { dataTestIdsBaseForm } from '../base-form';
import { CreateUpdateBaseForm } from '../create-update-base-form';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'dialog-base-form',
  title: 'dialog-base-form-title',
  content: 'dialog-base-form-content',
  close: 'dialog-base-form-close',
  submit: dataTestIdsBaseForm.submit,
};

export { dataTestIds as dataTestIdsDialogBaseForm };

export interface DialogBaseForm<OnSuccessResponse = any> extends Pick<DialogProps, 'open' | 'maxWidth'> {
  formGenConfig: FormGen.Config;
  layout?: FormGen.Layout;
  initialValues?: any;
  isUpdating?: boolean;
  onClose: () => void;
  onSuccess: CreateUpdateBaseForm<OnSuccessResponse>['onSuccess'];
  onError?: CreateUpdateBaseForm<OnSuccessResponse>['onError'];
  disableDefaultOnSuccessHandler?: CreateUpdateBaseForm['disableDefaultOnSuccessHandler'];
  disableDefaultOnErrorHandler?: CreateUpdateBaseForm['disableDefaultOnErrorHandler'];
  'data-testid'?: string;
  disableGoToPath?: boolean;
}

// interface that the parent components should inherit.
export type DialogBaseFormProps<OnSuccessResponse = any> = Omit<DialogBaseForm<OnSuccessResponse>, 'formGenConfig'>;

export const DialogBaseForm: React.FC<DialogBaseForm<unknown>> = ({
  formGenConfig,
  layout,
  isUpdating = false,
  initialValues,
  open,
  maxWidth,
  onClose,
  onSuccess,
  onError,
  disableDefaultOnSuccessHandler = false,
  disableDefaultOnErrorHandler = false,
  'data-testid': dataTestId = dataTestIds.root,
  disableGoToPath,
}) => {
  const handleDialogClose: DialogProps['onClose'] = (event, reason) => {
    if (reason === 'backdropClick') {
      // filter backdrop click - material ui upgrade has deprecated 'disableBackdropClick'
      return;
    }
    onClose();
  };
  const classes = useStyles({});
  return (
    <Dialog
      disableEscapeKeyDown={true}
      fullWidth={true}
      maxWidth={maxWidth || 'sm'}
      open={open}
      data-testid={dataTestId}
      onClose={handleDialogClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle classes={{ root: classes.titleRoot }} data-testid={dataTestIds.title}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{formGenConfig.title}</Typography>
          <IconButton
            color="default"
            icon={Close}
            aria-label="close"
            onClick={onClose}
            data-testid={dataTestIds.close}
          />
        </Box>
      </DialogTitle>
      <DialogContent data-testid={dataTestIds.content} classes={{ root: classes.contentRoot }}>
        <CreateUpdateBaseForm
          formGenConfig={formGenConfig}
          layout={layout}
          showTitle={false}
          isUpdating={isUpdating}
          initialValues={initialValues}
          onSuccess={onSuccess}
          disableDefaultOnSuccessHandler={disableDefaultOnSuccessHandler}
          disableDefaultOnErrorHandler={disableDefaultOnErrorHandler}
          onError={onError}
          disableGoToPath={disableGoToPath}
        />
      </DialogContent>
    </Dialog>
  );
};
