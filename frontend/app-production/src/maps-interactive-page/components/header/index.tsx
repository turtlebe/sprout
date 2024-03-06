import { useMapsInteractiveRouting } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing';
import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefArea, FarmDefFarm, FarmDefLine, FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';
import { Link } from 'react-router-dom';

import { isSupportedAreaAndLine } from '../../utils/is-supported-area-and-line';
import { HeaderToolbar } from '../header-toolbar';
import { NavToolbar } from '../nav-toolbar';

import { ReactComponent as MapsIcon } from './assets/farmos-maps-icon.svg';
import { useStyles } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    title: 'title',
    icon: 'icon',
  },
  'header'
);

export { dataTestIds as dataTestIdsHeader };

export interface Header {
  farm?: FarmDefFarm;
  area?: FarmDefArea;
  areas?: FarmDefArea[];
  line?: FarmDefLine;
  lines?: FarmDefLine[];
  mapsState?: MapsState;
  machines?: FarmDefMachine[];
  isLoadingMachines?: boolean;
  onMapsReset?: () => void;
}

export const Header: React.FC<Header> = ({
  farm,
  area,
  areas,
  line,
  lines,
  mapsState,
  machines,
  isLoadingMachines,
  onMapsReset,
}) => {
  const classes = useStyles({});
  const { getMapsInteractiveRoute } = useMapsInteractiveRouting();

  const farmDisplayName = farm?.displayName ? `${farm.displayName} Farm Interactive Maps` : '';
  const title = line?.displayName || farmDisplayName;

  return (
    <Box display="flex" width="100%" padding="0.25rem 0 0.25rem 1.5rem">
      <Box alignSelf="center" marginRight="0.5rem">
        <Link to={getMapsInteractiveRoute()} data-testid={dataTestIds.icon}>
          <Box className={classes.icon}>
            <MapsIcon />
          </Box>
        </Link>
      </Box>
      <Box alignSelf="center">
        <NavToolbar areas={areas} lines={lines} area={area} line={line} />
        <Typography variant="h5" data-testid={dataTestIds.title}>
          {title}
        </Typography>
      </Box>
      <Box marginLeft="auto">
        <Show when={isSupportedAreaAndLine(area?.class, line?.class)}>
          <HeaderToolbar
            mapsState={mapsState}
            machines={machines}
            isLoadingMachines={isLoadingMachines}
            line={line}
            onMapsReset={onMapsReset}
          />
        </Show>
      </Box>
    </Box>
  );
};
