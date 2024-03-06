import { YAxisScaleType } from '@plentyag/core/src/types';
import { Rule } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';

export interface RenderAlertRuleD3Area {
  x: d3.ScaleTime<number, number>;
  y: d3.AxisScale<YAxisScaleType>;
}

export function renderAlertRuleD3Area({ x, y }: RenderAlertRuleD3Area) {
  return d3
    .area<Rule<Date>>()
    .x(d => x(d.time))
    .y0(d => y(d.gte ?? y.domain()[1]))
    .y1(d => y(d.lte ?? y.domain()[0]));
}
