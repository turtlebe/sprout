import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { GetApp } from '@material-ui/icons';
import { BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components';
import { Button, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { getSortFilterServerParams as defaultGetSortFilterServerParams } from '@plentyag/core/src/ag-grid/helpers';
import { defaultProcessCellCallback, handleAgGridCsvDownload } from '@plentyag/core/src/ag-grid/utils';
import { useUnpaginate } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils';
import { reduce } from 'lodash';
import React from 'react';

import { useGlobalSnackbar } from '../global-snackbar';

import { CsvDownload } from './components/csv-download';

const dataTestIds = {
  button: 'button-csv-download-infinite',
};

export { dataTestIds as dataTestIdsButtonCsvDownloadInfinite };

export interface ButtonCsvDownloadInfinite {
  serviceName: string;
  apiName?: string;
  operation: string;
  fileNamePrefix: string;
  gridReadyEvent: GridReadyEvent;
  agGridConfig: BaseAgGridInfiniteTable['agGridConfig'];
  'data-testid'?: string;
}

/**
 * Button that downloads AgGrid content.
 *
 * AgGrid does not support downloading the entire data when using their Row Infinite Model.
 *
 * This button compensate this lacking feature.
 *
 * For a given AgGrid config, if no rows are selected in AgGrid, we will use the `unpaginate` endpoint fetch all the
 * data and download it with `react-csv`.
 */
export const ButtonCsvDownloadInfinite: React.FC<ButtonCsvDownloadInfinite> = ({
  serviceName,
  apiName,
  operation,
  fileNamePrefix,
  gridReadyEvent,
  agGridConfig,
  'data-testid': dataTestId,
}) => {
  const [csvData, setCsvData] = React.useState<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { makeRequest } = useUnpaginate<any[]>({ serviceName, apiName, operation });
  const fileNameSuffix = window.location.search.replace('?', '-').replace(/&/g, '_');
  const filename = `${fileNamePrefix}-${fileNameSuffix}.csv`;
  const snackbar = useGlobalSnackbar();

  const downloadSelectedRowsThroughAgGrid = () => {
    handleAgGridCsvDownload({
      gridReadyEvent,
      fileNamePrefix,
      onlySelected: true,
      processCellCallback: defaultProcessCellCallback,
    });
  };

  const downloadAllRows = () => {
    const sortFilterServerParams = agGridConfig.getSortFilterServerParams ?? defaultGetSortFilterServerParams;
    const data = sortFilterServerParams({
      sortModel: gridReadyEvent.api.getSortModel(),
      filterModel: gridReadyEvent.api.getFilterModel(),
      columnDefs: gridReadyEvent.api.getColumnDefs(),
    });

    setIsLoading(true);

    void makeRequest({
      data,
      onSuccess: response => {
        const colDefs = gridReadyEvent.columnApi.getAllColumns().map(col => col.getColDef());
        const formattedCsvData = response.map(item => {
          return reduce(
            colDefs,
            (result, colDef) => {
              if (colDef.valueFormatter && typeof colDef.valueFormatter !== 'string') {
                result[colDef.field] = colDef.valueFormatter({
                  api: gridReadyEvent.api,
                  colDef,
                  columnApi: gridReadyEvent.columnApi,
                  data: item,
                  value: item[colDef.field],
                  column: null,
                  context: null,
                  node: null,
                });
              } else {
                result[colDef.field] = item[colDef.field];
              }
              return result;
            },
            {}
          );
        });
        setCsvData(formattedCsvData);
        setIsLoading(false);
      },
      onError: response => {
        setIsLoading(false);
        const message = parseErrorMessage(response);
        snackbar.errorSnackbar({ message });
      },
    });
  };

  const handleDownload = () => {
    if (gridReadyEvent.api.getSelectedRows().length > 0) {
      downloadSelectedRowsThroughAgGrid();
    } else {
      downloadAllRows();
    }
  };

  // This unmount the CSVDownload component and reset the cycle to re-download the data.
  React.useEffect(() => {
    setCsvData(undefined);
  }, [csvData]);

  return (
    <>
      <Button
        variant="contained"
        color="default"
        onClick={handleDownload}
        startIcon={isLoading ? <CircularProgress size="12px" /> : <GetApp />}
        data-testid={dataTestId || dataTestIds.button}
        disabled={isLoading}
      >
        Download
      </Button>
      {csvData && <CsvDownload data={csvData} filename={filename} />}
    </>
  );
};
