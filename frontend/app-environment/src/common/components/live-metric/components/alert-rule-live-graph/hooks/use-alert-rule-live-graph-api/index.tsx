import { UseAlertRuleLiveScaleReturn } from '../use-alert-rule-live-scale';

import { clear } from './clear';
import { RenderAlertRuleLive, renderAlertRuleLive } from './render-alert-rule-live';

export interface UseAlertLiveViewGraphApi {
  ref: React.MutableRefObject<SVGSVGElement>;
  scale: UseAlertRuleLiveScaleReturn;
}

export interface UseAlertLiveViewGraphApiReturn {
  clear: ReturnType<RenderAlertRuleLiveGraphFunction>;
  renderAlertRuleLive: ReturnType<RenderAlertRuleLiveGraphFunction<RenderAlertRuleLive>>;
}

export type RenderAlertRuleLiveGraphFunction<T = void> = (props: UseAlertLiveViewGraphApi) => (props: T) => void;

export const useAlertLiveViewGraphApi = (props: UseAlertLiveViewGraphApi): UseAlertLiveViewGraphApiReturn => {
  return {
    clear: clear(props),
    renderAlertRuleLive: renderAlertRuleLive(props),
  };
};
