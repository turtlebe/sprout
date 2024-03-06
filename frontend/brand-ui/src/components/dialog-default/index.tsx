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
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { useStyles } from './styles';

const dataTestIds = {
  dialog: 'dialog-default-picker-dialog',
  close: 'dialog-default-picker-close',
};

export { dataTestIds as dataTestIdsDialogDefault };

export const getDialogDefaultDataTestIds = (prefix = '') => getScopedDataTestIds(dataTestIds, prefix);

export interface DialogDefault {
  title: string;
  open: boolean;
  onClose: () => void;
  maxWidth?: DialogProps['maxWidth'];
  'data-testid'?: string;
}

export const DialogDefault: React.FC<DialogDefault> = ({
  title,
  open,
  onClose,
  maxWidth,
  children,
  'data-testid': dataTestId,
}) => {
  const dataTestIdsWithPrefix = getDialogDefaultDataTestIds(dataTestId);
  const classes = useStyles({});

  return (
    <Dialog
      open={open}
      fullWidth
      data-testid={dataTestIdsWithPrefix.dialog}
      maxWidth={maxWidth}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{title}</Typography>
          <IconButton
            color="default"
            icon={Close}
            aria-label="close"
            onClick={onClose}
            data-testid={dataTestIdsWithPrefix.close}
          />
        </Box>
      </DialogTitle>
      <DialogContent classes={{ root: classes.contentRoot }}>{children}</DialogContent>
    </Dialog>
  );
};
