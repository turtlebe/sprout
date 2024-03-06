import * as d3 from 'd3';

import { RADIUSES } from '../constants';

export interface DrawHandles<Data> {
  ref: React.MutableRefObject<SVGElement>;
  data: Iterable<Data>;
  fill: string;
  selector: string;
  cx: (d: Data) => number;
  cy: (d: Data) => number;
}

export function drawHandles<Data>({ ref, data, fill, selector, cx, cy }: DrawHandles<Data>) {
  return d3
    .select(ref.current)
    .select(selector)
    .selectAll('schedule-circles')
    .data(data)
    .enter()
    .append('circle')
    .attr('fill', fill)
    .attr('fill-opacity', 1)
    .attr('stroke', 'none')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('r', RADIUSES.sm)
    .attr('index', (_, i) => i);
}
