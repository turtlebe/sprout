import MuiAlert, { Color } from '@material-ui/lab/Alert';
import { MarkdownExtended } from '@plentyag/brand-ui/src/components/markdown-extended';
import { Snackbar as MuiSnackbar, SnackbarProps } from '@plentyag/brand-ui/src/material-ui/core';
import { DEFAULT_ERROR_MESSSAGE } from '@plentyag/core/src/utils';
import React from 'react';

import { useStyles } from './styles';

const dataTestIds = {
  snackbar: 'snackbar-container',
  alert: 'alert-container',
};

export { dataTestIds as dataTestIdsSnackbar };

type MessageType = string | JSX.Element;

export interface Snackbar extends Omit<SnackbarProps, 'open'> {
  severity?: Color;
  message?: MessageType;
  open?: boolean;
  disableAutoHide?: boolean;
  closeSnackbar?: () => void;
  updateSnackbar?: (params: UpdateSnackbarParams) => void;
  successSnackbar?: (message: MessageType, options?: { disableAutoHide?: boolean }) => void;
  errorSnackbar?: (options?: { message: MessageType; title?: string }) => void;
  warningSnackbar?: (message?: MessageType) => void;
}

export const AUTO_HIDE_DURATION_MS = 15000;

export interface UpdateSnackbarParams {
  severity?: Color;
  message?: MessageType;
  open?: boolean;
  disableAutoHide?: boolean;
}

export const useSnackbar = (props: Snackbar = {}): Snackbar => {
  const [severity, setSnackbarSeverity] = React.useState<Color>(props.severity ?? 'success');
  const [message, setSnackbarMessage] = React.useState<MessageType>(props.message ?? '');
  const [open, setSnackbarOpen] = React.useState<boolean>(props.open ?? false);
  const [disableAutoHide, setDisableAutoHide] = React.useState<boolean>(props.disableAutoHide ?? false);

  const updateSnackbar = React.useCallback((params: UpdateSnackbarParams): void => {
    if (params.severity !== undefined) {
      setSnackbarSeverity(params.severity);
    }
    if (params.message !== undefined) {
      setSnackbarMessage(params.message);
    }
    if (params.open !== undefined) {
      setSnackbarOpen(params.open);
    }
    if (params.disableAutoHide !== undefined) {
      setDisableAutoHide(params.disableAutoHide);
    }
  }, []);

  const successSnackbar = React.useCallback((message, options): void => {
    updateSnackbar({
      severity: 'success',
      message: message,
      open: true,
      disableAutoHide: options?.disableAutoHide,
    });
  }, []);

  const errorSnackbar: Snackbar['errorSnackbar'] = React.useCallback((options): void => {
    const body = options?.message || DEFAULT_ERROR_MESSSAGE;

    const message =
      !React.isValidElement(body) && options?.title
        ? `${options.title}:

${body}`
        : body;
    updateSnackbar({
      severity: 'error',
      message,
      open: true,
    });
  }, []);

  const warningSnackbar = React.useCallback((message: string = DEFAULT_ERROR_MESSSAGE): void => {
    updateSnackbar({
      severity: 'warning',
      message: message,
      open: true,
    });
  }, []);

  const closeSnackbar = React.useCallback((): void => updateSnackbar({ open: false, disableAutoHide: false }), []);

  return {
    severity,
    message,
    open,
    disableAutoHide,
    updateSnackbar,
    errorSnackbar,
    successSnackbar,
    warningSnackbar,
    closeSnackbar,
  };
};

export const Snackbar: React.FC<Snackbar> = props => {
  const classes = useStyles({});

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    props.closeSnackbar();
  };

  return (
    <MuiSnackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={props.open}
      data-testid={dataTestIds.snackbar}
      onClose={handleClose}
      autoHideDuration={props.severity === 'error' || props.disableAutoHide ? null : AUTO_HIDE_DURATION_MS}
    >
      <MuiAlert
        className={classes.alert}
        variant="filled"
        severity={props.severity}
        data-testid={dataTestIds.alert}
        onClose={handleClose}
      >
        {typeof props.message === 'string' ? <MarkdownExtended>{props.message}</MarkdownExtended> : props.message}
      </MuiAlert>
    </MuiSnackbar>
  );
};
