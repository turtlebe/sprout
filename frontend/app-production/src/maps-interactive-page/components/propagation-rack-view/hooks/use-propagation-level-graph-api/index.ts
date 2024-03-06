import { clear } from '@plentyag/app-production/src/maps-interactive-page/utils';
import React from 'react';

import { UsePropagationLevelGraphScaleReturn } from '../use-propagation-level-graph-scale';

import { renderGraph, RenderGraph } from './render-graph';

export interface UsePropgationLevelGraphApi {
  ref: React.MutableRefObject<HTMLDivElement>;
  scale: UsePropagationLevelGraphScaleReturn;
  showLift?: boolean;
}

export type RenderFunction<T> = (props: UsePropgationLevelGraphApi) => (props?: T) => void;

export interface UsePropgationLevelGraphApiReturn {
  clear: () => void;
  renderGraph: ReturnType<RenderFunction<RenderGraph>>;
}

export const usePropagationLevelGraphApi = (props: UsePropgationLevelGraphApi): UsePropgationLevelGraphApiReturn => {
  return {
    clear: () => clear(props.ref),
    renderGraph: renderGraph(props),
  };
};
