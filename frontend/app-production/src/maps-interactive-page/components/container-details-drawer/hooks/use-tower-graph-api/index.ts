import { clear } from '@plentyag/app-production/src/maps-interactive-page/utils';
import { MutableRefObject } from 'react';

import { UseTowerGraphScaleReturn } from '../use-tower-graph-scale';

import { renderTower, RenderTower } from './render-tower';

export interface UseTowerGraphApi {
  ref: MutableRefObject<HTMLDivElement>;
  svgRef: MutableRefObject<SVGSVGElement>;
  scale: UseTowerGraphScaleReturn;
}

export type RenderFunction<T = undefined, K = undefined> = (props: UseTowerGraphApi) => (props?: T) => K | void;

export interface UseTowerGraphApiReturn {
  clear: () => void;
  renderTower: ReturnType<RenderFunction<RenderTower>>;
}

export const useTowerGraphApi = (props: UseTowerGraphApi): UseTowerGraphApiReturn => {
  return {
    clear: () => clear(props.ref),
    renderTower: renderTower(props),
  };
};
