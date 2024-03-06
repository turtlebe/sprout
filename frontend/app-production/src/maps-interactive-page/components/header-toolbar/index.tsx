import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefLine, FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import React, { FC } from 'react';

import { DownloadButton } from '../download-button';
import { MapsDateTimePicker } from '../maps-date-time-picker';
import { ResetMapsButton } from '../reset-maps-button';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'header-toolbar',
};

export interface HeaderToolbar {
  mapsState: MapsState;
  machines?: FarmDefMachine[];
  isLoadingMachines: boolean;
  line?: FarmDefLine;
  onMapsReset?: () => void;
}

export const HeaderToolbar: FC<HeaderToolbar> = ({ mapsState, isLoadingMachines, machines, line, onMapsReset }) => {
  const classes = useStyles({});

  return (
    <Box className={classes.container} data-testid={dataTestIds.root}>
      <MapsDateTimePicker />
      <DownloadButton mapsState={mapsState} machines={machines} isLoadingMachines={isLoadingMachines} line={line} />
      <ResetMapsButton onMapsReset={onMapsReset} />
    </Box>
  );
};
