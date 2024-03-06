import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  loader: 'table-metrics-label-loader',
};

export { dataTestIds as dataTestIdsTabMetricsLabel };

export interface TabMetricsLabel {
  isLoading: boolean;
}

export const TabMetricsLabel: React.FC<TabMetricsLabel> = ({ isLoading }) => {
  return isLoading ? (
    <Box display="flex" alignItems="center">
      Metrics&nbsp;
      <CircularProgress size="12px" data-testid={dataTestIds.loader} />
    </Box>
  ) : (
    <>Metrics</>
  );
};
