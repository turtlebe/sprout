import { AppHeader, AppLayout, TabPanel } from '@plentyag/brand-ui/src/components';
import { Box, Tab, Tabs, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React, { useState } from 'react';

import { TransferConveyanceSettings } from './components/transfer-conveyance-settings';
import { useStyles } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    title: 'title',
    cpSettingsTab: 'cp-settings-tab',
    icon: 'icon',
  },
  'CentralProcessingSettingsPage'
);

export { dataTestIds as dataTestIdsCentralProcessingSettingsPage };

export enum SettingsTabs {
  TransferConveyance,
}

export const CentralProcessingSettingsPage: React.FC = () => {
  const classes = useStyles({});

  const [tab, setTab] = useState<SettingsTabs>(SettingsTabs.TransferConveyance);

  const handleTabClick = (_, newTab) => {
    setTab(newTab);
  };

  return (
    <AppLayout data-testid={dataTestIds.root}>
      <AppHeader flexDirection="column" paddingBottom={0}>
        <Box display="flex" justifyContent="space-between" paddingBottom={2}>
          <Typography variant="h5" className={classes.title} data-testid={dataTestIds.title}>
            Central Processing Settings
          </Typography>
        </Box>
        <Tabs value={tab} onChange={handleTabClick} aria-label="CP Settings">
          <Tab
            value={SettingsTabs.TransferConveyance}
            wrapped={true}
            classes={{ selected: classes.tabSelected }}
            label="Transfer Conveyance"
            id={`cp-settings-${SettingsTabs.TransferConveyance}`}
            aria-controls={`cp-settings-${SettingsTabs.TransferConveyance}`}
            data-testid={dataTestIds.cpSettingsTab}
          />
        </Tabs>
      </AppHeader>
      <TabPanel value={tab.toString()} index={SettingsTabs.TransferConveyance.toString()} className={classes.tabPanel}>
        <TransferConveyanceSettings />
      </TabPanel>
    </AppLayout>
  );
};
