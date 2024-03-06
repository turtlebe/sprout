import React from 'react';

import { DialogConfirmation } from '../dialog-confirmation';

import {
  DialogConfirmationProxyReadyEvent,
  useDialogConfirmationProxyReadyEvent,
} from './hooks/use-dialog-confirmation-proxy-ready-event';

export * from './hooks/use-dialog-confirmation-proxy-ready-event';

export { dataTestIdsDialogConfirmation as dataTestIdsDialogConfirmationProxy } from '../dialog-confirmation';

export interface DialogConfirmationProxy {
  open?: boolean;
  title: string;
  onDialogConfirmationReady: (dialogConfirmationReadyEvent: DialogConfirmationProxyReadyEvent) => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const DialogConfirmationProxy: React.FC<DialogConfirmationProxy> = props => {
  const { dialogConfirmationReadyEvent, handleCancel, handleConfirm } = useDialogConfirmationProxyReadyEvent({
    open: props.open,
  });

  React.useEffect(() => {
    props.onDialogConfirmationReady(dialogConfirmationReadyEvent);
  }, []);

  return (
    <DialogConfirmation
      title={props.title}
      open={dialogConfirmationReadyEvent.api.isOpen}
      cancelLabel={props.cancelLabel}
      confirmLabel={props.confirmLabel}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      {props.children}
    </DialogConfirmation>
  );
};
