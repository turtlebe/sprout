import { DataTestIdsGraphTooltip } from '@plentyag/app-environment/src/common/utils/constants';
import { YAxisScaleType } from '@plentyag/core/src/types/environment';

export interface MouseOverHandler<T> {
  svg: SVGSVGElement;
  bisect: d3.Bisector<T, Date>;
  data: T[];
  mouseX: number;
  x: d3.ScaleTime<number, number>;
  y: d3.AxisScale<YAxisScaleType>;
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  unitSymbol: string;
  graphTooltipSelectors: DataTestIdsGraphTooltip;
}

export * from './mouse-over-alert-rule-handler';
export * from './mouse-over-schedule-handler';
export * from './mouse-over-metric-handler';
