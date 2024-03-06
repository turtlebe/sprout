import { getMeasurementTypeLabel } from '@plentyag/app-environment/src/common/utils';
import { PATHS } from '@plentyag/app-environment/src/paths';
import { AppBreadcrumbs, AppHeader } from '@plentyag/brand-ui/src/components';
import { Box, Chip, CircularProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { Metric } from '@plentyag/core/src/types/environment';
import { getShortenedPath } from '@plentyag/core/src/utils';
import React from 'react';

import { ButtonFavoriteMetric } from '..';

const dataTestIds = {
  description: 'header-metric-description',
  loader: 'header-metric-description-loader',
};

export { dataTestIds as dataTestIdsHeaderMetric };

export interface HeaderMetric {
  metric: Metric;
  isLoading: boolean;
}

/**
 * Display basic information about the Metric and render children within this header.
 */
export const HeaderMetric: React.FC<HeaderMetric> = ({ metric, children, isLoading }) => {
  return (
    <AppHeader flexDirection="column">
      <AppBreadcrumbs
        homePageRoute={PATHS.metricsPage}
        homePageName="Metrics"
        pageName={isLoading ? '--' : metric?.id}
        marginLeft="0.75rem"
      />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <ButtonFavoriteMetric metric={metric} />
          {isLoading ? (
            <CircularProgress size="12px" data-testid={dataTestIds.loader} />
          ) : (
            <>
              <Typography variant="h5" data-testid={dataTestIds.description}>
                {getMeasurementTypeLabel(metric?.measurementType)} - {metric?.observationName}
              </Typography>
              <Box padding={1} />
              <Chip color="primary" label={getShortenedPath(metric?.path)} />
            </>
          )}
        </Box>
      </Box>
      {children}
    </AppHeader>
  );
};
