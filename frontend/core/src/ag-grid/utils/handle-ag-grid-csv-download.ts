import { BaseExportParams, GridReadyEvent, ProcessCellForExportParams } from '@ag-grid-community/all-modules';

export interface HandleAgGridCsvDownload {
  gridReadyEvent: GridReadyEvent;
  fileNamePrefix: string;
  fileNameSuffix?: string;
  processCellCallback?: (params: ProcessCellForExportParams) => string;
  shouldRowBeSkipped?: BaseExportParams['shouldRowBeSkipped'];
  columnsToDownload?: BaseExportParams['columnKeys'];
  onlySelected?: BaseExportParams['onlySelected'];
}

export function handleAgGridCsvDownload({
  gridReadyEvent,
  fileNamePrefix,
  fileNameSuffix,
  processCellCallback,
  shouldRowBeSkipped,
  columnsToDownload,
  onlySelected,
}: HandleAgGridCsvDownload) {
  const _fileNameSuffix = fileNameSuffix || window.location.search.replace('?', '-').replace(/&/g, '_');
  gridReadyEvent?.api.exportDataAsCsv({
    fileName: `${fileNamePrefix}${_fileNameSuffix}.csv`,
    processCellCallback,
    shouldRowBeSkipped,
    onlySelected,
    columnKeys: columnsToDownload,
  });
}
