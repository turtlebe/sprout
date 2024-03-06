import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { AppBreadcrumbs, AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { Metric } from '@plentyag/core/src/types/environment';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { PATHS } from '../paths';

import {
  ButtonCreateMetric,
  ButtonDeleteMetric,
  ButtonEditMetric,
  DropdownMetricsActions,
  MetricsTable,
} from './components';

const dataTestIds = {
  addMetric: 'metrics-page-add-metric',
};

export { dataTestIds as dataTestIdsMetricsPage };

export const MetricsPage: React.FC<RouteComponentProps> = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [metricsCount, setMetricsCount] = React.useState<number>(null);
  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);
  const [selectedMetrics, setSelectedMetrics] = React.useState<Metric[]>([]);

  const handleSuccess = () => {
    gridReadyEvent.api.refreshServerSideStore({ purge: true });
    gridReadyEvent.api.deselectAll();
  };
  const handleSelectionChanged: MetricsTable['onSelectionChanged'] = () => {
    setSelectedMetrics(gridReadyEvent.api.getSelectedRows());
  };
  const handleDatasourceSuccess: MetricsTable['onDatasourceSuccess'] = result => {
    setMetricsCount(result.meta.total);
  };

  return (
    <AppLayout isLoading={isLoading}>
      <AppHeader>
        <AppBreadcrumbs
          homePageRoute={PATHS.metricsPage}
          homePageName={metricsCount ? `Metrics (${metricsCount})` : 'Metrics'}
          marginLeft="0.75rem"
        />
        <Box display="flex">
          <DropdownMetricsActions metrics={selectedMetrics} onSuccess={handleSuccess} />
          <Box paddingLeft="0.5rem" />
          <ButtonDeleteMetric onSuccess={handleSuccess} metrics={selectedMetrics} />
          <Box paddingLeft="0.5rem" />
          <ButtonEditMetric
            onSuccess={handleSuccess}
            metric={selectedMetrics[0]}
            disabled={selectedMetrics.length !== 1}
          />
          <Box paddingLeft="0.5rem" />
          <ButtonCreateMetric onSuccess={handleSuccess} />
        </Box>
      </AppHeader>

      <MetricsTable
        onIsLoading={setIsLoading}
        onGridReady={setGridReadyEvent}
        onSelectionChanged={handleSelectionChanged}
        onDatasourceSuccess={handleDatasourceSuccess}
      />
    </AppLayout>
  );
};
