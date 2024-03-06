import { UploadHistoryEntry } from '@plentyag/app-production-admin/src/import-plans-page/types';
import { BaseAgGridClientSideTable, CircularProgressCentered, Show } from '@plentyag/brand-ui/src/components';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useImportedPlansAgGridConfig } from './hooks/use-imported-plans-ag-grid-config';
import { useProcessUploadHistory } from './hooks/use-process-upload-history';

const dataTestIds = {
  root: 'imported-plans-root',
  loading: 'imported-plans-loading',
};

export { dataTestIds as dataTestIdsImportedPlansTable };

export interface ImportedPlansTable {
  uploadHistory: UploadHistoryEntry[];
  isLoading: boolean;
}

export const ImportedPlansTable: React.FC<ImportedPlansTable> = ({ uploadHistory, isLoading }) => {
  const processedData = useProcessUploadHistory(uploadHistory);

  const agGridConfig = useImportedPlansAgGridConfig(processedData);

  return (
    <Box height="100%" data-testid={dataTestIds.root}>
      <Box ml={2}>
        <Typography variant="h6">Past imports</Typography>
      </Box>
      <Show when={!isLoading} fallback={<CircularProgressCentered data-testid={dataTestIds.loading} />}>
        <BaseAgGridClientSideTable agGridConfig={agGridConfig} />
      </Show>
    </Box>
  );
};
