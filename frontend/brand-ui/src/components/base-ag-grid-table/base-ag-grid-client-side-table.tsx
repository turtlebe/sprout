import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { getSortFilterQueryParams, updateUrlQueryParams } from '@plentyag/core/src/ag-grid/helpers';
import { useLocalStorageQueryParams } from '@plentyag/core/src/ag-grid/hooks';
import { AgGridConfig } from '@plentyag/core/src/ag-grid/types';
import { getSortModel } from '@plentyag/core/src/ag-grid/utils';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { BaseAgGridTable } from './base-ag-grid-table';
export type BaseAgGridClientSideTable = Omit<BaseAgGridTable, 'agGridConfig'> & {
  agGridConfig: Omit<AgGridConfig, 'cacheBlockSize' | 'rowModelType' | 'datasource'>;
  keepQueryParams?: string[];
  persistFilterAndSortModelsInLocalStorage?: boolean;
  updateFilterAndSortQueryParameters?: boolean;
  enableAutoSizeAllColumns?: boolean;
};

/**
 * Uses ag-grid's 'clientSide' data model to populate the grid. As such 'rowData' must
 * be provided in agGridConfig to set the data model.
 * @param agGridConfig The grid configuration.
 * @param onSelectionChanged Callback when selection is changed in the grid.
 * @param onGridReady Callback when the grid api is ready.
 * @param keepQueryParams Optional list of query parameters are not touched by this component.
 * @param persistFilterAndSortModelsInLocalStorage Optional (default: true). If true then filtering/sorting values
 *  will be saved in localstorage. So coming back to page with empty query parameters will
 *  restore filtering/sorting from localstorage.
 * @param updateFilterAndSortQueryParameters If set true (default) then any changes to sorting or filtering will
 * update query parameters.
 * @param enableAutoSizeAllColumns If set true, the ag-grid columns will be auto sized (default is true).
 */
export const BaseAgGridClientSideTable: React.FC<BaseAgGridClientSideTable> = ({
  agGridConfig,
  onSelectionChanged,
  onGridReady,
  keepQueryParams,
  persistFilterAndSortModelsInLocalStorage = true,
  updateFilterAndSortQueryParameters = true,
  enableAutoSizeAllColumns = true,
}) => {
  const history = useHistory();
  const [, setLocalStorageQueryParams] = useLocalStorageQueryParams();

  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);

  const handleGridReady: BaseAgGridTable['onGridReady'] = event => {
    setGridReadyEvent(event);
    onGridReady && onGridReady(event);
  };

  React.useEffect(() => {
    if (gridReadyEvent) {
      function handleSortOrFilterModelChanged() {
        if (updateFilterAndSortQueryParameters) {
          const queryParams = getSortFilterQueryParams({
            filterModel: gridReadyEvent.api.getFilterModel(),
            sortModel: getSortModel(gridReadyEvent.columnApi),
            columnDefs: agGridConfig.columnDefs,
          });
          updateUrlQueryParams({
            history,
            newQueryParams: queryParams,
            keepQueryParams,
          });
          persistFilterAndSortModelsInLocalStorage && setLocalStorageQueryParams(queryParams);
        }
      }

      gridReadyEvent.api.addEventListener('sortChanged', handleSortOrFilterModelChanged);
      gridReadyEvent.api.addEventListener('filterChanged', handleSortOrFilterModelChanged);

      return () => {
        gridReadyEvent.api.removeEventListener('sortChanged', handleSortOrFilterModelChanged);
        gridReadyEvent.api.removeEventListener('filterChanged', handleSortOrFilterModelChanged);
      };
    }
  }, [gridReadyEvent]);

  const clientSideAgGridConfig: BaseAgGridTable['agGridConfig'] = {
    ...agGridConfig,
    rowModelType: 'clientSide',
  };

  return (
    <BaseAgGridTable
      agGridConfig={clientSideAgGridConfig}
      onSelectionChanged={onSelectionChanged}
      onGridReady={handleGridReady}
      persistFilterAndSortModelsInLocalStorage={persistFilterAndSortModelsInLocalStorage}
      enableAutoSizeAllColumns={enableAutoSizeAllColumns}
    />
  );
};
