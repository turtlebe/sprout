import { YAxisScaleType } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';

export interface LineCalculationProps<Data> {
  x: d3.ScaleTime<number, number>;
  y: d3.AxisScale<YAxisScaleType>;
  data: Iterable<Data>;
  value: (d: Data) => any;
}

export type LineCalculation = <Data>(props: LineCalculationProps<Data>) => (d: Data, i: number) => number;

export const horizontalLineX1: LineCalculation =
  ({ x, value }) =>
  d =>
    x(value(d));

export const horizontalLineX2: LineCalculation =
  ({ x, data, value }) =>
  (_, i) => {
    if (data[i + 1]) {
      return x(value(data[i + 1]));
    }
    return x(value(data[i]));
  };

export const horizontalLineY: LineCalculation =
  ({ y, value }) =>
  d =>
    y(value(d));

export const verticalLineX: LineCalculation =
  ({ data, x, value }) =>
  (_, i) =>
    data[i + 1] ? x(value(data[i + 1])) : null;

export const verticalLineY1: LineCalculation =
  ({ data, y, value }) =>
  (d, i) => {
    if (data[i + 1]) {
      if (value(d) > value(data[i + 1])) {
        return y(value(d));
      } else {
        return y(value(data[i + 1]));
      }
    } else {
      return null;
    }
  };

export const verticalLineY2: LineCalculation =
  ({ data, y, value }) =>
  (d, i) => {
    if (data[i + 1]) {
      if (value(d) > value(data[i + 1])) {
        return y(value(data[i + 1]));
      } else {
        return y(value(d));
      }
    } else {
      return null;
    }
  };

export const linearLineX1: LineCalculation =
  ({ x, value }) =>
  d =>
    x(value(d));

export const linearLineX2: LineCalculation =
  ({ x, data, value }) =>
  (_, i) => {
    if (data[i + 1]) {
      return x(value(data[i + 1]));
    }
    return x(value(data[i]));
  };

export const linearLineY1: LineCalculation =
  ({ y, value }) =>
  d =>
    y(value(d));

export const linearLineY2: LineCalculation =
  ({ y, data, value }) =>
  (_, i) => {
    if (data[i + 1]) {
      return y(value(data[i + 1]));
    }
    return y(value(data[i]));
  };
