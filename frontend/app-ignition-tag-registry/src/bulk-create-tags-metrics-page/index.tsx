import { AppBreadcrumbs, AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { PATHS } from '../paths';

import { BulkCreateTable } from './components';

const dataTestIds = {};

export { dataTestIds as dataTestIdsBulkCreateTagsMetricsPage };

export const BulkCreateTagsMetricsPage: React.FC<RouteComponentProps> = () => {
  return (
    <AppLayout isLoading={false}>
      <AppHeader>
        <AppBreadcrumbs homePageRoute={PATHS.tagsPage} homePageName="Bulk Create Tags/Metrics" marginLeft="0.75rem" />
      </AppHeader>

      <Box padding={2}>
        <BulkCreateTable />
      </Box>
    </AppLayout>
  );
};
