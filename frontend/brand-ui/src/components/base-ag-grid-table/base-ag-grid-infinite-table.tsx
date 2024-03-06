import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { useAgGridDatasource, UseAgGridDatasource } from '@plentyag/core/src/ag-grid/hooks';
import { AgGridConfig } from '@plentyag/core/src/ag-grid/types';
import React from 'react';

import { BaseAgGridTable } from './base-ag-grid-table';

export type BaseAgGridInfiniteTable = Omit<BaseAgGridTable, 'agGridConfig'> & {
  agGridConfig: Omit<AgGridConfig, 'rowData' | 'rowModelType'>;
  onIsLoading?: UseAgGridDatasource['onIsLoading'];
  onDatasourceSuccess?: UseAgGridDatasource['onDatasourceSuccess'];
  url: UseAgGridDatasource['url'];
  requestMethod?: UseAgGridDatasource['requestMethod'];
  keepQueryParams?: UseAgGridDatasource['keepQueryParams'];
  persistFilterAndSortModelsInLocalStorage?: UseAgGridDatasource['persistFilterAndSortModelsInLocalStorage'];
  extraData?: UseAgGridDatasource['extraData'];
  enableAutoUpdateDataSource?: boolean;
};

/**
 * Uses ag-grid's 'infinite' data model to populate the grid. As such the url
 * parameter must be provided pointing the pagination api.
 * @param agGridConfig The grid configuration.
 * @param onSelectionChanged Callback when selection is changed in the grid.
 * @param onGridReady Callback when the grid api is ready.
 * @param onIsLoading Callback when the pagination api is loading data.
 * @param url The url pointing to the pagination api.
 * @param requestMethod The method type used when calling the pagination api.
 * @param keepQueryParams Optional list of query parameters names that are not touched by this component.
 * @param persistFilterAndSortModelsInLocalStorage Optional (default: true). If true then filtering/sorting values
 *  will be saved in localstorage. So coming back to page with empty query parameters will
 *  restore filtering/sorting from localstorage.
 * @param enableAutoSizeAllColumns If set true, the ag-grid columns will be auto sized (default is true).
 */
export const BaseAgGridInfiniteTable: React.FC<BaseAgGridInfiniteTable> = ({
  agGridConfig,
  onSelectionChanged,
  onGridReady,
  onIsLoading,
  onDatasourceSuccess,
  url,
  requestMethod,
  keepQueryParams,
  persistFilterAndSortModelsInLocalStorage = true,
  enableAutoSizeAllColumns = true,
  enableAutoUpdateDataSource,
  extraData,
}) => {
  const { getSortFilterServerParams: getSortFilterServerParams } = agGridConfig;
  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);

  const datasource = useAgGridDatasource({
    columnDefs: agGridConfig.columnDefs,
    onIsLoading,
    onDatasourceSuccess,
    url,
    requestMethod,
    getSortFilterServerParams,
    keepQueryParams,
    persistFilterAndSortModelsInLocalStorage,
    extraData,
  });

  const handleGridReady: BaseAgGridTable['onGridReady'] = event => {
    onGridReady && onGridReady(event);
    setGridReadyEvent(event);
    event.api.setServerSideDatasource(datasource);
  };

  const infiniteRowAgGridConfig: BaseAgGridTable['agGridConfig'] = {
    ...agGridConfig,
    rowModelType: 'serverSide',
    serverSideStoreType: 'partial',
  };

  React.useEffect(() => {
    if (enableAutoUpdateDataSource && gridReadyEvent?.api) {
      // re-set dataSource when getSortFilterServerParams changes.
      gridReadyEvent.api.setServerSideDatasource(datasource);
    }
  }, [enableAutoUpdateDataSource, getSortFilterServerParams]);

  return (
    <BaseAgGridTable
      agGridConfig={infiniteRowAgGridConfig}
      onSelectionChanged={onSelectionChanged}
      onGridReady={handleGridReady}
      persistFilterAndSortModelsInLocalStorage={persistFilterAndSortModelsInLocalStorage}
      enableAutoSizeAllColumns={enableAutoSizeAllColumns}
    />
  );
};
