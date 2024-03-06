import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { AgGridReact, AgGridReactProps } from '@ag-grid-community/react';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { getFilterModelFromQueryParams, getSortModelFromQueryParams } from '@plentyag/core/src/ag-grid/helpers';
import { useLocalStorageQueryParams } from '@plentyag/core/src/ag-grid/hooks';
import { AgGridConfig } from '@plentyag/core/src/ag-grid/types';
import { setSortModel } from '@plentyag/core/src/ag-grid/utils';
import { useQueryParam } from '@plentyag/core/src/hooks/use-query-param';
import React from 'react';

import { useStyles } from './styles';

export interface BaseAgGridTable {
  agGridConfig: AgGridConfig;
  onSelectionChanged?: AgGridReactProps['onSelectionChanged'];
  onGridReady?: AgGridReactProps['onGridReady'];
  persistFilterAndSortModelsInLocalStorage?: boolean;
  enableAutoSizeAllColumns?: boolean;
}

export const BaseAgGridTable: React.FC<BaseAgGridTable> = ({
  agGridConfig,
  onSelectionChanged,
  onGridReady,
  persistFilterAndSortModelsInLocalStorage,
  enableAutoSizeAllColumns = true,
}) => {
  // hooks
  const urlQueryParams = useQueryParam();
  const [localStorageQueryParams] = useLocalStorageQueryParams();

  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);

  // styles
  useStyles({});

  // handlers
  const handleGridReady: AgGridReactProps['onGridReady'] = event => {
    setGridReadyEvent(event);
    onGridReady && onGridReady(event);
  };
  const resizeAllColumns: AgGridReactProps['onPaginationChanged'] = () => {
    if (enableAutoSizeAllColumns) {
      gridReadyEvent?.columnApi.autoSizeAllColumns(false);
    }
  };

  // When gridReadEvent is defined, restore SortModel and FilterModel from query parameters
  React.useEffect(() => {
    if (gridReadyEvent) {
      const queryParams =
        urlQueryParams.toString() === ''
          ? new URLSearchParams(persistFilterAndSortModelsInLocalStorage ? localStorageQueryParams : '')
          : urlQueryParams;

      const columnDefs = gridReadyEvent.columnApi.getAllColumns().map(col => col.getColDef());

      setSortModel(getSortModelFromQueryParams(queryParams, columnDefs), gridReadyEvent.columnApi);

      gridReadyEvent.api.setFilterModel(getFilterModelFromQueryParams(queryParams, columnDefs));
    }
  }, [gridReadyEvent]);

  return (
    <Box display="flex" flexDirection="column" overflow="hidden" height="100%" flex={'1 1 auto'} p={2}>
      <div className="ag-theme-balham" style={{ width: '100%', height: '100%' }}>
        <AgGridReact
          {...agGridConfig}
          onGridReady={handleGridReady}
          onPaginationChanged={resizeAllColumns}
          onSelectionChanged={onSelectionChanged}
        />
      </div>
    </Box>
  );
};
