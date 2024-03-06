import { AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { getScopedDataTestIds, getShortenedPath } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    content: 'content',
    notSupportedFarm: 'not-supported-farm',
  },
  'cultivationDashboardPage'
);

export { dataTestIds as dataTestIdsCultivationDashboardPage };

export const CultivationDashboardPage: React.FC = () => {
  const [coreStore] = useCoreStore();

  const currentFarm = coreStore.currentUser.currentFarmDefPath;
  const supportedFarm = 'sites/LAX1/farms/LAX1';

  return (
    <AppLayout data-testid={dataTestIds.root}>
      <AppHeader justifyContent="space-between">
        <Box pl={1}>
          <Typography variant="h5">Cultivation Orchestration Dashboard</Typography>
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
          <Typography data-testid={dataTestIds.content}>Coming soon...</Typography>
        )}
      </Box>
    </AppLayout>
  );
};
