import {
  ContainerData,
  ContainerEventHandler,
  GetCropColor,
  MapsState,
  QueryParameters,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import { noop } from '@plentyag/app-production/src/maps-interactive-page/utils/noop';
import { FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import { useResizeObserver } from '@plentyag/core/src/hooks';
import React, { forwardRef, memo, MutableRefObject, useCallback } from 'react';

import { ZOOM_TOWER_WIDTH } from '../../constants';
import { useVerticalGrowGraphData } from '../../hooks/use-vertical-grow-graph-data';
import { getZoomFullWidth } from '../../utils/get-zoom-full-width';
import { CanvasLayer } from '../canvas-layer';
import { SvgLayer } from '../svg-layer';

import { useStyles } from './styles';

const dataTestIds = {
  container: 'grow-line-zoomed-graph',
};

export { dataTestIds as dataTestGrowLineZoomedGraphIds };

interface GrowLineZoomedGraph {
  machine?: FarmDefMachine;
  mapsState: MapsState;
  selectedTower?: ContainerData;
  queryParameters?: QueryParameters;
  getCropColor: GetCropColor;
  onScroll: (e?: Event, machine?: FarmDefMachine) => void;
  onTowerEnter?: ContainerEventHandler;
  onTowerExit?: ContainerEventHandler;
  onTowerClick?: ContainerEventHandler;
}

export const GrowLineZoomedGraph = memo(
  forwardRef<HTMLDivElement, GrowLineZoomedGraph>(
    (
      {
        machine,
        mapsState,
        selectedTower,
        queryParameters,
        getCropColor,
        onScroll = noop,
        onTowerEnter = noop,
        onTowerExit = noop,
        onTowerClick = noop,
      },
      ref: MutableRefObject<HTMLDivElement>
    ) => {
      const classes = useStyles({});

      const towerWidth = ZOOM_TOWER_WIDTH;

      const { lanes } = useVerticalGrowGraphData(machine);
      const refSize = useResizeObserver<HTMLDivElement>(ref);

      const fixedWidth = getZoomFullWidth(lanes, towerWidth);

      const handleScroll = useCallback(
        e => {
          onScroll(e, machine);
        },
        [machine]
      );

      return (
        <div ref={ref} className={classes.diagramContainer} data-testid={dataTestIds.container} onScroll={handleScroll}>
          <CanvasLayer
            machine={machine}
            mapsState={mapsState}
            width={fixedWidth}
            height={refSize.height}
            queryParameters={queryParameters}
            getCropColor={getCropColor}
            towerWidth={towerWidth}
          />
          <SvgLayer
            machine={machine}
            mapsState={mapsState}
            selectedTower={selectedTower}
            width={fixedWidth}
            height={refSize.height}
            queryParameters={queryParameters}
            getCropColor={getCropColor}
            towerWidth={towerWidth}
            enableHotspot={true}
            onTowerEnter={onTowerEnter}
            onTowerExit={onTowerExit}
            onTowerClick={onTowerClick}
          />
        </div>
      );
    }
  )
);
