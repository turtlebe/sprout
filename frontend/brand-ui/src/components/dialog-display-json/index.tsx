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

import { useStyles } from './styles';

const dataTestIds = {
  root: 'dialog-display-json-root',
  close: 'dialog-display-json-close',
};

export { dataTestIds as dataTestIdsDialogDisplayJson };

/**
 * Dialog that renders a beautified JSON object.
 */
export interface DialogDisplayJson extends Pick<DialogProps, 'open' | 'maxWidth'> {
  title: string;
  jsonObject: any;
  onClose: () => void;
  'data-testid'?: string;
}

export const DialogDisplayJson: React.FC<DialogDisplayJson> = ({
  open,
  title,
  jsonObject,
  onClose,
  'data-testid': dataTestId,
}) => {
  const classes = useStyles({});

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} data-testid={dataTestId ?? dataTestIds.root}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <IconButton
            color="default"
            icon={Close}
            aria-label="close"
            onClick={onClose}
            data-testid={dataTestIds.close}
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box className={classes.jsonContent}>{jsonObject ? JSON.stringify(jsonObject, null, '\t') : <>--</>}</Box>
      </DialogContent>
    </Dialog>
  );
};
