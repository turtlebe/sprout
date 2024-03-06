import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { DownloadButton } from '../table-renderers/download-button';

import { saveAndPrintFlow } from './save-and-print-flow';

export type SaveResult = 'saved' | 'save-failed';

export interface SavePrintDialog {
  statusTitle?: string;
  status?: React.ReactNode;
  open: boolean;
  onClose?: () => void;
  onPrint?: () => void;
  enableClose?: boolean;
  enablePrint?: boolean;
  submissionFormData?: { metadata: LT.DownloadMetadata; labProvider: string };
}

export function useSavePrintDialog() {
  const [savePrintDialogStatus, setSavePrintStatusDialog] = React.useState<SavePrintDialog>({
    open: false,
    enableClose: false,
    enablePrint: false,
  });

  async function doSave(items: LT.CreateItem[], isEdit: boolean) {
    return new Promise<SaveResult>(async resolve => {
      await saveAndPrintFlow({
        itemsToSave: items,
        isEdit,
        setModalStatus: setSavePrintStatusDialog,
        done: (saved: boolean) => {
          resolve(saved ? 'saved' : 'save-failed');
        },
      });
    });
  }

  const save = React.useCallback(
    async (items: LT.CreateItem[], isEdit): Promise<SaveResult> => doSave(items, isEdit),
    []
  );

  return { savePrintDialogStatus, save };
}
export const SavePrintDialog: React.FC<SavePrintDialog> = props => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  return (
    <Dialog ref={containerRef} fullWidth={true} maxWidth="sm" open={props.open} onClose={props.onClose}>
      <DialogTitle>{props.statusTitle || ''}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.status}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {props.submissionFormData && containerRef && (
          <Box flex="1 1" ml={2}>
            <DownloadButton
              downloadMetaData={[props.submissionFormData.metadata]}
              containerRef={containerRef}
              buttonText={`Download ${props.submissionFormData.labProvider} Submission Form`}
            />
          </Box>
        )}
        <Button disabled={!props.enablePrint} onClick={props.onPrint} color="primary">
          Print
        </Button>
        <Button disabled={!props.enableClose} onClick={props.onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
