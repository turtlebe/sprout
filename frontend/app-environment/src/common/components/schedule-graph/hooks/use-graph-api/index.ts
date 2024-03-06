import {
  RenderMouseOverEffect,
  renderMouseOverEffect,
} from '@plentyag/app-environment/src/common/hooks/use-metric-graph-api/render-mouse-over-effect';
import { Schedule } from '@plentyag/core/src/types/environment';

import { UseScaleReturn } from '../use-scale';

import { clear } from './clear';
import { renderGraph, RenderGraph } from './render-graph';
import { renderSchedule, RenderSchedule } from './render-schedule';
import { renderScheduleEditMode, RenderScheduleEditMode } from './render-schedule-edit-mode';

export type RenderFunction<T = unknown> = (props: UseGraphApi) => (props: T) => void;

export interface UseGraphApi {
  ref: React.MutableRefObject<SVGSVGElement>;
  scale: UseScaleReturn;
  schedule: Schedule;
}

export interface UseGraphApiReturn {
  clear: () => void;
  renderGraph: ReturnType<RenderFunction<RenderGraph>>;
  renderSchedule: ReturnType<RenderFunction<RenderSchedule>>;
  renderScheduleEditMode: ReturnType<RenderFunction<RenderScheduleEditMode>>;
  renderMouseOverEffect: ReturnType<RenderFunction<RenderMouseOverEffect>>;
}

export const useGraphApi = (props): UseGraphApiReturn => {
  return {
    clear: clear(props),
    renderGraph: renderGraph(props),
    renderSchedule: renderSchedule(props),
    renderScheduleEditMode: renderScheduleEditMode(props),
    renderMouseOverEffect: renderMouseOverEffect(props),
  };
};
