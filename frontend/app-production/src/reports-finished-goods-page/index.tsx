import { AppHeader, AppLayout, CircularProgressCentered, Show } from '@plentyag/brand-ui/src/components';
import { WindowDateTimePicker } from '@plentyag/brand-ui/src/components/window-date-time-picker';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { useFetchFinishedGoodCases, useFetchPackagingLots } from '@plentyag/core/src/hooks';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import React from 'react';

import { SkusTab } from './components/skus-tab';
import { useLoadCrops, useLoadSkusForPackagingLots, useProcessDateWindow } from './hooks';
import { useStyles } from './styles';
import { FinishedGoodsData } from './types';

const dataTestIds = {
  root: 'finished-goods-report-root',
  title: 'finished-goods-title',
  loading: 'finished-goods-loading',
};

export { dataTestIds as dataTestIdsReportsFinishedGoods };

export const ReportsFinishedGoods: React.FC = () => {
  const [{ currentUser }] = useCoreStore();
  const currentFarmDefPath = currentUser.currentFarmDefPath;
  const { endDate, startDate } = useProcessDateWindow();
  const {
    lots,
    refresh,
    isLoading: isLoadingPackagingLots,
  } = useFetchPackagingLots({ farmPath: currentFarmDefPath, startDate, endDate });
  const { cases, isLoading: isLoadingCases } = useFetchFinishedGoodCases(startDate, endDate);
  const { skus, isLoading: isLoadingSkus } = useLoadSkusForPackagingLots({
    lots,
    includeDeleted: true,
    skuTypeClass: 'Case',
  });
  const { crops, isLoading: isLoadingCrops } = useLoadCrops();
  const classes = useStyles({});

  const finishedGoodsData: FinishedGoodsData = { lots, skus, crops, cases };
  const isLoading = isLoadingPackagingLots || isLoadingSkus || isLoadingCrops || isLoadingCases;

  return (
    <AppLayout data-testid={dataTestIds.root}>
      <AppHeader flexDirection="column" paddingBottom={16}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" className={classes.title} data-testid={dataTestIds.title}>
            Finished Goods Report
          </Typography>
          <Box display="flex">
            <WindowDateTimePicker
              startDateTime={startDate}
              endDateTime={endDate}
              format={DateTimeFormat.US_DATE_ONLY}
              disableTime
              disableFuture
            />
          </Box>
        </Box>
      </AppHeader>
      <Box height="100%">
        <Show when={!isLoading} fallback={<CircularProgressCentered data-testid={dataTestIds.loading} />}>
          <SkusTab finishedGoodsData={finishedGoodsData} refresh={refresh} />
        </Show>
      </Box>
    </AppLayout>
  );
};
