import { clear } from '@plentyag/app-production/src/maps-interactive-page/utils';
import { MutableRefObject } from 'react';

import { UseTrayGraphScaleReturn } from '../use-tray-graph-scale';

import { renderTray, RenderTray } from './render-tray';

export interface UseTrayGraphApi {
  ref: MutableRefObject<HTMLDivElement>;
  svgRef: MutableRefObject<SVGSVGElement>;
  scale: UseTrayGraphScaleReturn;
}

export type RenderFunction<T = undefined, K = undefined> = (props: UseTrayGraphApi) => (props?: T) => K | void;

export interface UseTrayGraphApiReturn {
  clear: () => void;
  renderTray: ReturnType<RenderFunction<RenderTray>>;
}

export const useTrayGraphApi = (props: UseTrayGraphApi): UseTrayGraphApiReturn => {
  return {
    clear: () => clear(props.ref),
    renderTray: renderTray(props),
  };
};
