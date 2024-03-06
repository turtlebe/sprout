import { clear } from '@plentyag/app-production/src/maps-interactive-page/utils';
import React from 'react';

import { UseGerminationRackGraphScaleReturn } from '../use-germination-rack-graph-scale';

import { renderGraph, RenderGraph } from './render-graph';

export interface UseGerminationRackGraphApi {
  ref: React.MutableRefObject<HTMLDivElement>;
  scale: UseGerminationRackGraphScaleReturn;
}

export type RenderFunction<T> = (props: UseGerminationRackGraphApi) => (props?: T) => void;

export interface UseGerminationRackGraphApiReturn {
  clear: () => void;
  renderGraph: ReturnType<RenderFunction<RenderGraph>>;
}

export const useGerminationRackGraphApi = (props: UseGerminationRackGraphApi): UseGerminationRackGraphApiReturn => {
  return {
    clear: () => clear(props.ref),
    renderGraph: renderGraph(props),
  };
};
