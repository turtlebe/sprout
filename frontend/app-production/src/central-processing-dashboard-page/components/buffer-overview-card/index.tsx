import { BufferState } from '@plentyag/app-production/src/central-processing-dashboard-page/types/buffer-state';
import { RefreshButton } from '@plentyag/brand-ui/src/components';
import { Card, CardContent, CardHeader, LinearProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { useLogAxiosErrorInSnackbar, useRunActionPeriodicallyWhenVisible, useSwrAxios } from '@plentyag/core/src/hooks';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { BufferCarriersTable } from '../buffer-carriers-table';

import { useStyles } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    table: 'table',
    title: 'title',
  },
  'BufferOverviewCard'
);

export { dataTestIds as dataTestIdsBufferOverviewCard };

export interface BufferOverviewCard {
  'data-testid'?: string;
  refreshIntervalInMs: number;
  apiUrl: string;
  title: string;
}

/**
 * This card displays an overview of table of carriers.
 */
export const BufferOverviewCard: React.FC<BufferOverviewCard> = ({
  'data-testid': rootDataTestId = dataTestIds.root,
  refreshIntervalInMs,
  apiUrl,
  title,
}) => {
  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<string>(new Date().toISOString());

  const {
    data: seedlingBuffer,
    isValidating: isLoading,
    revalidate,
    error,
  } = useSwrAxios<BufferState[]>({ url: apiUrl });

  useLogAxiosErrorInSnackbar(error, `Error loading ${title}`);

  const classes = useStyles({ isLoading });

  async function handleRefresh() {
    setLastRefreshedAt(new Date().toISOString());
    return revalidate();
  }

  useRunActionPeriodicallyWhenVisible({
    condition: () => !isLoading,
    action: handleRefresh,
    period: refreshIntervalInMs,
  });

  return (
    <Card data-testid={rootDataTestId}>
      <LinearProgress className={classes.linearProgress} />
      <CardHeader
        data-testid={dataTestIds.title}
        title={title}
        subheader={<RefreshButton lastRefreshedAt={lastRefreshedAt} onClick={handleRefresh} />}
      />
      <CardContent>
        <BufferCarriersTable
          data-testid={dataTestIds.table}
          bufferCarriers={seedlingBuffer}
          onUpdateAsync={handleRefresh}
          showOrder
        />
      </CardContent>
    </Card>
  );
};
