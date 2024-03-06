import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { BaseAgGridClientSideTable, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { useExtendedAgGridWithExpandableRows } from '@plentyag/core/src/hooks';
import React, { useState } from 'react';

import { useFinishedGoodsAgGridConfig, useProcessFinishedGoodsData } from '../../hooks';
import { useGetFinishedGoodsCounts } from '../../hooks/use-get-finished-goods-counts';
import { FinishedGoodsData, FinishedGoodsStatus } from '../../types';
import { CountWidget } from '../count-widget';
import { DownloadReportButton } from '../download-report-button';
import { FinishedGoodsExpandedRow } from '../finished-goods-expanded-row';

const dataTestIds = {
  root: 'finished-goods-tab-root',
  unreleasedCount: 'finished-goods-tab-unreleased-count',
  releasedCount: 'finished-goods-tab-released-count',
  expiredCount: 'finished-goods-tab-expired-count',
};

export { dataTestIds as dataTestIdsFinishedGoodsTab };

interface FinishedGoodsTab {
  basePath: string;
  finishedGoodsData: FinishedGoodsData;
  refresh: () => void;
}

export const FinishedGoodsTab: React.FC<FinishedGoodsTab> = ({ basePath, finishedGoodsData, refresh }) => {
  const snackbar = useGlobalSnackbar();
  const data = useProcessFinishedGoodsData({ finishedGoodsData });
  const [gridReadyEvent, setGridReadyEvent] = useState<GridReadyEvent>(null);
  const agGridConfig = useFinishedGoodsAgGridConfig({
    finishedGoodsData: data,
    onUpdateStatusError() {
      snackbar.errorSnackbar({ message: 'Record was not saved! Please try again' });
    },
    onUpdateStatusSuccess() {
      snackbar.successSnackbar('Record saved!');
      refresh();
    },
  });
  const agGridConfigWithExpandableRows = useExtendedAgGridWithExpandableRows({
    agGridConfig,
    expandedRowHeight: 160,
    renderExpandableRow: row => {
      const rowLot = row?.data?.lot;
      const rowSkus = row?.data?.skus || [];
      return <FinishedGoodsExpandedRow basePath={basePath} skus={rowSkus} lot={rowLot} />;
    },
  });
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
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center">
          <DownloadReportButton tableName="finished_goods" gridReadyEvent={gridReadyEvent} />
        </Box>
      </Box>
      <BaseAgGridClientSideTable agGridConfig={agGridConfigWithExpandableRows} onGridReady={setGridReadyEvent} />
    </Box>
  );
};
