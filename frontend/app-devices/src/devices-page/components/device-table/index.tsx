import { BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components/base-ag-grid-table';
import React from 'react';

import { useAgGridConfig } from './hooks';

export interface DeviceTable {
  onIsLoading: BaseAgGridInfiniteTable['onIsLoading'];
  onSelectionChanged: BaseAgGridInfiniteTable['onSelectionChanged'];
  onGridReady: BaseAgGridInfiniteTable['onGridReady'];
  onDatasourceSuccess: BaseAgGridInfiniteTable['onDatasourceSuccess'];
}

const SEARCH_DEVICES_URL = '/api/plentyservice/farm-def-service/search-devices-by';

export const DeviceTable: React.FC<DeviceTable> = ({
  onIsLoading,
  onSelectionChanged,
  onGridReady,
  onDatasourceSuccess,
}) => {
  const { isValidating, config: deviceTableAgGridConfig } = useAgGridConfig();

  // Waiting on filters (containing dynamic device types) to resolve from useAgGridConfig.
  // this can be remove once we upgrade AgGrid's version and have more fine control when filters change values
  // see https://www.ag-grid.com/javascript-grid/filter-set-filter-list#refreshing-values
  if (isValidating) {
    return null;
  }

  return (
    <BaseAgGridInfiniteTable
      agGridConfig={deviceTableAgGridConfig}
      url={SEARCH_DEVICES_URL}
      requestMethod="POST"
      onIsLoading={onIsLoading}
      onSelectionChanged={onSelectionChanged}
      onGridReady={onGridReady}
      onDatasourceSuccess={onDatasourceSuccess}
    />
  );
};
