import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { handleAgGridCsvDownload, HandleAgGridCsvDownload } from '@plentyag/core/src/ag-grid/utils';
import React from 'react';

import { ActionStatus, ContainerActionResult } from '../../types';

import { agGridConfig } from './ag-grid-config';
import { useStyles } from './styles';

const dataTestIds = {
  numSuccesses: 'bulk-actions-results-num-successes',
  numFailures: 'bulk-actions-results-num-failures',
  downloadAll: 'bulk-actions-results-download-all',
  downloadFailures: 'bulk-actions-results-download-failures',
  close: 'bulk-actions-results-close',
};

export { dataTestIds as dataTestIdsDialogActionResults };

interface DialogActionResults {
  action: ProdActions.Operation;
  containers: ContainerActionResult[];
  onClose: () => void;
}

export const DialogActionResults: React.FC<DialogActionResults> = ({ action, containers, onClose }) => {
  const classes = useStyles();

  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);

  function handleClose() {
    onClose();
  }

  const numSuccess = containers.filter(container => container.status === ActionStatus.success).length;
  const numFailed = containers.length - numSuccess;

  const shouldRowBeSkipped: HandleAgGridCsvDownload['shouldRowBeSkipped'] = params => {
    return params?.node?.data['status'] !== ActionStatus.fail;
  };

  const actionNameParts = action.path.split('/');
  const actionName = actionNameParts[actionNameParts.length - 1];
  return (
    <Dialog fullWidth={true} maxWidth="lg" open>
      <DialogTitle>
        {actionName + ' Bulk Action Results'}
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography data-testid={dataTestIds.numSuccesses}>Number of successes: {numSuccess}</Typography>
            <Typography data-testid={dataTestIds.numFailures}>Number of failures: {numFailed}</Typography>
          </Box>
          <Box>
            <Button
              data-testid={dataTestIds.downloadAll}
              className={classes.downloadButton}
              variant="contained"
              color="default"
              onClick={() =>
                handleAgGridCsvDownload({
                  gridReadyEvent,
                  fileNamePrefix: `bulk-action-${actionName}-all-results`,
                  fileNameSuffix: '',
                })
              }
            >
              Download All
            </Button>
            <Button
              data-testid={dataTestIds.downloadFailures}
              disabled={numFailed === 0}
              className={classes.downloadButton}
              variant="contained"
              color="default"
              onClick={() =>
                handleAgGridCsvDownload({
                  gridReadyEvent,
                  fileNamePrefix: `bulk-action-${actionName}-failed-results`,
                  fileNameSuffix: '',
                  shouldRowBeSkipped,
                })
              }
            >
              Download Failed
            </Button>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <BaseAgGridClientSideTable
          agGridConfig={agGridConfig(containers)}
          onGridReady={setGridReadyEvent}
          updateFilterAndSortQueryParameters={false}
        />
      </DialogContent>

      <DialogActions>
        <Button data-testid={dataTestIds.close} onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
