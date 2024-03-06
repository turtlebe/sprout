import * as d3 from 'd3';

import { MOUSE_OVER_EFFECT } from '../constants';

export interface DrawMouseOverCircles<T> {
  svg: SVGSVGElement;
  data: T[];
  class: (item: T) => string;
  color: (item: T) => string;
}

export function drawMouseOverCircles<T>({ svg, data, class: _class, color: color }: DrawMouseOverCircles<T>) {
  return d3
    .select(svg)
    .select(`g.${MOUSE_OVER_EFFECT.container}`)
    .selectAll()
    .data(data)
    .join('circle')
    .attr('class', _class)
    .attr('r', MOUSE_OVER_EFFECT.circleRadius)
    .style('fill', color)
    .style('opacity', MOUSE_OVER_EFFECT.mouseOutOpacity);
}
