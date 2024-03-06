import { GrowLaneData } from '../use-vertical-grow-graph-data';

import { RenderFunction } from '.';

import { trackColor } from './color-map';
import { drawTrack } from './draw-track';

export interface RenderTrack {
  lanes: GrowLaneData[];
}

export const renderTrack: RenderFunction<RenderTrack> =
  ({ canvasCtx, scale }) =>
  ({ lanes }) => {
    // No Canvas Context? get outta here!
    if (!canvasCtx) {
      return;
    }

    // Scale metadata
    const { paddingX, paddingY, chartWidth, chartMarginX, chartMarginY, towersScale, lanesScale } = scale;

    // Draw Track
    drawTrack(canvasCtx, {
      x: paddingX,
      y: paddingY + chartMarginY,
      width: chartWidth + chartMarginX * 2,
      yScale: lanesScale,
      lanes,
      scales: towersScale,
      color: trackColor,
    });
  };
