import { EVS_URLS } from '@plentyag/app-environment/src/common/utils/';
import { BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components';
import React from 'react';

import { useSchedulesAgGridConfig } from './hooks';

const dataTestIds = {
  loader: 'schedules-table-loader',
};

export { dataTestIds as dataTestIdsSchedulesTable };

export interface SchedulesTable {
  onIsLoading: BaseAgGridInfiniteTable['onIsLoading'];
  onGridReady: BaseAgGridInfiniteTable['onGridReady'];
  onSelectionChanged: BaseAgGridInfiniteTable['onSelectionChanged'];
  onDatasourceSuccess: BaseAgGridInfiniteTable['onDatasourceSuccess'];
}

/**
 * AgGrid Table that renders a paginated list of Schedules.
 */
export const SchedulesTable: React.FC<SchedulesTable> = ({
  onIsLoading,
  onGridReady,
  onSelectionChanged,
  onDatasourceSuccess,
}) => {
  const { config } = useSchedulesAgGridConfig();

  return (
    <BaseAgGridInfiniteTable
      agGridConfig={config}
      onIsLoading={onIsLoading}
      onGridReady={onGridReady}
      onSelectionChanged={onSelectionChanged}
      onDatasourceSuccess={onDatasourceSuccess}
      url={EVS_URLS.schedules.searchUrl()}
      requestMethod="POST"
    />
  );
};
