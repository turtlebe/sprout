import * as d3 from 'd3';

import { MOUSE_OVER_EFFECT } from '../constants';

export interface DrawMouseOverCircle {
  svg: SVGSVGElement;
  class: string;
  color: string;
}

export function drawMouseOverCircle({ svg, class: _class, color }: DrawMouseOverCircle) {
  return d3
    .select(svg)
    .select(`g.${MOUSE_OVER_EFFECT.container}`)
    .append('circle')
    .attr('class', _class)
    .attr('r', MOUSE_OVER_EFFECT.circleRadius)
    .style('fill', color)
    .style('opacity', MOUSE_OVER_EFFECT.mouseOutOpacity);
}
