import * as d3 from 'd3';

export const PLUG_CLASS = 'plug';

interface DrawPlug {
  el: d3.Selection<any, any, any, any>;
  x?: number;
  y?: number;
  borderRadius: number;
  width: number;
  height: number;
  plugColor?: string;
}

export const drawPlug = ({
  el,
  x = 0,
  y = 0,
  borderRadius,
  width,
  height,
  plugColor,
}: DrawPlug): d3.Selection<any, any, any, any> => {
  const plugEl = el.append('g').classed(PLUG_CLASS, true).attr('transform', `translate(${x}, ${y})`);

  plugEl
    .append('rect')
    .attr('rx', borderRadius)
    .attr('width', width)
    .attr('height', height)
    .attr('stroke-width', 1)
    .attr('fill', plugColor);

  return plugEl;
};
