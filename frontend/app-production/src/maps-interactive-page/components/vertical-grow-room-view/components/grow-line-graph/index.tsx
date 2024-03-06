import { GetCropColor, MapsState, QueryParameters } from '@plentyag/app-production/src/maps-interactive-page/types';
import { noop } from '@plentyag/app-production/src/maps-interactive-page/utils/noop';
import { FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import { useResizeObserver } from '@plentyag/core/src/hooks';
import React, { MutableRefObject, useRef } from 'react';

import { TOWER_WIDTH } from '../../constants';
import { ZoomState } from '../../types';
import { CanvasLayer } from '../canvas-layer';
import { SvgLayer } from '../svg-layer';

import { useStyles } from './styles';

const dataTestIds = {
  container: 'grow-line-graph',
};

export { dataTestIds as dataTestGrowLineGraphIds };

interface GrowLineGraph {
  machine: FarmDefMachine;
  mapsState: MapsState;
  zoomRef?: MutableRefObject<HTMLDivElement>;
  zoomState?: ZoomState;
  queryParameters?: QueryParameters;
  getCropColor: GetCropColor;
  onClick?: (e: Event, machine: FarmDefMachine) => void;
}

export const GrowLineGraph: React.FC<GrowLineGraph> = React.memo(
  ({ machine, mapsState, queryParameters, getCropColor, zoomRef, zoomState, onClick = noop }) => {
    const classes = useStyles({});

    const towerWidth = TOWER_WIDTH;

    const ref = useRef<HTMLDivElement>(null);
    const refSize = useResizeObserver(ref);

    return (
      <div ref={ref} className={classes.diagramContainer} data-testid={dataTestIds.container}>
        <CanvasLayer
          machine={machine}
          mapsState={mapsState}
          width={refSize.width}
          height={refSize.height}
          queryParameters={queryParameters}
          getCropColor={getCropColor}
          towerWidth={towerWidth}
        />
        <SvgLayer
          data-testid={`${machine.name}:${dataTestIds.container}`}
          mapsState={mapsState}
          machine={machine}
          zoomRef={zoomRef}
          zoomState={zoomState}
          width={refSize.width}
          height={refSize.height}
          queryParameters={queryParameters}
          getCropColor={getCropColor}
          towerWidth={towerWidth}
          onClick={onClick}
        />
      </div>
    );
  }
);
