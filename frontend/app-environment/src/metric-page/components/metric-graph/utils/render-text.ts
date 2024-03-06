import * as d3 from 'd3';

export function renderText(selection: d3.Selection<SVGGElement, unknown, null, undefined>, text: string) {
  selection.append('text').attr('x', 40).attr('y', 0).attr('dy', 12).attr('font-size', '1rem').text(text);
}
