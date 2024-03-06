import { UseMetricScaleReturn } from '../use-metric-scale';

import { clear } from './clear';
import { debugRenderAlertRuleInterval, DebugRenderAlertRuleInterval } from './debug';
import { renderAlertEvents, RenderAlertEvents } from './render-alert-events';
import { renderAlertRule, RenderAlertRule } from './render-alert-rule';
import { renderAlertRuleEditMode, RenderAlertRuleEditMode } from './render-alert-rule-edit-mode';
import { renderGraph, RenderGraph } from './render-graph';
import { RenderMouseOverEffect, renderMouseOverEffect } from './render-mouse-over-effect';
import { RenderNonNumericalObservations, renderNonNumericalObservations } from './render-non-numerical-observations';
import {
  RenderNonNumericalObservationsStepInterpolation,
  renderNonNumericalObservationsStepInterpolation,
} from './render-non-numerical-observations-step-interpolation';
import { renderObservations, RenderObservations } from './render-observations';
import { renderTodaysLine, RenderTodaysLine } from './render-todays-line';
import { updateAlertRule, UpdateAlertRule } from './update-alert-rule';
import { updateObservations, UpdateObservations } from './update-observations';

export interface UseMetricGraphApi {
  ref: React.MutableRefObject<SVGSVGElement>;
  scale: UseMetricScaleReturn;
}

export type RenderFunction<T> = (props: UseMetricGraphApi) => (props: T) => void;

export interface UseMetricGraphApiReturn {
  clear: () => void;
  debugRenderAlertRuleInterval: ReturnType<RenderFunction<DebugRenderAlertRuleInterval>>;
  renderAlertEvents: ReturnType<RenderFunction<RenderAlertEvents>>;
  renderAlertRule: ReturnType<RenderFunction<RenderAlertRule>>;
  renderAlertRuleEditMode: ReturnType<RenderFunction<RenderAlertRuleEditMode>>;
  renderGraph: ReturnType<RenderFunction<RenderGraph>>;
  renderMouseOverEffect: ReturnType<RenderFunction<RenderMouseOverEffect>>;
  renderNonNumericalObservations: ReturnType<RenderFunction<RenderNonNumericalObservations>>;
  renderNonNumericalObservationsStepInterpolation: ReturnType<
    RenderFunction<RenderNonNumericalObservationsStepInterpolation>
  >;
  renderObservations: ReturnType<RenderFunction<RenderObservations>>;
  renderTodaysLine: ReturnType<RenderFunction<RenderTodaysLine>>;
  updateAlertRule: ReturnType<RenderFunction<UpdateAlertRule>>;
  updateObservations: ReturnType<RenderFunction<UpdateObservations>>;
}

export const useMetricGraphApi = (props: UseMetricGraphApi): UseMetricGraphApiReturn => {
  return {
    clear: clear(props),
    debugRenderAlertRuleInterval: debugRenderAlertRuleInterval(props),
    renderAlertEvents: renderAlertEvents(props),
    renderAlertRule: renderAlertRule(props),
    renderAlertRuleEditMode: renderAlertRuleEditMode(props),
    renderGraph: renderGraph(props),
    renderMouseOverEffect: renderMouseOverEffect(props),
    renderNonNumericalObservations: renderNonNumericalObservations(props),
    renderNonNumericalObservationsStepInterpolation: renderNonNumericalObservationsStepInterpolation(props),
    renderObservations: renderObservations(props),
    renderTodaysLine: renderTodaysLine(props),
    updateObservations: updateObservations(props),
    updateAlertRule: updateAlertRule(props),
  };
};
