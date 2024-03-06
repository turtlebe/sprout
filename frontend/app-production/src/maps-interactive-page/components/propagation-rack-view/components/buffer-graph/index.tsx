import {
  ContainerData,
  ContainerEventHandler,
  GetCropColor,
  MapsState,
  QueryParameters,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { ContainerLocation } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { PropagationLevelGraph } from '../propagation-level-graph';

const dataTestIds = {
  container: 'buffer-graph',
  displayName: 'buffer-graph-display-name',
};

export { dataTestIds as dataTestIdsBufferGraph };

interface BufferGraph {
  loadBufferContainerLocation: ContainerLocation;
  loadBufferState: MapsState;
  getCropColor: GetCropColor;
  selectedTable?: ContainerData;
  queryParameters: QueryParameters;
  onTableEnter?: ContainerEventHandler;
  onTableExit?: ContainerEventHandler;
  onTableClick?: ContainerEventHandler;
}

export const BufferGraph: React.FC<BufferGraph> = ({
  loadBufferContainerLocation,
  loadBufferState,
  getCropColor,
  selectedTable,
  queryParameters,
  onTableEnter,
  onTableExit,
  onTableClick,
}) => {
  const containerLocations = React.useMemo(
    () => ({ propLoadBuffer: loadBufferContainerLocation }),
    [loadBufferContainerLocation]
  );
  return (
    <Box height="100%" data-testid={dataTestIds.container}>
      <Typography variant="subtitle2" data-testid={dataTestIds.displayName}>
        Load Buffer
      </Typography>
      <Box height="100%" bgcolor="white" borderRadius="4px" display="flex" flexDirection="row" justifyContent="center">
        <PropagationLevelGraph
          containerLocations={containerLocations}
          mapsState={loadBufferState}
          getCropColor={getCropColor}
          selectedTable={selectedTable}
          queryParameters={queryParameters}
          onTableEnter={onTableEnter}
          onTableExit={onTableExit}
          onTableClick={onTableClick}
        />
      </Box>
    </Box>
  );
};
