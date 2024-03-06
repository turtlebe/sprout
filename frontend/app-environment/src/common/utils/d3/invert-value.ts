import { YAxisScaleType } from '@plentyag/core/src/types';
import { isScaleLinear } from '@plentyag/core/src/types/environment/type-guards';
import * as d3 from 'd3';
import numeral from 'numeral';

export function invertValue(scale: d3.AxisScale<YAxisScaleType>, value: number): string {
  if (isScaleLinear(scale)) {
    return numeral(scale.invert(value)).format('0,0,0.[00]');
  }

  return value.toString();
}
