import { Show } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { ObservationStats } from '@plentyag/core/src/types';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import { isNumber } from 'lodash';
import React from 'react';

export interface ObservationStatistics {
  observationStats: ObservationStats;
  unitSymbol: string;
  isLoading: boolean;
  'data-testid'?: string;
}

const dataTestIds = getScopedDataTestIds(
  {
    count: 'count',
    max: 'max',
    min: 'min',
    mean: 'mean',
    median: 'median',
    range: 'range',
    stddev: 'stddev',
    loader: 'loader',
  },
  'ObservationStatistics'
);

export { dataTestIds as dataTestIdsObservationStatistics };

export const getObservationStatisticsDataTestIds = prefix => getScopedDataTestIds(dataTestIds, prefix);

export const ObservationStatistics: React.FC<ObservationStatistics> = ({
  observationStats,
  unitSymbol,
  isLoading,
  'data-testid': dataTestId,
}) => {
  const _dataTestIds = getObservationStatisticsDataTestIds(dataTestId);

  function format(value: number, isCount = false): string {
    if (!isNumber(value) || isNaN(value) || isLoading) {
      return '--';
    }

    return isCount ? value.toString() : `${value.toFixed(2)} ${unitSymbol}`;
  }

  return (
    <Box data-testid={_dataTestIds.root} display="flex" gridGap="0.5rem">
      <Box data-testid={_dataTestIds.min}>Min: {format(observationStats?.min)},</Box>
      <Box data-testid={_dataTestIds.max}>Max: {format(observationStats?.max)},</Box>
      <Box data-testid={_dataTestIds.range}>Range: {format(observationStats?.max - observationStats?.min)},</Box>
      <Box data-testid={_dataTestIds.median}>Median: {format(observationStats?.median)},</Box>
      <Box data-testid={_dataTestIds.mean}>Mean: {format(observationStats?.mean)},</Box>
      <Box data-testid={_dataTestIds.stddev}>Std Dev: {format(observationStats?.stddev)}</Box>
      <Box data-testid={_dataTestIds.count}>Count: {format(observationStats?.count, true)}</Box>
      <Show when={isLoading}>
        <CircularProgress size="1rem" data-testid={_dataTestIds.loader} />
      </Show>
    </Box>
  );
};
