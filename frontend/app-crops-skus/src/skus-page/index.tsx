import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { AppHeader, AppLayout, BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { CropsSkusBreadcrumbs, DownloadTableButton, EditSkuButton } from '../common/components';
import { useSelectedTableRow } from '../common/hooks';
import { SkuWithFarmInfo } from '../common/types';
import { ROUTES } from '../constants';

import { useAgGridConfig, useLoadSkus } from './hooks';
import { skusTableCols } from './utils';

export const SkusPage: React.FC = () => {
  const { isValidating, data: skusData, revalidate } = useLoadSkus();
  const agGridConfig = useAgGridConfig(skusData);
  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);
  const { selectedRow: selectedSku, updateSelectedRow } = useSelectedTableRow<SkuWithFarmInfo>(
    gridReadyEvent,
    skusData
  );

  function handleEditSuccess() {
    void revalidate();
  }

  // download all columns except package imagery.
  const columnsToDownload =
    agGridConfig &&
    agGridConfig.columnDefs.reduce<string[]>((prev, curr) => {
      if (curr['colId'] && curr['colId'] !== skusTableCols.packageImagery.colId) {
        prev.push(curr['colId']);
      }
      return prev;
    }, []);

  return (
    <AppLayout isLoading={isValidating}>
      <AppHeader>
        <CropsSkusBreadcrumbs homePageRoute={ROUTES.skus} homePageName="SKUs" />
        <Box display="flex">
          <DownloadTableButton
            tableName="skus"
            columnsToDownload={columnsToDownload}
            gridReadyEvent={gridReadyEvent}
            disabled={isValidating}
          />
          <Box m={0.5} />
          <EditSkuButton sku={selectedSku} skus={skusData} isUpdating onEditSuccess={handleEditSuccess} />
          <Box m={0.5} />
          <EditSkuButton sku={selectedSku} skus={skusData} isUpdating={false} onEditSuccess={handleEditSuccess} />
        </Box>
      </AppHeader>

      {agGridConfig && (
        <BaseAgGridClientSideTable
          agGridConfig={agGridConfig}
          onGridReady={setGridReadyEvent}
          onSelectionChanged={updateSelectedRow}
          persistFilterAndSortModelsInLocalStorage={false}
        />
      )}
    </AppLayout>
  );
};
