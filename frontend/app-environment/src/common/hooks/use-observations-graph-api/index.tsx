import { UseObservationsScaleReturn } from '../use-observations-scale';

import { clear } from './clear';
import { renderObservations, RenderObservations } from './render-observations';

export interface UseRenderObservationsGraphApi {
  ref: React.MutableRefObject<SVGSVGElement>;
  scale: UseObservationsScaleReturn;
}

export interface UseRenderObservationsGraphApiReturn {
  clear: ReturnType<RenderObservationsGraphFunction>;
  renderObservations: ReturnType<RenderObservationsGraphFunction<RenderObservations>>;
}

export type RenderObservationsGraphFunction<T = void> = (props: UseRenderObservationsGraphApi) => (props: T) => void;

/**
 * Return a D3 API to render Observations that represent a Data stream.
 */
export const useRenderObservationsGraphApi = (
  props: UseRenderObservationsGraphApi
): UseRenderObservationsGraphApiReturn => {
  return {
    clear: clear(props),
    renderObservations: renderObservations(props),
  };
};
