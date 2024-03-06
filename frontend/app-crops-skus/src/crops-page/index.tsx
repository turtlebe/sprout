import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { AppHeader, AppLayout, BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { CropsSkusBreadcrumbs, DownloadTableButton, EditCropButton } from '../common/components';
import { useSelectedTableRow } from '../common/hooks';
import { CropWithFarmInfo } from '../common/types';
import { ROUTES } from '../constants';

import { useAgGridConfig, useLoadCrops } from './hooks';

export const CropsPage: React.FC = () => {
  const { isValidating, data: cropData, revalidate } = useLoadCrops();
  const agGridConfig = useAgGridConfig(cropData);
  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);
  const { selectedRow: selectedCrop, updateSelectedRow } = useSelectedTableRow<CropWithFarmInfo>(
    gridReadyEvent,
    cropData
  );

  function handleEditSuccess() {
    void revalidate();
  }

  return (
    <AppLayout isLoading={isValidating}>
      <AppHeader>
        <CropsSkusBreadcrumbs homePageRoute={ROUTES.crops} homePageName="Crops" />
        <Box display="flex">
          <DownloadTableButton tableName="crops" gridReadyEvent={gridReadyEvent} disabled={isValidating} />
          <Box m={0.5} />
          <EditCropButton crop={selectedCrop} crops={cropData} isUpdating onEditSuccess={handleEditSuccess} />
          <Box m={0.5} />
          <EditCropButton crop={selectedCrop} crops={cropData} isUpdating={false} onEditSuccess={handleEditSuccess} />
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
