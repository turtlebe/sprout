import React from 'react';

interface OpenDialogOptions {
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface DialogConfirmationProxyReadyEvent {
  api: {
    isOpen: boolean;
    openDialog: (options?: OpenDialogOptions) => void;
  };
}

interface UseDialogConfirmationProxyReadyEvent {
  open?: boolean;
}

interface UseDialogConfirmationProxyReturn {
  dialogConfirmationReadyEvent: DialogConfirmationProxyReadyEvent;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export function useDialogConfirmationProxyReadyEvent(
  props: UseDialogConfirmationProxyReadyEvent = {}
): UseDialogConfirmationProxyReturn {
  const [isOpen, setIsOpen] = React.useState<boolean>(props.open ?? false);
  const [onConfirmCallback, setOnConfirmCallback] = React.useState<() => void>(null);
  const [onCancelCallback, setOnCancelCallback] = React.useState<() => void>(null);

  /**
   * Shows the dialog and records confirm and cancel callbacks.
   */
  const handleOpenDialog = React.useCallback((options = {}) => {
    setIsOpen(true);
    if (options.onConfirm) {
      setOnConfirmCallback(() => options.onConfirm);
    }
    if (options.onCancel) {
      setOnCancelCallback(() => options.onCancel);
    }
  }, []);

  /**
   * Closes the dialog.
   */
  const handleCloseDialog = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Closes the dialog and calls the confirm callback.
   */
  const handleConfirm = React.useCallback(() => {
    handleCloseDialog();
    onConfirmCallback && onConfirmCallback();
  }, [onConfirmCallback]);

  /**
   * Closes the dialog and calls the cancel callback.
   */
  const handleCancel = React.useCallback(() => {
    handleCloseDialog();
    onCancelCallback && onCancelCallback();
  }, [onCancelCallback]);

  return {
    dialogConfirmationReadyEvent: {
      api: {
        isOpen,
        openDialog: handleOpenDialog,
      },
    },
    handleConfirm,
    handleCancel,
  };
}
