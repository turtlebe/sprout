import { RefreshButton } from '@plentyag/brand-ui/src/components';
import { Box, Card, CardContent, CardHeader, LinearProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { useRunActionPeriodicallyWhenVisible } from '@plentyag/core/src/hooks';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { PickupBufferCard } from './components/pickup-buffer-card';
import { PickupPositionCard } from './components/pickup-position-card';
import { TransplanterCard } from './components/transplanter-card';
import { useLoadPreTransferConveyanceData } from './hooks/use-load-pre-transfer-convenyance-data';
import { useStyles } from './styles';

const dataTestIds = getScopedDataTestIds({}, 'PreTransferConveyanceCard');

export { dataTestIds as dataTestIdsPreTransferConveyanceCard };

export interface PreTransferConveyanceCard {
  refreshIntervalInMs: number;
}

/**
 * This card displays four tables depicting the state of the transplanter and pickup robot systems.
 * This is just prior to items reaching the transfer conveyance system.
 */
export const PreTransferConveyanceCard: React.FC<PreTransferConveyanceCard> = ({ refreshIntervalInMs }) => {
  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<string>(new Date().toISOString());
  const { pickupBuffer, transplanterTowers, transplanterOutfeedTowers, isLoading, revalidate } =
    useLoadPreTransferConveyanceData();
  const classes = useStyles({ isLoading });

  async function handleRefresh() {
    setLastRefreshedAt(new Date().toISOString());
    return await revalidate();
  }

  useRunActionPeriodicallyWhenVisible({
    condition: () => !isLoading,
    action: handleRefresh,
    period: refreshIntervalInMs,
  });

  return (
    <Card data-testid={dataTestIds.root}>
      <LinearProgress className={classes.linearProgress} />
      <CardHeader
        title="Pre-Transfer Conveyance Overview"
        subheader={<RefreshButton lastRefreshedAt={lastRefreshedAt} onClick={handleRefresh} />}
      />
      <CardContent>
        <Box display="grid" gridGap={10} gridTemplateColumns="1fr 1fr" gridAutoRows="auto auto auto">
          <Box gridColumn="1/span 2" gridRow="1">
            <PickupPositionCard pickupBuffer={pickupBuffer} onUpdateAsync={handleRefresh} />
          </Box>
          <Box gridColumn="1" gridRow="2">
            <TransplanterCard title="Transplanter Outfeed" towers={transplanterOutfeedTowers} />
          </Box>
          <Box gridColumn="2" gridRow="2/span 2">
            <PickupBufferCard pickupBuffer={pickupBuffer} />
          </Box>
          <Box gridColumn="1" gridRow="3">
            <TransplanterCard title="Transplanter" towers={transplanterTowers} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
