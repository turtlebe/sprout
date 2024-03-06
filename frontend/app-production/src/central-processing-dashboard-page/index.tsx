import { AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box, Grid, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { getScopedDataTestIds, getShortenedPath } from '@plentyag/core/src/utils';
import React from 'react';

import { BufferOverviewCard, CentralProcessingLinksCard, PreTransferConveyanceCard } from './components';

const dataTestIds = getScopedDataTestIds(
  {
    notSupportedFarm: 'not-supported-farm',
    seedlingBufferCard: 'seedling-buffer-card',
    auxBuffer1Card: 'aux-buffer-1-card',
    auxBuffer2Card: 'aux-buffer-2-card',
    preInspectionCard: 'pre-inspection-card',
  },
  'centralProcessingDashboardPage'
);

export { dataTestIds as dataTestIdsCentralProcessingDashboardPage };

// all components here will periodically refresh their data every 5 seconds.
const REFRESH_INTERVAL_IN_MS = 5000;

export const CentralProcessingDashboardPage: React.FC = () => {
  const [coreStore] = useCoreStore();

  const currentFarm = coreStore.currentUser.currentFarmDefPath;
  const supportedFarm = 'sites/LAX1/farms/LAX1';

  return (
    <AppLayout data-testid={dataTestIds.root}>
      <AppHeader justifyContent="space-between">
        <Box pl={1}>
          <Typography variant="h5">Central Processing Orchestration Dashboard</Typography>
        </Box>
      </AppHeader>
      <Box m={2}>
        {currentFarm !== supportedFarm ? (
          <>
            <Typography data-testid={dataTestIds.notSupportedFarm} variant="h6">
              This page is only supported for site/farm: {getShortenedPath(supportedFarm)}
            </Typography>
            <Typography variant="h6">Please select another option from the global site/farm picker.</Typography>
          </>
        ) : (
          <Grid container spacing={2} direction="column" style={{ overflowAnchor: 'none' }}>
            <Grid item>
              <BufferOverviewCard
                data-testid={dataTestIds.seedlingBufferCard}
                title="Seedling Buffer Overview"
                apiUrl="/api/production/transfer-conveyance/buffers/states/seedling-buffer"
                refreshIntervalInMs={REFRESH_INTERVAL_IN_MS}
              />
            </Grid>
            <Grid item>
              <PreTransferConveyanceCard refreshIntervalInMs={REFRESH_INTERVAL_IN_MS} />
            </Grid>
            <Grid item>
              <BufferOverviewCard
                data-testid={dataTestIds.auxBuffer1Card}
                title="Aux Buffer 1 Overview"
                apiUrl="/api/production/transfer-conveyance/buffers/states/aux-buffer-1"
                refreshIntervalInMs={REFRESH_INTERVAL_IN_MS}
              />
            </Grid>
            <Grid item>
              <BufferOverviewCard
                data-testid={dataTestIds.auxBuffer2Card}
                title="Aux Buffer 2 Overview"
                apiUrl="/api/production/transfer-conveyance/buffers/states/aux-buffer-2"
                refreshIntervalInMs={REFRESH_INTERVAL_IN_MS}
              />
            </Grid>
            <Grid item>
              <BufferOverviewCard
                data-testid={dataTestIds.preInspectionCard}
                title="Pre Inspection Overview"
                apiUrl="/api/production/transfer-conveyance/buffers/states/pre-inspection"
                refreshIntervalInMs={REFRESH_INTERVAL_IN_MS}
              />
            </Grid>
            <Grid item>
              <CentralProcessingLinksCard />
            </Grid>
          </Grid>
        )}
      </Box>
    </AppLayout>
  );
};
