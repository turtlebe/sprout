import { clear } from '@plentyag/app-production/src/maps-interactive-page/utils';
import { MutableRefObject } from 'react';

import { UseVerticalGrowGraphScaleReturn } from '../use-vertical-grow-graph-scale';

import { renderAxis, RenderAxis } from './render-axis';
import { renderHighlight, RenderHighlight } from './render-highlight';
import { renderHotSpots, RenderHotSpots } from './render-hotspots';
import { renderPins, RenderPins } from './render-pins';
import { renderTowers, RenderTowers } from './render-towers';
import { renderTrack, RenderTrack } from './render-track';

export interface UseVerticalGrowGraphApi {
  svgRef?: MutableRefObject<SVGSVGElement>;
  canvasCtx?: CanvasRenderingContext2D;
  scale: UseVerticalGrowGraphScaleReturn;
}

export type RenderFunction<T = undefined, K = undefined> = (props: UseVerticalGrowGraphApi) => (props?: T) => K | void;

export interface UseVerticalGrowGraphApiReturn {
  clear: () => void;
  renderAxis: ReturnType<RenderFunction<RenderAxis>>;
  renderHighlight: ReturnType<RenderFunction<RenderHighlight>>;
  renderHotSpots: ReturnType<RenderFunction<RenderHotSpots>>;
  renderTowers: ReturnType<RenderFunction<RenderTowers>>;
  renderTrack: ReturnType<RenderFunction<RenderTrack>>;
  renderPins: ReturnType<RenderFunction<RenderPins>>;
}

export const useVerticalGrowGraphApi = (props: UseVerticalGrowGraphApi): UseVerticalGrowGraphApiReturn => {
  return {
    clear: () => clear(props.svgRef),
    renderAxis: renderAxis(props),
    renderHighlight: renderHighlight(props),
    renderHotSpots: renderHotSpots(props),
    renderTowers: renderTowers(props),
    renderTrack: renderTrack(props),
    renderPins: renderPins(props),
  };
};
