import { BaseExportParams, GridReadyEvent } from '@ag-grid-community/all-modules';
import { GetApp } from '@material-ui/icons';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { handleAgGridCsvDownload } from '@plentyag/core/src/ag-grid/utils';
import React from 'react';

const dataTestIds = {
  downloadButton: 'download-button',
};

export { dataTestIds as dataTestIdsDownloadButton };

export interface DownloadTableButton {
  tableName: string;
  gridReadyEvent: GridReadyEvent;
  columnsToDownload?: BaseExportParams['columnKeys'];
  disabled?: boolean;
}

export const DownloadTableButton: React.FC<DownloadTableButton> = ({
  tableName,
  columnsToDownload,
  disabled,
  gridReadyEvent,
}) => {
  return (
    <Button
      data-testid={dataTestIds.downloadButton}
      startIcon={<GetApp />}
      variant="contained"
      color="default"
      disabled={disabled}
      onClick={() =>
        handleAgGridCsvDownload({ gridReadyEvent, fileNamePrefix: `${tableName}-table`, columnsToDownload })
      }
    >
      Download
    </Button>
  );
};
