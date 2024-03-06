import { clear } from '@plentyag/app-production/src/maps-interactive-page/utils';
import { MutableRefObject } from 'react';

import { UseTableGraphScaleReturn } from '../use-table-graph-scale';

import { renderCoordinates, RenderCoordinates } from './render-coordinates';
import { renderTrays, RenderTrays } from './render-trays';

export interface UseTableGraphApi {
  ref: MutableRefObject<HTMLDivElement>;
  svgRef: MutableRefObject<SVGSVGElement>;
  scale: UseTableGraphScaleReturn;
}

export type RenderFunction<T = undefined, K = undefined> = (props: UseTableGraphApi) => (props?: T) => K | void;

export interface UseTableGraphApiReturn {
  clear: () => void;
  renderTrays: ReturnType<RenderFunction<RenderTrays>>;
  renderCoodinates: ReturnType<RenderFunction<RenderCoordinates>>;
}

export const useTableGraphApi = (props: UseTableGraphApi): UseTableGraphApiReturn => {
  return {
    clear: () => clear(props.ref),
    renderCoodinates: renderCoordinates(props),
    renderTrays: renderTrays(props),
  };
};
