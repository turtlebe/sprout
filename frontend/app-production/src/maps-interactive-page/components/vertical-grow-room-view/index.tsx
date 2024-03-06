import { MachineDiagram } from '@plentyag/app-production/src/maps-interactive-page/components/machine-diagram';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import { FC, useCallback, useRef, useState } from 'react';

import { ContainerData, GetCropColor, MapsState, QueryParameters } from '../../types';
import { ContainerDetailsDrawer } from '../container-details-drawer';
import { ContainerSummaryTooltip } from '../container-summary-tooltip';

import { GrowLineGraph } from './components/grow-line-graph';
import { ZoomedDrawer } from './components/zoomed-drawer';
import { ZoomState } from './types';

const dataTestIds = {
  root: 'vertical-grow-room-view',
  displayName: 'vertical-grow-room-view-display-name',
  loading: 'vertical-grow-room-view-loading',
};

export { dataTestIds as dataTestIdsVerticalGrowRoomView };

interface VerticalGrowRoomView {
  machines: FarmDefMachine[];
  mapsState: MapsState;
  queryParameters: QueryParameters;
  getCropColor: GetCropColor;
}

export const VerticalGrowRoomView: FC<VerticalGrowRoomView> = ({
  machines,
  mapsState,
  getCropColor,
  queryParameters,
}) => {
  const zoomRef = useRef<HTMLDivElement>(null);

  // Interaction States
  const [zoomState, setZoomState] = useState<ZoomState>({
    machine: null,
    moving: false,
  });
  const [hoveredTower, setHoveredTower] = useState<{ node: Element; data: ContainerData }>(null);
  const [selectedTower, setSelectedTower] = useState<ContainerData>(null);

  // Interaction Events
  const handleZoomScroll = useCallback(
    (e, machine) => {
      setZoomState({
        ...zoomState,
        machine,
        moving: true,
      });
    },
    [setZoomState]
  );

  const handleZoomClose = useCallback(() => {
    setZoomState({
      ...zoomState,
      machine: null,
    });
  }, [setZoomState]);

  const handleGraphClick = useCallback(
    (e, machine) => {
      setZoomState({
        ...zoomState,
        machine,
      });
    },
    [setZoomState]
  );

  const handleTowerEnter = useCallback(
    (_e, node, data) => {
      setHoveredTower({ node, data });
    },
    [setHoveredTower]
  );

  const handleTowerExit = useCallback(() => {
    setHoveredTower(null);
  }, [setHoveredTower]);

  const handleTowerClick = useCallback(
    (_e, _el, data) => {
      setHoveredTower(null);
      if (data?.resourceState || data?.conflicts) {
        setSelectedTower(data);
      }
    },
    [setHoveredTower, setSelectedTower]
  );

  const handleDrawerClose = useCallback(() => {
    setSelectedTower(null);
  }, [setSelectedTower]);

  return (
    <Box px={3} py={0.5} height="100%" display="flex" flexDirection="column" data-testid={dataTestIds.root}>
      <Box height="100%" display="flex" flexDirection="column" flex="1 1 0" overflow="auto">
        {machines.map(machine => (
          <MachineDiagram key={machine.name} title={machine.name}>
            <GrowLineGraph
              machine={machine}
              mapsState={mapsState}
              queryParameters={queryParameters}
              getCropColor={getCropColor}
              zoomRef={zoomRef}
              zoomState={zoomState}
              onClick={handleGraphClick}
            />
          </MachineDiagram>
        ))}
      </Box>
      <ZoomedDrawer
        ref={zoomRef}
        machine={zoomState.machine}
        mapsState={mapsState}
        selectedTower={selectedTower}
        queryParameters={queryParameters}
        getCropColor={getCropColor}
        onScroll={handleZoomScroll}
        onClose={handleZoomClose}
        onTowerEnter={handleTowerEnter}
        onTowerExit={handleTowerExit}
        onTowerClick={handleTowerClick}
      />
      <ContainerDetailsDrawer
        data={selectedTower}
        onClose={handleDrawerClose}
        getCropColor={getCropColor}
        selectedDate={queryParameters.selectedDate}
      />
      <ContainerSummaryTooltip
        node={hoveredTower?.node}
        data={hoveredTower?.data}
        selectedDate={queryParameters.selectedDate}
      />
    </Box>
  );
};
