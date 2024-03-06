import { RefreshButton } from '@plentyag/brand-ui/src/components/refresh-button';
import { Box, LinearProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { DrawerWithClose } from '../../../drawer-with-close';
import { irrigationFlowRate } from '../../constants';
import { IrrigationTable } from '../irrigation-table';

import { useLoadIrrigationTasks } from './hooks/load-irrigation-tasks';
import { useGetFarmDefSiteObject } from './hooks/use-get-farm-def-site-object';
import { useStyles } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    footerTimeZone: 'footer-time-zone',
  },
  'irrigation-table-drawer'
);

export { dataTestIds as dataTestIdsTableIrrigationDrawer };

export interface IrrigationTableDrawer {
  open: boolean;
  lotName: string;
  tableSerial: string;
  rackPath: string;
  tableLoadedDate: Date;
  rightOffSet?: number;
  onClose: () => void;
}

export const IrrigationTableDrawer: React.FC<IrrigationTableDrawer> = ({
  lotName,
  tableSerial,
  rackPath,
  tableLoadedDate,
  open,
  onClose,
  rightOffSet,
}) => {
  const {
    refreshIrrigationTasks,
    isLoading: isLoadingIrrigationTasks,
    irrigationTasks,
  } = useLoadIrrigationTasks({
    lotName: open && lotName ? lotName : undefined,
  });

  const site = getKindFromPath(rackPath, 'sites');
  const { farmSiteObject, isLoading: isLoadingFarmSiteObject } = useGetFarmDefSiteObject({
    site: open && site ? site : undefined,
  });
  const siteTimeZone = farmSiteObject?.timezone;

  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<string>();

  React.useEffect(() => {
    setLastRefreshedAt(new Date().toISOString());
  }, [irrigationTasks]);

  const classes = useStyles({ isLoading: isLoadingIrrigationTasks || isLoadingFarmSiteObject });

  return (
    <DrawerWithClose
      open={open}
      onClose={onClose}
      rightOffset={rightOffSet}
      title={<Typography variant="h6">Irrigation Table</Typography>}
    >
      <Box flex="1 1 auto">
        <LinearProgress className={classes.linearProgress} />
        <RefreshButton lastRefreshedAt={lastRefreshedAt} onClick={refreshIrrigationTasks} />
        <Box paddingY={0.5}>
          <IrrigationTable
            lotName={lotName}
            tableSerial={tableSerial}
            siteTimeZone={siteTimeZone}
            rackPath={rackPath}
            irrigationTasks={irrigationTasks}
            tableLoadedDate={tableLoadedDate}
            onRefreshIrrigationTasks={refreshIrrigationTasks}
          />
        </Box>
        <Typography data-testid={dataTestIds.footerTimeZone}>
          *Recipe Day is displayed based on {site} time zone: {siteTimeZone}
        </Typography>
        <Typography>**{irrigationFlowRate}</Typography>
      </Box>
    </DrawerWithClose>
  );
};
