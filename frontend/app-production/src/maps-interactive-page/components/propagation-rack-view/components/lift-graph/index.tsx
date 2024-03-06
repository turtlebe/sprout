import {
  ContainerData,
  ContainerEventHandler,
  GetCropColor,
  MapsState,
  QueryParameters,
  SupportedLiftTypes,
  SupportedMachineClass,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { PropagationLevelGraph } from '../propagation-level-graph';

const dataTestIds = {
  container: 'lift-graph',
  displayName: 'lift-graph-display-name',
};

export { dataTestIds as dataTestIdsLiftGraph };

interface LiftGraph {
  machines: FarmDefMachine[];
  mapsState: MapsState;
  getCropColor: GetCropColor;
  liftType: SupportedLiftTypes;
  selectedTable?: ContainerData;
  queryParameters: QueryParameters;
  onTableEnter?: ContainerEventHandler;
  onTableExit?: ContainerEventHandler;
  onTableClick?: ContainerEventHandler;
}

export const LiftGraph: React.FC<LiftGraph> = ({
  machines,
  mapsState,
  getCropColor,
  liftType,
  selectedTable,
  queryParameters,
  onTableEnter,
  onTableExit,
  onTableClick,
}) => {
  const tableLift = machines?.find(
    machine => machine.name === liftType && machine.class === SupportedMachineClass.TableLift
  );

  return (
    <Show when={!!tableLift}>
      <Box height="100%" data-testid={dataTestIds.container}>
        <Typography variant="subtitle2" data-testid={dataTestIds.displayName}>
          {tableLift?.name}
        </Typography>
        <Box
          height="100%"
          minWidth="100px"
          bgcolor="white"
          borderRadius="4px"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <PropagationLevelGraph
            containerLocations={tableLift?.containerLocations || {}}
            getCropColor={getCropColor}
            mapsState={mapsState}
            showLift
            selectedTable={selectedTable}
            queryParameters={queryParameters}
            onTableEnter={onTableEnter}
            onTableExit={onTableExit}
            onTableClick={onTableClick}
          />
        </Box>
      </Box>
    </Show>
  );
};
