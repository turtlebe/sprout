import { AppBreadcrumbs, AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { PATHS } from '../paths';

import { TimeSummarizationPreference, UnitsPreferences } from './components';

export const SettingsPage: React.FC = () => {
  return (
    <AppLayout>
      <AppHeader>
        <AppBreadcrumbs homePageRoute={PATHS.settingsPage} homePageName="Settings" marginLeft="0.75rem" />
      </AppHeader>
      <Box padding={2}>
        <UnitsPreferences />
        <Box padding={1} />
        <TimeSummarizationPreference />
      </Box>
    </AppLayout>
  );
};
