import { GetCropColor, MapsState, QueryParameters } from '@plentyag/app-production/src/maps-interactive-page/types';
import { FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import React, { useEffect, useRef } from 'react';

import { useInitCanvas } from '../../hooks/use-init-canvas';
import { useVerticalGrowGraphApi } from '../../hooks/use-vertical-grow-graph-api';
import { useVerticalGrowGraphData } from '../../hooks/use-vertical-grow-graph-data';
import { useVerticalGrowGraphScale } from '../../hooks/use-vertical-grow-graph-scale';

import { useStyles } from './styles';

const dataTestIds = {
  container: 'canvas-layer-graph',
};

export { dataTestIds as dataTestCanvasLayerIds };
interface CanvasLayer {
  machine: FarmDefMachine;
  mapsState: MapsState;
  queryParameters?: QueryParameters;
  width: number;
  height: number;
  towerWidth: number;
  getCropColor: GetCropColor;
}

const CANVAS_SCALE = 2; // Retina scale

export const CanvasLayer: React.FC<CanvasLayer> = React.memo(
  ({ machine, width, height, mapsState, queryParameters, getCropColor, towerWidth }) => {
    const classes = useStyles({});

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const canvasCtx = useInitCanvas({ ref: canvasRef, width, height, scaleSize: CANVAS_SCALE });

    const { lanes } = useVerticalGrowGraphData(machine);
    const scale = useVerticalGrowGraphScale({ width, height, lanes, towerWidth });
    const { renderTrack, renderTowers } = useVerticalGrowGraphApi({
      canvasCtx,
      scale,
    });

    useEffect(() => {
      if (lanes?.length && width && height) {
        renderTrack({ lanes });
        renderTowers({ lanes, mapsState, queryParameters, getCropColor, towerWidth });
      }
    }, [lanes, queryParameters, mapsState, width, height]);

    return <canvas ref={canvasRef} className={classes.canvasChart} data-testid={dataTestIds.container} />;
  }
);
