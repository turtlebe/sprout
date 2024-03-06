import * as d3 from 'd3';

import {
  horizontalLineX1,
  horizontalLineX2,
  horizontalLineY,
  linearLineX1,
  linearLineX2,
  linearLineY1,
  linearLineY2,
  LineCalculationProps,
  verticalLineX,
  verticalLineY1,
  verticalLineY2,
} from '.';

export interface SetDataOnLine<Data> {
  ref: React.MutableRefObject<SVGElement>;
  classes: string[];
  data: Data[];
  x: LineCalculationProps<Data>['x'];
  y: LineCalculationProps<Data>['y'];
  xValue: LineCalculationProps<Data>['value'];
  yValue: LineCalculationProps<Data>['value'];
}

export function setDataOnLine<Data>({ ref, classes, data, x, y, xValue, yValue }: SetDataOnLine<Data>) {
  const selector = ['line', ...classes].filter(Boolean).join('.');
  const args: Omit<LineCalculationProps<Data>, 'value'> = { x, y, data };
  if (classes.includes('horizontal')) {
    d3.select(ref.current)
      .selectAll(selector)
      .data(data)
      .attr('x1', horizontalLineX1({ ...args, value: xValue }))
      .attr('x2', horizontalLineX2({ ...args, value: xValue }))
      .attr('y1', horizontalLineY({ ...args, value: yValue }))
      .attr('y2', horizontalLineY({ ...args, value: yValue }));
  } else if (classes.includes('vertical')) {
    d3.select(ref.current)
      .selectAll(selector)
      .data(data)
      .attr('x1', verticalLineX({ ...args, value: xValue }))
      .attr('x2', verticalLineX({ ...args, value: xValue }))
      .attr('y1', verticalLineY1({ ...args, value: yValue }))
      .attr('y2', verticalLineY2({ ...args, value: yValue }));
  } else {
    d3.select(ref.current)
      .selectAll(selector)
      .data(data)
      .attr('x1', linearLineX1({ ...args, value: xValue }))
      .attr('x2', linearLineX2({ ...args, value: xValue }))
      .attr('y1', linearLineY1({ ...args, value: yValue }))
      .attr('y2', linearLineY2({ ...args, value: yValue }));
  }
}
