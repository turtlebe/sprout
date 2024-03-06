import { AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { ImportedPlansTable, ImportPlansModule } from './components';
import { useLoadUploadHistory } from './hooks';

export interface ImportPlansPage {
  basePath?: string;
  reactorsAndTasksDetailBasePath?: string;
  workcentersBasePath?: string;
}

export const ImportPlansPage: React.FC<ImportPlansPage> = ({ reactorsAndTasksDetailBasePath, workcentersBasePath }) => {
  const { uploadHistory, revalidate, isLoading } = useLoadUploadHistory();

  // confirming import
  function handleSuccess() {
    revalidate();
  }

  return (
    <AppLayout isLoading={false}>
      <AppHeader justifyContent="normal">
        <Box marginLeft="0.75rem">
          <Typography variant="h5">Import Plans</Typography>
        </Box>
      </AppHeader>
      <ImportPlansModule
        onSuccess={handleSuccess}
        reactorsAndTasksDetailBasePath={reactorsAndTasksDetailBasePath}
        workcentersBasePath={workcentersBasePath}
      />
      <ImportedPlansTable isLoading={isLoading} uploadHistory={uploadHistory} />
    </AppLayout>
  );
};
