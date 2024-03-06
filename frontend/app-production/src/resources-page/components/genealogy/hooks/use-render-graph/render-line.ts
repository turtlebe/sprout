import * as d3 from 'd3';

import { doesSegmentIntersectWithViewBounds } from './utils';

const lineGenerator = (xScale: ProdResources.XScale, yScale: ProdResources.YScale) =>
  d3
    .line<ProdResources.PathData>()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

interface RenderLine {
  pathData: ProdResources.PathData[];
  pathAttributes: ProdResources.PathAttributes;
  svg: d3.Selection<any, any, any, any>;
  scale: ProdResources.Scale;
  viewBounds: ProdResources.ViewBounds;
}

export const renderLine = ({ pathData, pathAttributes, svg, scale, viewBounds }: RenderLine) => {
  const x1 = scale.xScale(pathData[0].x);
  const y1 = scale.yScale(pathData[0].y);
  const x2 = scale.xScale(pathData[1].x);
  const y2 = scale.yScale(pathData[1].y);
  if (doesSegmentIntersectWithViewBounds({ viewBounds, x1, y1, x2, y2 })) {
    return svg
      .append('path')
      .attr('class', 'line')
      .datum(pathData)
      .attr('stroke', pathAttributes.stroke)
      .attr('fill', pathAttributes.fill)
      .attr('stroke-width', pathAttributes.strokeWidth)
      .attr('d', lineGenerator(scale.xScale, scale.yScale));
  }
};
