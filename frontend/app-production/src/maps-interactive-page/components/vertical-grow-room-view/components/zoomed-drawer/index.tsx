import { Close } from '@material-ui/icons';
import {
  ContainerData,
  ContainerEventHandler,
  GetCropColor,
  MapsState,
  QueryParameters,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import { filterMapsState } from '@plentyag/app-production/src/maps-interactive-page/utils/filter-maps-state';
import { noop } from '@plentyag/app-production/src/maps-interactive-page/utils/noop';
import { Box, IconButton, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import React, { forwardRef, memo, MutableRefObject } from 'react';

import { Legend } from '../../../legend';
import { filterMapsStateForMachine } from '../../utils/filter-maps-state-for-machine';
import { GrowLineZoomedGraph } from '../grow-line-zoomed-graph';

import { useStyles } from './styles';

const dataTestIds = {
  container: 'zoomed-drawer',
  title: 'zoomed-drawer-title',
  close: 'zoomed-drawer-close',
};

export { dataTestIds as dataTestIdsZoomedDrawer };

interface ZoomedDrawer {
  machine: FarmDefMachine;
  mapsState: MapsState;
  selectedTower?: ContainerData;
  queryParameters: QueryParameters;
  getCropColor: GetCropColor;
  onClose?: () => void;
  onScroll: (e?: Event, machine?: FarmDefMachine) => void;
  onTowerEnter?: ContainerEventHandler;
  onTowerExit?: ContainerEventHandler;
  onTowerClick?: ContainerEventHandler;
}

export const ZoomedDrawer = memo(
  forwardRef<HTMLDivElement, ZoomedDrawer>(
    (
      {
        machine,
        mapsState,
        selectedTower,
        queryParameters,
        getCropColor,
        onClose = noop,
        onScroll = noop,
        onTowerEnter = noop,
        onTowerExit = noop,
        onTowerClick = noop,
      },
      ref: MutableRefObject<HTMLDivElement>
    ) => {
      const toShow = Boolean(machine);
      const classes = useStyles({ show: toShow });

      const machineMapsState = filterMapsStateForMachine(mapsState, machine);
      const filteredMapsState = filterMapsState({ mapsState: machineMapsState, queryParameters });

      return (
        <Box className={classes.drawer} data-testid={dataTestIds.container} aria-hidden={!toShow}>
          <Box pl={3} py={2} pr="16px" height="100%" display="flex" flexDirection="column">
            <Box display="flex" alignItems="flex-start" justifyContent="space-between" width="100%">
              <Typography variant="h6" data-testid={dataTestIds.title}>
                {machine?.displayName}
              </Typography>
              <IconButton
                className={classes.closeIcon}
                size="small"
                color="default"
                icon={Close}
                onClick={onClose}
                data-testid={dataTestIds.close}
              />
            </Box>
            <Legend getCropColor={getCropColor} mapsState={filteredMapsState} />
            <GrowLineZoomedGraph
              ref={ref}
              machine={machine}
              mapsState={machineMapsState}
              selectedTower={selectedTower}
              queryParameters={queryParameters}
              getCropColor={getCropColor}
              onScroll={onScroll}
              onTowerEnter={onTowerEnter}
              onTowerExit={onTowerExit}
              onTowerClick={onTowerClick}
            />
          </Box>
        </Box>
      );
    }
  )
);
