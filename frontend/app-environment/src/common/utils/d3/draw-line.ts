import * as d3 from 'd3';

export interface DrawLine<Data = unknown> {
  ref: React.MutableRefObject<SVGElement>;
  selector: string;
  classes: string[];
  data: Data[];
  color: string;
  strokeDasharray?: number;
}

export function drawLine({ ref, selector, classes, data, color, strokeDasharray = 0 }: DrawLine) {
  return d3
    .select(ref.current)
    .select(selector)
    .selectAll(['line', ...classes].filter(Boolean).join('.'))
    .data(data)
    .enter()
    .append('line')
    .attr('class', classes.join(' '))
    .attr('stroke', color)
    .attr('stroke-dasharray', strokeDasharray);
}
