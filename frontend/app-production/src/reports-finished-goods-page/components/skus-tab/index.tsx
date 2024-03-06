import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { BaseAgGridClientSideTable, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React, { useState } from 'react';

import { useGetFinishedGoodsCounts, useProcessSkusData, useSkusAgGridConfig } from '../../hooks';
import { FinishedGoodsData, FinishedGoodsStatus } from '../../types';
import { CountWidget } from '../count-widget';
import { DownloadReportButton } from '../download-report-button';

const dataTestIds = {
  root: 'skus-tab-root',
  unreleasedCount: 'skus-tab-unreleased-count',
  releasedCount: 'skus-tab-released-count',
  expiredCount: 'skus-tab-expired-count',
  casesCount: 'skus-tab-cases-count',
};

export { dataTestIds as dataTestIdsSkusTab };

interface SkusTab {
  finishedGoodsData: FinishedGoodsData;
  refresh: () => void;
}

export const SkusTab: React.FC<SkusTab> = ({ finishedGoodsData, refresh }) => {
  const snackbar = useGlobalSnackbar();
  const data = useProcessSkusData({ finishedGoodsData });
  const [gridReadyEvent, setGridReadyEvent] = useState<GridReadyEvent>(null);
  const agGridConfig = useSkusAgGridConfig({
    finishedGoodsSkus: data,
    onUpdateStatusError() {
      snackbar.errorSnackbar({ message: 'Record was not saved! Please try again' });
    },
    onUpdateStatusSuccess() {
      snackbar.successSnackbar('Record saved!');
      refresh();
    },
  });

  // post data
  const { getCount } = useGetFinishedGoodsCounts(gridReadyEvent);

  return (
    <Box height="100%" display="flex" flexDirection="column" data-testid={dataTestIds.root}>
      <Box display="flex" m={2} mb={0} justifyContent="space-between">
        <Box display="flex">
          <CountWidget
            name={FinishedGoodsStatus.UNRELEASED}
            value={getCount(FinishedGoodsStatus.UNRELEASED)}
            data-testid={dataTestIds.unreleasedCount}
          />
          <CountWidget
            name={FinishedGoodsStatus.RELEASED}
            value={getCount(FinishedGoodsStatus.RELEASED)}
            data-testid={dataTestIds.releasedCount}
          />
          <CountWidget
            name={FinishedGoodsStatus.EXPIRED}
            value={getCount(FinishedGoodsStatus.EXPIRED)}
            data-testid={dataTestIds.expiredCount}
          />
          <CountWidget name="Total Count" value={getCount('caseCount')} data-testid={dataTestIds.casesCount} />
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center">
          <DownloadReportButton tableName="skus" gridReadyEvent={gridReadyEvent} />
        </Box>
      </Box>
      <BaseAgGridClientSideTable agGridConfig={agGridConfig} onGridReady={setGridReadyEvent} />
    </Box>
  );
};
