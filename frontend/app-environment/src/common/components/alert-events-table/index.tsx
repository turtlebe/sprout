import { useAlertEventsAgGridConfig } from '@plentyag/app-environment/src/common/hooks';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components';
import React from 'react';

export interface AlertEventsTable {
  onIsLoading: BaseAgGridInfiniteTable['onIsLoading'];
  onDatasourceSuccess: BaseAgGridInfiniteTable['onDatasourceSuccess'];
  onGridReady?: BaseAgGridInfiniteTable['onGridReady'];
  activeOnly?: boolean;
  startDateTime?: Date;
  endDateTime?: Date;
}

/**
 * AgGrid Table rendering infinite list of AlertEvents.
 */
export const AlertEventsTable: React.FC<AlertEventsTable> = ({
  onIsLoading,
  onDatasourceSuccess,
  onGridReady = () => {},
  activeOnly = false,
  startDateTime,
  endDateTime,
}) => {
  const { config } = useAlertEventsAgGridConfig({ startDateTime, endDateTime });

  return (
    <BaseAgGridInfiniteTable
      agGridConfig={config}
      onGridReady={onGridReady}
      onIsLoading={onIsLoading}
      onDatasourceSuccess={onDatasourceSuccess}
      url={EVS_URLS.alertEvents.searchUrl()}
      requestMethod="POST"
      extraData={{ includeAlertRule: true, includeMetric: true, activeOnly }}
      enableAutoUpdateDataSource
    />
  );
};
